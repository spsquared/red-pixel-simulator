const menuScreen = document.getElementById('menuScreen');
const titleContainer = document.getElementById('titleContainer');
const t_redpixel = document.getElementById('t_redpixel');
const t_textRed = document.getElementById('t_textRed');
const t_textPixel = document.getElementById('t_textPixel');
const t_textSimulator = document.getElementById('t_textSimulator');
const transitionBarTop = document.getElementById('t_top');
const transitionBarBottom = document.getElementById('t_bottom');
const sandboxButton = document.getElementById('sandboxButton');
const puzzleButton = document.getElementById('puzzleButton');
const multiplayerButton = document.getElementById('multiplayerButton');

window.addEventListener('resize', (e) => {
    menuScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');
});
menuScreen.style.setProperty('--title-left-offset', (window.innerWidth / 2 - (t_textSimulator.getBoundingClientRect().width + window.innerWidth * 0.01 + window.innerHeight * 0.3) / 2) + 'px');

window.addEventListener('DOMContentLoaded', async () => {
    const loadingText = document.getElementById('loadingProgressText');
    loadingText.innerText = 'Loading Pixels...';
    await pixelsLoad;
    loadingText.innerText = 'Loading sounds...';
    await soundsLoad;
    loadingText.innerText = '';
    document.getElementById('pageLoadCover').style.opacity = 0;
    document.getElementById('pageLoadCover').style.pointerEvents = 'none';
    setTimeout(() => {
        document.getElementById('pageLoadCover').remove();
        t_redpixel.style.transition = '200ms ease-in transform';
        t_redpixel.style.transform = 'none';
    }, 500);
    setTimeout(() => {
        t_textRed.style.transition = '200ms ease-in transform';
        t_textRed.style.transform = 'none';
    }, 1100);
    setTimeout(() => {
        t_textPixel.style.transition = '200ms ease-in transform';
        t_textPixel.style.transform = 'none';
    }, 1200);
    setTimeout(() => {
        t_textSimulator.style.transition = '200ms ease-in transform';
        t_textSimulator.style.transform = 'none';
    }, 1300);
    setTransitionTimeout(() => {
        titleContainer.style.transform = 'translateY(-20vh)';
    }, 1800);
    setTransitionTimeout(() => {
        sandboxButton.style.transform = 'translateY(-55vh)';
    }, 2500);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = 'translateY(-55vh)';
    }, 2700);
    setTransitionTimeout(() => {
        multiplayerButton.style.transform = 'translateY(-55vh)';
    }, 2900);
    startTitleBob = setTransitionTimeout(titleBob, 3000);
});

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
const loadingTips = [
    '<span style="color: #FF0000;">Red Pixel Simulator!</span>',
    '<span style="color: #00FF00;">Green Pixel Simulator!</span>',
    '<span style="color: #0099FF;">Blue Pixel Simulator!</span>',
    '<span style="color: #FF00FF;">Pixel Simulator Platformer!</span>',
    '<span style="color: #FFFF00;">Pixels: Story Mode!</span>',
    '<span style="color: #FFFF00;">Pixels: Legends!</span>',
    '<span style="color: #FFFF00;">Pixels: JaveScript Edition!</span>',
    '<span style="color: #FFFF00;">Pixels: Bugrock Edition!</span>',
    '<span style="color: #FFFF00;">Pixels: 3D!</span>',
    '<span style="color: #FFCC00;">Rick Astley!</span>',
    'The monsters aren\'t what you\'re told...',
    'Using a combination of rotators and sliders you can create a slow-flying flying machine that moves at half the pace of a regular one.',
    'This is a loading tip, and it\'s a tip. They can also be used to make loading screens less boring, although <span style="color: #FF0000;">Red Pixel Simulator</span> barely has loading screens, so loading tips are unneccesary.',
    'Remember, puzzles are not in difficulty order. If you get stuck, try a different puzzle.',
    'Level design is REALLY hard.',
    'Explore what pixels do in sandbox mode - this makes many puzzles easier.',
    'Don\'t place the corrupted pixels!',
    'Reading the descriptions of pixels in the Pixel Picker can give some helpful information.',
    'You can design and submit a puzzle on the <a href="https://discord.pixelsimulator.repl.co" target="_blank">Pixel Simulator discord</a>!',
    'All of Pixel Simulator (including music!) is made by SP, SP^2, and Erik!',
    'Use the RedPrint Editor to save contraptions you use a lot.',
    'Some levels are very RNG-based; messing around randomly usually works in those levels.',
    'There exists a few pixels that are not in the Pixel Picker...',
    '"Rafting Revisited" originally started as a play on how <span style="color: #0099FF;">Blue Pixel Simulator!</span> got multiple rafting puzzles as a "lazy workaround".',
    '"War is only a cowardly escape from the problems of peace" - Thomas Mann',
    '.-. . -.. / .--. .. -..- . .-.. / ... .. -- ..- .-.. .- - --- .-. -.-.--'
];
const loadingTip = document.getElementById('loadingTip');
function setLoadingTipInterval(tipDiv) {
    tipDiv.innerHTML = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    return setInterval(() => {
        glitchTextTransition(tipDiv.innerHTML, loadingTips[Math.floor(Math.random() * loadingTips.length)], (text) => {
            tipDiv.innerHTML = text;
        }, 50, 2, 5, 1);
    }, 8000);
};
function setTransitionTimeout(cb, ms) {
    let t = setTimeout(() => {
        cb();
        transitionTimeouts.splice(transitionTimeouts.indexOf(t), 1);
    }, ms);
    transitionTimeouts.push(t);
};
function fadeToGame() {
    acceptMenuInputs = false;
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    clearInterval(titleBobController);
    document.getElementById('sidebar').scrollTo(0, 0);
    clearMenuScreen();
    setTransitionTimeout(() => {
        menuScreen.style.opacity = '0';
    }, 600);
    setTransitionTimeout(() => {
        menuScreen.style.pointerEvents = 'none';
    }, 1100);
    setTransitionTimeout(() => {
        menuScreen.style.visibility = 'hidden';
    }, 1600);
};
function transitionToGame(cb) {
    acceptMenuInputs = false;
    for (let t of transitionTimeouts) {
        clearInterval(t);
    }
    transitionTimeouts.length = 0;
    clearInterval(titleBobController);
    document.getElementById('sidebar').scrollTo(0, 0);
    clearMenuScreen();
    let loadingTipInterval = setLoadingTipInterval(loadingTip);
    loadingTip.style.opacity = '1';
    transitionBarTop.style.transform = 'translateY(60vh)';
    transitionBarBottom.style.transform = 'translateY(-60vh)';
    setTransitionTimeout(async () => {
        if (cb) await cb();
        menuScreen.style.backgroundColor = 'transparent';
        clearInterval(loadingTipInterval);
        loadingTip.style.opacity = '0';
        transitionBarTop.style.transform = '';
        transitionBarBottom.style.transform = '';
        document.getElementById('sidebar').scrollTo(0, 0);
        inMenuScreen = false;
        setTransitionTimeout(() => {
            menuScreen.style.visibility = 'hidden';
            menuScreen.style.transitionDuration = '';
            menuScreen.style.backgroundColor = '';
            menuScreen.style.opacity = '0';
            menuScreen.style.pointerEvents = 'none';
        }, 300);
    }, 800);
};
function transitionToMenu(cb) {
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
    let loadingTipInterval = setLoadingTipInterval(loadingTip);
    loadingTip.style.opacity = '1';
    transitionBarTop.style.transform = 'translateY(60vh)';
    transitionBarBottom.style.transform = 'translateY(-60vh)';
    restoreMenuScreen();
    setTransitionTimeout(async () => {
        if (cb) await cb();
        menuScreen.style.transitionDuration = '';
        menuScreen.style.backgroundColor = '';
        clearInterval(loadingTipInterval);
        loadingTip.style.opacity = '0';
        transitionBarTop.style.transform = '';
        transitionBarBottom.style.transform = '';
    }, 800);
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
    let loadingTipInterval = setLoadingTipInterval(loadingTip);
    loadingTip.style.opacity = '1';
    transitionBarTop.style.transform = 'translateY(60vh)';
    transitionBarBottom.style.transform = 'translateY(-60vh)';
    setTransitionTimeout(async () => {
        if (cb) await cb();
        clearInterval(loadingTipInterval);
        loadingTip.style.opacity = '0';
        transitionBarTop.style.transform = '';
        transitionBarBottom.style.transform = '';
        document.getElementById('sidebar').scrollTo(0, 0);
        inMenuScreen = false;
        setTransitionTimeout(() => {
            menuScreen.style.visibility = 'hidden';
            menuScreen.style.transitionDuration = '';
            menuScreen.style.backgroundColor = '';
            menuScreen.style.opacity = '0';
            menuScreen.style.pointerEvents = 'none';
        }, 300);
    }, 800);
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
        multiplayerButton.style.transform = '';
    }, 200);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = '';
    }, 300);
    setTransitionTimeout(() => {
        sandboxButton.style.transform = '';
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
        sandboxButton.style.transform = 'translateY(-55vh)';
    }, 600);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = 'translateY(-55vh)';
    }, 700);
    setTransitionTimeout(() => {
        multiplayerButton.style.transform = 'translateY(-55vh)';
    }, 800);
    setTransitionTimeout(() => {
        titleBob();
    }, 1500);
};

