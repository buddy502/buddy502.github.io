import { getMusicMetadata, updateUI } from './AddMusicFiles.js'
import { deleteSongData } from './storeSongFiles.js'

const contextMenu = document.getElementById("contextMenu");
const songContext = document.getElementById('songContext');

function hidesongContainerMenu(event) {
    songContext.style.display = "none";
    updateUI();
}

const removeSongInfo = document.getElementById('removeSongInfo');

function showContextMenu(event) {
    event.preventDefault();

    const x = event.clientX;
    const y = event.clientY;

    contextMenu.style.display = "none";

    if (songContext) {
        songContext.style.left = `${x}px`;
        songContext.style.top = `${y}px`;
        songContext.style.display = "block";
    }
}

const songContainer = document.querySelector('.songContainer');

document.addEventListener("contextmenu", (event) => {
    const metadataContainer = document.getElementById('metadataContainer');
    if (!metadataContainer || !metadataContainer.contains(event.target)) {
        return;
    }

    const song = event.target.closest('.songContainer');

    if (song) {
        showContextMenu(event);

        const textMetadataStyles = song.querySelector('.textMetadataStyles');

        const nameWithExt = textMetadataStyles.querySelector('.hiddenNameText').innerText;
        const artist = textMetadataStyles.querySelector('.hiddenArtistText').innerText;

        const name = nameWithExt
            .replace(/\//g, " ")
            .replace(/\|/g, " ")
            .replace(/\:/g, "")
            .replace(/\【/g, "[")
            .replace(/\】/g, "]");

        removeSongInfo.addEventListener("click", () => {
            song.remove();

            deleteSongData(name, artist);
        });
    } else {
        hidesongContainerMenu(event)
    }
});

document.addEventListener("click", hidesongContainerMenu);
document.addEventListener("wheel", hidesongContainerMenu);


const createContextMenu = document.querySelectorAll('.songContainer');

createContextMenu.forEach(songContainer => {
    songContainer.addEventListener('contextmenu', showContextMenu(songContainer));
});
