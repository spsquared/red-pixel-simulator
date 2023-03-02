let inMenuScreen = true;

const menuScreen = document.getElementById('menuScreen');
const titleContainer = document.getElementById('titleContainer');
const t_redpixel = document.getElementById('t_redpixel');
const t_textRed = document.getElementById('t_textRed');
const t_textPixel = document.getElementById('t_textPixel');
const t_textSimulator = document.getElementById('t_textSimulator');
const t_top = document.getElementById('t_top');
const t_bottom = document.getElementById('t_bottom');
const sandboxButton = document.getElementById('sandboxButton');
const puzzleButton = document.getElementById('puzzleButton');
const multiplayerButton = document.getElementById('multiplayerButton');

window.addEventListener('resize', (e) => {
    menuScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');
});
menuScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');

window.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('tempCover').remove();
    setTimeout(() => {
        t_redpixel.style.transition = '200ms ease-in transform';
        t_textRed.style.transition = '200ms ease-in transform';
        t_textPixel.style.transition = '200ms ease-in transform';
        t_textSimulator.style.transition = '200ms ease-in transform';
        t_redpixel.style.transform = 'none';
    }, 200);
    setTimeout(() => {
        t_textRed.style.transform = 'none';
    }, 800);
    setTimeout(() => {
        t_textPixel.style.transform = 'none';
    }, 900);
    setTimeout(() => {
        t_textSimulator.style.transform = 'none';
    }, 1000);
    setTimeout(() => {
        titleContainer.style.transform = 'translateY(-20vh)';
    }, 1500);
    setTimeout(() => {
        sandboxButton.style.transform = 'translateY(-45vh)';
    }, 2200);
    setTimeout(() => {
        puzzleButton.style.transform = 'translateY(-45vh)';
    }, 2400);
    setTimeout(() => {
        multiplayerButton.style.transform = 'translateY(-45vh)';
    }, 2600);
    startTitleBob = setTimeout(titleBob, 3000);
});

let titleBobController = setInterval(() => { });
function titleBob() {
    titleContainer.style.transitionDuration = '2s';
    let timer = false;
    titleContainer.style.transform = 'translateY(-19vh)';
    titleBobController = setInterval(() => {
        timer = !timer;
        if (timer) titleContainer.style.transform = 'translateY(-21vh)';
        else titleContainer.style.transform = 'translateY(-19vh)';
    }, 2000);
};
let startTitleBob = setTimeout(() => { });

let acceptMenuInputs = true;
const transitionTimeouts = [];
function setTransitionTimeout(cb, ms) {
    let t = setTimeout(() => {
        cb();
        transitionTimeouts.splice(transitionTimeouts.indexOf(t), 1);
    }, ms);
    transitionTimeouts.push(t);
};
function transitionWithinGame(cb) {
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    menuScreen.style.transitionDuration = '0s';
    menuScreen.style.backgroundColor = 'transparent';
    menuScreen.style.opacity = '1';
    menuScreen.style.visibility = '';
    menuScreen.style.pointerEvents = '';
    inMenuScreen = true;
    t_top.style.transform = 'translateY(60vh)';
    t_bottom.style.transform = 'translateY(-60vh)';
    setTransitionTimeout(() => {
        cb();
        t_top.style.transform = '';
        t_bottom.style.transform = '';
        document.getElementById('sidebar').scrollTo(0, 0);
        inMenuScreen = false;
    }, 800);
    setTransitionTimeout(() => {
        menuScreen.style.visibility = 'hidden';
        menuScreen.style.transitionDuration = '';
        menuScreen.style.backgroundColor = '';
        menuScreen.style.opacity = '0';
        menuScreen.style.pointerEvents = 'none';
    }, 1100);
};
function transitionToMenu() {
    acceptMenuInputs = true;
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    menuScreen.style.transitionDuration = '0s';
    menuScreen.style.backgroundColor = 'transparent';
    menuScreen.style.opacity = '1';
    menuScreen.style.visibility = '';
    menuScreen.style.pointerEvents = '';
    titleContainer.style.transitionDuration = '';
    inMenuScreen = true;
    t_top.style.transform = 'translateY(60vh)';
    t_bottom.style.transform = 'translateY(-60vh)';
    setTransitionTimeout(() => {
        menuScreen.style.transitionDuration = '';
        menuScreen.style.backgroundColor = '';
        t_top.style.transform = '';
        t_bottom.style.transform = '';
        if (window.startMenuMusic) window.startMenuMusic();
        else setTimeout(function wait() {
            if (window.startMenuMusic) window.startMenuMusic();
            else setTimeout(wait, 1000);
        }, 1000);
    }, 800);
    titleContainer.style.transform = 'translateY(-20vh)';
    setTransitionTimeout(() => {
        sandboxButton.style.transform = 'translateY(-45vh)';
    }, 600);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = 'translateY(-45vh)';
    }, 700);
    setTransitionTimeout(() => {
        multiplayerButton.style.transform = 'translateY(-45vh)';
    }, 800);
    setTransitionTimeout(() => {
        titleBob();
    }, 1500);
};
function transitionToGame() {
    acceptMenuInputs = false;
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    clearInterval(titleBobController);
    titleContainer.style.transitionDuration = '';
    titleContainer.style.transform = 'translateY(-165vh)';
    document.getElementById('sidebar').scrollTo(0, 0);
    setTransitionTimeout(() => {
        multiplayerButton.style.transform = 'translateY(100vh)';
    }, 200);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = 'translateY(100vh)';
    }, 300);
    setTransitionTimeout(() => {
        sandboxButton.style.transform = 'translateY(100vh)';
    }, 400);
    setTransitionTimeout(() => {
        menuScreen.style.opacity = '0';
        inMenuScreen = false;
        if (window.stopMenuMusic) window.stopMenuMusic();
    }, 600);
    setTransitionTimeout(() => {
        menuScreen.style.pointerEvents = 'none';
    }, 1100);
    setTransitionTimeout(() => {
        menuScreen.style.visibility = 'hidden';
    }, 1600);
};

