import { appendRandomSongToDll, randomButtonActive, dll } from './repeateAndRandButtons.js'
import { currentSong } from './playSong.js'

const skipButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

const audioPlayer = document.getElementById('audioPlayer');
const metadataContainer = document.getElementById('metadataContainer');

const randomSongButton = document.getElementById('randomSongButton');

const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');

let currentNode = null;

function skipToNextSong() {
     if (randomButtonActive) {
        if (audioPlayer.paused) return; // Don't do anything if the player is paused

        appendRandomSongToDll();

        const nextSong = dll.tail.data;
        if (nextSong) {
            const audioUrl = nextSong.dataset.file;
            audioPlayer.src = audioUrl;
            audioPlayer.currentTime = 0;
            audioPlayer.play().catch((error) => {
                console.error("Error playing random song:", error);
            });
        }

        playButton.style.display = "none";
        pauseButton.style.display = "inline-block";
        return;
    }

    if (!audioPlayer.src) return;
    // logic for skipping to next song with random button not pressed
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];

    const currentSrc = audioPlayer.src;

    currentNode = (currentSong + 1) % songContainers.length;

    const nextSongContainer = songContainers[currentNode];
    const audioFile = nextSongContainer.dataset.file;

    if (nextSongContainer) {
        audioPlayer.src = audioFile;
        audioPlayer.currentTime = 0;

        playButton.style.display = "none";
        pauseButton.style.display = "inline-block";

        audioPlayer.play().catch((error) => {
            console.error("Error playing audio:", error);
        });

    } else {
        console.error("Invalid next song container.");
    }
}

function goToPreviousSong() {
if (randomButtonActive) {
        if (audioPlayer.paused) return;

        const deletedNode = dll.deleteLastNode();
        
        if (!deletedNode) return;

        const nextSong = deletedNode.data;
        if (nextSong) {
            const audioUrl = nextSong.dataset.file;

            if (audioPlayer.paused) {
                audioPlayer.src = audioUrl;
                audioPlayer.currentTime = 0;
                audioPlayer.play().catch((error) => {
                    console.error("Error playing random song:", error);
                });

                playButton.style.display = "none";
                pauseButton.style.display = "inline-block";
            }
        }
        return;
    }

    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];

    if (!audioPlayer.src) return;

    currentNode = (currentSong - 1 + songContainers.length) % songContainers.length;

    const prevSongContainer = songContainers[currentNode];
    const audioFile = prevSongContainer.dataset.file;

    if (prevSongContainer && audioPlayer) {
        audioPlayer.src = audioFile;
        audioPlayer.currentTime = 0;
        playButton.style.display = "none";
        pauseButton.style.display = "inline-block";

        audioPlayer.play().catch((error) => {
            console.error("Error playing audio:", error);
        });

    } else {
        console.error("Invalid previous song container.");
    }
}

skipButton.addEventListener("click", skipToNextSong);

prevButton.addEventListener("click", goToPreviousSong);
