import { storeVolume } from './storeSongFiles.js'

const audioPlayer = document.getElementById("audioPlayer");

audioPlayer.addEventListener('loadedmetadata', () => {
    const totalDuration = formatTime(audioPlayer.duration);
    const currentDuration = formatTime(audioPlayer.currentTime);
    seekbarTotalDuration.innerHTML = totalDuration;
    seekbarDuration.innerHTML = currentDuration;
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

export function updateVolumeSliderBackground(slider) {
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
    
    // Only proceed if the volume slider is active
    if (!isVolumeActive) return;

    let currentVolume = volumeControl.value;

    if (event.key === "ArrowUp") {
        if (currentVolume % 5 !== 0) {
            currentVolume = Math.ceil(currentVolume / 5) * 5;
        }

        let newVolumeUp = Math.min(parseInt(currentVolume) + 5, 100);

        volumeControl.value = newVolumeUp;
        audioPlayer.volume = newVolumeUp / 100;

        updateVolumeSliderBackground(volumeControl);
        storeVolume();

    } else if (event.key === "ArrowDown") {
        if (currentVolume % 5 !== 0) {
            currentVolume = Math.floor(currentVolume / 5) * 5;
        }

        let newVolumeDown = Math.max(parseInt(currentVolume) - 5, 0);

        volumeControl.value = newVolumeDown;
        audioPlayer.volume = newVolumeDown / 100;

        updateVolumeSliderBackground(volumeControl);
        storeVolume();
    }
});

// Volume control
volumeControl.addEventListener('input', () => {
    audioPlayer.volume = volumeControl.value / 100;
    storeVolume();
});
