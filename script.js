"use strict";

const body = document.getElementById("body");

const loadingScreen = document.getElementById("loadingScreen");

const navElements = document.getElementById("navElements");
const navBar = document.getElementById("navBar");

const alertText = document.getElementById("alertText");

const menuContainer = document.getElementById("menu");

const playButtonContainer = document.getElementById('playButton');
const playIcon = document.getElementById('playIcon')
const durationSlider = document.getElementById('durationSlider');
const audioContainer = document.getElementById('audio');
const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('currentTime');

const saveButtonContainer = document.getElementById('saveButton');
const saveIcon = document.getElementById("saveIcon");

const seekLeftButton = document.getElementById('seekLeft');
const seekRightButton = document.getElementById('seekRight');
const skipLeftButton = document.getElementById('skipLeft');
const skipRightButton = document.getElementById('skipRight');

const timeLimit = 60.0;
const timeStep = 0.01;
let time = -1;
let state = 'play';
let saved = false;
let rAF = null;
let isMenu = false;
let isReverse = false;
let timer = setInterval(() => {
    time = time.toFixed(2);
    alertText.innerHTML = "SYSTEM IS UNSTABLE. PERFORMING RESET IN " + time + " SECONDS.";
    time -= timeStep;
    if(time === 0){
        reverseAudio();
    }
}, 10);
// https://raw.githubusercontent.com/dienkiett/NightEvent2025/master/objects/audio.mp3
const playAudio = () => {
    audio.play();
    playIcon.src = "./objects/icon/pause.png";
    playIcon.alt = "Pause";
    state = 'pause';
    playIcon.style.height = '80%';
    requestAnimationFrame(whilePlaying);
}

const pauseAudio = () => {
    audio.pause();
    playIcon.src = "./objects/icon/play.png";
    playIcon.alt = "Play";
    state = 'play';
    playIcon.style.height = '75%';
    requestAnimationFrame(whilePlaying);
}

const loading = () => {
    audio.pause();
    audio.currentTime = 0;
    playIcon.src = "./objects/icon/play.png";
    playIcon.alt = "Play";
    state = 'play';
    playIcon.style.height = '75%';
    requestAnimationFrame(whilePlaying);
    if(isMenu)
        toggleMenu();
    loadingScreen.style.display = "block";
    setTimeout(() => {
        loadingScreen.style.display = "none";     
    }, 1000);
}

const toggleMenu = () => {
    if(!isMenu){
        menuContainer.style.display = "flex";
        isMenu = true;
    } else {
        menuContainer.style.display = "none";
        isMenu = false;
    }
}


const reverseAudio = () => {
    if(!isReverse){
        pauseAudio();
        audio.src = "https://raw.githubusercontent.com/dienkiett/NightEvent2025/master/objects/_audio.mp3";
        audio.load();
        isReverse = true;
        body.style.animationName = "flip";
        setTimeout(() => {
            time = timeLimit;
            alertText.style.rotate = "0 1 0 180deg";
            alertText.style.display = "flex";
        }, 1000);

    } else {
        alertText.style.display = "none";
        pauseAudio();
        audio.src = "https://raw.githubusercontent.com/dienkiett/NightEvent2025/master/objects/audio.mp3";
        audio.load();
        isReverse = false;
        body.style.animationName = "unflip";
        time = -1;
    }
}

playButtonContainer.addEventListener('click', () => {
    if(state === 'play') {
        playAudio();
    } else {
    pauseAudio();
  }
});

const showRangeProgress = (rangeInput) => {
    audioContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}


durationSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    durationSlider.max = Math.floor(audio.duration);
}

const whilePlaying = () => {
    durationSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(durationSlider.value);
    audioContainer.style.setProperty('--seek-before-width', `${durationSlider.value / durationSlider.max * 100}%`);
    rAF = requestAnimationFrame(whilePlaying);
}

if (audio.readyState > 0) {
    audio.volume = 0;
    displayDuration();
    setSliderMax();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
    });
}

durationSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(durationSlider.value);
    if(!audio.paused) {
        cancelAnimationFrame(rAF);
    }
});

durationSlider.addEventListener('change', () => {
    audio.currentTime = durationSlider.value;
    if(!audio.paused) {
        requestAnimationFrame(whilePlaying);
    } 
});

audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    durationSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(durationSlider.value);
    audioContainer.style.setProperty('--seek-before-width', `${durationSlider.value / durationSlider.max * 100}%`);
    pauseAudio();
});

saveButtonContainer.addEventListener("click", () => {
    if(!saved){
        saved = true;
        saveIcon.src = "./objects/icon/saved.png";
    } else{
        saved = false;
        saveIcon.src = "./objects/icon/save.png";
    }
});

seekLeftButton.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    requestAnimationFrame(whilePlaying);
});

seekRightButton.addEventListener("click", () => {
    audio.currentTime = Math.min(durationSlider.max, audio.currentTime + 10);
    requestAnimationFrame(whilePlaying);
});

skipLeftButton.addEventListener("click", () => {
    audio.currentTime = 0;
    pauseAudio();
});

skipRightButton.addEventListener("click", () => {
    audio.currentTime = durationSlider.max;
    pauseAudio();
});

loading();