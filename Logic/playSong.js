import { storeFile } from './storeSongFiles.js'

function updatePlayPauseButtons(isPlaying) {
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

document.addEventListener('keydown', (event) => {
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
});

function changeHandler({ target }) {
    // Make sure we have files to use
    if (!target.files.length) return;

    // Create a blob that we can use as an src for our audio element
    const urlObj = URL.createObjectURL(target.files[0]);

    // Select the audio player element
    const audioPlayer = document.getElementById("audioPlayer");

    // Set the src and start loading the audio from the file
    audioPlayer.src = urlObj;

    // Set up audio controls
    audioPlayer.controls = true;

    // Optional: Clean up the URL Object after we are done with it
    audioPlayer.addEventListener("ended", () => {
        URL.revokeObjectURL(urlObj);
    });
}

const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");


const metadataContainer = document.getElementById("metadataContainer");
const audioPlayer = document.getElementById("audioPlayer");

if (metadataContainer) {
    metadataContainer.addEventListener("dblclick", (event) => {
        const songContainer = event.target.closest(".songContainer");
        const audioFile = songContainer.dataset.file;

        if (songContainer && audioFile) {
                audioPlayer.src = audioFile;
                seekbar.value = 0;
                audioPlayer.currentTime = 0;
                audioPlayer.play();
                playButton.style.display = "none";
                pauseButton.style.display = "inline-block";
        }
    });
}

document.getElementById("fileInputRightClick").addEventListener("change", changeHandler);
document.getElementById("directoryRightClick").addEventListener("change", changeHandler);
document.getElementById("fileExplorerMyMusic").addEventListener("change", changeHandler);


// Play Button Event
playButton.addEventListener("click", () => {
    audioPlayer.play();
    updatePlayPauseButtons(true);

});

audioPlayer.addEventListener('loadedmetadata', () => {
    const totalDuration = formatTime(audioPlayer.duration);
    const currentDuration = formatTime(audioPlayer.currentTime);
    seekbarTotalDuration.innerHTML = totalDuration;
    seekbarDuration.innerHTML = currentDuration;
});

// Pause Button Event
pauseButton.addEventListener("click", () => {
    audioPlayer.pause();
    updatePlayPauseButtons(false);
});


////////////////////
/////////////////// Seekbar control
//////////////////
const seekbar = document.getElementById('seekbar');
const seekbarDuration = document.getElementById('seekbarDuration');
const seekbarTotalDuration = document.getElementById('seekbarTotalDuration');

// change css for seekbar hover
let hideThumbTimeout;

seekbar.addEventListener("mouseenter", () => {
    clearTimeout(hideThumbTimeout); // Clear any existing timeout
    seekbar.classList.add("hovered"); // Add the class to show the thumb
});

seekbar.addEventListener("mouseleave", () => {
    hideThumbTimeout = setTimeout(() => {
        seekbar.classList.remove("hovered"); // Remove the class after 2 seconds
    }, 1300);
});


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

function updateSeekBarSlider(slider) {
    if (!slider) {
        console.error('Slider element is undefined or null.');
        return;
    }

    if (!slider.value || !slider.max) {
        console.error('Slider is missing value or max attributes.');
        return;
    }

    const value = slider.value;
    const max = slider.max;
    const percentage = Math.ceil((value / max) * 100);

    slider.style.background = `linear-gradient(to right, rgb(120, 252, 255) ${percentage}%, #ccc ${percentage}%)`;
}

let isSeekBarActive = false;

seekbar.addEventListener('focus', () => {
    isSeekBarActive = true;
});

document.addEventListener('click', (event) => {
    if (!seekbar.contains(event.target)) {
        isSeekBarActive = false;
        seekbar.blur();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        return;
    }

    if (!isSeekBarActive) return;

    const currentTime = Math.round(audioPlayer.currentTime);
    const duration = audioPlayer.duration;

    if (event.key === "ArrowRight") {
        if (duration - currentTime <= 10) {
            seekbar.value = 100;
            audioPlayer.currentTime = duration;
        } else {
            const updatedTime = Math.min(currentTime + 10, duration);
            seekbar.value = Math.ceil((updatedTime / duration) * 100);
            audioPlayer.currentTime = updatedTime;
        }

        updateSeekBarSlider(seekbar);
    } else if (event.key === "ArrowLeft") {
        if (currentTime <= 10) {
            seekbar.value = 0;
            audioPlayer.currentTime = 0;
        } else {
            const updatedTime = currentTime - 10;
            seekbar.value = Math.round((updatedTime / duration) * 100);
            audioPlayer.currentTime = updatedTime;
        }

        updateSeekBarSlider(seekbar);
    }
});

// event listener for dragging or clicking current seekTime
seekbar.addEventListener('input', () => {
    const seekTime = (seekbar.value / 100) * audioPlayer.duration;
    if (seekTime) {
        audioPlayer.currentTime = seekTime;
        seekbar.style.cursor = "context-menu";
        updateSeekBarSlider(seekbar);
    }
});


// updating progress for song
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekbar.value = progress;

    // update current time display
    seekbarDuration.innerHTML = formatTime(audioPlayer.currentTime);

    updateSeekBarSlider(seekbar);
});

////////////////////
/////////////////// Volume control
//////////////////

const volumeControl = document.getElementById('volumeControl');

function updateVolumeSliderBackground(slider) {
    const value = slider.value;
    const max = slider.max;

    const percentage = Math.ceil((value / max) * 100);

    slider.style.background = `linear-gradient(to right, rgb(125, 255, 105) ${percentage}%, #ccc ${percentage}%)`;

    const volumePercentage = document.getElementById("volumePercentage");
    volumePercentage.innerHTML = `${percentage}%`;
}

// use event listener for activating volume keydown
let isVolumeActive = false;

volumeControl.addEventListener('focus', () => {
    isVolumeActive = true;
});

// make volume not work if clicked outside
document.addEventListener('click', (event) => {
    if (!volumeControl.contains(event.target)) {
        isVolumeActive = false;
        volumeControl.blur();
    }
});

volumeControl.addEventListener('input', () => {
    audioPlayer.volume = volumeControl.value / 100;
    volumeControl.style.cursor = "context-menu";
    updateVolumeSliderBackground(volumeControl);
});

updateVolumeSliderBackground(volumeControl);

// event listener for volume control
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        return;
    }
    // only do the rest if slider is active
    if (!isVolumeActive) return;

    let newVolumeDown = Math.floor(volumeControl.value);
    let newVolumeUp = Math.ceil(volumeControl.value);

    if (event.key === "ArrowUp") {
        if (newVolumeUp % 5 !== 0) {
            newVolumeUp = Math.ceil(newVolumeUp / 5) * 5;
        }else {
            newVolumeUp = Math.min(newVolumeUp + 5, 100);
        }

        updateVolumeSliderBackground(volumeControl);

        volumeControl.value = newVolumeUp;

    } else if (event.key === "ArrowDown") {
        if (newVolumeDown % 5 !== 0) {
            newVolumeDown = Math.floor(newVolumeDown / 5) * 5;
        }else {
            newVolumeDown = Math.max(newVolumeDown - 5, 0);
        }

        updateVolumeSliderBackground(volumeControl);

        volumeControl.value = newVolumeDown;
    }
});

    // Volume control
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value / 100;
    });


