const overlay = document.getElementById('overlay');
const closeButton = document.querySelector('[data-close-button]');
const songInfo = document.querySelector('.song-info');

function checkForWindowState(info) {
    if (!info) return;

    if (overlay.classList.contains('active') && info.classList.contains('active')) {
        overlay.classList.remove('active');
        info.classList.remove('active');
    } else {
        overlay.classList.add('active');
        info.classList.add('active');
    }
}

function createPopupContent(currentContainer) {
    const songContainer = currentContainer;
    if (!songContainer) return;

    const textMetadataStyles = songContainer.querySelector('.textMetadataStyles');
    const imageMetadataStyles = songContainer.querySelector('.imageMetadataStyles');
    if (!textMetadataStyles && !imageMetadataStyles) return;

    const songName = textMetadataStyles.querySelector('.hiddenNameText')?.innerText || "";
    const songArtist = textMetadataStyles.querySelector('.hiddenArtistText')?.innerText || "";
    const songAlbum = songContainer.dataset.album || "";

    const imageSrc = imageMetadataStyles.querySelector('.hiddenImageSrc').innerText;

    const infoBody = songInfo.querySelector('.info-body');

    checkForWindowState(songInfo)
    infoBody.innerHTML = `
    <div class="info-container">
        <div class="info-text">
            <strong>Title</strong><br>
            <p>${songName}</p>
            <hr>
            <strong>Artist</strong><br>
            <p>${songArtist}</p>
            <hr>
            <strong>Album</strong><br>
            <p>${songAlbum}</p>
            <hr>
        </div>
        <div class="info-image">
            <img src='${imageSrc}' alt="Song Image">
        </div>
    </div>
    `;
;
}
const informationRightClick = document.getElementById('informationRightClick');

let currentSongContainer = null;

document.addEventListener("contextmenu", (event) => {
    const songContainer = event.target.closest('.songContainer');
    if (songContainer) {
        currentSongContainer = songContainer;
    }
});

document.addEventListener("click", (event) => {
    const infoButton = event.target.closest('#informationRightClick');
    const songContainer = event.target.closest('.songContainer');

     if (infoButton && currentSongContainer) {
        createPopupContent(currentSongContainer);
        return;
    }

    if (!songInfo.contains(event.target) && !infoButton && songInfo.classList.contains('active')) {
        checkForWindowState(songInfo);
    }
});

closeButton.addEventListener("click", () => {
    checkForWindowState(songInfo);
});
