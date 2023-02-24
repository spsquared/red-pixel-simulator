const puzzles = [
    // haha i can put comments take that json
    // oh right i barely ever use comments anyways
    {
        name: 'World of Squares',
        levels: [
            {
                name: 'A Grid of Numbers',
                description: `Welcome to <h style="color: red;">Red Pixel Simulator</h>!<br>&emsp;<h style="color: red;">Red Pixel Simulator</h> is a sandbox-puzzle game based solely on interactions between some numbers in a grid. (Almost) everything is completely deterministic based on simple interactions between pixels. For the purposes of the puzzles, your goal is to <h>defeat all the monsters</h> (the green things with faces) by destroying them using other pixels and to <h>move the goal pixel</h> (gold) <h>to the target</h> (red).<br>&emsp;On the left of your screen is the <h>grid</h>. On the right is the <h>sidebar</h>, which contains all of the game controls. At the top, there is the <h>Pixel Picker</h>. Here you can see what and how many pixels you can place and select them by clicking on them. Below that, there are controls for your brush size (up and down) and simulation control; you can <h>pause</h>, <h>warp</h>, and <h>step</h> the simulation. In sandbox mode, the text box allows you to transfer and edit save codes. Below that the small buttons are a few settings, they're pretty self-explainatory.<br><h>At the bottom you can find all the controls available.</h><br><h>Let's get started! Go down and press the <b>run</b> button (it looks like a play button) to begin.</h>`,
                saveCode: '20;0000;air-259:sand:air-19:grass:air-19:grass:water-12:mud:grass-6:dirt:water-8:mud-4:dirt-8:mud-2:water-3:mud-3:dirt-14:mud-3:dirt-35:;190:;190:;12a:1:65:',
                inventory: {
                    air: 0
                },
                id: '212c7cd9-1ea3-4d1e-a2a8-6a287b06b1a5'
            },
            {
                name: 'Gravity',
                description: `Although everything is, at its core, a grid of numbers, gravity still applies. Pixels like <h>dirt</h>, <h>sand</h>, <h>water</h>, and many more will fall downwards when given the chance to. Some are more flowy than others. <h>Water</h> is... watery, and flows until it can't find a lower spot. Pixels like <h>dirt</h> and <h>sand</h> will form hills of different slopes, depending on the pixel.<br><h>Place sand, dirt, and water in the highlighted (lighter) area to destroy the monsters!</h><br>You have <h>one</h> of <h>each</h> pixel, and you cannot edit after starting the simulation. Use the <b>reset</b> button to revert to before the simulation began.`,
                saveCode: '20;0000;air-160:leaves-3:air-17:leaves-4:air-16:leaves:wood:leaves-2:air-8:leaves-3:air-5:wood:leaves-3:air-7:leaves-5:air-4:wood:air-10:leaves-2:wood:leaves-2:air-4:wood:air-12:wood:air-6:wood:air-12:wood:air-6:wood:air-2:grass-5:air-5:wood:air-2:grass-4:dirt:grass-2:dirt-5:grass-3:air-2:wood:air:grass:dirt-15:grass-2:dirt:grass:dirt-45:;190:;0:78:118:;11f:1:e:1:1f:1:41:',
                inventory: {
                    dirt: 1,
                    sand: 1,
                    water: 1
                },
                id: 'aa79ddcd-da13-4459-8a23-02050d22e2cf'
            },
            {
                name: 'Mudslide',
                description: `Oh no! Your only pixels are <h>wood</h>, which doesn't fall. Don't worry, though, because you can use that wood to <h>redirect the water</h>. It may seem like this challenge is impossible, but there is another way. <h>Water</h> turns <h>dirt</h> into <h>mud</h> when it touches it - <h>you can use this to your advantage by creating a mudslide.</h>`,
                saveCode: '25;000d;air-128:water:air-154:dirt:air-23:dirt-3:air-21:dirt-4:air-21:dirt-5:air-10:leaves-3:air-6:dirt-7:air-8:leaves-5:air-5:dirt-7:concrete:air-7:leaves-2:wood:leaves-2:air-4:dirt-8:concrete:air-9:wood:air-2:water-4:dirt-8:concrete:air-9:wood:air-2:mud-4:dirt-8:concrete:air-2:grass-2:air-3:grass-2:dirt:grass-2:dirt-12:concrete-5:grass:air:grass:dirt-22:grass:air:grass:dirt-23:grass:dirt-56:;271:;7:8:11:8:11:8:11:8:11:8:11:8:a:f:a:f:a:f:a:f:a:f:168:;21f:1:51:',
                inventory: {
                    wood: 8
                },
                id: '90bbdef9-1f44-4d9b-a085-082189b71dfe'
            },
            {
                name: 'Lava',
                description: `It appears that the monsters are learning. They've built a barrier of wood to protect themselves from falling pixels. However, they failed to neglect the fact that you have been given lava for the purposes of these levels.<br><h>Lava can set stuff on fire, use it to burn through their barriers.</h>`,
                saveCode: '25;0000;air-367:wood-8:air-17:wood:air-6:wood:air-17:wood:air-6:wood:air-17:wood:air-6:wood:grass-15:air-2:wood:air-6:wood:dirt-15:grass-2:dirt:grass-6:dirt-126:;271:;0:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:9:10:18:1:9f:;1d5:1:2:2:97:',
                inventory: {
                    lava: 1
                },
                id: '3bf72052-af2f-4e43-ab64-bff7008be1bc'
            },
            {
                name: 'Breaking Game',
                description: `There's plenty of lava to destroy the monsters, but they've built a water trough to stop the lava and you only have some kitchen sponges and that weird plant you found growing on your basement floor. Wait, is that a <i>vault</i> that that monster's sealed itself in? You should be able to do this, though, you'll find a way.`,
                saveCode: '25;0000;air-310:water-4:concrete:air-17:concrete-8:air-21:concrete:air-24:concrete:air-24:concrete:air-24:concrete:air-13:lava-6:air-5:concrete:air-6:wall-3:concrete:wall-9:air:wall:air-3:concrete:grass-6:wall-3:concrete:wall-3:dirt-5:wall:air:wall:grass-3:concrete:dirt-6:wall-3:concrete:wall-3:dirt-5:wall:air:wall:dirt-10:wall-3:air:wall-3:dirt-5:wall:air:wall:dirt-10:wall-7:dirt-5:wall:air:wall:dirt-10:wall-7:dirt-5:wall-3:dirt-10:wall-7:;271:;32:f:a:f:a:f:a:f:a:f:a:f:a:f:a:f:35:7:12:7:12:7:12:7:12:7:12:7:12:7:af:;1ce:1:15:2:3c:1:4e:',
                inventory: {
                    plant: 1,
                    sponge: 3
                },
                id: 'fd389469-07ad-4d5d-b73e-9a5165d2037e'
            },
            {
                name: 'Floating Islands',
                description: `How strange, the Aether is real! Anyways, you only have a few pixels to use. <h>Choose wisely!</h>`,
                saveCode: '40;0000;air-61:leaves:air-38:leaves:wood:leaves:air-38:wood:air-35:grass-4:dirt:grass-2:air-33:concrete-7:air-33:concrete-6:air-35:concrete-4:air-37:concrete-3:air-19:grass-6:air-12:concrete-2:air-20:concrete-6:air-13:concrete:air-21:concrete-5:air-30:leaves-3:air-3:concrete-3:air-31:leaves-3:air-4:concrete-2:air-30:leaves-4:air-4:concrete:air-31:leaves:wood:leaves:wood:air-37:leaves:wood-2:air-32:leaves-3:air-4:wood:air-3:leaves-3:air-26:leaves-3:air-4:wood:air-2:leaves-5:air-17:leaves-3:air-4:leaves-5:air-3:wood:air-2:leaves-2:wood:leaves-2:air-16:leaves-5:air-3:leaves-2:wood:leaves-2:air-3:wood:air-2:leaves-2:wood:leaves-2:air-16:leaves-2:wood:leaves-2:air-3:leaves-2:wood:leaves-2:air-3:wood:air-4:wood:air-20:wood:air-7:wood:air-5:wood:air-4:wood:air-20:wood:air-7:wood:air-5:wood:grass:air-2:grass:dirt:grass-5:water-2:air-13:wood:air-7:wood:air-2:grass-3:dirt-2:grass-2:dirt-7:cloner_up:concrete:water:air-11:grass:dirt:grass-7:dirt:grass-2:dirt-4:concrete-2:dirt-6:concrete-2:water:concrete:air-12:concrete-2:dirt-12:concrete-13:air-14:concrete-4:dirt-8:concrete-2:air:concrete-8:air-17:concrete-13:air-2:concrete-7:air-19:concrete-11:air-3:concrete-6:air-21:concrete-10:air-3:concrete-5:air-15:grass-4:air-4:concrete-8:air-4:concrete-5:air-15:concrete-4:grass-2:air-2:concrete-8:air-4:concrete-4:air-17:concrete-5:air-3:concrete-6:air-5:concrete-3:air-19:concrete-3:air-5:concrete-4:air-6:concrete-3:air-19:concrete:air-7:concrete-3:air-7:concrete-3:air-37:concrete-2:air-38:concrete:air-79:deleter-40:;640:;0:3d:1:26:3:25:3:22:7:21:7:21:7:21:7:21:7:11:6:a:7:11:6:a:7:11:6:a:7:d:463:;2c0:1:26:1:88:1:28:1:21:1:10d:1:176:',
                inventory: {
                    dirt: 3,
                    sand: 2,
                    wood: 10,
                    water: 1
                },
                id: 'ea8bb6b5-ef28-4576-a06f-8e450868b795'
            },
            {
                name: 'Platformer',
                description: `Well, the monsters have built themselves a platform up to an unplaceable area. Unfortunately for them, they've made it out of <h>wood</h>. Find a way to get them down!`,
                saveCode: '40;0000;air-605:wood-7:air-36:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-39:wood:air-21:leaves-5:air-13:wood:air-21:leaves-6:air-2:leaves-2:air-8:wood:air-20:leaves-3:wood:leaves-3:air:leaves-3:air-8:wood:air-9:wood-3:air-8:leaves-3:wood:leaves-3:air:leaves-3:air-8:wood:air-9:wood-3:air-9:leaves-2:wood:leaves-2:air-2:leaves-2:wood:air-8:wood:air-9:wood-3:wall:lava:wall:air-8:wood:air-6:wood:water-8:wood:water-8:grass:concrete-3:wall:lava_generator:wall:grass:air-7:wood:air-6:wood:water-8:wood:water-5:mud-3:dirt-4:wall-3:dirt:grass:water-4:grass-2:dirt:grass:air:grass:air:grass-2:dirt:mud-4:water-4:wood:water-2:mud-5:dirt-10:mud-4:dirt-4:grass:dirt:grass:dirt-6:mud-5:wood:mud-2:dirt-34:concrete-7:dirt-33:concrete-7:dirt-228:;640:;2a8:8:1:27:1:27:1:27:1:27:1:1f:2d0:;1e9:1:26:2:23:2:1:3:1a2:1:f4:1:1:1:16b:',
                inventory: {
                    sand: 5,
                    wood: 3,
                    leaves: 8,
                    water: 1,
                    plant: 1
                },
                id: '56550ea3-28fa-48ff-84ac-2a5b41e4902a'
            },
            {
                name: 'Rafting',
                description: `Quick, they're approaching by sea! Try and find a way to get them while they're still on the raft!`,
                saveCode: '40;0000;air-1243:wood-12:air-25:water-3:wood-12:water-305:;640:;13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:13:15:230:;4b6:1:3:1:1:1:183:',
                inventory: {
                    sand: 20,
                    wood: 5,
                    water: 8,
                    concrete_powder: 9
                },
                id: '55f2433d-8012-4b75-a3bf-c00a182a6a43'
            },
            {
                name: 'Oh Well',
                description: `This is a strange predicament... We're in a desert now, and we nothing except some leaves, which are pretty useless. Wait, did I say "<h>we</h>"? Sorry, I meant <h>you</h>.`,
                saveCode: '50;0000;air-891:wood-5:air-45:wood-5:air-96:wood:air:wood:air-5:sand-10:air-32:wood:air:wood:sand-18:air-5:sand-10:lava-7:sand-7:concrete:water:concrete:sand-34:lava-5:sand-8:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-47:concrete:water:concrete:sand-5:concrete-11:sand-7:concrete-5:sand-19:concrete:water:concrete:sand-5:concrete-29:sand-3:concrete-7:sand-3:concrete:water:concrete:sand:concrete-47:water:concrete-49:water:concrete-49:water:concrete-43:water-13:concrete-34:water-16:;9c4:;16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:1c:16:13:5:4:16:13:5:4:16:1c:16:14:1:1:1:5:16:14:1:1:57e:;459:1:56a:',
                inventory: {
                    leaves: 20
                },
                id: '71000398-a49e-486a-98a0-56c0b0a8dbee'
            },
            {
                name: 'Resupply Needed',
                description: `You actually have nothing this time! Well, good luck!<br>Hint: The butterfly effect still exists.`,
                saveCode: '50;0000;air-373:wall:lava-3:wall:air-43:sand-2:wall:lava-3:wall:air-42:sand-3:wall:lava-3:wall:air-16:wood-3:air-22:concrete-4:wall-5:concrete:air-14:wood-4:air-23:concrete-8:air-15:dirt-4:grass:air-23:concrete-7:air-15:concrete-5:air-23:concrete-7:air-8:concrete:air-3:concrete:air-3:concrete-4:air-24:concrete-5:air-9:concrete:water-3:concrete:air-4:concrete:air-27:concrete-4:air-10:concrete-4:air-4:concrete:air-12:grass-5:air-10:concrete-3:air-11:concrete-3:air-18:concrete-5:air-10:concrete-2:air-12:concrete-2:air-20:concrete-3:air-12:concrete:air-34:concrete-3:air-48:concrete-2:air-276:leaves-5:air-7:dirt-2:air-35:leaves-7:air-6:dirt-3:air-13:sand-3:air-17:leaves-4:wood:leaves:wood:leaves:air-6:dirt-4:air-10:wood:sand-5:wood:air-15:leaves-4:wood-2:leaves-2:air-6:dirt-4:air-10:wood:sand-5:wood:air-16:leaves:wood:leaves:wood:leaves-2:air-3:leaves-3:air:dirt-5:air-9:wood:sand-5:wood:air-18:wood-2:air-4:leaves-5:dirt-5:air-9:wood:sand-5:wood:air-19:wood:air-4:leaves-5:dirt-6:air-8:wood:sand-5:wood:air-19:wood:air-4:leaves-2:wood:leaves-2:dirt-6:air-8:wood:sand-5:wood:air-19:wood:air-6:wood:air-2:dirt-7:air-7:wood:sand-5:wood:air-19:wood:air-6:wood:air-2:dirt-7:concrete-14:grass:water-2:wood-5:water-9:grass:air:dirt:grass-2:air-2:grass-2:dirt:grass-2:dirt-22:mud:water-13:mud-2:dirt-5:grass-2:dirt-28:mud-4:water-6:mud-3:dirt-41:mud-6:dirt-269:concrete-16:dirt-32:concrete-32:dirt-18:concrete-200:;9c4:;0:175:5:2d:5:2d:5:29:a:29:8:f:5:17:7:f:5:17:7:8:1:3:1:3:4:18:5:9:1:3:1:4:1:1b:4:a:4:4:1:4:6a4:;538:1:16a:1:9:1:1:1:d:1:16:2:27:1:3:1:2c2:',
                inventory: {
                    air: 0
                },
                id: '97d4d74b-4c07-4c6f-8de4-2412090c019f'
            }
        ]
    },
    // {
    //     name: 'Pixel Machines'
    // }
];

