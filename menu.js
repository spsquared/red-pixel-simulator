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

window.onload = (e) => {
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
    setTransitionTimeout(() => {
        titleContainer.style.transform = 'translateY(-20vh)';
    }, 1500);
    setTransitionTimeout(() => {
        sandboxButton.style.transform = 'translateY(-45vh)';
    }, 2200);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = 'translateY(-45vh)';
    }, 2400);
    setTransitionTimeout(() => {
        multiplayerButton.style.transform = 'translateY(-45vh)';
    }, 2600);
    startTitleBob = setTransitionTimeout(titleBob, 3000);
};

let titleBobController = setInterval(() => { });
function titleBob() {
    titleContainer.style.transitionDuration = '3179ms';
    let timer = false;
    titleContainer.style.transform = 'translateY(-19vh)';
    titleBobController = setInterval(() => {
        timer = !timer;
        if (timer) titleContainer.style.transform = 'translateY(-21vh)';
        else titleContainer.style.transform = 'translateY(-19vh)';
    }, 3179);
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
        stopAllMusic();
        if (inMenuScreen && !playMusic('menu')) setTimeout(function wait() {
            if (inMenuScreen && !playMusic('menu')) setTimeout(wait, 1000);
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
        stopAllMusic();
    }, 600);
    setTransitionTimeout(() => {
        menuScreen.style.pointerEvents = 'none';
    }, 1100);
    setTransitionTimeout(() => {
        menuScreen.style.visibility = 'hidden';
    }, 1600);
};
function clearMenuScreen() {
    acceptMenuInputs = false;
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    clearInterval(titleBobController);
    titleContainer.style.transitionDuration = '';
    titleContainer.style.transform = 'translateY(-165vh)';
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
        inMenuScreen = false;
        stopAllMusic();
    }, 600);
};
function restoreMenuScreen() {
    acceptMenuInputs = true;
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    inMenuScreen = true;
    setTransitionTimeout(() => {
        stopAllMusic();
        if (inMenuScreen && !playMusic('menu')) setTimeout(function wait() {
            if (inMenuScreen && !playMusic('menu')) setTimeout(wait, 1000);
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

const levelSelect = document.getElementById('levelSelect');
const levelSelectClose = document.getElementById('levelSelectClose');
const levelSelectBody = document.getElementById('levelSelectBody');
const pixsimMenu = document.getElementById('pixsimMenu');
const pixsimMenuClose = document.getElementById('pixsimMenuClose');
const pixsimMenuConnecting = document.getElementById('pixsimMenuConnecting');
const pixsimSelectHostButton = document.getElementById('pixsimSelectHost');
const pixsimSelectJoinButton = document.getElementById('pixsimSelectJoin');
const pixsimSelectSpectateButton = document.getElementById('pixsimSelectSpectate');
const pixsimSelectScrimmageButton = document.getElementById('pixsimSelectScrimmage');
const pixsimMenuContents = document.getElementById('pixsimMenuContents');

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
    if (levelSelect._open) return;
    levelSelect._open = true;
    levelSelect.style.transform = 'translateY(100vh)';
    saveCodeText.blur();
};
multiplayerButton.onclick = (e) => {
    if (pixsimMenu._open) return;
    pixsimMenu._open = true;
    pixsimMenuConnecting.style.opacity = 1;
    pixsimMenuConnecting.style.pointerEvents = '';
    pixsimMenuContents.style.transform = '';
    pixsimMenu.style.transform = 'translateY(100vh)';
    APIconnect().then(() => {
        pixsimMenuConnecting.style.opacity = 0;
        pixsimMenuConnecting.style.pointerEvents = 'none';
    }, (err) => {
        modal('Could not connect to PixSim API:', `<span style="color: red;">${err.message}</span><br><button onclick="window.open('https://pixsim-api.radioactivestuf.repl.co');>Attempt manual wake</button>`).then(() => pixsimMenuClose.click());
    });
};
levelSelectClose.onclick = (e) => {
    levelSelect._open = false;
    levelSelect.style.transform = '';
};
pixsimMenuClose.onclick = (e) => {
    pixsimMenu._open = false;
    APIdisconnect();
    pixsimMenu.style.transform = '';
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
    levelSelect._open = false;
    transitionToGame();
};

pixsimSelectHostButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateY(100%)';
    const joinCodeDisp = document.getElementById('hostJoinCode');
    joinCodeDisp.innerText = '- - -';
    APIcreateGame().then((gameHost) => {
        joinCodeDisp.innerText = gameHost.code();
        function cancelHostGame() {
            gameHost.end();
            pixsimMenuClose.removeEventListener('click', cancelHostGame);
            document.querySelector('#pixsimHostBody .pixsimBackButton').removeEventListener('click', cancelHostGame);
        };
        pixsimMenuClose.addEventListener('click', cancelHostGame);
        document.querySelector('#pixsimHostBody .pixsimBackButton').addEventListener('click', cancelHostGame);
    });
};
pixsimSelectJoinButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    const joinGameCodeCode = document.getElementById('joinGameCodeCode');
    const joinGameCodeJoin = document.getElementById('joinGameCodeJoin');
    joinGameCodeCode.value = '';
    joinGameCodeJoin.onclick = (e) => {
        modal('Unable to do that!', 'This feature hasn\'t been implemented yet.', false);
    };
    function refresh(data) {
        const joinList = document.getElementById('joinListContent');
        joinList.innerHTML = '';
        function type(t) {
            switch (t) {
                case 'vaultwars':
                    return 'Vault Wars';
                case 'resourcerace':
                    return 'Resource Race';
                default:
                    return 'Unknown';
            }
        };
        for (let game of data) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('joinTile');
            const img = new Image();
            img.classList.add('joinTileImg');
            const codeText = document.createElement('div');
            codeText.classList.add('joinTileCode');
            codeText.innerText = game.code;
            wrapper.appendChild(codeText);
            const sub1 = document.createElement('div');
            sub1.classList.add('joinTileSub1');
            sub1.innerText = `${type(game.type)} ❖ ${game.hostName}`;
            wrapper.appendChild(sub1);
            const sub2 = document.createElement('div');
            sub2.classList.add('joinTileSub2');
            sub2.innerText = game.allowsSpectators ? 'Spectators allowed' : 'Spectators not allowed';
            wrapper.appendChild(sub2);
            wrapper.appendChild(img);
            wrapper.onclick = (e) => {
                modal('Unable to do that!', 'This feature hasn\'t been implmented yet.', false);
            };
            joinList.appendChild(wrapper);
        }
    }
    let refreshLoop = setInterval(() => {
        APIgetPublicGames('all').then(refresh);
    }, 20000);
    function stopRefreshLoop() {
        clearInterval(refreshLoop);
        pixsimMenuClose.removeEventListener('click', stopRefreshLoop);
        document.querySelector('#pixsimHostBody .pixsimBackButton').removeEventListener('click', stopRefreshLoop);
    };
    pixsimMenuClose.addEventListener('click', stopRefreshLoop);
    document.querySelector('#pixsimJoinBody .pixsimBackButton').addEventListener('click', stopRefreshLoop);
    APIgetPublicGames('all').then(refresh);
};
pixsimSelectSpectateButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateY(-100%)';
};
pixsimSelectScrimmageButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateX(-100%)';
};
document.querySelectorAll('.pixsimBackButton').forEach(e => e.onclick = (e) => {
    pixsimMenuContents.style.transform = '';
});

const copyrightNotice = document.getElementById('copyrightNotice');
const creditsAnimation = document.getElementById('creditsAnimation');
copyrightNotice.onclick = (e) => {
    if (!acceptMenuInputs) return;
    e.preventDefault();
    window.open('https://opensource.org/license/mit/');
    return;
    clearMenuScreen();
    levelSelect._open = false;
    levelSelect.style.transform = '';
    pixsimMenu._open = false;
    pixsimMenu.style.transform = '';
    copyrightNotice.style.display = 'none';
    creditsAnimation.style.animationName = 'scroll';
    creditsAnimation.onanimationend = (e) => {
        setTimeout(() => {
            restoreMenuScreen();
            copyrightNotice.style.display = '';
            creditsAnimation.style.animationName = '';
        }, 3000);
    };
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