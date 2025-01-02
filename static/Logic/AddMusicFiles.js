
// append song metadata as they're added
let songsList = [];

window.onload = () => {
    // iterate through the file for My Music selection
    // for directories
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
            const files = event.target.files;
            const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
            for (let i = 0; i < audioFiles.length; i++) {
                getMusicMetadata(audioFiles[i], i);
            }
        })
    }

    // iterate through the file for Right Click selection
    const fileInputRightClick = document.getElementById("fileInputRightClick");
    if (fileInputRightClick) {
        fileInputRightClick.addEventListener("change", (event) => {
            const files = event.target.files;
            const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
            for (let i = 0; i < audioFiles.length; i++) {
                getMusicMetadata(audioFiles[i], i);
            }
        })
    }

    // For directories
    const fileInputDirectory = document.getElementById("directoryRightClick");
    if (fileInputDirectory) {
        fileInputDirectory.addEventListener("change", (event) => {
            const files = event.target.files;
            const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
            for (let i = 0; i < audioFiles.length; i++) {
                getMusicMetadata(audioFiles[i], i);
            }
        })
    }
}

function appendToSongList(name, artist, duration, filePath) {
    const songName = `${name}`;
    const artistName = `${artist}`;
    const durationSong = `${duration}`;
    const filePathSong = filePath;

    const isDuplicate = songsList.some(
        (song) => song.songName === songName && song.artistName === artistName
        && song.filePathSong === filePathSong);

    if (!isDuplicate) {
        songsList.push({ songName, artistName, durationSong, filePathSong });
    }

    if ( songsList.length > 0) {
        document.getElementById("hiddenMusicText").style.display = "none"
        document.getElementById("metadataContainer").style.width = "72vw";
        document.getElementById("metadataContainer").style.height = "690px";
    }
}

function checkTextWrap(containerId, textContent) {
    const container = document.getElementById(containerId);
    if (container) {
        const initialHeight = container.offsetHeight;
        container.innerHTML = textContent;

        const newHeight = container.offsetHeight;
        return newHeight > initialHeight;
    }
    return false;
}

function removeStringLength(str) {
    if (str.length > 20 || checkTextWrap("textMetadata", str)) {
        str = str.slice(0, 20) + "...";
    }
    return str;
}

async function uploadSong(file) {
    // Create a FormData object
    const formData = new FormData();
    formData.append("songFile", file);
    formData.append("songName", file.name); // Example: Use file name as the song name
    formData.append("artistName", "Unknown Artist"); // Placeholder artist name
    formData.append("duration", "0:00"); // Placeholder duration

    try {
        // Send the file and metadata to the server
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload the song");
        }

        const metadata = await response.json();

        // Update the UI with the received metadata
        appendToSongList(
            metadata.songName,
            metadata.artistName,
            metadata.duration,
            metadata.filePath
        );

        console.log("Song uploaded successfully:", metadata);
    } catch (error) {
        console.error("Error uploading song:", error);
    }
}

function getMusicMetadata(file) {
    window.musicmetadata(file, function (err, result) {
        if (err) throw err;

        // Process picture (album artwork)
        let imageSrc = null;
        if (result.picture && result.picture.length > 0) {
            const picture = result.picture[0];
            const base64 = picture.data.toString('base64');
            imageSrc = `data:${picture.format};base64,${base64}`;
        } else {
            imageSrc = "../Icons/Music App Icon.png";
        }

        // Extract metadata: title, artist, and duration
        const name = removeStringLength(result.title || "");
        const artist = removeStringLength(result.artist[0] || "");
        const duration = result.duration || "";
        const filePath = result.name || "";

        // Create a new container for this song
        const songContainer = document.createElement('div');
        songContainer.classList.add('songContainer');
        songContainer.dataset.file = URL.createObjectURL(file);
        songContainer.style.display = "flex";
        songContainer.style.flexWrap = "wrap";
        songContainer.style.width = "120px";
        songContainer.style.justifyContent = "center";
        songContainer.style.aspectRatio = "3/2";

        // Create and style the image metadata
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('imageMetadataStyles');
        if (imageSrc) {
            imageDiv.style.backgroundImage = `url('${imageSrc}')`;
            imageDiv.style.backgroundSize = "contain";
            imageDiv.style.backgroundRepeat = "no-repeat";
            imageDiv.style.backgroundPosition = "center";
            imageDiv.style.width = "80%";
            imageDiv.style.height = "80px";
            imageDiv.style.overflow = "hidden";
        }

        // Create and style the text metadata
        const textDiv = document.createElement('div');
        textDiv.classList.add('textMetadataStyles');
        textDiv.innerHTML = `${name}<br>${artist}`;
        textDiv.style.fontSize = "13px";
        textDiv.style.color = "black";
        textDiv.style.marginBottom = "10px";
        textDiv.style.textAlign = "center";

        // Append the image and text metadata to the song container
        songContainer.appendChild(imageDiv);
        songContainer.appendChild(textDiv);

        const metadataContainer = document.getElementById('metadataContainer');
        if (metadataContainer) {
            metadataContainer.appendChild(songContainer);
        }
        appendToSongList(name, artist, duration, filePath);

        uploadSong(filePath);

    });
}