let currentPuzzleSection = 0;
let currentPuzzleLevel = 0;
let currentPuzzleId = 0;
const winScreen = document.getElementById('winScreen');
const winBox = document.getElementById('winBox');
const winReset = document.getElementById('winReset');
const winNext = document.getElementById('winNext');
const winMenu = document.getElementById('winMenu');
let inWinScreen = false;
function triggerWin() {
    if (inWinScreen) return;
    inWinScreen = true;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    winScreen.style.opacity = '1';
    winScreen.style.pointerEvents = 'all';
    winBox.style.transform = 'translateY(-50%)';
    const hide = () => {
        winScreen.style.opacity = '';
        winScreen.style.pointerEvents = '';
        winBox.style.transform = '';
        winReset.onclick = null;
        winNext.onclick = null;
        winMenu.onclick = null;
        inWinScreen = false;
    };
    if (puzzles[currentPuzzleSection].levels[currentPuzzleLevel + 1]) {
        winNext.onclick = () => {
            hide();
            transitionWithinGame(() => {
                loadPuzzle(currentPuzzleSection, currentPuzzleLevel + 1);
            });
        }
        winNext.style.display = '';
    } else {
        winNext.style.display = 'none';
    }
    winReset.onclick = (e) => {
        hide();
        saveCode = saveCodeText.value.replace('\n', '');
        loadSaveCode();
        inResetState = true;
    };
    winMenu.onclick = (e) => {
        hide();
        transitionToMenu();
    };
};

