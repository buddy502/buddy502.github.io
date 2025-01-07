import { songsList } from './AddMusicFiles.js';
import { getMusicMetadata } from './AddMusicFiles.js'

const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let db;

const request = indexedDB.open("FileDatabase", 1);

// Handle database upgrade
request.onupgradeneeded = function(event) {
    const db = event.target.result;
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
                        //console.log(`Successfully loaded metadata for ${metadata.name}`);
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

export function storeFile(metadata, file) {
    const songContainer = document.querySelectorAll('.songContainer');

    if (!file || !songContainer) {
        console.error("No file selected or no song container found!");
        return;
    }

    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");

    const fileId = songContainer[songContainer.length - 1].dataset.file;

    const existingRequest = store.get(fileId);
    existingRequest.onsuccess = function (event) {

        const songsWithMetadata = {
            id: fileId,
            name: metadata?.innerNameText || null,
            artist: metadata?.innerArtistText || null,
            fileData: file
        };

        store.put(songsWithMetadata);
    };

    transaction.onerror = function(event) {
        console.error("Error storing file:", event.target.errorCode);
    };
}

export function deleteSongData(name, artist) {
    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");

    const getRequest = store.getAll();

    getRequest.onsuccess = function(event) {
        const songs = event.target.result;

        if (songs && songs.length > 0) {
            songs.forEach(song => {
                const songName = song.name || "";
                const songArtist = song.artist || "";

                const songNameWithoutExt = songName
                    .replace(/\//g, " ")
                    .replace(/\|/g, " ")
                    .replace(/\:/g, "")
                    .replace(/\【/g, "[")
                    .replace(/\】/g, "]");

                if (songNameWithoutExt === name && songArtist === artist) {

                    const deleteRequest = store.delete(song.id);

                    deleteRequest.onerror = function(event) {
                        console.error("Error deleting song:", event.target.errorCode);
                    };

                    return;
                }
            });
        }
    };
    getRequest.onerror = function(event) {
        console.error("Error retrieving data from IndexedDB:", event.target.errorCode);
    };
}
