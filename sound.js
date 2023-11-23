const audioContext = new AudioContext();
let volume = parseInt(window.localStorage.getItem('volume') ?? 100);
const volumeDisp = document.getElementById('volumeAdjustDisp');
const volumeSlider = document.getElementById('volumeAdjustSlider');
const globalVolume = audioContext.createGain();
globalVolume.connect(audioContext.destination);
globalVolume.gain.setValueAtTime(volume / 100, audioContext.currentTime);

// general audio functions
function setAudio(file, cb) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) audioContext.decodeAudioData(request.response, (buf) => {
                cb(buf);
                resolve();
            });
        };
        request.onerror = (e) => reject(e);
        request.send();
    });
};
const sounds = {};
function addAudioQueue(buf, id, randomDetune = 0) {
    const preloadQueue = [];
    preloadQueue.push(audioContext.createBufferSource());
    preloadQueue[0].buffer = buf;
    preloadQueue[0].detune.value = Math.random() * randomDetune * 2 - randomDetune;
    if (sounds[id] === undefined) {
        sounds[id] = (volume = 1) => {
            let v = isNaN(parseFloat(volume)) ? 1 : parseFloat(volume);
            if (v == 0) return;
            if (sounds[id].variants.length == 1) sounds[id].variants[0](v); // useless?
            else sounds[id].variants[Math.floor(Math.random() * sounds[id].variants.length)](v);
        };
        sounds[id].variants = [];
    }
    sounds[id].variants.push((volume = 1) => {
        const source = preloadQueue.shift();
        const gain = audioContext.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(globalVolume);
        source.onended = gain.disconnect;
        source.start();
        const nextSource = audioContext.createBufferSource();
        nextSource.buffer = buf;
        nextSource.detune.value = Math.random() * randomDetune * 2 - randomDetune;
        preloadQueue.push(nextSource);
    });
};

// music
let musicMuted = window.localStorage.getItem('musicMuted') == '1';
const musicMuteButton = document.getElementById('musicMuteButton');
const musicVolume = audioContext.createGain();
musicVolume.connect(globalVolume);
const musicBuffers = new Map();
const activeMusic = [];
function playMusic(id, loop = true) {
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
        source.loop = loop;
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
        musicMuteButton.style.backgroundImage = 'url(/assets/svg/volumeMute.svg)';
    } else {
        musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = `url(/assets/svg/volume${Math.ceil(volume / 50)}.svg)`;
    }
    window.localStorage.setItem('musicMuted', musicMuted ? 1 : 0);
};
function setGlobalVolume(vol) {
    volume = Math.max(0, Math.min(parseInt(vol), 100));
    globalVolume.gain.setValueAtTime(volume / 100, audioContext.currentTime);
    if (musicMuted) musicMuteButton.style.backgroundImage = 'url(/assets/svg/volumeMute.svg)';
    else musicMuteButton.style.backgroundImage = `url(/assets/svg/volume${Math.ceil(volume / 50)}.svg)`;
    volumeDisp.style.backgroundImage = `url(/assets/svg/volume${Math.ceil(volume / 50)}.svg)`;
    window.localStorage.setItem('volume', volume);
};
musicMuteButton.onclick = toggleMusic;
volumeSlider.oninput = (e) => setGlobalVolume(volumeSlider.value);
volumeSlider.onmouseup = (e) => sounds.shortDing();

