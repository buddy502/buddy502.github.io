const contextMenu = document.querySelector(".songContext");

// Function to show the context menu on right-click inside songContainer
function showContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu

    const x = event.clientX;
    const y = event.clientY;

    // Set the position of the context menu to the mouse coordinates
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    // Show the context menu
    contextMenu.style.display = "block";
}

// Function to hide the context menu if clicked anywhere else
function hideContextMenu(event) {
    // If the click was outside the context menu or songContainer, hide the context menu
    if (contextMenu && !contextMenu.contains(event.target) && !document.querySelector(".songContainer").contains(event.target)) {
        contextMenu.style.display = "none"; // Hide the context menu
    }
}

// Attach event listeners to show the context menu when right-clicking on songContainers
const songContainers = document.getElementsByClassName("songContainer");

for (let songContainer of songContainers) {
    songContainer.addEventListener("contextmenu", showContextMenu);
}

// Hide the context menu if clicking anywhere outside
document.addEventListener("click", hideContextMenu);
