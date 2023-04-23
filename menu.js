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
        sandboxButton.style.transform = 'translateY(-55vh)';
    }, 2200);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = 'translateY(-55vh)';
    }, 2400);
    setTransitionTimeout(() => {
        multiplayerButton.style.transform = 'translateY(-55vh)';
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
const loadingTips = [
    'The monsters aren\'t what you\'re told...',
    'Using a combination of rotators and sliders you can create a slow-flying flying machine that moves at half the pace of a regular one.',
    'Try <span style="color: #00AAFF;">Blue Pixel Simulator!</span>',
    'This is a loading tip, and it\'s a tip. They can also be used to make loading screens less boring, although Red Pixel Simulator barely has loading screens, so loading tips are unneccesary.',
    'Remember, puzzles are not in difficulty order. If you get stuck, try a different puzzle.',
    'Level design is REALLY hard.',
    'Explore what pixels do in sandbox mode - this makes many puzzles easier.',
    'Don\'t place the corrupted pixels!',
    'Reading the descriptions of pixels in the Pixel Picker can give some helpful information.',
    'You can design and submit a puzzle on the <a href="https://discord.pixelsimulator.repl.co" target="_blank">Pixel Simulator discord</a>!',
    '<span style="font-style: bold italic;">Pixels: Story Mode</span>',
    'All of <span style="color: #FF0000;">Red Pixel Simulator</span> (including music!) is developed by us!',
    'Use the RedPrint Editor to save contraptions you use a lot.',
    '<span style="color: #FFCC00;">Rick Astley!</span>',
    '<span style="color: #00FF00;">Green Pixel Simulator!</span> (not) coming soon!',
    'Some levels are very RNG-based; messing around randomly usually works in those levels',
    '<span style="font-style: bold italic;">Pixels: Legends</span>'

];
const loadingTip = document.getElementById('loadingTip');
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
    loadingTip.innerHTML = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    loadingTip.style.opacity = '1';
    t_top.style.transform = 'translateY(60vh)';
    t_bottom.style.transform = 'translateY(-60vh)';
    setTransitionTimeout(async () => {
        await cb();
        loadingTip.style.opacity = '0';
        t_top.style.transform = '';
        t_bottom.style.transform = '';
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
    loadingTip.innerHTML = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    loadingTip.style.opacity = '1';
    t_top.style.transform = 'translateY(60vh)';
    t_bottom.style.transform = 'translateY(-60vh)';
    setTransitionTimeout(() => {
        menuScreen.style.transitionDuration = '';
        menuScreen.style.backgroundColor = '';
        loadingTip.style.opacity = '0';
        t_top.style.transform = '';
        t_bottom.style.transform = '';
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
        multiplayerButton.style.transform = '';
    }, 200);
    setTransitionTimeout(() => {
        puzzleButton.style.transform = '';
    }, 300);
    setTransitionTimeout(() => {
        sandboxButton.style.transform = '';
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

const levelSelect = document.getElementById('levelSelect');
const levelSelectClose = document.getElementById('levelSelectClose');
const levelSelectBody = document.getElementById('levelSelectBody');
const pixsimMenu = document.getElementById('pixsimMenu');
const pixsimMenuClose = document.getElementById('pixsimMenuClose');
const pixsimMenuConnecting = document.getElementById('pixsimMenuConnecting');
const pixsimMenuConnectingTip = document.getElementById('pixsimMenuConnectingTip');
const pixsimSelectHostButton = document.getElementById('pixsimSelectHost');
const pixsimSelectJoinButton = document.getElementById('pixsimSelectJoin');
const pixsimSelectSpectateButton = document.getElementById('pixsimSelectSpectate');
const pixsimSelectScrimmageButton = document.getElementById('pixsimSelectScrimmage');
const pixsimMenuContents = document.getElementById('pixsimMenuContents');

sandboxButton.onclick = (e) => {
    if (!acceptMenuInputs || levelSelect._open || pixsimMenu._open) return;
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
    pixsimMenuConnectingTip.innerHTML = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    pixsimMenuContents.style.transform = '';
    pixsimMenu.style.transform = 'translateY(100vh)';
    PixSimAPI.connect().then(() => {
        pixsimMenuConnecting.style.opacity = 0;
        pixsimMenuConnecting.style.pointerEvents = 'none';
    }, (err) => {
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
const pixsimHostCancelGame = document.getElementById('hostCancelGame');
const pixsimHostStartGame = document.getElementById('hostStartGame');
const pixsimWaitLeaveGame = document.getElementById('waitLeaveGame');
const pixsimDragCard = document.getElementById('pixsimDragCardWrapper');
const pixsimDragging = {
    dragging: false,
    draggingName: '',
    startX: 0,
    startY: 0,
    hoveringTeam: -1
};
pixsimSelectHostButton.onclick = (e) => {
    pixsimMenuContents.style.transform = 'translateY(100%)';
    const joinCodeDisp = document.getElementById('hostJoinCode');
    const allowSpectatorsToggle = document.getElementById('hostAllowSpectators');
    const publicGameToggle = document.getElementById('hostPublicGame');
    allowSpectatorsToggle.checked = true;
    publicGameToggle.checked = true;
    joinCodeDisp.innerText = '- - -';
    pixsimHostTeamListWrapper.appendChild(pixsimTeamList);
    pixsimHostSpectatorsListWrapper.appendChild(pixsimSpectatorsList);
    PixSimAPI.createGame().then((code) => {
        joinCodeDisp.innerText = code;
        joinCodeDisp.onclick = (e) => {
            window.navigator.clipboard.writeText(code);
        };
        function cancelHostGame() {
            pixsimMenuContents.style.transform = '';
            pixsimHostStartGame.onclick = null;
            PixSimAPI.leaveGame();
            pixsimMenuClose.removeEventListener('click', cancelHostGame);
        };
        pixsimMenuClose.addEventListener('click', cancelHostGame);
        pixsimHostCancelGame.onclick = cancelHostGame;
        allowSpectatorsToggle.onclick = (e) => {
            PixSimAPI.allowSpectators = allowSpectatorsToggle.checked;
        };
        publicGameToggle.onclick = (e) => {
            PixSimAPI.isPublic = publicGameToggle.checked;
        };
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
document.querySelectorAll('.pixsimBackButton').forEach(e => e.onclick = (e) => {
    pixsimMenuContents.style.transform = '';
});
pixsimJoinGameCodeCode.onkeyup = (e) => {
    if (pixsimJoinGameCodeCode.value.length == 8) {
        pixsimJoinGameCodeJoin.style.backgroundColor = '';
        pixsimJoinGameCodeJoin.style.cursor = '';
    } else {
        pixsimJoinGameCodeJoin.style.backgroundColor = 'gray';
        pixsimJoinGameCodeJoin.style.cursor = 'not-allowed';
    }
};
pixsimJoinGameCodeJoin.onclick = (e) => {
    if (pixsimJoinGameCodeCode.value.length == 8) {
        PixSimAPI.joinGame(pixsimJoinGameCodeCode.value).then(handleJoinGame);
    }
};
function refreshGameList(games) {
    let scrollPos = pixsimJoinList.scrollTop;
    pixsimJoinList.innerHTML = '';
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
    for (let game of games) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('joinTile');
        const codeText = document.createElement('div');
        codeText.classList.add('joinTileCode');
        codeText.innerText = game.code;
        wrapper.appendChild(codeText);
        const sub1 = document.createElement('div');
        sub1.classList.add('joinTileSub1');
        sub1.innerText = `${game.open ? 'Running' : 'Open'} ❖ ${type(game.type)} ❖ ${PixSimAPI.getUserData(game.hostName).igname}`;
        wrapper.appendChild(sub1);
        const sub2 = document.createElement('div');
        sub2.classList.add('joinTileSub2');
        sub2.innerText = `${game.teamSize}v${game.teamSize} ❖ ${game.allowsSpectators ? 'Spectators allowed' : 'Spectators not allowed'}`;
        wrapper.appendChild(sub2);
        wrapper.onclick = (e) => {
            PixSimAPI.joinGame(game.code).then(handleJoinGame);
            clickSound();
        };
        pixsimJoinList.appendChild(wrapper);
    }
    if (games.length == 0) {
        pixsimJoinList.innerHTML = '<span style="font-size: 18px; margin-top: 8px;">No open games!</span><span style="margin-bottom: 8px;">Check back later, or host a game yourself.</span>';
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
        };
    } else {
        modal('Could not join game', status == 1 ? 'Game does not exist or already running' : 'Banned by game host');
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
async function generatePlayerCard(username) {
    const userData = await PixSimAPI.getUserData(username);
    const card = document.createElement('div');
    card.classList.add('pxPlayerCard');
    if (PixSimAPI.isHost) {
        card.classList.add('pxHostPlayerCard');
        card.onmousedown = (e) => {
            if (!e.target.matches('.pxPlayerCardKick')) {
                startDragPlayerCard(card, username, e.pageX, e.pageY);
            }
        }
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
        if (pixsimDragging.hoveringTeam != -1) PixSimAPI.movePlayer(pixsimDragging.draggingName, pixsimDragging.hoveringTeam);
        card.style.visibility = '';
        document.removeEventListener('mouseup', release);
        document.removeEventListener('mousemove', move);
        pixsimTeamsTAPlayers.onmouseout();
        pixsimTeamsTBPlayers.onmouseout();
        pixsimSpectatorsList.onmouseout();
        tickSound();
    });
    tickSound();
};
pixsimTeamsTAPlayers.onmouseover = (e) => {
    if (!pixsimDragging.dragging) return;
    pixsimTeamsTAPlayers.style.backgroundColor = '#FFFFFF22';
    pixsimDragging.hoveringTeam = 1;
};
pixsimTeamsTBPlayers.onmouseover = (e) => {
    if (!pixsimDragging.dragging) return;
    pixsimTeamsTBPlayers.style.backgroundColor = '#FFFFFF22';
    pixsimDragging.hoveringTeam = 2;
};
pixsimSpectatorsList.onmouseover = (e) => {
    if (!pixsimDragging.dragging) return;
    pixsimSpectatorsList.style.backgroundColor = '#FFFFFF22';
    pixsimDragging.hoveringTeam = 0;
};
pixsimTeamsTAPlayers.onmouseout = (e) => {
    pixsimTeamsTAPlayers.style.backgroundColor = '';
    pixsimDragging.hoveringTeam = -1;
};
pixsimTeamsTBPlayers.onmouseout = (e) => {
    pixsimTeamsTBPlayers.style.backgroundColor = '';
    pixsimDragging.hoveringTeam = -1;
};
pixsimSpectatorsList.onmouseout = (e) => {
    pixsimSpectatorsList.style.backgroundColor = '';
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
        const card = await generatePlayerCard(username);
        pixsimSpectatorsList.appendChild(card);
        if (pixsimDragging.dragging && username == pixsimDragging.draggingName) {
            startDragPlayerCard(card, username);
            stillDragging = true;
        }
    }
    if (!stillDragging) {
        pixsimDragCard.style.visibility = '';
        pixsimDragging.dragging = false;
    }
    if (teams.teamA.length == PixSimAPI.teamSize && teams.teamB.length == PixSimAPI.teamSize) {
        pixsimHostStartGame.style.filter = '';
        pixsimHostStartGame.style.cursor = '';
    } else {
        pixsimHostStartGame.style.filter = 'saturate(0)';
        pixsimHostStartGame.style.cursor = 'not-allowed';
    }
    shortDingSound();
};
PixSimAPI.onGameKicked = () => {
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    modal('Kicked from game', 'You were removed from the game by the host');
    loadPublicGameList(PixSimAPI.spectating);
};
PixSimAPI.onGameClose = () => {
    pixsimMenuContents.style.transform = 'translateY(-100%)';
    modal('Game closed', 'The game session was closed by the host');
    loadPublicGameList(PixSimAPI.spectating);
};
pixsimJoinGameCodeCode.onkeyup();

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
    // coverCanvas.style.position = 'absolute';
    // coverCanvas.style.top = '0px';
    // coverCanvas.style.left = '0px';
    // coverCanvas.style.zIndex = 10000;
    // document.body.appendChild(coverCanvas);
    document.getElementById('t_redpixel').style.backgroundImage = 'url(' + coverCanvas.toDataURL('image/png') + ')';
    document.getElementById('t_redpixel').style.backgroundSize = 'contain';
}