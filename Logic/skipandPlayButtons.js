import { appendRandomSongToDll, randomButtonActive, dll } from './repeateAndRandButtons.js'
import { currentSong } from './playSong.js'
import { updatePlayPauseButtons } from './pausePlayButtons.js'

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

let currentRandomNode = null;

function goToPreviousSong() {
    if (randomButtonActive) {
        // Check if DLL is empty or has only one node
        if (!dll.head || !dll.tail.prev) {
            const firstSong = dll.head?.data;
            if (firstSong) {
                audioPlayer.src = firstSong.dataset.file;
                audioPlayer.currentTime = 0;

                audioPlayer.play().catch((error) => {
                    console.error("Error playing first random song:", error);
                });
                updatePlayPauseButtons(true);
            }
            return;
        }

        if (currentRandomNode === null) {
            currentRandomNode = dll.tail;
        } else if (currentRandomNode === dll.head) {
            return;
        }

        currentRandomNode = currentRandomNode.prev;

        const previousSong = currentRandomNode?.data;
        if (previousSong) {
            audioPlayer.src = previousSong.dataset.file;
            audioPlayer.currentTime = 0;
            audioPlayer.play().catch((error) => {
                console.error("Error playing previous random song:", error);
            });
            updatePlayPauseButtons(true);
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
