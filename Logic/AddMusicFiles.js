
// append song metadata as they're added
export let songsList = [];

const hiddenMusicText = document.getElementById('hiddenMusicText');
const metadataContainer = document.getElementById('metadataContainer');

export function updateUI() {
    const songContainer = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainer.length > 0) {
        hiddenMusicText.style.display = "none";
        metadataContainer.style.height = "670px";
    } else {
        hiddenMusicText.style.display = "flex";
        metadataContainer.style.height = "0px";
    }
}

updateUI();


function appendToSongList(name, artist) {
    const songName = `${name}`;
    const artistName = `${artist}`;

    songsList.push({ songName, artistName});

    updateUI();
}

function checkTextWrap(containerId, textContent) {
    const container = document.getElementById(containerId);
    if (container) {
        const initialWidth = container.offsetWidth;
        container.innerHTML = textContent;

        const newWidth = container.offsetWidth;
        return newWidth > initialWidth;
    }
    return false;
}

function removeStringLength(str) {
    if (str.length > 20 || checkTextWrap("textMetadata", str)) {
        str = str.slice(0, 17) + "...";
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
                imageSrc = "http://127.0.0.1:8080/Icons/Music%20App%20Icon.png"
            }

            const name = removeStringLength(result.title || "");
            const artist = removeStringLength(result.artist[0] || "");
            const duration = result.duration || "";
            const filePath = result.name || "";

            const hiddenNameText = result.title || ""
            const hiddenArtistText = result.artist[0] || ""

            // imageSrc is already checked for null value
            const hiddenImageSrc = imageSrc

            const songContainer = document.createElement('div');
            songContainer.classList.add('songContainer');
            songContainer.dataset.file = URL.createObjectURL(file);
            songContainer.style.display = "flex";
            songContainer.style.flexWrap = "wrap";
            songContainer.style.width = "125px";
            songContainer.style.height = "150px";
            songContainer.style.justifyContent = "center";
            songContainer.style.aspectRatio = "3/2";
            songContainer.style.paddingTop = "10px";

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('imageMetadataStyles');
            if (imageSrc) {
                imageDiv.style.backgroundImage = `url('${imageSrc}')`;
                imageDiv.style.width = "70%";
                imageDiv.style.height = "80px";
                imageDiv.style.backgroundRepeat = "no-repeat";
                imageDiv.style.backgroundPosition = "center";
                imageDiv.style.backgroundSize = "cover";
                imageDiv.style.overflow = "hidden";
                imageDiv.style.borderRadius = "8px";
                imageDiv.style.boxShadow = "2px 2px 6px rgba(0, 0, 0, 0.5)"
                imageDiv.innerHTML = `
                    <p class='hiddenImageSrc'>${hiddenImageSrc}</p>
                `
            }

            const textDiv = document.createElement('div');
            textDiv.classList.add('textMetadataStyles');
            textDiv.style.fontSize = "12px";
            textDiv.style.color = "black";
            textDiv.style.marginBottom = "10px";
            textDiv.style.textAlign = "center";

            textDiv.innerHTML = `
                <p class='name' style="margin-top: 0px; margin-bottom: 0px">${name}</p>
                <p class='artist' style="margin-top: 7px; margin-bottom: 0px">${artist}</p>

                <p class='hiddenNameText'>${hiddenNameText}</p>
                <p class='hiddenArtistText'>${hiddenArtistText}</p>
            `;
            

            // Append the image and text metadata to the song container
            songContainer.appendChild(imageDiv);
            songContainer.appendChild(textDiv);

            const hiddenName = textDiv.querySelector('.hiddenNameText');
            const hiddenArtist = textDiv.querySelector('.hiddenArtistText');

            const hiddenImage = imageDiv.querySelector('.hiddenImageSrc');

            const innerNameText = hiddenName.innerText;
            const innerArtistText = hiddenArtist.innerText;


            const metadataContainer = document.getElementById('metadataContainer');
            if (metadataContainer) {
                metadataContainer.appendChild(songContainer);
            }

            appendToSongList(innerNameText, innerArtistText, duration, filePath);

            hiddenName.style.display = "none";
            hiddenArtist.style.display = "none";
            hiddenImage.style.display = "none";

            resolve({ innerNameText, innerArtistText, duration, filePath, imageSrc });
        });
    });
}
