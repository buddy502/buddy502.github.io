function changeHandler({ target }) {
    if (!target.files.length) return;

    const urlObj = URL.createObjectURL(target.files[0]);

    const audioPlayer = document.getElementById("audioPlayer");

    audioPlayer.src = urlObj;

    audioPlayer.controls = true;
}

document.getElementById("fileInputRightClick").addEventListener("change", changeHandler);
document.getElementById("directoryRightClick").addEventListener("change", changeHandler);
document.getElementById("fileExplorerMyMusic").addEventListener("change", changeHandler);

//
// MY MUSIC DIRECTORY / FILE SELECTION
//
document.getElementById("fileExplorerMyMusic").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});

//
// RIGHT CLICK DIRECTORY / FILE SELECTION
//
document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
    document.getElementById("contextMenu").style.display = "none"
}

// get right click function
function rightClick(e) {
    e.preventDefault();

    const menu = document.getElementById("contextMenu")
    const menuUl = document.getElementById("contextMenuUl")
    const borderWithSongs = document.getElementById("borderWithSongs");

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let y = e.pageY;
    let x = e.pageX;

    if (x + 150 > windowWidth) {
        menuUl.style.marginRight = "px";
    }

    if (y + 150 > windowHeight) {
        y = menuUl.style.marginBottom = "px";
    }

    menu.style.display = 'block';
    menu.style.left = x + "px";
    menu.style.top = y + "px";

    // if x or y value is outside box then make it none
    const rect = borderWithSongs.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        hideMenu();
    }

}

document.addEventListener("click", (e) => {
    const menu = document.getElementById("contextMenu");
    if (!menu.contains(e.target) && e.target !== menu) {
        hideMenu();
    }
});

document.addEventListener("wheel", () => {
    hideMenu();
});

// right click context menu
document.getElementById("openFileExplorer").addEventListener("click", () => {
    const fileInputRightClick = document.getElementById("fileInputRightClick");
    if (fileInputRightClick) {
        fileInputRightClick.click();
        hideMenu();
    }
});

// directory context menu
document.getElementById("openDirectoryExplorer").addEventListener("click", () => {
    const directoryRightClick = document.getElementById("directoryRightClick");
    if (directoryRightClick) {
        directoryRightClick.setAttribute("webkitdirectory", "");
        directoryRightClick.click();
        hideMenu();
    }
});
