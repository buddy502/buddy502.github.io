import { randomizeSongs, shuffledSongs} from './repeateAndRandButtons.js'

const skipButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');

const audioPlayer = document.getElementById('audioPlayer');
const metadataContainer = document.getElementById('metadataContainer');

const randomSongButton = document.getElementById('randomSongButton');

const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');

let currentSongIndex = 0;

// add logic to skip into part of the random stack
audioPlayer.addEventListener('ended', () => {
    // used to turn all of the things using the songContainer class
    // needed because every song is appended with songContainer class
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];

    currentSongIndex = (currentSongIndex + 1) % songContainers.length;
    if (songContainers.length > 0) {

        const nextSongContainer = songContainers[currentSongIndex];
        if (!nextSongContainer) return;

        const audioFile = nextSongContainer.dataset.file;

        audioPlayer.src = audioFile;
        audioPlayer.currentTime = 0;

        playButton.style.display = "none";
        pauseButton.style.display = "inline-block";

        audioPlayer.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    }
})

function skipToNextSong() {
    // Check if the random button is active by checking the class
    const isRandomButtonActive = randomSongButton.classList.contains("activeRandomSongButton");

    // If the random button is active and the song list has not been shuffled, randomize it
    if (isRandomButtonActive && shuffledSongs.length === 0) {
        randomizeSongs();  // Shuffle the songs when the button is pressed
    }

    // Use shuffledSongs if random button is active, otherwise use the original order
    const currentSongList = isRandomButtonActive ? shuffledSongs : [...metadataContainer.querySelectorAll('.songContainer')];

    // Find the index of the currently playing song in the appropriate container list
    currentSongIndex = currentSongList.findIndex((songContainer) => {
        const audioFile = songContainer.dataset.file;
        return audioPlayer.src.includes(audioFile) && audioPlayer.currentTime > 0 && !audioPlayer.paused;
    });

    // If no song is currently playing, start with the first song in the list
    if (currentSongIndex === -1) {
        currentSongIndex = 0;
    }

    // Calculate the next song index (loop around if at the end)
    currentSongIndex = (currentSongIndex + 1) % currentSongList.length;

    // Ensure that the currentSongIndex is within bounds
    if (currentSongIndex >= 0 && currentSongIndex < currentSongList.length) {
        const nextSongContainer = currentSongList[currentSongIndex];
        const audioFile = nextSongContainer.dataset.file;

        if (nextSongContainer && audioPlayer) {
            // Update audio player to the next song
            audioPlayer.src = audioFile;
            audioPlayer.currentTime = 0;
            playButton.style.display = "none";
            pauseButton.style.display = "inline-block";

            audioPlayer.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    } else {
        console.error("Invalid currentSongIndex:", currentSongIndex);
    }
}

function goToPreviousSong() {
    const isRandomButtonActive = randomSongButton.classList.contains("activeRandomSongButton");

    if (isRandomButtonActive && shuffledSongs.length === 0) {
        randomizeSongs();
    }

    const currentSongList = isRandomButtonActive ? shuffledSongs : [...metadataContainer.querySelectorAll('.songContainer')];

    currentSongIndex = currentSongList.findIndex((songContainer) => {
        const audioFile = songContainer.dataset.file;
        return audioPlayer.src.includes(audioFile) && audioPlayer.currentTime > 0 && !audioPlayer.paused;
    });

    if (currentSongIndex === -1) {
        currentSongIndex = 0;
    }

    currentSongIndex = (currentSongIndex - 1) % currentSongList.length;

    if (currentSongIndex >= 0 && currentSongIndex < currentSongList.length) {
        const nextSongContainer = currentSongList[currentSongIndex];
        const audioFile = nextSongContainer.dataset.file;

        if (nextSongContainer && audioPlayer) {
            audioPlayer.src = audioFile;
            audioPlayer.currentTime = 0;
            playButton.style.display = "none";
            pauseButton.style.display = "inline-block";

            audioPlayer.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    } else {
        console.error("Invalid currentSongIndex:", currentSongIndex);
    }
}

skipButton.addEventListener("click", skipToNextSong);

prevButton.addEventListener("click", goToPreviousSong);