const levelName = document.getElementById('levelName');
const levelDescription = document.getElementById('levelDescription');
function loadPuzzle(section, level) {
    try {
        currentPuzzleSection = parseInt(section);
        currentPuzzleLevel = parseInt(level);
        const puzzle = puzzles[section].levels[level];
        currentPuzzleId = puzzle.id;
        levelName.innerHTML = `${parseInt(section) + 1}-${parseInt(level) + 1} ${puzzle.name}`;
        levelDescription.innerHTML = puzzle.description;
        puzzleSaveCode = puzzle.saveCode;
        saveCode = puzzleSaveCode;
        let savedData = window.localStorage.getItem(`challenge-${currentPuzzleId}`);
        if (savedData) savedData = JSON.parse(savedData);
        if (savedData) saveCode = savedData.code;
        saveCodeText.value = saveCode;
        loadSaveCode();
        inResetState = true;
        resetPixelAmounts();
        if (savedData) {
            let isFirst = true;
            for (let i in savedData.pixels) {
                if (isFirst) {
                    pixelSelectors[i].box.click();
                    isFirst = false;
                }
                if (puzzle.inventory[i] !== undefined || (savedData.pixels[i] != 0 && i != 'air')) {
                    pixelAmounts[i] = savedData.pixels[i];
                    updatePixelAmount(i, false, true);
                }
            }
        } else {
            let isFirst = true;
            for (let i in puzzle.inventory) {
                if (isFirst) {
                    pixelSelectors[i].box.click();
                    isFirst = false;
                }
                pixelAmounts[i] = puzzle.inventory[i];
                updatePixelAmount(i, false, true);
            }
        }
        pixelAmounts['air'] = Infinity;
        updatePixelAmount('air', false, false);
        camera.scale = 1;
        camera.x = 0;
        camera.y = 0;
    } catch (err) {
        modal('Could not load puzzle:', `<span style="color: red;">${err.message}</span>`, false);
    }
};
for (let section in puzzles) {
    const block = document.createElement('div');
    block.classList.add('levelGroup');
    const title = document.createElement('h1');
    title.innerText = puzzles[section].name;
    block.appendChild(title);
    let col = 0;
    for (let level in puzzles[section].levels) {
        const button = document.createElement('button');
        button.classList.add('levelButton');
        button.innerText = parseInt(level) + 1;
        button.onclick = (e) => {
            sandboxMode = false;
            loadPuzzle(section, level);
            selectPuzzle();
        };
        block.appendChild(button);
        col++;
        if (col == 5) {
            block.appendChild(document.createElement('br'));
            col = 0;
        }
    }
    levelSelectBody.appendChild(block);
}

window.addEventListener('DOMContentLoaded', (e) => {
    let i = 0;
    let key = window.localStorage.key(i);
    while (key != null) {
        if (key.startsWith('challenge-')) {
            let exists = false;
            let searchId = key.replace('challenge-', '');
            search: for (let section of puzzles) {
                for (let level of section.levels) {
                    if (level.id == searchId) {
                        exists = true;
                        break search;
                    }
                }
            }
            if (!exists) {
                window.localStorage.removeItem(key);
            }
        }
        i++;
        key = window.localStorage.key(i);
    }
});