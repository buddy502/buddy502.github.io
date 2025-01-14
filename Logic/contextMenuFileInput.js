import { getMusicMetadata } from './AddMusicFiles.js'
import { storeFile } from './storeSongFiles.js'

// iterate through the file for Right Click selection
const fileInputRightClick = document.getElementById("fileInputRightClick");
if (fileInputRightClick) {
    fileInputRightClick.addEventListener("change", (event) => {
        const files = event.target.files;
        const audioFiles = Array.from(files).filter(file => file.type.startsWith("audio/"));
        
        audioFiles.forEach((file) => {
            getMusicMetadata(file)
                .then(metadata => {
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
                    storeFile(metadata, file);
                })
                .catch(error => {
                    console.error("Error getting metadata:", error);
                });
        });
    });
}
