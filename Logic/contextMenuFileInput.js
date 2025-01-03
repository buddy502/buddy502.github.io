import { getMusicMetadata } from './AddMusicFiles.js'
import { storeFile } from './storeSongFiles.js'

//import { songsList } from './AddMusicFiles.js'

// iterate through the file for My Music selection
// for directories
const fileInput = document.getElementById("fileInput");
if (fileInput) {
    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
        
        audioFiles.forEach((file) => {
            getMusicMetadata(file)
                .then(metadata => {
                    // Store the file with its metadata
                    storeFile(metadata, file);
                })
                .catch(error => {
                    console.error("Error getting metadata:", error);
                });
        });
    });
}

// iterate through the file for Right Click selection
const fileInputRightClick = document.getElementById("fileInputRightClick");
if (fileInputRightClick) {
    fileInputRightClick.addEventListener("change", (event) => {
        const files = event.target.files;
        const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
        
        audioFiles.forEach((file) => {
            getMusicMetadata(file)
                .then(metadata => {
                    // Store the file with its metadata
                    storeFile(metadata, file);
                })
                .catch(error => {
                    console.error("Error getting metadata:", error);
                });
        });
    });
}

// For directories
const fileInputDirectory = document.getElementById("directoryRightClick");
if (fileInputDirectory) {
    fileInputDirectory.addEventListener("change", (event) => {
        const files = event.target.files;
        const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
        
        audioFiles.forEach((file) => {
            getMusicMetadata(file)
                .then(metadata => {
                    // Store the file with its metadata
                    storeFile(metadata, file);
                })
                .catch(error => {
                    console.error("Error getting metadata:", error);
                });
        });
    });
}