// menu submenus
const levelSelect = document.getElementById('levelSelect');
const levelSelectClose = document.getElementById('levelSelectClose');
const levelSelectBody = document.getElementById('levelSelectBody');
const pixsimMenu = document.getElementById('pixsimMenu');
const pixsimMenuClose = document.getElementById('pixsimMenuClose');
const pixsimMenuConnecting = document.getElementById('pixsimMenuConnecting');
const pixsimMenuConnectingText = document.getElementById('pixsimMenuConnectingText');
const pixsimMenuConnectingTip = document.getElementById('pixsimMenuConnectingTip');
const pixsimMenuContents = document.getElementById('pixsimMenuContents');
sandboxButton.onclick = (e) => {
    if (!acceptMenuInputs || levelSelect._open || pixsimMenu._open) return;
    levelSelect.style.transform = '';
    clearTimeout(startTitleBob);
    levelDetails.style.display = 'none';
    pixelPickerCrafting.style.display = '';
    restartButton.style.display = 'none';
    pauseButton.disabled = false;
    fastSimulationButton.disabled = false;
    simulateSlowButton.disabled = false;
    advanceTickButton.disabled = false;
    resetButton.disabled = false;
    restartButton.disabled = false;
    saveCodeText.disabled = false;
    generateSaveButton.disabled = false;
    uploadSaveButton.disabled = false;
    downloadSaveButton.disabled = false;
    gridWidthText.disabled = false;
    gridHeightText.disabled = false;
    document.getElementById('premadeSaves').style.display = '';
    sandboxMode = true;
    backgroundColor = '#ffffff';
    camera.shakeIntensity = 0;
    camera.scale = 1;
    camera.x = 0;
    camera.y = 0;
    resetPixelAmounts();
    loadStoredSave();
    fadeToGame();
};
puzzleButton.onclick = (e) => {
    if (!acceptMenuInputs || levelSelect._open || pixsimMenu._open) return;
    levelSelect._open = true;
    levelSelect.style.transform = 'translateY(100vh)';
    saveCodeText.blur();
};
multiplayerButton.onclick = (e) => {
    if (!acceptMenuInputs || levelSelect._open || pixsimMenu._open) return;
    pixsimMenu._open = true;
    pixsimMenuConnecting.style.opacity = 1;
    pixsimMenuConnecting.style.pointerEvents = '';
    let loadingTip = setLoadingTipInterval(pixsimMenuConnectingTip);
    pixsimMenuContents.style.transform = '';
    pixsimMenu.style.transform = 'translateY(100vh)';
    glitchTextTransition(pixsimMenuConnectingText.innerText, 'Connecting to PixSim API...', (text) => {
        pixsimMenuConnectingText.innerText = text;
    }, 50, 1, 40, 2);
    let glitch = setInterval(() => {
        glitchTextTransition(pixsimMenuConnectingText.innerText, 'Connecting to PixSim API...', (text) => {
            pixsimMenuConnectingText.innerText = text;
        }, 50, 1, 40, 2);
    }, 5000);
    PixSimAPI.connect().then(() => {
        clearInterval(glitch);
        clearInterval(loadingTip);
        pixsimMenuConnecting.style.opacity = 0;
        pixsimMenuConnecting.style.pointerEvents = 'none';
    }, (err) => {
        clearInterval(glitch);
        modal('Could not connect to PixSim API:', `<span style="color: red;">${err.message}</span>`).then(() => pixsimMenuClose.click());
    });
};
levelSelectClose.onclick = (e) => {
    levelSelect._open = false;
    levelSelect.style.transform = '';
};
pixsimMenuClose.onclick = (e) => {
    pixsimMenu._open = false;
    PixSimAPI.disconnect();
    pixsimMenu.style.transform = '';
};
function selectPuzzle() {
    if (!acceptMenuInputs) return;
    clearTimeout(startTitleBob);
    levelDetails.style.display = '';
    pixelPickerCrafting.style.display = 'none';
    restartButton.style.display = '';
    pauseButton.disabled = false;
    fastSimulationButton.disabled = false;
    simulateSlowButton.disabled = false;
    advanceTickButton.disabled = false;
    resetButton.disabled = false;
    restartButton.disabled = false;
    saveCodeText.disabled = true;
    generateSaveButton.disabled = true;
    uploadSaveButton.disabled = true;
    downloadSaveButton.disabled = true;
    gridWidthText.disabled = true;
    gridHeightText.disabled = true;
    document.getElementById('premadeSaves').style.display = 'none';
    sandboxMode = false;
    levelSelect.style.transform = '';
    levelSelect._open = false;
    fadeToGame();
};

