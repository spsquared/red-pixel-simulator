const audioContext = new (window.AudioContext ?? window.webkitAudioContext ?? Error)();
let volume = parseInt(window.localStorage.getItem('volume') ?? 100);
const volumeDisp = document.getElementById('volumeAdjustDisp');
const volumeSlider = document.getElementById('volumeAdjustSlider');
const globalVolume = audioContext.createGain();
globalVolume.connect(audioContext.destination);
globalVolume.gain.setValueAtTime(volume / 100, audioContext.currentTime);
function setAudio(file, cb) {
    const request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) audioContext.decodeAudioData(request.response, cb);
    };
    request.send();
};
let musicMuted = window.localStorage.getItem('musicMuted') == '1';
const musicMuteButton = document.getElementById('musicMuteButton');
const musicVolume = audioContext.createGain();
musicVolume.connect(globalVolume);
const musicBuffers = new Map();
const activeMusic = [];
function playMusic(id) {
    if (musicBuffers.has(id)) {
        const gain = audioContext.createGain();
        const source = audioContext.createBufferSource();
        activeMusic.push({
            id: id,
            source: source,
            gain: gain
        });
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.connect(musicVolume);
        source.buffer = musicBuffers.get(id);
        source.loop = true;
        source.connect(gain);
        source.start();
        gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 1);
        return true;
    }
    return false;
};
function stopMusic(id) {
    const music = activeMusic.find(n => n.id === id);
    if (music !== undefined) {
        music.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        setTimeout(() => {
            music.source.stop();
            music.source.disconnect();
            music.gain.disconnect();
        }, 1000);
    }
};
function stopAllMusic() {
    for (const music of activeMusic) {
        music.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        setTimeout(() => {
            music.source.stop();
            music.source.disconnect();
            music.gain.disconnect();
        }, 1000);
    }
    activeMusic.length = 0;
};
function toggleMusic() {
    musicMuted = !musicMuted;
    if (musicMuted) {
        musicVolume.gain.setValueAtTime(0, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = 'url(/assets/volumeMute.svg)';
    } else {
        musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = `url(/assets/volume${Math.ceil(volume / 50)}.svg)`;
    }
    window.localStorage.setItem('musicMuted', musicMuted ? 1 : 0);
};
function setGlobalVolume(vol) {
    volume = Math.max(0, Math.min(parseInt(vol), 100));
    globalVolume.gain.setValueAtTime(volume / 100, audioContext.currentTime);
    if (musicMuted) musicMuteButton.style.backgroundImage = 'url(/assets/volumeMute.svg)';
    else musicMuteButton.style.backgroundImage = `url(/assets/volume${Math.ceil(volume / 50)}.svg)`;
    volumeDisp.style.backgroundImage = `url(/assets/volume${Math.ceil(volume / 50)}.svg)`;
    window.localStorage.setItem('volume', volume);
};
musicMuteButton.onclick = toggleMusic;
volumeSlider.oninput = (e) => setGlobalVolume(volumeSlider.value);
volumeSlider.onmouseup = (e) => shortDingSound();
const musicPixelSounds = new Map();
const musicPixelOscillators = new Map();
async function addMusicPixelSound(id) {
    setAudio(`./assets/musicpixels/music-${id}.mp3`, (buf) => {
        const preloadQueue = [];
        for (let i = 0; i < 5; i++) {
            preloadQueue.unshift(audioContext.createBufferSource());
            preloadQueue[0].buffer = buf;
            preloadQueue[0].connect(globalVolume);
            preloadQueue[0].onended = preloadQueue[0].disconnect;
        }
        musicPixelSounds.set(id, function play() {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
            nextSource.onended = nextSource.disconnect;
        });
    });
};
async function addMusicPixelOscillator(id, type, pitch) {
    const gain = audioContext.createGain();
    gain.gain.value = 0;
    gain.connect(globalVolume);
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
    oscillator.connect(gain);
    oscillator.start();
    let activePixels = 0;
    let paused = false;
    musicPixelOscillators.set(id, {
        increment: () => {
            activePixels++;
            if (!paused) gain.gain.value = 0.1 * activePixels;
        },
        decrement: () => {
            activePixels--;
            if (!paused) gain.gain.value = 0.1 * activePixels;
        },
        pause: () => {
            paused = true;
            gain.gain.value = 0;
        },
        resume: () => {
            paused = false;
            gain.gain.value = 0.1 * activePixels;
        },
        stop: () => {
            activePixels = 0;
            gain.gain.value = 0;
        }
    });
};
function stopAllMusicPixels() {
    musicPixelOscillators.forEach(n => n.stop());
};
function pauseMusicPixels() {
    musicPixelOscillators.forEach(n => n.pause());
};
function resumeMusicPixels() {
    musicPixelOscillators.forEach(n => n.resume());
};
function createSoundQueue(buf, funcName) {
    const preloadQueue = [];
    preloadQueue.push(audioContext.createBufferSource());
    preloadQueue[0].buffer = buf;
    preloadQueue[0].connect(globalVolume);
    preloadQueue[0].onended = preloadQueue[0].disconnect;
    window[funcName] = () => {
        preloadQueue.shift().start();
        const nextSource = audioContext.createBufferSource();
        nextSource.buffer = buf;
        nextSource.connect(globalVolume);
        preloadQueue.push(nextSource);
        nextSource.onended = nextSource.disconnect;
    };
};
window.addEventListener('load', (e) => {
    setAudio('./assets/click.mp3', (buf) => {
        createSoundQueue(buf, 'playClickSound');
        document.querySelectorAll('.bclick').forEach(e => e.addEventListener('click', window.playClickSound));
        document.querySelectorAll('.pickerPixel').forEach(e => e.addEventListener('click', window.playClickSound));
        document.querySelectorAll('.levelButton').forEach(e => e.addEventListener('click', window.playClickSound));
    });
    setAudio('./assets/tick.mp3', (buf) => {
        createSoundQueue(buf, 'playTickSound');
        document.querySelectorAll('.btick').forEach(e => e.addEventListener('click', window.playTickSound));
        document.querySelectorAll('.pickerPixel').forEach(e => e.firstChild.addEventListener('mouseover', window.playTickSound));
    });
    setAudio('./assets/ding.mp3', (buf) => createSoundQueue(buf, 'playDing1'));
    setAudio('./assets/ding-short.mp3', (buf) => createSoundQueue(buf, 'playDing2'));
    setAudio('./assets/monsterDeath.mp3', (buf) => createSoundQueue(buf, 'playMonsterDeathSound'));
    setAudio('./assets/targetFilled.mp3', (buf) => createSoundQueue(buf, 'playTargetFillSound'));
    setAudio('./assets/win.mp3', (buf) => createSoundQueue(buf, 'playWinSound'));
    setAudio('./assets/menu.mp3', (buf) => {
        musicBuffers.set('menu', buf);
    });
    addMusicPixelSound(1);
    addMusicPixelSound(2);
    addMusicPixelSound(3);
    addMusicPixelOscillator(4, 'square', 261.63);
    addMusicPixelOscillator(5, 'square', 277.18);
    addMusicPixelOscillator(6, 'square', 293.66);
    addMusicPixelOscillator(7, 'square', 311.13);
    addMusicPixelOscillator(8, 'square', 329.63);
    addMusicPixelOscillator(9, 'square', 349.23);
    addMusicPixelOscillator(10, 'square', 369.99);
    addMusicPixelOscillator(11, 'square', 392.00);
    addMusicPixelOscillator(12, 'square', 415.30);
    addMusicPixelOscillator(13, 'square', 440.00);
    addMusicPixelOscillator(14, 'square', 466.16);
    addMusicPixelOscillator(15, 'square', 493.88);
    addMusicPixelOscillator(16, 'square', 523.25);
    addMusicPixelOscillator(17, 'square', 554.37);
    addMusicPixelOscillator(18, 'square', 587.33);
    addMusicPixelOscillator(19, 'square', 622.25);
    addMusicPixelOscillator(20, 'square', 659.25);
    addMusicPixelOscillator(21, 'square', 698.46);
    addMusicPixelOscillator(22, 'square', 739.99);
    addMusicPixelOscillator(23, 'square', 783.99);
    addMusicPixelOscillator(24, 'square', 830.61);
    addMusicPixelOscillator(25, 'square', 880.00);
    addMusicPixelOscillator(26, 'square', 932.33);
    addMusicPixelOscillator(27, 'square', 987.77);
    addMusicPixelOscillator(28, 'square', 1046.50);
    addMusicPixelOscillator(29, 'sawtooth', 261.63);
    addMusicPixelOscillator(30, 'sawtooth', 277.18);
    addMusicPixelOscillator(31, 'sawtooth', 293.66);
    addMusicPixelOscillator(32, 'sawtooth', 311.13);
    addMusicPixelOscillator(33, 'sawtooth', 329.63);
    addMusicPixelOscillator(34, 'sawtooth', 349.23);
    addMusicPixelOscillator(35, 'sawtooth', 369.99);
    addMusicPixelOscillator(36, 'sawtooth', 392.00);
    addMusicPixelOscillator(37, 'sawtooth', 415.30);
    addMusicPixelOscillator(38, 'sawtooth', 440.00);
    addMusicPixelOscillator(39, 'sawtooth', 466.16);
    addMusicPixelOscillator(40, 'sawtooth', 493.88);
    addMusicPixelOscillator(41, 'sawtooth', 523.25);
    addMusicPixelOscillator(42, 'sawtooth', 554.37);
    addMusicPixelOscillator(43, 'sawtooth', 587.33);
    addMusicPixelOscillator(44, 'sawtooth', 622.25);
    addMusicPixelOscillator(45, 'sawtooth', 659.25);
    addMusicPixelOscillator(46, 'sawtooth', 698.46);
    addMusicPixelOscillator(47, 'sawtooth', 739.99);
    addMusicPixelOscillator(48, 'sawtooth', 783.99);
    addMusicPixelOscillator(49, 'sawtooth', 830.61);
    addMusicPixelOscillator(50, 'sawtooth', 880.00);
    addMusicPixelOscillator(51, 'sawtooth', 932.33);
    addMusicPixelOscillator(52, 'sawtooth', 987.77);
    addMusicPixelOscillator(53, 'sawtooth', 1046.50);
    addMusicPixelOscillator(54, 'triangle', 261.63);
    addMusicPixelOscillator(55, 'triangle', 277.18);
    addMusicPixelOscillator(56, 'triangle', 293.66);
    addMusicPixelOscillator(57, 'triangle', 311.13);
    addMusicPixelOscillator(58, 'triangle', 329.63);
    addMusicPixelOscillator(59, 'triangle', 349.23);
    addMusicPixelOscillator(60, 'triangle', 369.99);
    addMusicPixelOscillator(61, 'triangle', 392.00);
    addMusicPixelOscillator(62, 'triangle', 415.30);
    addMusicPixelOscillator(63, 'triangle', 440.00);
    addMusicPixelOscillator(64, 'triangle', 466.16);
    addMusicPixelOscillator(65, 'triangle', 493.88);
    addMusicPixelOscillator(66, 'triangle', 523.25);
    addMusicPixelOscillator(67, 'triangle', 554.37);
    addMusicPixelOscillator(68, 'triangle', 587.33);
    addMusicPixelOscillator(69, 'triangle', 622.25);
    addMusicPixelOscillator(70, 'triangle', 659.25);
    addMusicPixelOscillator(71, 'triangle', 698.46);
    addMusicPixelOscillator(72, 'triangle', 739.99);
    addMusicPixelOscillator(73, 'triangle', 783.99);
    addMusicPixelOscillator(74, 'triangle', 830.61);
    addMusicPixelOscillator(75, 'triangle', 880.00);
    addMusicPixelOscillator(76, 'triangle', 932.33);
    addMusicPixelOscillator(77, 'triangle', 987.77);
    addMusicPixelOscillator(78, 'triangle', 1046.50);
    addMusicPixelSound(82);
    addMusicPixelSound(83);
    addMusicPixelSound(84);
    addMusicPixelSound(85);
    addMusicPixelSound(86);
    addMusicPixelSound(87);
    addMusicPixelSound(88);
    addMusicPixelSound(89);
    if (musicMuted) {
        musicVolume.gain.setValueAtTime(0, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = 'url(/assets/volumeMute.svg)';
    } else {
        musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = `url(/assets/volume${Math.ceil(volume / 50)}.svg)`;
    }
    globalVolume.gain.setValueAtTime(volume / 100, audioContext.currentTime);
    volumeDisp.style.backgroundImage = `url(/assets/volume${Math.ceil(volume / 50)}.svg)`;
    volumeSlider.value = volume;
});
function tickSound() {
    if (window.playTickSound) window.playTickSound();
};
function clickSound() {
    if (window.playClickSound) window.playClickSound();
};
function dingSound() {
    if (window.playDing1) window.playDing1();
};
function shortDingSound() {
    if (window.playDing2) window.playDing2();
};
function musicPixel(id, state) {
    if (musicPixelSounds.has(id)) {
        if (state) musicPixelSounds.get(id)();
    } else if (musicPixelOscillators.has(id)) {
        if (state) musicPixelOscillators.get(id).increment();
        else musicPixelOscillators.get(id).decrement();
    }
};
if (navigator.userActivation) {
    let waitForInteraction = setInterval(() => {
        if (navigator.userActivation.hasBeenActive) {
            audioContext.resume();
            if (inMenuScreen && !playMusic('menu')) setTimeout(function wait() {
                if (inMenuScreen && !playMusic('menu')) setTimeout(wait, 1000);
            }, 1000);
            clearInterval(waitForInteraction);
        }
    }, 100);
} else {
    document.addEventListener('click', function c(e) {
        document.removeEventListener('click', c);
        audioContext.resume();
        if (inMenuScreen && !playMusic('menu')) setTimeout(function wait() {
            if (inMenuScreen && !playMusic('menu')) setTimeout(wait, 1000);
        }, 1000);
    });
}
document.addEventListener('visibilitychange', () => {
    if (document.hidden) globalVolume.gain.linearRampToValueAtTime(volume / 1000, audioContext.currentTime + 1);
    else globalVolume.gain.linearRampToValueAtTime(volume / 100, audioContext.currentTime + 1);
});
