const metadataContainer = document.getElementById("metadataContainer");
const searchInput = document.getElementById('searchBar');

// Search functionality
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const songContainers = metadataContainer.querySelectorAll(".songContainer");
    songContainers.forEach((song) => {
        const textMetadataStyles = song.querySelector('.textMetadataStyles');
        const nameWithExt = textMetadataStyles.querySelector('.hiddenNameText').innerText.toLowerCase();
        const artist = textMetadataStyles.querySelector('.hiddenArtistText').innerText.toLowerCase();

        const isVisible = nameWithExt.includes(value) || artist.includes(value);
        song.style.display = isVisible ? "flex" : "none";
    });
});
