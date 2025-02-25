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

    deleteLinkedList() {
        let currentNode = this.head;

        while (currentNode !== null) {
            let nextNode = currentNode.next;
            currentNode.next = null;
            currentNode.prev = null;
            currentNode = nextNode;
        }

        let length = 0;
        this.head = null;
        this.tail = null;
    } 

    isEmpty() {
        return this.head === null;
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
            this.tail = temp;
        }

        length++;
    }

    prependItem(val) {
        let temp = new Node(val);

        this.length++;
        if (!this.head) {
            this.head = this.tail = temp;
            return
        }

        temp.next = this.head;
        this.head.prev = temp;
        this.head = temp;
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
export let currentSongRandom = null;

export function getCurrentSongRandom(newSong) {
    currentSongRandom = newSong;
}

export function prependRandomSongToDll() {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainers.length === 0) return;

    let availableSongs = songContainers.filter((element) => element.dataset.file !== audioPlayer.src);
    if (availableSongs.length === 0) return;

    const rand = Math.floor(Math.random() * availableSongs.length);
    const randomSong = availableSongs[rand];

    dll.prependItem(randomSong);

    currentSongRandom = dll.head;

    const nextSong = dll.head.data;
    if (nextSong) {
        const audioUrl = nextSong.dataset.file;
    }

    return dll;
}

export function appendRandomSongToDll() {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainers.length === 0) return;

    let availableSongs = songContainers.filter((element) => element.dataset.file !== audioPlayer.src);
    if (availableSongs.length === 0) return;

    const rand = Math.floor(Math.random() * availableSongs.length);
    const randomSong = availableSongs[rand];

    dll.addItem(randomSong);

    currentSongRandom = dll.tail;

    const nextSong = dll.tail.data;
    if (nextSong) {
        const audioUrl = nextSong.dataset.file;
    }

    return dll;
}

export function appendCurrentSongToDll() {
    const songContainers = [...metadataContainer.querySelectorAll('.songContainer')];
    if (songContainers.length === 0) return;

    const currentSongContainer = songContainers.find(
        (container) => container.dataset.file === audioPlayer.src
    );

    if (!currentSongContainer) {
        console.error("Current song container not found.");
        return;
    }

    if (!dll.tail || dll.tail.data.dataset.file !== currentSongContainer.dataset.file) {
        const newNode = { data: currentSongContainer, next: null, prev: null };

        if (!dll.tail) {
            dll.head = dll.tail = newNode;
        } else {
            newNode.prev = dll.tail;
            dll.tail.next = newNode;
            dll.tail = newNode;
        }

        currentSongRandom = dll.tail;
    }
}

export let randomButtonActive = false;

randomSongButton.addEventListener('click', () => {
    randomButtonActive = !randomButtonActive;
    randomSongButton.classList.toggle("activeRandomSongButton");

    if (randomButtonActive) {
        appendCurrentSongToDll();
    } else {
        dll.deleteLinkedList();
        currentSongRandom = null;
    }
});


audioPlayer.addEventListener('ended', () => {
    if (!randomButtonActive) {
        return;
    }

    appendRandomSongToDll();

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
