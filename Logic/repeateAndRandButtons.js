const repeateSongButton = document.getElementById('repeateSongButton');
const randomSongButton = document.getElementById('randomSongButton');
const seekbar = document.getElementById('seekbar');

const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const audioPlayer = document.getElementById('audioPlayer');

const metadataContainer = document.getElementById('metadataContainer');

let previousHighlightedContainer = null;

function highlightCurrentSong(songContainer) {
    // Remove the highlighted class from the previously highlighted container
    if (previousHighlightedContainer) {
        previousHighlightedContainer.classList.remove('highlighted');
        const textElement = previousHighlightedContainer.querySelector('.textMetadataStyles');
        if (textElement) {
            textElement.classList.remove('highlightedText');
        }
    }

    // Add the highlighted class to the current song container and text element
    if (songContainer) {
        songContainer.classList.add('highlighted');
        const textElement = songContainer.querySelector('.textMetadataStyles');
        if (textElement) {
            textElement.classList.add('highlightedText');
        }
    }

    // Update the reference to the currently highlighted container
    previousHighlightedContainer = songContainer;
}

// Get the audio player and song containers

let highlightSongList = []

audioPlayer.addEventListener('play', () => {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    const currentSrc = audioPlayer.src;

    highlightSongList = songContainers

    const currentSong = highlightSongList.find(item => item.dataset.file === currentSrc);

    if (highlightSongList.length > 0) {
        highlightCurrentSong(currentSong);
    }
});

// set event listener for active event
let repeateActiveButton = false;

repeateSongButton.addEventListener('click', () => {
    repeateActiveButton = !repeateActiveButton;
    repeateSongButton.classList.toggle("activeRepeateSongButton");

    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekbar.value = progress;

     if (repeateActiveButton) {
        audioPlayer.loop = true;
    } else {
        audioPlayer.loop = false;
    }
})

export let shuffledSongs = [];
let currentSongIndex = -1;

export function randomizeSongs() {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainers.length === 0) return;

    for (let i = songContainers.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [songContainers[i], songContainers[rand]] = [songContainers[rand], songContainers[i]];
    }

    shuffledSongs = songContainers;
    currentSongIndex = 0;
}


let randomButtonActive = false;

randomSongButton.addEventListener('click', () => {
    randomButtonActive = !randomButtonActive;
    randomSongButton.classList.toggle("activeRandomSongButton");

    if (!randomButtonActive) {
        shuffledSongs = [];
        currentSongIndex = -1;
        return;
    }

    randomizeSongs();

    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    // Handle the end of the current song and start a new random song

    audioPlayer.addEventListener('ended', () => {
        if (shuffledSongs.length === 0) return;

        const audioUrl = shuffledSongs[currentSongIndex].dataset.files;
        
        if (audioUrl) {
            const tempAudio = new Audio();
            tempAudio.addEventListener('loadeddata', () => {
                // Update the main audio source to the new URL after it's loaded
                audioPlayer.src = audioUrl;
                audioPlayer.load();
                audioPlayer.play();
            });
            // Start loading audio in the background to preload
            tempAudio.src = audioUrl;
        }
    });
});
