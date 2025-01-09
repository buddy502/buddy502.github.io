const metadataContainer = document.getElementById('metadataContainer');

var newWindow;

function popitup(url) {
    if (!url) {
        console.error("No URL provided to pop-up.");
        return false;
    }

    newWindow = window.open(url, 'name', 'height=200,width=150');

    if (newWindow && newWindow.focus) {
        newWindow.focus();
    }

    return false;
}

// tracks position of song container for W's
let currentSongContainer = null;

document.addEventListener("contextmenu", (event) => {
    const songContainer = event.target.closest('.songContainer');

    if (songContainer) {
        currentSongContainer = songContainer;
    }
});

document.addEventListener("click", event => {
    const informationRightClick = document.getElementById('informationRightClick');
    if (!currentSongContainer || !informationRightClick) {
        return;
    }
})
