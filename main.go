package main

import (
    "fmt"
    "io"
    "os"
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "sync"
    "time"

    "github.com/julienschmidt/httprouter"
    "github.com/patrickmn/go-cache"
)

// type structs
type Song struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    FilePath string `json:"filePath"` // Store the file path, not the Blob
}

type SongManager struct {
    sync.Mutex
    songs  map[int]Song
    nextID int
}

type SongCache struct {
    song *cache.Cache
}

func NewSongManager() *SongManager {
    sm := &SongManager{
        songs:  make(map[int]Song),
        nextID: 1,
    }

    sm.loadFromFile()

    return sm
}

var sm = NewSongManager()

const (
    defaultExpiration = 5 * time.Minute
    purgeTime         = 10 * time.Minute
)

func newCache() *SongCache {
    Cache := cache.New(defaultExpiration, purgeTime)
    return &SongCache{
        song: Cache,
    }
}

func (c *SongCache) read(id string) (item []byte, ok bool) {
    song, ok := c.song.Get(id)
    if ok {
        log.Println("from cache")
        res, err := json.Marshal(song.(Song))
        if err != nil {
            log.Fatal("Error")
        }
        return res, true
    }
    return nil, false
}

func (c *SongCache) update(id string, song Song) {
    c.song.Set(id, song, cache.DefaultExpiration)
}

var c = newCache()

func checkCache(f httprouter.Handle) httprouter.Handle {
    return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
        id := p.ByName("id")
        res, ok := c.read(id)
        if ok {
            w.Header().Set("Content-Type", "application/json")
            w.Write(res)
            return
        }
        log.Println("From Controller")
        f(w, r, p)
    }
}

func (sm *SongManager) loadFromFile() error {
    go func() {
        file, err := os.Open("songs.json")
        if err != nil {
            if os.IsNotExist(err) {
                return
            }
            log.Printf("Error opening file: %v", err)
            return
        }
        defer file.Close()

        decoder := json.NewDecoder(file)
        if err := decoder.Decode(&sm.songs); err != nil {
            log.Printf("Error decoding file: %v", err)
        }
    }()
    return nil
}

func (sm *SongManager) saveToFile() error {
    sm.Lock()
    defer sm.Unlock()

    file, err := os.Create("songs.json")
    if err != nil {
        return err
    }
    defer file.Close()

    encoder := json.NewEncoder(file)
    return encoder.Encode(sm.songs)
}

func (sm *SongManager) AddSong(name, filePath string) int {
    sm.Lock()
    defer sm.Unlock()
    id := sm.nextID
    song := Song{
        ID:       id,
        Name:     name,
        FilePath: filePath,
    }
    sm.songs[id] = song
    sm.nextID++
    sm.saveToFile() // Persist to songs.json
    
    // Update cache with the new song data
    c.update(strconv.Itoa(id), song)
    return id
}

func (sm *SongManager) GetAllSongs() []Song {
    sm.Lock()
    defer sm.Unlock()
    var songs []Song
    for _, song := range sm.songs {
        songs = append(songs, song)
    }
    return songs
}

func (sm *SongManager) GetSong(id int) (Song, bool) {
    sm.Lock()
    defer sm.Unlock()
    song, found := sm.songs[id]
    return song, found
}

func createDirIfNotExists(dir string) error {
    if _, err := os.Stat(dir); os.IsNotExist(err) {
        return os.MkdirAll(dir, 0755)
    }
    return nil
}

func uploadHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    // Parse the multipart form (max size 10 MB)
    if err := r.ParseMultipartForm(10 << 20); err != nil {
        http.Error(w, "Unable to parse form", http.StatusBadRequest)
        return
    }

    // Retrieve the file from the form field "songFile"
    file, header, err := r.FormFile("songFile")
    if err != nil {
        http.Error(w, "Error retrieving the file", http.StatusInternalServerError)
        return
    }
    defer file.Close()

    // Retrieve additional metadata from the form
    songName := r.FormValue("songName")
    artistName := r.FormValue("artistName")
    duration := r.FormValue("duration")

    // Ensure 'songs' directory exists
    uploadDir := "./static/upload" // Save to 'static/songs'
    if err := createDirIfNotExists(uploadDir); err != nil {
        http.Error(w, "Unable to create upload directory", http.StatusInternalServerError)
        return
    }

    // Save the file to the 'songs' directory
    filePath := fmt.Sprintf("%s/%s", uploadDir, header.Filename)
    out, err := os.Create(filePath)
    if err != nil {
        http.Error(w, "Unable to create file", http.StatusInternalServerError)
        return
    }
    defer out.Close()

    // Save the uploaded file
    if _, err := io.Copy(out, file); err != nil {
        http.Error(w, "Unable to save file", http.StatusInternalServerError)
        return
    }

    // Add song to SongManager (file path, not the Blob)
    songID := sm.AddSong(songName, filePath)

    // Respond with the metadata and the file info (file path)
    response := map[string]interface{}{
        "songName":   songName,
        "artistName": artistName,
        "duration":   duration,
        "filePath":   filePath,
        "songID":     songID,
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(response); err != nil {
        http.Error(w, "Unable to encode response", http.StatusInternalServerError)
    }
}

func routerGetSong(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
    id, err := strconv.Atoi(p.ByName("id"))
    if err != nil {
        http.Error(w, "Invalid song ID", http.StatusBadRequest)
        return
    }

    song, exists := sm.GetSong(id)
    if !exists {
        http.Error(w, "Song not found", http.StatusNotFound)
        return
    }

    // Serve the song file (cached in songs folder)
    w.Header().Set("Content-Type", "audio/mpeg")
    http.ServeFile(w, r, song.FilePath)
}

func routerLogger(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    songs := sm.GetAllSongs()

    // Construct a JSON response with all songs
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    fmt.Fprint(w, "[")
    for i, song := range songs {
        if i > 0 {
            fmt.Fprint(w, ",")
        }
        fmt.Fprintf(w, `{"id": %d, "name": "%s", "url": "/songs/%d"}`, song.ID, song.Name, song.ID)
    }
    fmt.Fprint(w, "]")
}

func main() {
    router := httprouter.New()

    // Use index.html as root path file
    router.GET("/", func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
        http.ServeFile(w, r, "./static/index.html")
    })

    // Serve static files from the "static" folder
    router.ServeFiles("/static/*filepath", http.Dir("./static"))

    // Upload route to upload a song
    router.POST("/upload", checkCache(uploadHandler))

    // Get the current song by ID
    router.GET("/songs/:id", routerGetSong)

    // Log all songs (id, name, and URL)
    router.GET("/songs", routerLogger)

    fmt.Println("Server running on :8080")
    log.Fatal(http.ListenAndServe(":8080", router))
}
