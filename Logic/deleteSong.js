const contextMenu = document.getElementById("contextMenu");
const songContext = document.getElementById('songContext');

function hidesongContainerMenu(event) {
    if (songContext && !songContext.contains(event.target)) {
        songContext.style.display = "none";
    }
}

const songContainer = document.querySelectorAll('.songContainer');

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

    removeSongInfo.onclick = function () {
        event.remove();
        songContext.style.display = 'none';
    };
}

// Event listeners
document.addEventListener("contextmenu", (event) => {
    const song = event.target.closest('.songContainer');

    if (song) {
        showContextMenu(event);
    } else {
        hidesongContainerMenu(event);
    }
});

document.addEventListener("click", hidesongContainerMenu);
document.addEventListener("wheel", hidesongContainerMenu);

const removeSongInfo = document.getElementById('removeSongInfo');


songContainer.forEach(songContainer => {
    songContainer.addEventListener('contextmenu', showContextMenu(songContainer));
});

removeSongInfo.addEventListener("click", (event) => {
    // Find the metadata container related to the clicked element
    const parentContainer = event.target.closest('#metadataContainer');

    // Get all the songContainer elements within the parentContainer
    const songContainer = parentContainer.querySelectorAll('.songContainer');

    let closestSongContainer = null;

    // Iterate through the songContainer elements
    songContainer.forEach(songContainer => {
        if (songContainer.contains(event.target)) {
            closestSongContainer = songContainer;
        }
    });

    if (closestSongContainer) {
        console.log("Found closest songContainer:", closestSongContainer);

        // Remove the songContainer or perform any action
        closestSongContainer.remove(); // Remove the container from the DOM
    } else {
        console.log("No songContainer found.");
    }
});

