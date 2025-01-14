const audioPlayer = document.getElementById("audioPlayer");

export function updatePlayPauseButtons(isPlaying) {
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    if (isPlaying) {
        playButton.style.display = "none";
        pauseButton.style.display = "inline-block";
    } else {
        pauseButton.style.display = "none";
        playButton.style.display = "inline-block";
    }
}

const pauseButton = document.getElementById("pauseButton");
const playButton = document.getElementById("playButton");

function togglePlayPause(event) {
    if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();

        if (audioPlayer.paused) {
            audioPlayer.play();
            playButton.style.display = "none";
            pauseButton.style.display = "inline-block";
        } else {
            audioPlayer.pause();
            pauseButton.style.display = "none";
            playButton.style.display = "inline-block";
        }
    }
}

pauseButton.addEventListener('keydown', togglePlayPause);
playButton.addEventListener('keydown', togglePlayPause);

playButton.addEventListener("click", () => {
    if (!audioPlayer.paused && audioPlayer.currentTime > 0) {
        return;
    }

    audioPlayer.play().then(() => {
        updatePlayPauseButtons(true);
    }).catch((error) => {
        console.error("Error playing audio:", error);
    });
});

pauseButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        return;
    }

    audioPlayer.pause();
    updatePlayPauseButtons(false);
});