const levelSelect = document.getElementById('levelSelect');
const levelSelectClose = document.getElementById('levelSelectClose');
const levelSelectBody = document.getElementById('levelSelectBody');

sandboxButton.onclick = (e) => {
    if (!acceptMenuInputs) return;
    levelSelect.style.transform = '';
    clearTimeout(startTitleBob);
    document.getElementById('levelDetails').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('saveCode').disabled = false;
    document.getElementById('saveCode').style.cursor = '';
    document.getElementById('generateSave').style.backgroundColor = '';
    document.getElementById('uploadSave').style.backgroundColor = '';
    document.getElementById('downloadSave').style.backgroundColor = '';
    document.getElementById('generateSave').style.cursor = '';
    document.getElementById('uploadSave').style.cursor = '';
    document.getElementById('downloadSave').style.cursor = '';
    document.getElementById('gridSize').disabled = false;
    document.getElementById('gridSize').style.cursor = '';
    document.getElementById('premadeSaves').style.display = '';
    sandboxMode = true;
    camera.scale = 1;
    camera.x = 0;
    camera.y = 0;
    resetPixelAmounts();
    loadStoredSave();
    transitionToGame();
};
puzzleButton.onclick = (e) => {
    levelSelect.style.transform = 'translateY(100vh)';
    saveCodeText.blur();
};
levelSelectClose.onclick = (e) => {
    levelSelect.style.transform = '';
};
function selectPuzzle() {
    if (!acceptMenuInputs) return;
    clearTimeout(startTitleBob);
    document.getElementById('levelDetails').style.display = '';
    document.getElementById('restart').style.display = '';
    document.getElementById('saveCode').disabled = true;
    document.getElementById('saveCode').style.cursor = 'not-allowed';
    document.getElementById('generateSave').style.backgroundColor = 'grey';
    document.getElementById('uploadSave').style.backgroundColor = 'grey';
    document.getElementById('downloadSave').style.backgroundColor = 'grey';
    document.getElementById('generateSave').style.cursor = 'not-allowed';
    document.getElementById('uploadSave').style.cursor = 'not-allowed';
    document.getElementById('downloadSave').style.cursor = 'not-allowed';
    document.getElementById('gridSize').disabled = true;
    document.getElementById('gridSize').style.cursor = 'not-allowed';
    document.getElementById('premadeSaves').style.display = 'none';
    sandboxMode = false;
    levelSelect.style.transform = '';
    transitionToGame();
};

if (Math.random() < 0.001) {
    const coverCanvas = document.createElement('canvas');
    const cctx = coverCanvas.getContext('2d');
    coverCanvas.width = 500;
    coverCanvas.height = 500;
    cctx.fillStyle = '#FF0000';
    cctx.fillRect(0, 0, 500, 500);
    cctx.textBaseline = 'top';
    cctx.textAlign = 'left';
    cctx.font = '80px Lucida Console';
    cctx.fillStyle = '#FFFFFF';
    cctx.fillText('SP', 340, 30);
    cctx.font = 'bold 60px Lucida Console';
    cctx.fillText('2', 440, 24);
    cctx.font = '150px Lucida Console';
    cctx.fillStyle = '#FFFFFF7F';
    cctx.fillText('Red', 26, 186);
    cctx.fillText('Pixel', 26, 336);
    cctx.shadowBlur = 10;
    cctx.shadowColor = '#FFFFFFC0';
    cctx.fillStyle = '#FFFFFF';
    cctx.fillText('Red', 30, 180);
    cctx.fillText('Pixel', 30, 330);
    coverCanvas.style.position = 'absolute';
    coverCanvas.style.top = '0px';
    coverCanvas.style.left = '0px';
    coverCanvas.style.zIndex = 10000;
    // document.body.appendChild(coverCanvas);
    document.getElementById('t_redpixel').style.backgroundImage = 'url(' + coverCanvas.toDataURL('image/png') + ')';
    document.getElementById('t_redpixel').style.backgroundSize = 'contain';
}