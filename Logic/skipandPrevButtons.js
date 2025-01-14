import { appendRandomSongToDll, randomButtonActive, dll, appendCurrentSongToDll, prependRandomSongToDll } from './repeateAndRandButtons.js'
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
let currentRandomNode = null;

function skipToNextSong() {
if (randomButtonActive) {
        if (!currentRandomNode) {
            currentRandomNode = dll.tail;
        }

        if (currentRandomNode && currentRandomNode.next) {
            currentRandomNode = currentRandomNode.next;
        } else if (!currentRandomNode.next){
            appendRandomSongToDll();
            currentRandomNode = dll.tail;
        } else {
            currentRandomNode = currentRandomNode.next;
        }

        const nextSong = currentRandomNode.data;
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

    // code for if random button isn't active
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

function previousSong() {
    if (randomButtonActive) {
        if (!currentRandomNode) {
            prependRandomSongToDll(); // Prepend a new random song if needed
            currentRandomNode = dll.head; // Start at the new head
        } else if (!currentRandomNode.prev) {
            prependRandomSongToDll(); // Prepend if at the head
            currentRandomNode = dll.head; // Move to the new head
        } else {
            currentRandomNode = currentRandomNode.prev; // Move to the previous node
        }

        // Play the previous random song
        const previousSong = currentRandomNode?.data;
        if (previousSong) {
            audioPlayer.src = previousSong.dataset.file;
            audioPlayer.currentTime = 0;
            audioPlayer.play().catch((error) => {
                console.error("Error playing previous random song:", error);
            });
        }

        updatePlayPauseButtons(true);
        return;
    }

    // Code for when the random button is not active
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (!audioPlayer.src || songContainers.length === 0) return;

    currentNode = (currentNode - 1 + songContainers.length) % songContainers.length; // Move to the previous song
    const prevSongContainer = songContainers[currentNode];

    if (prevSongContainer) {
        audioPlayer.src = prevSongContainer.dataset.file;
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

prevButton.addEventListener("click", previousSong);
