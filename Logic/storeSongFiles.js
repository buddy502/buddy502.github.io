import { songsList } from './AddMusicFiles.js';
import { getMusicMetadata } from './AddMusicFiles.js'

let db;

const request = indexedDB.open("FileDatabase", 1);

// Handle database upgrade
request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadSongData();
};

// Load data from IndexedDB and update the songsList or UI
function loadSongData() {
    const transaction = db.transaction(["files"], "readonly");
    const store = transaction.objectStore("files");

    const getRequest = store.getAll();

    getRequest.onsuccess = function(event) {
        const songs = event.target.result;

        if (songs && songs.length > 0) {
            songs.forEach(song => {
                const file = new Blob([song.fileData], { type: "audio/mpeg" });

                getMusicMetadata(file)
                    .then(metadata => {
                        console.log(`Successfully loaded metadata for ${metadata.name}`);
                    })
                    .catch(err => {
                        console.error(`Failed to get metadata for ${song.name}:`, err);
                    });
            });
        }
    };

    getRequest.onerror = function(event) {
        console.error("Error retrieving data from IndexedDB:", event.target.errorCode);
    };
}

// Store the song files into IndexedDB
// Store the song files into IndexedDB
export function storeFile(metadata, file) {
    const songContainer = document.querySelectorAll('.songContainer');

    if (!file || !songContainer) {
        console.error("No file selected or no song container found!");
        return;
    }

    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");

    // Check if file already exists by its ID before storing
    const fileId = songContainer[0].dataset.file;  // Assuming all song containers have the same dataset file for the same song

    const existingRequest = store.get(fileId);  // Look for the file by its ID
    existingRequest.onsuccess = function (event) {
        const existingFile = event.target.result;

        if (!existingFile) {
            // If the file doesn't exist, create a new entry in the database
            const songsWithMetadata = {
                id: fileId, // Using the fileId as key
                name: metadata?.name || null,
                artist: metadata?.artist || null,
                fileData: file
            };

            store.put(songsWithMetadata); // Store it in the IndexedDB
            console.log(`Stored new file: ${metadata.name}`);
        } else {
            console.log(`File already exists: ${metadata.name}`);
        }
    };

    transaction.onerror = function(event) {
        console.error("Error storing file:", event.target.errorCode);
    };
}
