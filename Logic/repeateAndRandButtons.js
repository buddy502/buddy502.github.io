const repeateSongButton = document.getElementById('repeateSongButton');
const randomSongButton = document.getElementById('randomSongButton');
const seekbar = document.getElementById('seekbar');

const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const audioPlayer = document.getElementById('audioPlayer');

const metadataContainer = document.getElementById('metadataContainer');

// set event listener for active event
let repeateActiveButton = false;

repeateSongButton.addEventListener('click', () => {
    repeateActiveButton = !repeateActiveButton;
    repeateSongButton.classList.toggle("activeRepeateSongButton");

    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekbar.value = progress;

     if (repeateActiveButton) {
        audioPlayer.loop = true;
    } else {
        audioPlayer.loop = false;
    }
})

// linked list for random songs
class Node {
    constructor(val) {
        this.data = val;
        this.next = null;
        this.prev = null;
    }
}
 
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    getNextNode() {
        if (!this.tail || !this.tail.next) {
            return null;
        }

        this.tail = this.tail.next;
        return this.tail;
    }

    deleteLastNode() {
        if (!this.tail) return null;

        let temp = this.tail;

        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.prev;
            this.tail.next = null;
        }

        return temp;
    }

    deleteLinkedList() {
        let currentNode = this.head;

        while (currentNode !== null) {
            let nextNode = currentNode.next;
            currentNode.next = null;
            currentNode.prev = null;
            currentNode = nextNode;
        }

        this.head = null;
        this.tail = null;
    } 

    isEmpty() {
        if (this.head == null) return true;
        return false;
    }
 
    addItem(val) {
        let temp = new Node(val);
 
        if (this.head == null) {
            this.head = temp;
            this.tail = temp;
        }
        else {
            this.tail.next = temp;
            temp.prev = this.tail
            this.tail = this.tail.next;
        }
    }
 
    display() {
        if (!this.isEmpty()) {
            let curr = this.head;
            while (curr !== null) {
                console.log(curr.data);
                curr = curr.next;
            }
        }
    }
}

export const dll = new DoublyLinkedList();
let currentSongRandom = dll.tail;

export function appendRandomSongToDll() {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainers.length === 0) return;

    const availableSongs = songContainers.filter((_, index) => index !== currentSongRandom);
    if (availableSongs.length === 0) return;

    const rand = Math.floor(Math.random() * availableSongs.length);
    const randomSong = availableSongs[rand];

    if (dll) {
        dll.addItem(randomSong);
        currentSongRandom = songContainers.indexOf(randomSong);

        audioPlayer.play().catch((error) => {
            console.error("Error playing random song:", error);
        });
    }

    return dll;
}

export let randomButtonActive = false;

randomSongButton.addEventListener('click', () => {
    randomButtonActive = !randomButtonActive;
    randomSongButton.classList.toggle("activeRandomSongButton"); // css toggle

    // if the random button isn't active
    // delete dll and reset current song
    if (!randomButtonActive) {
        dll.deleteLinkedList();
        currentSongRandom = dll.head;
        return;
    }
    // make sure audio player stays paused
    if (audioPlayer.paused) return;

    appendRandomSongToDll();


    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";
});

audioPlayer.addEventListener('ended', () => {
    if (!randomButtonActive) {
        return;
    }

    // Ensure we are appending a song to the DLL before proceeding
    appendRandomSongToDll();

    // Check if the DLL has a valid tail (last appended song)
    const nextSong = dll.tail ? dll.tail.data : null;
    if (!nextSong) {
        console.error("No song available to play.");
        return;
    }

    const audioUrl = nextSong.dataset.file;

    if (audioUrl) {
        const tempAudio = new Audio();
        tempAudio.addEventListener('loadeddata', () => {
            audioPlayer.src = audioUrl;
            audioPlayer.load();
            audioPlayer.play().catch((error) => {
                console.error("Error playing next song:", error);
            });
        });

        // Start preloading the song
        tempAudio.src = audioUrl;
    } else {
        console.error("Invalid audio URL for the next song.");
    }
});
