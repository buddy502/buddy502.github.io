import { randomButtonActive, appendRandomSongToDll } from './repeateAndRandButtons.js'

const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");

const metadataContainer = document.getElementById("metadataContainer");
const audioPlayer = document.getElementById("audioPlayer");

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

export let currentSong = -1;

// Trigger when the audio starts playing
audioPlayer.addEventListener('play', () => {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    const currentSrc = audioPlayer.src;

    currentSong = songContainers.findIndex((container) => container.dataset.file === currentSrc);

    if (currentSong !== -1) {
        const currentSongContainer = songContainers[currentSong];
        highlightCurrentSong(currentSongContainer);
    }
});

// Trigger when the audio ends
audioPlayer.addEventListener('ended', () => {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];

    if (randomButtonActive) return;

    // Update current song index and loop to the start if at the end
    currentSong = (currentSong + 1) % songContainers.length;

    const nextSongContainer = songContainers[currentSong];
    if (!nextSongContainer) {
        console.error("No next song found.");
        return;
    }

    const audioFile = nextSongContainer.dataset.file;

    highlightCurrentSong(nextSongContainer);

    audioPlayer.src = audioFile;
    audioPlayer.currentTime = 0;

    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";

    audioPlayer.play().catch((error) => {
        console.error("Error playing next audio:", error);
    });
});

const seekbar = document.getElementById('seekbar');

if (metadataContainer) {
    metadataContainer.addEventListener("dblclick", (event) => {
        const songContainer = event.target.closest(".songContainer");
        
        if (!songContainer) return;

        const audioFile = songContainer?.dataset.file;

        if (audioFile) {
            audioPlayer.src = audioFile;
            seekbar.value = 0;
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            playButton.style.display = "none";
            pauseButton.style.display = "inline-block";
        }
    });
}