// pixsim submenu submenus
const pixsimSelectHostButton = document.getElementById('pixsimSelectHost');
const pixsimSelectJoinButton = document.getElementById('pixsimSelectJoin');
const pixsimSelectSpectateButton = document.getElementById('pixsimSelectSpectate');
const pixsimSelectScrimmageButton = document.getElementById('pixsimSelectScrimmage');
const pixsimSelectLeaderboardsButton = document.getElementById('pixsimSelectLeaderboards');
const pixsimjoinTitle = document.getElementById('pixsimJoinTitle');
const pixsimJoinGameCodeCode = document.getElementById('joinGameCodeCode');
const pixsimJoinGameCodeJoin = document.getElementById('joinGameCodeJoin');
const pixsimJoinList = document.getElementById('joinListContent');
const pixsimTeamList = document.getElementById('pxTeamsContent');
const pixsimHostTeamListWrapper = document.getElementById('hostTeamsWrapper');
const pixsimGameWaitTeamListWrapper = document.getElementById('waitTeamsWrapper');
const pixsimSpectatorsList = document.getElementById('pxSpectatorsContent');
const pixsimHostSpectatorsListWrapper = document.getElementById('hostSpectatorsWrapper');
const pixsimGameWaitSpectatorListWrapper = document.getElementById('waitSpectatorsWrapper');
const pixsimTeamsTAPlayers = document.getElementById('pxTeamsTAPlayers');
const pixsimTeamsTBPlayers = document.getElementById('pxTeamsTBPlayers');
const pixsimHostGTPrevious = document.getElementById('hostGameTypePrevious');
const pixsimHostGTNext = document.getElementById('hostGameTypeNext');
const pixsimHostGTName = document.getElementById('hostGameTypeName');
const pixsimHostGTDescription = document.getElementById('hostGameTypeDescription');
const pixsimJoinCodeDisp = document.getElementById('hostJoinCode');
const pixsimSpectatorsToggle = document.getElementById('hostAllowSpectators');
const pixsimPublicGameToggle = document.getElementById('hostPublicGame');
const pixsimHostCancelGame = document.getElementById('hostCancelGame');
const pixsimHostStartGame = document.getElementById('hostStartGame');
const pixsimWaitGTName = document.getElementById('waitGameTypeName');
const pixsimWaitGTDescription = document.getElementById('waitGameTypeDescription');
const pixsimWaitLeaveGame = document.getElementById('waitLeaveGame');
const pixsimDragCard = document.getElementById('pixsimDragCardWrapper');
const pixsimDragging = {
    dragging: false,
    draggingName: '',
    startX: 0,
    startY: 0,
    hoveringTeam: -1,
    hoveringName: null
};
pixsimSelectHostButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateY(100%)';
    pixsimSpectatorsToggle.checked = true;
    pixsimPublicGameToggle.checked = true;
    pixsimJoinCodeDisp.innerText = '- - -';
    pixsimHostTeamListWrapper.appendChild(pixsimTeamList);
    pixsimHostSpectatorsListWrapper.appendChild(pixsimSpectatorsList);
    PixSimAPI.createGame().then((code) => {
        pixsimJoinCodeDisp.innerText = code;
        function cancelHostGame() {
            pixsimMenuContents.style.transform = '';
            PixSimAPI.leaveGame();
            pixsimHostCancelGame.onclick = null;
            pixsimHostStartGame.onclick = null;
            pixsimMenuClose.removeEventListener('click', cancelHostGame);
        };
        pixsimMenuClose.addEventListener('click', cancelHostGame);
        pixsimHostCancelGame.onclick = cancelHostGame;
        pixsimHostStartGame.onclick = (e) => {
            PixSimAPI.startGame();
        };
    });
};
pixsimSelectJoinButton.onclick = (e) => {
    pixsimJoinTitle.innerText = 'Join Game';
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    loadPublicGameList(false);
};
pixsimSelectSpectateButton.onclick = (e) => {
    pixsimJoinTitle.innerText = 'Spectate Game';
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    loadPublicGameList(true);
};
pixsimSelectScrimmageButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateX(-100%)';
};
pixsimSelectLeaderboardsButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateX(100%)';
};
document.querySelectorAll('.pixsimBackButton').forEach(e => e.onclick = (e) => {
    pixsimMenuContents.style.transform = '';
});
pixsimHostGTPrevious.onclick = (e) => {
    PixSimAPI.gameMode = (PixSimAPI.gameMode + PixSimAPI.gameModeCount - 1) % PixSimAPI.gameModeCount;
    let gameMode = PixSimAPI.gameModeData;
    pixsimHostGTName.innerHTML = gameMode.name;
    pixsimWaitGTName.innerHTML = gameMode.name;
    pixsimHostGTDescription.innerHTML = gameMode.description;
    pixsimWaitGTDescription.innerHTML = gameMode.description;
};
pixsimHostGTNext.onclick = (e) => {
    PixSimAPI.gameMode = (PixSimAPI.gameMode + 1) % PixSimAPI.gameModeCount;
    let gameMode = PixSimAPI.gameModeData;
    pixsimHostGTName.innerHTML = gameMode.name;
    pixsimWaitGTName.innerHTML = gameMode.name;
    pixsimHostGTDescription.innerHTML = gameMode.description;
    pixsimWaitGTDescription.innerHTML = gameMode.description;
};
PixSimAPI.onGameModeChange = (mode) => {
    let gameMode = PixSimAPI.gameModeData;
    pixsimHostGTName.innerHTML = gameMode.name;
    pixsimWaitGTName.innerHTML = gameMode.name;
    pixsimHostGTDescription.innerHTML = gameMode.description;
    pixsimWaitGTDescription.innerHTML = gameMode.description;
};
pixsimJoinCodeDisp.onclick = (e) => {
    window.navigator.clipboard.writeText(code);
};
pixsimSpectatorsToggle.onclick = (e) => {
    PixSimAPI.allowSpectators = pixsimSpectatorsToggle.checked;
};
pixsimPublicGameToggle.onclick = (e) => {
    PixSimAPI.isPublic = pixsimPublicGameToggle.checked;
};
pixsimJoinGameCodeCode.onkeyup = (e) => {
    if (pixsimJoinGameCodeCode.value.length == 8) {
        pixsimJoinGameCodeJoin.style.backgroundColor = '';
        pixsimJoinGameCodeJoin.style.cursor = '';
    } else {
        pixsimJoinGameCodeJoin.style.backgroundColor = 'gray';
        pixsimJoinGameCodeJoin.style.cursor = 'not-allowed';
    }
};
pixsimJoinGameCodeCode.onkeydown = (e) => {
    if (e.key == 'Enter') pixsimJoinGameCodeJoin.click();
};
pixsimJoinGameCodeJoin.onclick = (e) => {
    if (pixsimJoinGameCodeCode.value.length == 8) {
        PixSimAPI.joinGame(pixsimJoinGameCodeCode.value.toUpperCase()).then(handleJoinGame);
    }
};
function refreshGameList(games) {
    let scrollPos = pixsimJoinList.scrollTop;
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
    if (pixsimJoinList.children[0].tagName == 'SPAN') pixsimJoinList.children[0].remove();
    let existingIndex = 0;
    for (let game of games) {
        if (existingIndex < pixsimJoinList.children.length) {
            const wrapper = pixsimJoinList.children[existingIndex];
            const codeText = wrapper.children[0];
            if (codeText.innerText != game.code) {
                glitchTextTransition(codeText.innerText, game.code, (text) => {
                    codeText.innerText = text;
                }, 100);
                const sub1 = wrapper.children[1];
                glitchTextTransition(sub1.innerText, `${game.open ? 'Running' : 'Open'} ❖ ${type(game.type)} ❖ ${PixSimAPI.getUserData(game.hostName).igname}`, (text) => {
                    sub1.innerText = text;
                }, 100);
                const sub2 = wrapper.children[2];
                glitchTextTransition(sub2.innerText, `${game.teamSize}v${game.teamSize} ❖ ${game.allowsSpectators ? 'Spectators allowed' : 'Spectators not allowed'}`, (text) => {
                    sub2.innerText = text;
                }, 100);
                wrapper.onclick = (e) => {
                    PixSimAPI.joinGame(game.code).then(handleJoinGame);
                    sounds.click();
                };
            }
            existingIndex++;
        } else {
            const wrapper = document.createElement('div');
            wrapper.classList.add('joinTile');
            const codeText = document.createElement('div');
            codeText.classList.add('joinTileCode');
            flipTextTransition('', game.code, (text) => {
                codeText.innerText = text;
            }, 100);
            wrapper.appendChild(codeText);
            const sub1 = document.createElement('div');
            sub1.classList.add('joinTileSub1');
            flipTextTransition('', `${game.open ? 'Running' : 'Open'} ❖ ${type(game.type)} ❖ ${PixSimAPI.getUserData(game.hostName).igname}`, (text) => {
                sub1.innerText = text;
            }, 100);
            wrapper.appendChild(sub1);
            const sub2 = document.createElement('div');
            sub2.classList.add('joinTileSub2');
            flipTextTransition('', `${game.teamSize}v${game.teamSize} ❖ ${game.allowsSpectators ? 'Spectators allowed' : 'Spectators not allowed'}`, (text) => {
                sub2.innerText = text;
            }, 100);
            wrapper.appendChild(sub2);
            wrapper.onclick = (e) => {
                PixSimAPI.joinGame(game.code).then(handleJoinGame);
                sounds.click();
            };
            pixsimJoinList.appendChild(wrapper);
        }
    }
    if (games.length < pixsimJoinList.children.length) {
        for (let i = pixsimJoinList.children.length - 1; i >= games.length; i--) {
            pixsimJoinList.children[i].remove();
        }
    }
    if (games.length == 0) {
        pixsimJoinList.innerHTML = '<span><span style="font-size: 18px; margin-top: 8px;">No open games!</span><br><span style="margin-bottom: 8px;">Check back later, or host a game yourself.</span></span>';
    }
    pixsimJoinList.scrollTop = scrollPos;
};
function handleJoinGame(status) {
    if (status == 0) {
        stopRefreshLoop();
        pixsimMenuContents.style.transform = 'translate(100%, -100%)';
        pixsimGameWaitTeamListWrapper.appendChild(pixsimTeamList);
        pixsimGameWaitSpectatorListWrapper.appendChild(pixsimSpectatorsList);
        pixsimWaitLeaveGame.onclick = (e) => {
            pixsimMenuContents.style.transform = 'translateY(-100%)';
            PixSimAPI.leaveGame();
            loadPublicGameList(PixSimAPI.spectating);
            pixsimWaitLeaveGame.onclick = null;
        };
    } else {
        modal('Could not join game', status == 1 ? 'Game does not exist or already started!' : 'Banned by game host!');
    }
};
function loadPublicGameList(spectating) {
    PixSimAPI.spectating = spectating;
    pixsimJoinGameCodeCode.value = '';
    pixsimJoinGameCodeJoin.style.backgroundColor = 'gray';
    pixsimJoinGameCodeJoin.style.cursor = 'not-allowed';
    let refreshLoop = setInterval(() => {
        window.requestIdleCallback(() => {
            PixSimAPI.getPublicGames('all').then(refreshGameList, stopRefreshLoop);
        }, { timeout: 100 });
    }, 3000);
    stopRefreshLoop = () => {
        clearInterval(refreshLoop);
        pixsimMenuClose.removeEventListener('click', stopRefreshLoop);
    };
    pixsimMenuClose.addEventListener('click', stopRefreshLoop);
    PixSimAPI.getPublicGames('all').then(refreshGameList, stopRefreshLoop);
};
function stopRefreshLoop() { };
async function generatePlayerCard(username, allowDrag = true) {
    const userData = await PixSimAPI.getUserData(username);
    const card = document.createElement('div');
    card.classList.add('pxPlayerCard');
    if (PixSimAPI.isHost && allowDrag) {
        card.classList.add('pxHostPlayerCard');
        card.onmousedown = (e) => {
            if (!e.target.matches('.pxPlayerCardKick')) {
                startDragPlayerCard(card, username, e.pageX, e.pageY);
            }
        };
        card.onmouseover = (e) => {
            pixsimDragging.hoveringName = username;
        };
        card.onmouseout = (e) => {
            pixsimDragging.hoveringName = null;
        };
    }
    const img = new Image();
    img.classList.add('pxPlayerCardProfileImg');
    img.src = userData.img;
    card.appendChild(img);
    const name = document.createElement('div');
    name.classList.add('pxPlayerCardName');
    name.innerText = userData.igname;
    card.appendChild(name);
    const ranking = document.createElement('div');
    ranking.classList.add('pxPlayerCardRanking');
    ranking.innerText = `Rank ${userData.rank} ❖ ${userData.elo} ELO`;
    card.appendChild(ranking);
    if (PixSimAPI.isHost && PixSimAPI.username != username) {
        const kickButton = document.createElement('div');
        kickButton.classList.add('pxPlayerCardKick');
        kickButton.onclick = (e) => {
            PixSimAPI.kickPlayer(username);
        };
        card.appendChild(kickButton);
    }
    return card;
};
async function startDragPlayerCard(card, username, pageX, pageY) {
    pixsimDragging.dragging = true;
    pixsimDragging.draggingName = username;
    const cardRect = card.getBoundingClientRect();
    pixsimDragging.startX = (pageX ?? pixsimDragging.startX) - cardRect.left;
    pixsimDragging.startY = (pageY ?? pixsimDragging.startY) - cardRect.top;
    card.style.visibility = 'hidden';
    pixsimDragCard.innerHTML = '';
    const dragCard = await generatePlayerCard(username);
    dragCard.style.cursor = 'grabbing';
    pixsimDragCard.appendChild(dragCard);
    pixsimDragCard.style.visibility = 'visible';
    pixsimDragCard.style.top = pageY - pixsimDragging.startY + 'px';
    pixsimDragCard.style.left = pageX - pixsimDragging.startX + 'px';
    pixsimDragCard.style.width = cardRect.width + 'px';
    document.addEventListener('mousemove', function move(e) {
        pixsimDragCard.style.top = e.pageY - pixsimDragging.startY + 'px';
        pixsimDragCard.style.left = e.pageX - pixsimDragging.startX + 'px';
    });
    document.addEventListener('mouseup', function release(e) {
        pixsimDragCard.style.visibility = '';
        pixsimDragging.dragging = false;
        if (pixsimDragging.hoveringTeam != -1) PixSimAPI.movePlayer(pixsimDragging.draggingName, pixsimDragging.hoveringTeam, pixsimDragging.hoveringName);
        card.style.visibility = '';
        document.removeEventListener('mouseup', release);
        document.removeEventListener('mousemove', move);
        pixsimTeamsTAPlayers.onmouseout();
        pixsimTeamsTBPlayers.onmouseout();
        sounds.tick();
    });
    sounds.tick();
};
pixsimTeamsTAPlayers.onmouseover = (e) => {
    if (!pixsimDragging.dragging) return;
    pixsimTeamsTAPlayers.style.backgroundColor = '#FFFFFF22';
    pixsimDragging.hoveringTeam = 0;
};
pixsimTeamsTBPlayers.onmouseover = (e) => {
    if (!pixsimDragging.dragging) return;
    pixsimTeamsTBPlayers.style.backgroundColor = '#FFFFFF22';
    pixsimDragging.hoveringTeam = 1;
};
pixsimTeamsTAPlayers.onmouseout = (e) => {
    pixsimTeamsTAPlayers.style.backgroundColor = '';
    pixsimDragging.hoveringTeam = -1;
};
pixsimTeamsTBPlayers.onmouseout = (e) => {
    pixsimTeamsTBPlayers.style.backgroundColor = '';
    pixsimDragging.hoveringTeam = -1;
};
PixSimAPI.onUpdateTeamList = async (teams) => {
    pixsimTeamList.style.setProperty('--pixsim-team-size', PixSimAPI.teamSize);
    pixsimTeamsTAPlayers.innerHTML = '';
    pixsimTeamsTBPlayers.innerHTML = '';
    pixsimSpectatorsList.innerHTML = '';
    let stillDragging = false;
    for (let username of teams.teamA) {
        const card = await generatePlayerCard(username);
        pixsimTeamsTAPlayers.appendChild(card);
        if (pixsimDragging.dragging && username == pixsimDragging.draggingName) {
            startDragPlayerCard(card, username);
            stillDragging = true;
        }
    }
    for (let i = 0; i < PixSimAPI.teamSize - teams.teamA.length; i++) {
        pixsimTeamsTAPlayers.appendChild(document.createElement('div'));
    }
    for (let username of teams.teamB) {
        const card = await generatePlayerCard(username);
        pixsimTeamsTBPlayers.appendChild(card);
        if (pixsimDragging.dragging && username == pixsimDragging.draggingName) {
            startDragPlayerCard(card, username);
            stillDragging = true;
        }
    }
    for (let i = 0; i < PixSimAPI.teamSize - teams.teamB.length; i++) {
        pixsimTeamsTBPlayers.appendChild(document.createElement('div'));
    }
    for (let username of teams.spectators) {
        const card = await generatePlayerCard(username, false);
        pixsimSpectatorsList.appendChild(card);
    }
    if (!stillDragging) {
        pixsimDragCard.style.visibility = '';
        pixsimDragging.dragging = false;
    }
    if (teams.teamA.length == PixSimAPI.teamSize && teams.teamB.length == PixSimAPI.teamSize) {
        pixsimHostStartGame.disabled = false;
        pixsimHostStartGame.style.backgroundColor = '';
        pixsimHostStartGame.style.borderColor = '';
    } else {
        pixsimHostStartGame.disabled = true;
        pixsimHostStartGame.style.backgroundColor = 'grey';
        pixsimHostStartGame.style.borderColor = 'grey';
    }
    sounds.shortDing();
};
PixSimAPI.onGameKicked = () => {
    if (PixSimAPI.gameRunning) {
        simulationPaused = true;
        fastSimulation = false;
        updateTimeControlButtons();
        stopAllMusicPixels();
        pixsimHostCancelGame.onclick = null;
        pixsimHostStartGame.onclick = null;
        pixsimWaitLeaveGame.onclick = null;
        PixSimAPI.disconnect();
        transitionToMenu(async() => {
            await modal('Kicked from game', 'You were removed from the game by the host');
        });
    } else {
        modal('Kicked from game', 'You were removed from the game by the host');
    }
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    loadPublicGameList(PixSimAPI.spectating);
};
PixSimAPI.onGameClosed = () => {
    if (PixSimAPI.gameRunning) {
        simulationPaused = true;
        fastSimulation = false;
        updateTimeControlButtons();
        stopAllMusicPixels();
        pixsimHostCancelGame.onclick = null;
        pixsimHostStartGame.onclick = null;
        pixsimWaitLeaveGame.onclick = null;
        PixSimAPI.disconnect();
        transitionToMenu(async() => {
            await modal('Game closed', 'The game session was closed by the host');
        });
    } else {
        modal('Game closed', 'The game session was closed by the host');
    }
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    loadPublicGameList(PixSimAPI.spectating);
};
pixsimJoinGameCodeCode.onkeyup();

PixSimAPI.onDisconnect = async () => {
    if (PixSimAPI.gameRunning) {
        simulationPaused = true;
        fastSimulation = false;
        updateTimeControlButtons();
        stopAllMusicPixels();
        transitionToMenu();
    }
    await modal('PixSim API Disconnected', '<span style="color: red;">PixSim API was disconnected.</span>', false);
    pixsimMenuClose.onclick();
};

const copyrightNotice = document.getElementById('copyrightNotice');
const creditsAnimation = document.getElementById('creditsAnimation');
copyrightNotice.onclick = (e) => {
    if (!acceptMenuInputs) return;
    e.preventDefault();
    clearMenuScreen();
    levelSelect._open = false;
    levelSelect.style.transform = '';
    pixsimMenu._open = false;
    pixsimMenu.style.transform = '';
    PixSimAPI.disconnect();
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