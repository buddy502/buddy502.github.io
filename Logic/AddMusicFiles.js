
// append song metadata as they're added
export let songsList = [];

function appendToSongList(name, artist) {
    const songName = `${name}`;
    const artistName = `${artist}`;

    songsList.push({ songName, artistName});

    if ( songsList.length > 0) {
        document.getElementById("hiddenMusicText").style.display = "none"
        document.getElementById("metadataContainer").style.width = "72vw";
        document.getElementById("metadataContainer").style.height = "690px";
    }
}

function checkTextWrap(containerId, textContent) {
    const container = document.getElementById(containerId);
    if (container) {
        const initialHeight = container.offsetHeight;
        container.innerHTML = textContent;

        const newHeight = container.offsetHeight;
        return newHeight > initialHeight;
    }
    return false;
}

function removeStringLength(str) {
    if (str.length > 20 || checkTextWrap("textMetadata", str)) {
        str = str.slice(0, 20) + "...";
    }
    return str;
}

export function getMusicMetadata(file) {
    return new Promise((resolve, reject) => {
        window.musicmetadata(file, function (err, result) {
            if (err) {
                reject(err);  // Reject the promise if there's an error
                return;
            }

            let imageSrc = null;

            if (result.picture && result.picture.length > 0) {
                const picture = result.picture[0];
                const base64 = picture.data.toString('base64');
                imageSrc = `data:${picture.format};base64,${base64}`;
            } else {
                imageSrc = "http://127.0.0.1:8080/static/Icons/Music%20App%20Icon.png"
            }

            // Extract metadata: title, artist, and duration
            const name = removeStringLength(result.title || "");
            const artist = removeStringLength(result.artist[0] || "");
            const duration = result.duration || "";
            const filePath = result.name || "";

            // Create a new container for this song
            const songContainer = document.createElement('div');
            songContainer.classList.add('songContainer');
            songContainer.dataset.file = URL.createObjectURL(file);
            songContainer.style.display = "flex";
            songContainer.style.flexWrap = "wrap";
            songContainer.style.width = "120px";
            songContainer.style.justifyContent = "center";
            songContainer.style.aspectRatio = "3/2";

            // Create and style the image metadata
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('imageMetadataStyles');
            if (imageSrc) {
                imageDiv.style.backgroundImage = `url('${imageSrc}')`;
                imageDiv.style.backgroundSize = "contain";
                imageDiv.style.backgroundRepeat = "no-repeat";
                imageDiv.style.backgroundPosition = "center";
                imageDiv.style.width = "80%";
                imageDiv.style.height = "80px";
                imageDiv.style.overflow = "hidden";
            }

            // Create and style the text metadata
            const textDiv = document.createElement('div');
            textDiv.classList.add('textMetadataStyles');
            textDiv.innerHTML = `${name}<br>${artist}`;
            textDiv.style.fontSize = "13px";
            textDiv.style.color = "black";
            textDiv.style.marginBottom = "10px";
            textDiv.style.textAlign = "center";

            // Append the image and text metadata to the song container
            songContainer.appendChild(imageDiv);
            songContainer.appendChild(textDiv);

            const metadataContainer = document.getElementById('metadataContainer');
            if (metadataContainer) {
                metadataContainer.appendChild(songContainer);
            }

            appendToSongList(name, artist, duration, filePath);

            // Resolve the promise with the metadata
            resolve({ name, artist, duration, filePath, imageSrc });
        });
    });
}