// music pixels
const musicPixelSounds = new Map();
const musicPixelOscillators = new Map();
async function addMusicPixelSound(id) {
    await setAudio(`./assets/musicpixels/music-${id}.mp3`, (buf) => {
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
function musicPixel(id, state) {
    if (musicPixelSounds.has(id)) {
        if (state) musicPixelSounds.get(id)();
    } else if (musicPixelOscillators.has(id)) {
        if (state) musicPixelOscillators.get(id).increment();
        else musicPixelOscillators.get(id).decrement();
    } else throw new ReferenceError('Cannot invoke non-existent music pixel ' + id);
};

// load (blocks loading screen resolve)
let soundsResolveLoad;
let soundsLoad = new Promise((resolve, reject) => soundsResolveLoad = resolve);
window.addEventListener('load', async (e) => {
    const promiseList = [];
    promiseList.push(setAudio('./assets/sound/click.mp3', (buf) => {
        addAudioQueue(buf, 'click');
        document.querySelectorAll('.bclick').forEach(e => e.addEventListener('click', sounds.click));
        document.querySelectorAll('.pickerPixel').forEach(e => e.addEventListener('click', sounds.click));
        document.querySelectorAll('.levelButton').forEach(e => e.addEventListener('click', sounds.click));
    }));
    promiseList.push(setAudio('./assets/sound/tick.mp3', (buf) => {
        addAudioQueue(buf, 'tick');
        document.querySelectorAll('.btick').forEach(e => e.addEventListener('click', sounds.tick));
        document.querySelectorAll('.pickerPixel').forEach(e => e.firstChild.addEventListener('mouseover', sounds.tick));
    }));
    promiseList.push(setAudio('./assets/sound/ding.mp3', (buf) => addAudioQueue(buf, 'ding')));
    promiseList.push(setAudio('./assets/sound/ding-short.mp3', (buf) => addAudioQueue(buf, 'shortDing')));
    promiseList.push(setAudio('./assets/sound/deny.mp3', (buf) => addAudioQueue(buf, 'deny')));
    promiseList.push(setAudio('./assets/sound/explosion-1.mp3', (buf) => addAudioQueue(buf, 'explosion', 500)));
    promiseList.push(setAudio('./assets/sound/explosion-2.mp3', (buf) => addAudioQueue(buf, 'explosion', 500)));
    promiseList.push(setAudio('./assets/sound/explosion-3.mp3', (buf) => addAudioQueue(buf, 'explosion', 500)));
    promiseList.push(setAudio('./assets/sound/explosion-4.mp3', (buf) => addAudioQueue(buf, 'explosion', 500)));
    promiseList.push(setAudio('./assets/sound/monsterDeath.mp3', (buf) => addAudioQueue(buf, 'monsterDeath', 200)));
    promiseList.push(setAudio('./assets/sound/targetFilled.mp3', (buf) => addAudioQueue(buf, 'targetFill')));
    promiseList.push(setAudio('./assets/sound/win.mp3', (buf) => addAudioQueue(buf, 'win')));
    promiseList.push(setAudio('./assets/sound/null.mp3', (buf) => addAudioQueue(buf, 'rickroll')));
    setAudio('./assets/sound/menu.mp3', (buf) => {
        musicBuffers.set('menu', buf);
    });
    setAudio('./assets/sound/credits.mp3', (buf) => {
        musicBuffers.set('credits', buf);
    });
    promiseList.push(addMusicPixelSound(1));
    promiseList.push(addMusicPixelSound(2));
    promiseList.push(addMusicPixelSound(3));
    let id = 4;
    let types = ['square', 'sawtooth', 'triangle'];
    let frequencies = [
        261.63,
        277.18,
        293.66,
        311.13,
        329.63,
        349.23,
        369.99,
        392.00,
        415.30,
        440.00,
        466.16,
        493.88,
        523.25,
        554.37,
        587.33,
        622.25,
        659.25,
        698.46,
        739.99,
        783.99,
        830.61,
        880.00,
        932.33,
        987.77,
        1046.50
    ];
    for (let type of types) {
        for (let frequency of frequencies) {
            promiseList.push(addMusicPixelOscillator(id++, type, frequency));
        }
    }
    promiseList.push(addMusicPixelSound(82));
    promiseList.push(addMusicPixelSound(83));
    promiseList.push(addMusicPixelSound(84));
    promiseList.push(addMusicPixelSound(85));
    promiseList.push(addMusicPixelSound(86));
    promiseList.push(addMusicPixelSound(87));
    promiseList.push(addMusicPixelSound(88));
    if (musicMuted) {
        musicVolume.gain.setValueAtTime(0, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = 'url(/assets/svg/volumeMute.svg)';
    } else {
        musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
        musicMuteButton.style.backgroundImage = `url(/assets/svg/volume${Math.ceil(volume / 50)}.svg)`;
    }
    globalVolume.gain.setValueAtTime(volume / 100, audioContext.currentTime);
    volumeDisp.style.backgroundImage = `url(/assets/svg/volume${Math.ceil(volume / 50)}.svg)`;
    volumeSlider.value = volume;
    for (let promise of promiseList) {
        await promise;
    }
    soundsResolveLoad();
});
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
