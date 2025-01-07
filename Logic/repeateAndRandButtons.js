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
                console.log("New Linked List:", curr.data);
                curr = curr.next;
            }
        }
    }
}

export const dll = new DoublyLinkedList();
let currentSongRandom = null;

export function appendRandomSongToDll() {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainers.length === 0) return;

    let availableSongs = songContainers.filter((element) => element.dataset.file !== audioPlayer.src);
    if (availableSongs.length === 0) return;

    const rand = Math.floor(Math.random() * availableSongs.length);
    const randomSong = availableSongs[rand];

    dll.addItem(randomSong);

    const nextSong = dll.tail.data;
    if (nextSong) {
        const audioUrl = nextSong.dataset.file;
    }

    console.log(dll);
    return dll;
}

export let randomButtonActive = false;

randomSongButton.addEventListener('click', () => {
    randomButtonActive = !randomButtonActive;
    randomSongButton.classList.toggle("activeRandomSongButton"); // CSS toggle

    if (!randomButtonActive) {
        dll.deleteLinkedList();
        currentSongRandom = null;
        return;
    }

    if (audioPlayer.src) {
        const currentSongInDll = dll.tail && dll.tail.data && dll.tail.data.dataset.file === audioPlayer.src;

        if (!currentSongInDll) {
            const currentSong = { dataset: { file: audioPlayer.src } };
            dll.addItem(currentSong);
            currentSongRandom = dll.tail;
        }

        appendRandomSongToDll();
    }
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
