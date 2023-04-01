window.addEventListener('error', (e) => {
    modal('An error occured:', `<span style="color: red;">${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
});

let gridSize = 100;
let saveCode = '100;air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser-6:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava_generator-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}5|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let puzzleSaveCode;
let sandboxMode = true;
let backgroundColor = '#ffffff';
let noNoise = false;
let noAnimations = false;
let maxLaserDepth = 512;
let fadeEffect = 127;
let debugInfo = false;
let horribleLagMode = false;

const canvasResolution = parseInt(window.localStorage.getItem('resolution') ?? 800);
const NO_OFFSCREENCANVAS = typeof OffscreenCanvas == 'undefined';
function createCanvas2() {
    if (NO_OFFSCREENCANVAS) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasResolution;
        canvas.height = canvasResolution;
        return canvas;
    } else {
        return new OffscreenCanvas(canvasResolution, canvasResolution);
    }
};
const canvasContainer = document.getElementById('canvasContainer');
const canvas = document.getElementById('canvas');
const gameCanvas = document.createElement('canvas');
const gridCanvas = createCanvas2();
const above = createCanvas2();
const fire = createCanvas2();
const monster = createCanvas2();
const target = createCanvas2();
const placeable = createCanvas2();
const ctx = canvas.getContext('2d');
const gamectx = gameCanvas.getContext('2d');
const gridctx = gridCanvas.getContext('2d');
const abovectx = above.getContext('2d');
const firectx = fire.getContext('2d');
const monsterctx = monster.getContext('2d');
const targetctx = target.getContext('2d');
const placeablectx = placeable.getContext('2d');
function resetCanvases() {
    canvas.width = canvasResolution;
    canvas.height = canvasResolution;
    gameCanvas.width = canvasResolution;
    gameCanvas.height = canvasResolution;
    gridCanvas.width = canvasResolution;
    gridCanvas.height = canvasResolution;
    above.width = canvasResolution;
    above.height = canvasResolution;
    fire.width = canvasResolution;
    fire.height = canvasResolution;
    monster.width = canvasResolution;
    monster.height = canvasResolution;
    target.width = canvasResolution;
    target.height = canvasResolution;
    placeable.width = canvasResolution;
    placeable.height = canvasResolution;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    gamectx.imageSmoothingEnabled = false;
    gamectx.webkitImageSmoothingEnabled = false;
    gamectx.mozImageSmoothingEnabled = false;
    gridctx.imageSmoothingEnabled = false;
    gridctx.webkitImageSmoothingEnabled = false;
    gridctx.mozImageSmoothingEnabled = false;
    abovectx.imageSmoothingEnabled = false;
    abovectx.webkitImageSmoothingEnabled = false;
    abovectx.mozImageSmoothingEnabled = false;
    firectx.imageSmoothingEnabled = false;
    firectx.webkitImageSmoothingEnabled = false;
    firectx.mozImageSmoothingEnabled = false;
    monsterctx.imageSmoothingEnabled = false;
    monsterctx.webkitImageSmoothingEnabled = false;
    monsterctx.mozImageSmoothingEnabled = false;
    targetctx.imageSmoothingEnabled = false;
    targetctx.webkitImageSmoothingEnabled = false;
    targetctx.mozImageSmoothingEnabled = false;
    placeablectx.imageSmoothingEnabled = false;
    placeablectx.webkitImageSmoothingEnabled = false;
    placeablectx.mozImageSmoothingEnabled = false;
    rpResetCanvases();
};
const sidebar = document.getElementById('sidebar');
const pixelPicker = document.getElementById('pixelPicker');
const pixelPickerDescription = document.getElementById('pixelPickerDescription');
const saveCodeText = document.getElementById('saveCode');
const gridSizeText = document.getElementById('gridSize');
canvasContainer.addEventListener('contextmenu', e => e.preventDefault());
pixelPicker.addEventListener('contextmenu', e => e.preventDefault());

let gridScale = canvasResolution / gridSize;
let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 21;
let canvasScale = canvasResolution / canvasSize;
const grid = [];
const lastGrid = [];
const nextGrid = [];
const fireGrid = [];
const lastFireGrid = [];
const nextFireGrid = [];
const monsterGrid = [];
const targetGrid = [];
const musicGrid = [];
const lastMusicGrid = [];
const placeableGrid = [];
const lastPlaceableGrid = [];
const noiseGrid = [];
let pendingExplosions = [];
let frameCount = 0;
let ticks = 0;
let simulationPaused = true;
let slowSimulation = false;
let fastSimulation = false;
let runTicks = 0;
const frameList = [];
const fpsList = [];
let lastFpsList = -1;

const brush = {
    pixel: 'wall',
    size: 1,
    lineMode: false,
    isSelection: false,
    lineStartX: 0,
    lineStartY: 0,
    startsInRPE: false
};
let mX = 0;
let mY = 0;
let mXGrid = 0;
let mYGrid = 0;
let prevMX = 0;
let prevMY = 0;
let prevMXGrid = 0;
let prevMYGrid = 0;
let mouseOver = false;
const camera = {
    x: 0,
    y: 0,
    scale: 1,
    mUp: false,
    mDown: false,
    mLeft: false,
    mRight: false
};
const selection = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    grid: [],
    show: false
};
let removing = false;
let holdingControl = false;
let holdingAlt = false;
let acceptInputs = true;
let inResetState = true;
let forceRedraw = true;

// save codes
function createGrid(size) {
    if (size < 1) return;
    gridSize = size;
    gridScale = canvasResolution / gridSize;
    pendingExplosions = [];
    selection.show = false;
    grid.length = 0;
    lastGrid.length = 0;
    nextGrid.length = 0;
    fireGrid.length = 0;
    lastFireGrid.length = 0;
    nextFireGrid.length = 0;
    monsterGrid.length = 0;
    targetGrid.length = 0;
    musicGrid.length = 0;
    lastMusicGrid.length = 0;
    placeableGrid.length = 0;
    lastPlaceableGrid.length = 0;
    noiseGrid.length = 0;
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        lastGrid[i] = [];
        nextGrid[i] = [];
        fireGrid[i] = [];
        lastFireGrid[i] = [];
        nextFireGrid[i] = [];
        monsterGrid[i] = [];
        targetGrid[i] = [];
        musicGrid[i] = [];
        lastMusicGrid[i] = [];
        placeableGrid[i] = [];
        lastPlaceableGrid[i] = [];
        noiseGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = pixNum.AIR;
            lastGrid[i][j] = null;
            nextGrid[i][j] = null;
            fireGrid[i][j] = false;
            lastFireGrid[i][j] = false;
            nextFireGrid[i][j] = false;
            monsterGrid[i][j] = false;
            targetGrid[i][j] = false;
            musicGrid[i][j] = 0;
            lastMusicGrid[i][j] = 0;
            placeableGrid[i][j] = true;
            lastPlaceableGrid[i][j] = true;
            noiseGrid[i][j] = noise(j / 2, i / 2);
        }
    }
    gridSizeText.value = gridSize;
};
function loadSaveCode() {
    if (saveCode.length != 0) {
        simulationPaused = true;
        fastSimulation = false;
        updateTimeControlButtons();
        runTicks = 0;
        ticks = 0;
        stopAllMusicPixels();
        let sections = saveCode.split(';');
        if (isNaN(parseInt(sections[0]))) return;
        function parseSaveCode(code) {
            let x = 0;
            let y = 0;
            let i = 0;
            const loopedPixels = [];
            function addPixels(pixel, amount) {
                let pixelTypeNum = pixNum[pixel.toUpperCase()];
                while (amount > 0) {
                    grid[y][x++] = pixelTypeNum;
                    if (x == gridSize) {
                        y++;
                        x = 0;
                        if (y == gridSize) return true;
                    }
                    amount--;
                }
                return false;
            };
            load: while (i < code.length) {
                let nextDash = code.indexOf('-', i);
                let nextColon = code.indexOf(':', i);
                let nextOpenBracket = code.indexOf('{', i);
                let nextCloseBracket = code.indexOf('}', i);
                let nextPipeline = code.indexOf('|', i);
                if (nextDash == -1) nextDash = Infinity;
                if (nextColon == -1) nextColon = Infinity;
                if (nextOpenBracket == -1) nextOpenBracket = Infinity;
                if (nextCloseBracket == -1) nextCloseBracket = Infinity;
                if (nextPipeline == -1) nextPipeline = Infinity;
                let minNext = Math.min(nextDash, nextColon, nextOpenBracket, nextCloseBracket, nextPipeline);
                if (minNext == Infinity) break load;
                if (minNext == nextOpenBracket) {
                    loopedPixels.push([]);
                    i = nextOpenBracket + 1;
                } else if (minNext == nextCloseBracket) {
                    let loopedSection = loopedPixels.pop();
                    let iterations = parseInt(code.substring(nextCloseBracket + 1, nextPipeline));
                    if (loopedPixels.length) {
                        for (let i = 0; i < iterations; i++) {
                            loopedPixels[loopedPixels.length - 1].push(...loopedSection);
                        }
                    } else {
                        for (let i = 0; i < iterations; i++) {
                            for (let [pixel, amount] of loopedSection) {
                                if (addPixels(pixel, amount)) break load;
                            }
                        }
                    }
                    i = nextPipeline + 1;
                } else if (minNext == nextDash) {
                    let pixel = code.substring(i, nextDash);
                    let amount = parseInt(code.substring(nextDash + 1, nextColon));
                    if (loopedPixels.length) {
                        loopedPixels[loopedPixels.length - 1].push([pixel, amount])
                    } else {
                        if (addPixels(pixel, amount)) break load;
                    }
                    i = nextColon + 1;
                } else if (nextColon >= 0) {
                    let pixel = code.substring(i, nextColon);
                    if (loopedPixels.length) {
                        loopedPixels[loopedPixels.length - 1].push([pixel, 1])
                    } else {
                        if (addPixels(pixel, 1)) break load;
                    }
                    i = nextColon + 1;
                } else {
                    break load;
                }
            }
        };
        function parseBooleanCode(grid, code) {
            let x = 0;
            let y = 0;
            let i = 0;
            function addPixels(pixel, amount) {
                while (amount > 0) {
                    grid[y][x++] = pixel;
                    if (x == gridSize) {
                        y++;
                        x = 0;
                        if (y == gridSize) return true;
                    }
                    amount--;
                }
                return false;
            };
            let pixel = false;
            while (i < code.length) {
                let next = code.indexOf(':', i);
                if (next == -1) break;
                let amount = parseInt(code.substring(i, next), 16);
                if (addPixels(pixel, amount)) break;
                pixel = !pixel;
                i = next + 1;
            }
        };
        if (sections[0]) createGrid(parseInt(sections[0]));
        if (sections[1]) ticks = parseInt(sections[1], 16);
        if (sections[2]) parseSaveCode(sections[2]);
        if (sections[3]) parseBooleanCode(fireGrid, sections[3]);
        if (sections[4]) parseBooleanCode(placeableGrid, sections[4]);
        if (sections[5]) parseBooleanCode(monsterGrid, sections[5]);
        if (sections[6]) parseBooleanCode(targetGrid, sections[6]);
        randomSeed(ticks);
        updateTimeControlButtons();
        forceRedraw = true;
    }
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', saveCode);
    }
};
function generateSaveCode() {
    let saveCode = `${gridSize};${'0000'.substring(0, 4 - (ticks % 65536).toString(16).length)}${(ticks % 65536).toString(16)};`;
    let pixel = null;
    let amount = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            amount++;
            if (grid[i][j] != pixel) {
                if (pixel != null && amount != 0) {
                    if (amount == 1) {
                        saveCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}:`;
                    } else {
                        saveCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}-${amount}:`;
                    }
                }
                pixel = grid[i][j];
                amount = 0;
            }
        }
    }
    amount++;
    if (pixel != null) {
        if (amount == 1) {
            saveCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}:`;
        } else {
            saveCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}-${amount}:`;
        }
    }
    function createBooleanCode(grid) {
        saveCode += ';';
        let pixel = grid[0][0];
        amount = -1;
        if (pixel) saveCode += '0:';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != pixel) {
                    if (amount != 0) {
                        if (amount == 1) {
                            saveCode += `1:`;
                        } else {
                            saveCode += `${amount.toString(16)}:`;
                        }
                    }
                    pixel = grid[i][j];
                    amount = 0;
                }
            }
        }
        amount++;
        if (amount == 1) {
            saveCode += `1:`;
        } else {
            saveCode += `${amount.toString(16)}:`;
        }
    };
    createBooleanCode(fireGrid);
    createBooleanCode(placeableGrid);
    createBooleanCode(monsterGrid);
    createBooleanCode(targetGrid);
    return saveCode;
};
async function loadPremade(id) {
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (await modal('Confirm load?', 'Your current red simulation will be overwritten!', true)) {
        document.querySelectorAll('save').forEach(e => {
            if (e.getAttribute('save-id') == id) {
                saveCode = e.innerHTML;
                saveCodeText.value = saveCode;
                loadSaveCode();
                window.localStorage.setItem('saveCode', generateSaveCode());
                window.localStorage.setItem('saveCodeText', saveCodeText.value);
            }
        });
    }
};
function loadStoredSave() {
    saveCode = window.localStorage.getItem('saveCode') ?? saveCode;
    loadSaveCode();
    saveCode = window.localStorage.getItem(('saveCodeText')) ?? saveCode;
    saveCodeText.value = saveCode;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
};

// modal
const modalContainer = document.getElementById('modalContainer');
const modalBody = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalYes = document.getElementById('modalYes');
const modalNo = document.getElementById('modalNo');
const modalOk = document.getElementById('modalOk');
function modal(title, subtitle, confirmation) {
    if (!acceptInputs) return new Promise((resolve, reject) => reject('Modal already open'));
    acceptInputs = false;
    modalTitle.innerHTML = title;
    modalSubtitle.innerHTML = subtitle;
    if (confirmation) {
        modalYes.style.display = '';
        modalNo.style.display = '';
        modalOk.style.display = 'none';
    } else {
        modalYes.style.display = 'none';
        modalNo.style.display = 'none';
        modalOk.style.display = '';
    }
    modalContainer.style.opacity = '1';
    modalContainer.style.pointerEvents = 'all';
    modalBody.style.transform = 'translateY(calc(50vh + 50%))';
    const hide = () => {
        modalContainer.style.opacity = '';
        modalContainer.style.pointerEvents = '';
        modalBody.style.transform = '';
        modalYes.onclick = null;
        modalNo.onclick = null;
        modalOk.onclick = null;
        acceptInputs = true;
    };
    return new Promise((resolve, reject) => {
        modalYes.onclick = (e) => {
            hide();
            resolve(true);
        };
        modalNo.onclick = (e) => {
            hide();
            resolve(false);
        };
        modalOk.onclick = (e) => {
            hide();
            resolve(true);
        };
        document.addEventListener('keydown', function cancel(e) {
            if (e.key == 'Escape') {
                hide();
                resolve(false);
                document.removeEventListener('keydown', cancel);
            }
        });
    });
};

// p5 thing
function setup() {
    noiseDetail(3, 0.6);
    window.onresize();

    document.querySelectorAll('.p5Canvas').forEach(e => e.remove());

    loadStoredSave();

    startRPDrawLoop();

    setInterval(() => {
        if (sandboxMode) {
            window.localStorage.setItem('saveCode', generateSaveCode());
        }
    }, 30000);
};

// utilities
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// pixel utilities
function PreRenderer(size) {
    size = size ?? 60;
    const rendCanvas = document.createElement('canvas');
    rendCanvas.width = size;
    rendCanvas.height = size;
    const rendctx = rendCanvas.getContext('2d');
    rendCanvas.style.imageRendering = 'pixelated';
    rendctx.imageSmoothingEnabled = false;
    rendctx.webkitImageSmoothingEnabled = false;
    rendctx.mozImageSmoothingEnabled = false;
    return {
        ctx: rendctx,
        fillPixel: function (x, y, width, height) {
            rendctx.fillRect(x * size, y * size, width * size, height * size);
        },
        toImage: function () {
            const img = new Image(size, size);
            img.src = rendCanvas.toDataURL('image/png');
            return img;
        }
    }
};
function drawPixels(x, y, width, height, type, opacity, ctx, avoidGrid) {
    if (numPixels[type]) {
        numPixels[type].draw(x, y, width, height, opacity, ctx, avoidGrid);
    } else {
        numPixels[pixNum.MISSING].draw(x, y, width, height, opacity, ctx, avoidGrid);
    }
};
function clearPixels(x, y, width, height, ctx) {
    let scale = gridScale * camera.scale;
    ctx.clearRect(x * scale - camera.x, y * scale - camera.y, width * scale, height * scale);
};
function fillPixel(x, y, width, height, ctx) {
    let scale = gridScale * camera.scale;
    ctx.fillRect(x * scale - camera.x, y * scale - camera.y, width * scale, height * scale);
};
function imagePixel(x, y, width, height, source, ctx) {
    let scale = gridScale * camera.scale;
    for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
            ctx.drawImage(source, j * scale - camera.x, i * scale - camera.y, scale, scale);
        }
    }
};
function colorAnimate(r1, g1, b1, r2, g2, b2, p) {
    let multiplier1 = (Math.sin(frameCount * Math.PI / p) + 1) / 2;
    let multiplier2 = (Math.sin((frameCount + p) * Math.PI / p) + 1) / 2;
    return [
        (r1 * multiplier1) + (r2 * multiplier2),
        (g1 * multiplier1) + (g2 * multiplier2),
        (b1 * multiplier1) + (b2 * multiplier2),
    ];
};
function updatePixel(x, y, i) {
    let pixelType = numPixels[grid[y][x]];
    if (pixelType != undefined && pixelType.updateStage == i) {
        pixelType.update(x, y);
    }
};
function updateTouchingPixel(x, y, type, action) {
    let touchingPixel = false;
    if (x > 0 && grid[y][x - 1] == type) {
        if (typeof action == 'function') touchingPixel = (action(x - 1, y) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (x < gridSize - 1 && grid[y][x + 1] == type) {
        if (typeof action == 'function') touchingPixel = (action(x + 1, y) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (y > 0 && grid[y - 1][x] == type) {
        if (typeof action == 'function') touchingPixel = (action(x, y - 1) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (y < gridSize - 1 && grid[y + 1][x] == type) {
        if (typeof action == 'function') touchingPixel = (action(x, y + 1) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    return touchingPixel;
};
function updateTouchingAnything(x, y, action) {
    let touchingPixel = false;
    if (x > 0 && grid[y][x - 1] != pixNum.AIR) {
        if (typeof action == 'function') touchingPixel = (action(x - 1, y) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (x < gridSize - 1 && grid[y][x + 1] != pixNum.AIR) {
        if (typeof action == 'function') touchingPixel = (action(x + 1, y) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (y > 0 && grid[y - 1][x] != pixNum.AIR) {
        if (typeof action == 'function') touchingPixel = (action(x, y - 1) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (y < gridSize - 1 && grid[y + 1][x] != pixNum.AIR) {
        if (typeof action == 'function') touchingPixel = (action(x, y + 1) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    return touchingPixel;
};
function validMovingPixel(x, y) {
    return nextGrid[y][x] == null;
};
function isAir(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.STEAM || grid[y][x] == pixNum.DELETER;
};
function isPassableFluid(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.WATER || grid[y][x] == pixNum.LAVA || grid[y][x] == pixNum.STEAM || grid[y][x] == pixNum.DELETER;
};
function isPassableLiquid(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.WATER || grid[y][x] == pixNum.LAVA || grid[y][x] == pixNum.DELETER;
};
function isTransparent(x, y) {
    return (grid[y][x] == pixNum.AIR && !monsterGrid[y][x]) || grid[y][x] == pixNum.GLASS || grid[y][x] == pixNum.REINFORCED_GLASS;
};
function canMoveTo(x, y) {
    return nextGrid[y][x] == null || nextGrid[y][x] == pixNum.AIR || nextGrid[y][x] == pixNum.DELETER;
};
function move(x1, y1, x2, y2) {
    if (grid[y2][x2] == pixNum.DELETER) {
        nextGrid[y1][x1] = pixNum.AIR;
        fireGrid[y1][x1] = false;
    } else {
        nextGrid[y1][x1] = grid[y2][x2];
        nextGrid[y2][x2] = grid[y1][x1];
        let fire = fireGrid[y1][x1]
        fireGrid[y1][x1] = fireGrid[y2][x2];
        fireGrid[y2][x2] = fire;
    }
};
function fall(x, y, xTravel, yTravel, isPassable) {
    if (y < gridSize - 1) {
        if (isPassable(x, y + 1) && canMoveTo(x, y + 1)) {
            move(x, y, x, y + 1);
        } else if (y < gridSize - yTravel) {
            let slideLeft = x >= xTravel && canMoveTo(x - 1, y);
            let slideRight = x < gridSize - xTravel && canMoveTo(x + 1, y);
            let canMoveLeftDiagonal = false;
            let canMoveRightDiagonal = false;
            if (slideLeft) {
                for (let i = x - 1; i >= x - xTravel; i--) {
                    if (!isPassable(i, y)) {
                        slideLeft = false;
                        break;
                    }
                    let valid = true;
                    for (let j = y + 1; j <= y + yTravel; j++) {
                        if (!isPassable(i, j)) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        canMoveLeftDiagonal = i == x - 1 && canMoveTo(i, y + 1);
                        break;
                    }
                    if (i == x - xTravel) slideLeft = false;
                }
            }
            if (slideRight) {
                for (let i = x + 1; i <= x + xTravel; i++) {
                    if (!isPassable(i, y)) {
                        slideRight = false;
                        break;
                    }
                    let valid = true;
                    for (let j = y + 1; j <= y + yTravel; j++) {
                        if (!isPassable(i, j)) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        canMoveRightDiagonal = i == x + 1 && canMoveTo(i, y + 1);
                        break;
                    }
                    if (i == x + xTravel) slideRight = false;
                }
            }
            if (slideLeft && slideRight) {
                if (ticks % 2 == 0) {
                    if (canMoveLeftDiagonal) move(x, y, x - 1, y + 1);
                    else move(x, y, x - 1, y);
                } else {
                    if (canMoveRightDiagonal) move(x, y, x + 1, y + 1);
                    else move(x, y, x + 1, y);
                }
            } else if (slideLeft) {
                if (canMoveLeftDiagonal) move(x, y, x - 1, y + 1);
                else move(x, y, x - 1, y);
            } else if (slideRight) {
                if (canMoveRightDiagonal) move(x, y, x + 1, y + 1);
                else move(x, y, x + 1, y);
            }
        }
    }
};
function flow(x, y) {
    if (y == gridSize) {
        // still have to flow left and right to fill air gaps
        return;
    }
    if (isAir(x, y + 1)) {
        if (canMoveTo(x, y + 1)) move(x, y, x, y + 1);
    } else {
        let left = x;
        let right = x;
        let slideLeft = 0;
        let slideRight = 0;
        let foundLeftDrop = false;
        let foundRightDrop = false;
        let incrementLeft = canMoveTo(x - 1, y) && isAir(x - 1, y);
        let incrementRight = canMoveTo(x + 1, y) && isAir(x + 1, y);
        // move directly to destination?
        while (incrementLeft) {
            left--;
            if (!isAir(left, y) && grid[y + 1][left] != grid[y][x]) {
                if (grid[y][left] != grid[y][x]) slideLeft = x - left;
                incrementLeft = false;
            } else if (isAir(left, y + 1)) {
                slideLeft = x - left;
                foundLeftDrop = true;
                incrementLeft = false;
            }
            if (left < 0) {
                slideLeft = x - left;
                incrementLeft = false;
            }
        }
        while (incrementRight) {
            right++;
            if (!isAir(right, y) && grid[y + 1][right] != grid[y][x]) {
                if (grid[y][right] != grid[y][x]) slideRight = right - x;
                incrementRight = false;
            } else if (isAir(right, y + 1)) {
                slideRight = right - x;
                foundRightDrop = true;
                incrementRight = false;
            }
            if (right >= gridSize) {
                slideRight = right - x;
                incrementRight = false;
            }
        }
        let toSlide = 0;
        if (foundLeftDrop && foundRightDrop) {
            if (slideLeft < slideRight && slideLeft != 0) {
                toSlide = -1;
            } else if (slideLeft > slideRight && slideRight != 0) {
                toSlide = 1;
            } else {
                if (ticks % 2 == 0) {
                    toSlide = -1;
                } else {
                    toSlide = 1;
                }
            }
        } else if (foundLeftDrop) {
            toSlide = -1;
        } else if (foundRightDrop) {
            toSlide = 1;
        } else if (slideLeft < slideRight && slideLeft != 0) {
            toSlide = -1;
        } else if (slideLeft > slideRight && slideRight != 0) {
            toSlide = 1;
        } else if (slideLeft != 0 && slideRight != 0) {
            if (ticks % 2 == 0) {
                toSlide = -1;
            } else {
                toSlide = 1;
            }
        }
        if (toSlide > 0) {
            if (foundRightDrop && isAir(x + 1, y + 1) && canMoveTo(x + 1, y + 1)) {
                move(x, y, x + 1, y + 1);
            } else if (canMoveTo(x + 1, y)) {
                move(x, y, x + 1, y);
            }
        } else if (toSlide < 0) {
            if (foundLeftDrop && isAir(x - 1, y + 1) && canMoveTo(x - 1, y + 1)) {
                move(x, y, x - 1, y + 1);
            } else if (canMoveTo(x - 1, y)) {
                move(x, y, x - 1, y);
            }
        }
    }
};
function possibleRotations(id) {
    return (id == pixNum.SLIDER_HORIZONTAL || id == pixNum.SLIDER_VERTICAL || id == pixNum.MIRROR_1 || id == pixNum.MIRROR_2) ? 2 : 4;
};
function rotatePixel(x, y) {
    if (nextGrid[y][x] != null) return;
    let thisPixel = numPixels[grid[y][x]];
    let rotate = 0;
    let touchedRotators = [];
    updateTouchingAnything(x, y, function (actionX, actionY) {
        let pixel = grid[actionY][actionX];
        if (pixel == pixNum.ROTATOR_CLOCKWISE) {
            rotate++;
        } else if (pixel == pixNum.ROTATOR_COUNTERCLOCKWISE) {
            rotate--;
        } else if ((pixel >= pixNum.ROTATOR_LEFT && pixel <= pixNum.ROTATOR_DOWN) && numPixels[pixel].rotation != thisPixel.rotation && touchedRotators.indexOf(pixel) == -1) {
            rotate += numPixels[pixel].rotation - thisPixel.rotation;
            touchedRotators.push(pixel);
        }
    });
    if (rotate != 0) {
        let rotations = possibleRotations(grid[y][x]);
        nextGrid[y][x] = grid[y][x] - thisPixel.rotation + ((((thisPixel.rotation + rotate) % rotations) + rotations) % rotations);
    }
};
function getLaserPath(x, y, dir) {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return [[0, 0, 0, 0]];
    let path = [];
    let cdir = dir;
    let startX = x;
    let startY = y;
    let iterations = 0;
    while (iterations < maxLaserDepth && startX >= 0 && startX < gridSize && startY >= 0 && startY < gridSize) {
        let endX = startX;
        let endY = startY;
        switch (cdir) {
            case 0:
                endX = startX - 1;
                while (endX >= 0) {
                    if (!isTransparent(endX, endY)) break;
                    endX--;
                }
                path.push([startX, startY, endX, endY]);
                if (endX >= 0 && grid[endY][endX] == pixNum.MIRROR_1) cdir = 3;
                else if (endX >= 0 && grid[endY][endX] == pixNum.MIRROR_2) cdir = 1;
                else return path;
                break;
            case 1:
                endY = startY - 1;
                while (endY >= 0) {
                    if (!isTransparent(endX, endY)) break;
                    endY--;
                }
                path.push([startX, startY, endX, endY]);
                if (endY >= 0 && grid[endY][endX] == pixNum.MIRROR_1) cdir = 2;
                else if (endY >= 0 && grid[endY][endX] == pixNum.MIRROR_2) cdir = 0;
                else return path;
                break;
            case 2:
                endX = startX + 1;
                while (endX < gridSize) {
                    if (!isTransparent(endX, endY)) break;
                    endX++;
                }
                path.push([startX, startY, endX, endY]);
                if (endX < gridSize && grid[endY][endX] == pixNum.MIRROR_1) cdir = 1;
                else if (endX < gridSize && grid[endY][endX] == pixNum.MIRROR_2) cdir = 3;
                else return path;
                break;
            case 3:
                endY = startY + 1;
                while (endY < gridSize) {
                    if (!isTransparent(endX, endY)) break;
                    endY++;
                }
                path.push([startX, startY, endX, endY]);
                if (endY < gridSize && grid[endY][endX] == pixNum.MIRROR_1) cdir = 0;
                else if (endY < gridSize && grid[endY][endX] == pixNum.MIRROR_2) cdir = 2;
                else return path;
                break;
            default:
                path.push([startX, startY, endX, endY]);
                return path;
        }
        startX = endX;
        startY = endY;
        iterations++;
    }
    return path;
};
function drawLaserPath(path) {
    for (let line of path) {
        if (line[1] == line[3]) {
            fillPixel(Math.min(line[0], line[2]) + 1, line[1] + 1 / 3, Math.abs(line[0] - line[2]) - 1, 1 / 3, abovectx);
            if (grid[line[1]][line[0]] == pixNum.MIRROR_1 || grid[line[1]][line[0]] == pixNum.MIRROR_2) {
                if (line[0] < line[2]) {
                    fillPixel(line[0] + 1 / 2, line[1] + 1 / 3, 1 / 2, 1 / 3, abovectx);
                    if (grid[line[1]][line[0]] == pixNum.MIRROR_1) fillPixel(line[0] + 1 / 3, line[1] + 1 / 2, 1 / 3, 1 / 2, abovectx);
                    else fillPixel(line[0] + 1 / 3, line[1], 1 / 3, 1 / 2, abovectx);
                } else {
                    fillPixel(line[0], line[1] + 1 / 3, 1 / 2, 1 / 3, abovectx);
                    if (grid[line[1]][line[0]] == pixNum.MIRROR_1) fillPixel(line[0] + 1 / 3, line[1], 1 / 3, 1 / 2, abovectx);
                    else fillPixel(line[0] + 1 / 3, line[1] + 1 / 2, 1 / 3, 1 / 2, abovectx);
                }
                imagePixel(line[0], line[1], 1, 1, numPixels[grid[line[1]][line[0]]].prerenderedFrames[0], abovectx);
            }
        } else {
            fillPixel(line[0] + 1 / 3, Math.min(line[1], line[3]) + 1, 1 / 3, Math.abs(line[1] - line[3]) - 1, abovectx);
            if (grid[line[1]][line[0]] == pixNum.MIRROR_1 || grid[line[1]][line[0]] == pixNum.MIRROR_2) {
                if (line[1] < line[3]) {
                    fillPixel(line[0] + 1 / 3, line[1] + 1 / 2, 1 / 3, 1 / 2, abovectx);
                    if (grid[line[1]][line[0]] == pixNum.MIRROR_1) fillPixel(line[0] + 1 / 2, line[1] + 1 / 3, 1 / 2, 1 / 3, abovectx);
                    else fillPixel(line[0], line[1] + 1 / 3, 1 / 2, 1 / 3, abovectx);
                } else {
                    fillPixel(line[0] + 1 / 3, line[1], 1 / 3, 1 / 2, abovectx);
                    if (grid[line[1]][line[0]] == pixNum.MIRROR_1) fillPixel(line[0], line[1] + 1 / 3, 1 / 2, 1 / 3, abovectx);
                    else fillPixel(line[0] + 1 / 2, line[1] + 1 / 3, 1 / 2, 1 / 3, abovectx);
                }
                imagePixel(line[0], line[1], 1, 1, numPixels[grid[line[1]][line[0]]].prerenderedFrames[0], abovectx);
            }
        }
    }
};
function explode(x, y, size) {
    nextGrid[y][x] = pixNum.AIR;
    grid[y][x] = pixNum.AIR;
    let chained = 0;
    // let rays = size * 2;
    // for (let i = 0; i < rays; i++) {
    //     let angle = 2 * Math.PI / rays;
    //     let cos = Math.cos(angle);
    //     let sin = Math.sin(angle);
    //     // sector???
    // }
    for (let cy = y - size; cy <= y + size; cy++) {
        for (let cx = x - size; cx <= x + size; cx++) {
            if (cy >= 0 && cy < gridSize && cx >= 0 && cx < gridSize) {
                if (random() < (1 - (getDistance(x, y, cx, cy) / size)) * ((20 - (numPixels[grid[cy][cx]] ?? numPixels[pixNum.MISSING]).blastResistance) / (45 - size))) {
                    nextGrid[cy][cx] = pixNum.AIR;
                    monsterGrid[cy][cx] = false;
                    if (chained < 5 && getDistance(x, y, cx, cy) > 5 && random() < 0.8 - (getDistance(x, y, cx, cy) / size)) {
                        if (grid[cy][cx] == pixNum.NUKE) {
                            pendingExplosions.push([cx, cy, 10]);
                            grid[cy][cx] = pixNum.AIR;
                            chained++;
                        } else if (grid[cy][cx] == pixNum.HUGE_NUKE) {
                            pendingExplosions.push([cx, cy, 20]);
                            grid[cy][cx] = pixNum.AIR;
                            chained++;
                        } else if (grid[cy][cx] == pixNum.VERY_HUGE_NUKE) {
                            pendingExplosions.push([cx, cy, 40]);
                            grid[cy][cx] = pixNum.AIR;
                            chained++;
                        }
                    }
                    if (grid[cy][cx] == pixNum.GUNPOWDER) {
                        pendingExplosions.push([cx, cy, 5, 1]);
                        grid[cy][cx] = pixNum.WALL;
                    } else if (grid[cy][cx] == pixNum.C4) {
                        pendingExplosions.push([cx, cy, 15, 1]);
                        grid[cy][cx] = pixNum.WALL;
                    }
                    if (random() < 0.5 - (getDistance(x, y, cx, cy) / size)) {
                        fireGrid[cy][cx] = true;
                    }
                }
            }
        }
    }
};

// draw loop
function draw() {
    if (inMenuScreen) return;

    // reset stuff
    ctx.resetTransform();
    gamectx.resetTransform();
    gridctx.resetTransform();
    abovectx.resetTransform();
    firectx.resetTransform();
    monsterctx.resetTransform();
    targetctx.resetTransform();
    placeablectx.resetTransform();
    ctx.globalAlpha = 1;
    gamectx.globalAlpha = 1;
    gridctx.globalAlpha = 1;
    abovectx.globalAlpha = 1;
    firectx.globalAlpha = 1;
    monsterctx.globalAlpha = 1;
    targetctx.globalAlpha = 1;
    placeablectx.globalAlpha = 1;

    // frame
    drawFrame();

    // mouse controls + brush
    updateMouseControls();
    drawBrush();

    // update camera
    updateCamera();

    // simulate pixels
    updateTick();

    // fps
    while (frameList[0] + 1000 < millis()) {
        frameList.shift(1);
    }

    // ui
    drawUI();

    // totally nothing
    if (horribleLagMode) {
        let iterations = 0;
        for (let ny = 0; ny < gridSize * 2; ny++) {
            for (let nx = 0; nx < gridSize * 2; nx++) {
                ctx.fillStyle = `rgba(${Math.random() * 64}, ${Math.random() * 64}, ${Math.random() * 64}, ${Math.random() * 0.2})`;
                ctx.fillRect(nx * gridScale / 2, ny * gridScale / 2, gridScale / 2, gridScale / 2);
            }
        }
        function fry() {
            const uri = canvas.toDataURL('image/jpeg', 0.05 + Math.random() * 0.1);
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvasResolution, canvasResolution);
                ctx.drawImage(img, 0, 0);
                if (++iterations < 5) fry();
            }
            img.src = uri;
        };
        fry();
    }

    // set up for next frame
    frameCount++;
    prevMXGrid = mXGrid;
    prevMYGrid = mYGrid;
    prevMX = mX;
    prevMY = mY;
};
function drawFrame() {
    if (!fastSimulation || frameCount % 10 == 0) {
        ctx.clearRect(0, 0, canvasResolution, canvasResolution);
        gamectx.fillStyle = backgroundColor + (255 - fadeEffect).toString(16);
        gamectx.fillRect(0, 0, canvasResolution, canvasResolution);
        if (forceRedraw) {
            gamectx.fillStyle = backgroundColor;
            gamectx.fillRect(0, 0, canvasResolution, canvasResolution);
            gridctx.clearRect(0, 0, canvasResolution, canvasResolution);
            firectx.clearRect(0, 0, canvasResolution, canvasResolution);
            placeablectx.clearRect(0, 0, canvasResolution, canvasResolution);
        }
        abovectx.clearRect(0, 0, canvasResolution, canvasResolution);
        for (let i = 0; i < gridSize; i++) {
            let curr = pixNum.AIR;
            let redrawing = grid[i][0] != lastGrid[i][0];
            let amount = 0;
            for (let j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != curr || (grid[i][j] != lastGrid[i][j]) != redrawing) {
                    let pixelType = numPixels[curr] ?? numPixels[pixNum.MISSING];
                    if (curr != pixNum.AIR && (redrawing || pixelType.alwaysRedraw || (pixelType.animated && !noAnimations) || (pixelType.animatedNoise && !noNoise && !noAnimations) || forceRedraw)) drawPixels(j - amount, i, amount, 1, curr, 1, gridctx);
                    else if (curr == pixNum.AIR && (redrawing || forceRedraw)) clearPixels(j - amount, i, amount, 1, gridctx);
                    curr = grid[i][j];
                    redrawing = grid[i][j] != lastGrid[i][j];
                    amount = 0;
                }
                lastGrid[i][j] = grid[i][j];
            }
            let pixelType = numPixels[curr] ?? numPixels[pixNum.MISSING];
            if (curr != pixNum.AIR && (redrawing || pixelType.alwaysRedraw || (pixelType.animated && !noAnimations) || (pixelType.animatedNoise && !noNoise && !noAnimations) || forceRedraw)) drawPixels(gridSize - amount - 1, i, amount + 1, 1, curr, 1, gridctx);
            else if (curr == pixNum.AIR && (redrawing || forceRedraw)) clearPixels(gridSize - amount - 1, i, amount + 1, 1, gridctx);
        }
        drawBooleanGrid(fireGrid, lastFireGrid, pixNum.FIRE, firectx);
        drawBooleanGrid(monsterGrid, monsterGrid, pixNum.MONSTER, monsterctx);
        drawBooleanGrid(targetGrid, targetGrid, pixNum.TARGET, targetctx);
        drawBooleanGrid(placeableGrid, lastPlaceableGrid, pixNum.PLACEMENTRESTRICTION, placeablectx, true);
        forceRedraw = false;
        // copy layers
        ctx.globalAlpha = 1;
        gamectx.globalAlpha = 1;
        gamectx.drawImage(gridCanvas, 0, 0);
        gamectx.drawImage(above, 0, 0);
        gamectx.drawImage(monster, 0, 0);
        gamectx.drawImage(target, 0, 0);
        gamectx.drawImage(fire, 0, 0);
        ctx.drawImage(gameCanvas, 0, 0);
        if (inResetState || sandboxMode) ctx.drawImage(placeable, 0, 0);
    }
    if (simulationPaused && runTicks <= 0 || (!simulationPaused && !fastSimulation && slowSimulation && frameCount % 6 != 0)) {
        frameList.push(millis());
    }
};
function drawBooleanGrid(grid, lastGrid, type, ctx, invert) {
    if (grid === lastGrid) {
        ctx.clearRect(0, 0, canvasResolution, canvasResolution);
        for (let i = 0; i < gridSize; i++) {
            let pixel = false;
            let amount = 0;
            for (let j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != pixel) {
                    if (pixel ^ invert) drawPixels(j - amount, i, amount, 1, type, 1, ctx);
                    pixel = grid[i][j];
                    amount = 0;
                }
            }
            if (pixel) drawPixels(gridSize - amount - 1, i, amount + 1, 1, type, 1, ctx);
        }
    } else {
        for (let i = 0; i < gridSize; i++) {
            let pixel = false;
            let redrawing = grid[i][0] != lastGrid[i][0];
            let amount = 0;
            for (let j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != pixel || (grid[i][j] != lastGrid[i][j]) != redrawing) {
                    if (pixel ^ invert && (redrawing || forceRedraw)) drawPixels(j - amount, i, amount, 1, type, 1, ctx);
                    else if (!pixel ^ invert && (redrawing || forceRedraw)) clearPixels(j - amount, i, amount, 1, ctx);
                    pixel = grid[i][j];
                    redrawing = grid[i][j] != lastGrid[i][j];
                    amount = 0;
                }
                lastGrid[i][j] = grid[i][j];
            }
            if (pixel ^ invert && (redrawing || forceRedraw)) drawPixels(gridSize - amount - 1, i, amount + 1, 1, type, 1, ctx);
            else if (!pixel ^ invert && (redrawing || forceRedraw)) clearPixels(gridSize - amount - 1, i, amount + 1, 1, ctx);
        }
    }
};
function drawBrush() {
    if (!fastSimulation && !selecting) {
        if (brush.isSelection && selection.grid[0] != undefined) {
            let x1 = Math.min(gridSize, Math.max(0, Math.floor(mXGrid - selection.grid[0].length / 2)));
            let x2 = Math.min(gridSize - 1, Math.max(-1, Math.floor(mXGrid + selection.grid[0].length / 2) - 1));
            let y1 = Math.min(gridSize, Math.max(0, Math.floor(mYGrid - selection.grid.length / 2)));
            let y2 = Math.min(gridSize - 1, Math.max(-1, Math.floor(mYGrid + selection.grid.length / 2) - 1));
            let offsetX = Math.floor(mXGrid - selection.grid[0].length / 2);
            let offsetY = Math.floor(mYGrid - selection.grid.length / 2);
            for (let y = 0; y < selection.grid.length; y++) {
                for (let x = 0; x < selection.grid[y].length; x++) {
                    if (x + offsetX >= 0 && x + offsetX < gridSize && y + offsetY >= 0 && y + offsetY < gridSize) {
                        drawPixels(x + offsetX, y + offsetY, 1, 1, selection.grid[y][x], 0.5, ctx, true);
                    }
                }
            }
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            let scale = gridScale * camera.scale;
            ctx.setLineDash([scale / 2, scale / 2]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.beginPath();
            ctx.strokeRect(x1 * scale - camera.x, y1 * scale - camera.y, (x2 - x1 + 1) * scale, (y2 - y1 + 1) * scale);
            ctx.stroke();
        } else if (brush.lineMode) {
            const clickPixelNum = ((mouseIsPressed && mouseButton == RIGHT) || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId;
            abovectx.clearRect(0, 0, canvasResolution, canvasResolution);
            brushActionLine(brush.lineStartX, brush.lineStartY, mXGrid, mYGrid, (rect) => {
                drawPixels(rect.xmin, rect.ymin, rect.xmax - rect.xmin + 1, rect.ymax - rect.ymin + 1, clickPixelNum, 1, abovectx, true);
            });
            ctx.globalAlpha = 0.5;
            ctx.drawImage(above, 0, 0);
            let rect = calcBrushRectCoordinates(mXGrid, mYGrid);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            let scale = gridScale * camera.scale;
            ctx.setLineDash([]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.globalCompositeOperation = 'difference';
            ctx.beginPath();
            ctx.strokeRect(rect.xmin * scale - camera.x, rect.ymin * scale - camera.y, (rect.xmax - rect.xmin + 1) * scale, (rect.ymax - rect.ymin + 1) * scale);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        } else {
            let rect = calcBrushRectCoordinates(mXGrid, mYGrid)
            drawPixels(rect.xmin, rect.ymin, rect.xmax - rect.xmin + 1, rect.ymax - rect.ymin + 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId, 0.5, ctx, true);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            let scale = gridScale * camera.scale;
            ctx.setLineDash([]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.globalCompositeOperation = 'difference';
            ctx.beginPath();
            ctx.strokeRect(rect.xmin * scale - camera.x, rect.ymin * scale - camera.y, (rect.xmax - rect.xmin + 1) * scale, (rect.ymax - rect.ymin + 1) * scale);
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
        }
    }
    if (selection.show) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        let xmin = Math.min(selection.x1, selection.x2);
        let xmax = Math.max(selection.x1, selection.x2);
        let ymin = Math.min(selection.y1, selection.y2);
        let ymax = Math.max(selection.y1, selection.y2);
        fillPixel(xmin, ymin, xmax - xmin + 1, ymax - ymin + 1, ctx);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        let scale = gridScale * camera.scale;
        ctx.setLineDash([scale / 2, scale / 2]);
        ctx.lineWidth = 2 * camera.scale;
        ctx.beginPath();
        ctx.strokeRect(xmin * scale - camera.x, ymin * scale - camera.y, (xmax - xmin + 1) * scale, (ymax - ymin + 1) * scale);
        ctx.stroke();
    }
};
function updateCamera() {
    if ((!simulationPaused || !fastSimulation) && acceptInputs && !inWinScreen) {
        if (camera.mUp && !camera.mDown) {
            camera.y = Math.max(0, Math.min(camera.y - 20, (canvasResolution * camera.scale) - canvasResolution));
            forceRedraw = true;
        } else if (camera.mDown && !camera.mUp) {
            camera.y = Math.max(0, Math.min(camera.y + 20, (canvasResolution * camera.scale) - canvasResolution));
            forceRedraw = true;
        }
        if (camera.mLeft && !camera.mRight) {
            camera.x = Math.max(0, Math.min(camera.x - 20, (canvasResolution * camera.scale) - canvasResolution));
            forceRedraw = true;
        } else if (camera.mRight && !camera.mLeft) {
            camera.x = Math.max(0, Math.min(camera.x + 20, (canvasResolution * camera.scale) - canvasResolution));
            forceRedraw = true;
        }
        if (forceRedraw) {
            let scale = gridSize / canvasSize / camera.scale / canvasScale;
            mXGrid = Math.floor((mX + camera.x) * scale);
            mYGrid = Math.floor((mY + camera.y) * scale);
        }
    }
};
function drawUI() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Source Code Pro';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    if (debugInfo) {
        if (simulationPaused && fastSimulation) ctx.fillStyle = '#FFF';
        else ctx.fillStyle = '#0000004B';
        ctx.fillRect(5, 41, 200, 100);
        ctx.fillStyle = '#000';
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(5 + i * 2, 141 - fpsList[i], 2, fpsList[i]);
        }
        ctx.fillText('Last 10 seconds:', 10, 42);
    }
    let fpsText = `FPS: ${frameList.length}`;
    let tickText = `Tick: ${ticks}`;
    let brushSizeText = `Brush Size: ${(brush.isSelection && selection.grid[0] != undefined) ? '-' : brush.size * 2 - 1}`;
    let brushPixelText = (brush.isSelection && selection.grid[0] != undefined) ? `Brush: Paste` : `Brush Pixel: ${(pixels[brush.pixel] ?? numPixels[pixNum.MISSING]).name}`;
    let zoomText = `Zoom: ${Math.round(camera.scale * 10) / 10}`;
    ctx.fillStyle = '#FFF5';
    ctx.fillRect(1, 0, ctx.measureText(fpsText).width + 4, 20);
    ctx.fillRect(1, 21, ctx.measureText(tickText).width + 4, 20);
    ctx.fillRect(canvasResolution - ctx.measureText(brushSizeText).width - 4, 0, ctx.measureText(brushSizeText).width + 2, 20);
    ctx.fillRect(canvasResolution - ctx.measureText(brushPixelText).width - 4, 21, ctx.measureText(brushPixelText).width + 2, 20);
    ctx.fillRect(canvasResolution - ctx.measureText(zoomText).width - 4, 42, ctx.measureText(zoomText).width + 2, 20);
    ctx.fillStyle = '#000';
    ctx.fillText(fpsText, 3, 1);
    ctx.fillText(tickText, 3, 22);
    while (lastFpsList + 100 < millis()) {
        lastFpsList += 100;
        fpsList.push(frameList.length);
        while (fpsList.length > 100) {
            fpsList.shift(1);
        }
    }
    ctx.textAlign = 'right';
    ctx.fillText(brushSizeText, canvasResolution - 3, 1);
    ctx.fillText(brushPixelText, canvasResolution - 3, 22);
    ctx.fillText(zoomText, canvasResolution - 3, 43);
    if (fastSimulation) {
        ctx.font = '60px Source Code Pro';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SIMULATING...', canvasResolution / 2, canvasResolution / 2);
    } else if (simulationPaused) {
        ctx.fillStyle = '#FFF5';
        ctx.fillRect(canvasResolution - 84, 63, 82, 20);
        ctx.fillStyle = '#000';
        ctx.fillText('PAUSED', canvasResolution - 3, 64);
    } else if (slowSimulation) {
        ctx.fillStyle = '#FFF5';
        ctx.fillRect(canvasResolution - 124, 63, 122, 20);
        ctx.fillStyle = '#000';
        ctx.fillText('SLOWMODE', canvasResolution - 3, 64);
    }
};
function updateTick() {
    if ((!simulationPaused && (!slowSimulation || fastSimulation)) || runTicks > 0 || (!simulationPaused && !fastSimulation && slowSimulation && frameCount % 6 == 0)) {
        runTicks = 0; // lol
        let max = fastSimulation ? 10 : 1;
        for (let i = 0; i < max; i++) {
            /*
            update priority:
            -: fire
            0: nukes, plants, sponges, gunpowder, and lasers
            1, 2, 3, 4: pistons
            5, 6, 7, 8: cloners
            9: gravity solids
            10: steam
            11: fluids, concrete, and leaves
            12: pumps
            13: lag, music
            14: rotators
            -: monster
            */
            randomSeed((ticks % 65536) * 239);
            let monsterCount = 0;
            let fulfilledTargetCount = 0;
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (monsterGrid[y][x]) {
                        grid[y][x] = pixNum.MONSTER;
                        monsterCount++;
                    }
                    if (targetGrid[y][x] && grid[y][x] == pixNum.GOAL) fulfilledTargetCount++;
                }
            }
            let firePixelType = numPixels[pixNum.FIRE];
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (fireGrid[y][x]) firePixelType.update(x, y);
                }
            }
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (grid[y][x] == pixNum.MONSTER) grid[y][x] = pixNum.AIR;
                    if (nextFireGrid[y][x] != null) {
                        fireGrid[y][x] = nextFireGrid[y][x];
                        nextFireGrid[y][x] = null;
                    }
                    lastMusicGrid[y][x] = musicGrid[y][x];
                    musicGrid[y][x] = 0;
                }
            }
            let currentExplosions = pendingExplosions;
            pendingExplosions = [];
            for (let explosion of currentExplosions) {
                explode(...explosion);
            }
            for (let updateStage = 0; updateStage <= 14; updateStage++) {
                if (ticks % 2 == 0) {
                    for (let y = 0; y < gridSize; y++) {
                        for (let x = gridSize - 1; x >= 0; x--) {
                            updatePixel(x, y, updateStage);
                        }
                    }
                } else {
                    for (let y = 0; y < gridSize; y++) {
                        for (let x = 0; x < gridSize; x++) {
                            updatePixel(x, y, updateStage);
                        }
                    }
                }
                for (let y = 0; y < gridSize; y++) {
                    for (let x = 0; x < gridSize; x++) {
                        if (nextGrid[y][x] != null) {
                            grid[y][x] = nextGrid[y][x];
                            nextGrid[y][x] = null;
                        }
                    }
                }
            }
            let monsterPixelType = numPixels[pixNum.MONSTER];
            for (let y = gridSize - 1; y >= 0; y--) {
                for (let x = 0; x < gridSize; x++) {
                    if (monsterGrid[y][x]) monsterPixelType.update(x, y);
                }
            }
            let newMonsterCount = 0;
            let newFulfilledTargetCount = 0;
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (monsterGrid[y][x]) newMonsterCount++;
                    if (targetGrid[y][x] && grid[y][x] == pixNum.GOAL) newFulfilledTargetCount++;
                    if (musicGrid[y][x] != lastMusicGrid[y][x]) {
                        if (musicGrid[y][x] != 0) musicPixel(musicGrid[y][x], true);
                        else if (musicGrid[y][x] == 0) musicPixel(lastMusicGrid[y][x], false);
                    }
                }
            }
            if (newMonsterCount != monsterCount && window.playMonsterDeathSound != undefined) window.playMonsterDeathSound();
            if (newFulfilledTargetCount != fulfilledTargetCount && window.playTargetFillSound != undefined) window.playTargetFillSound();
            frameList.push(millis());
            ticks++;
        }
        inResetState = false;

        // check win
        let hasMonsters = false;
        let hasUnfulfilledTargets = false;
        search: for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (monsterGrid[y][x]) hasMonsters = true;
                if (targetGrid[y][x] && grid[y][x] != pixNum.GOAL) hasUnfulfilledTargets = true;
                if (hasMonsters && hasUnfulfilledTargets) break search;
            }
        }
        if (!hasMonsters && !hasUnfulfilledTargets && !sandboxMode) triggerWin();
    }
};

// brush
function calcBrushRectCoordinates(x, y) {
    return {
        xmin: Math.max(0, Math.min(x - brush.size + 1, gridSize)),
        xmax: Math.max(-1, Math.min(x + brush.size - 1, gridSize - 1)),
        ymin: Math.max(0, Math.min(y - brush.size + 1, gridSize)),
        ymax: Math.max(-1, Math.min(y + brush.size - 1, gridSize - 1))
    };
};
function updateMouseControls() {
    if ((mouseIsPressed && mouseButton == RIGHT) || removing) brush.isSelection = false;
    if (!fastSimulation && acceptInputs && !inWinScreen && mouseOver) {
        if (((mouseIsPressed && holdingAlt) || brush.lineMode) && !(brush.isSelection && selection.grid[0] != undefined && sandboxMode)) {
            if (!brush.lineMode) {
                brush.lineMode = true;
                brush.lineStartX = mXGrid;
                brush.lineStartY = mYGrid;
            }
            if (!mouseIsPressed) {
                brush.lineMode = false;
                clickLine(brush.lineStartX, brush.lineStartY, mXGrid, mYGrid, mouseButton == RIGHT || removing);
            }
        } else if (mouseIsPressed) {
            brush.lineMode = false;
            if (brush.isSelection && selection.grid[0] != undefined && sandboxMode) {
                let offsetX = Math.floor(mXGrid - selection.grid[0].length / 2);
                let offsetY = Math.floor(mYGrid - selection.grid.length / 2);
                for (let y = 0; y < selection.grid.length; y++) {
                    if (y + offsetY >= 0 && y + offsetY < gridSize) for (let x = 0; x < selection.grid[y].length; x++) {
                        if (x + offsetX >= 0 && x + offsetX < gridSize && selection.grid[y][x] != pixNum.AIR) {
                            grid[y + offsetY][x + offsetX] = selection.grid[y][x];
                            if (musicGrid[y + offsetY][x + offsetX]) {
                                musicPixel(musicGrid[y + offsetY][x + offsetX], false);
                                musicGrid[y + offsetY][x + offsetX] = 0;
                            }
                        }
                    }
                }
            } else if (mouseButton == CENTER) {
                if (holdingControl) {
                    camera.x = Math.max(0, Math.min(camera.x + prevMX - mX, (canvasResolution * camera.scale) - canvasResolution));
                    camera.y = Math.max(0, Math.min(camera.y + prevMY - mY, (canvasResolution * camera.scale) - canvasResolution));
                    forceRedraw = true;
                } else if (numPixels[grid[mYGrid][mXGrid]].pickable && pixelSelectors[numPixels[grid[mYGrid][mXGrid]].id].box.style.display != 'none') {
                    pixelSelectors[numPixels[grid[mYGrid][mXGrid]].id].box.onclick();
                }
            } else if (mouseButton == LEFT && holdingControl && sandboxMode) {
                if (!selecting) {
                    selecting = true;
                    selection.x1 = mXGrid;
                    selection.y1 = mYGrid;
                    selection.show = true;
                }
                selection.x2 = mXGrid;
                selection.y2 = mYGrid;
            } else {
                clickLine(prevMXGrid, prevMYGrid, mXGrid, mYGrid, mouseButton == RIGHT || removing);
            }
        }
    } else if (!mouseIsPressed && brush.lineMode && !(brush.isSelection && selection.grid[0] != undefined && sandboxMode)) {
        brush.lineMode = false;
        clickLine(brush.lineStartX, brush.lineStartY, mXGrid, mYGrid, mouseButton == RIGHT || removing);
    }
    if (!mouseIsPressed || mouseButton != LEFT) selecting = false;
};
function brushActionLine(x1, y1, x2, y2, cb) {
    let slope = (y2 - y1) / (x2 - x1);
    if (!isFinite(slope)) {
        cb({
            xmin: Math.max(0, Math.min(x1 - brush.size + 1, gridSize - 1)),
            xmax: Math.max(0, Math.min(x1 + brush.size - 1, gridSize - 1)),
            ymin: Math.max(0, Math.min(Math.min(y2, y1) - brush.size + 1, gridSize - 1)),
            ymax: Math.max(0, Math.min(Math.max(y2, y1) + brush.size - 1, gridSize - 1))
        });
    } else if (slope == 0) {
        cb({
            xmin: Math.max(0, Math.min(Math.min(x2, x1) - brush.size + 1, gridSize - 1)),
            xmax: Math.max(0, Math.min(Math.max(x2, x1) + brush.size - 1, gridSize - 1)),
            ymin: Math.max(0, Math.min(y1 - brush.size + 1, gridSize - 1)),
            ymax: Math.max(0, Math.min(y1 + brush.size - 1, gridSize - 1))
        });
    } else if (Math.abs(slope) > 1) {
        slope = 1 / slope;
        let min = y2 < y1 ? x2 : x1;
        let start = Math.min(y2, y1);
        let end = Math.max(y2, y1);
        for (let y = start; y <= end; y++) {
            let x = Math.round(slope * (y - start)) + min;
            cb(calcBrushRectCoordinates(x, y));
        }
    } else {
        let min = x2 < x1 ? y2 : y1;
        let start = Math.min(x2, x1);
        let end = Math.max(x2, x1);
        for (let x = start; x <= end; x++) {
            let y = Math.round(slope * (x - start)) + min;
            cb(calcBrushRectCoordinates(x, y));
        }
    }
};
function clickLine(x1, y1, x2, y2, remove) {
    if (!sandboxMode && !inResetState) return;
    let modifiedPixelCounts = [];
    let clickPixelNum = pixels[brush.pixel].numId;
    let skipToEnd = false;
    brushActionLine(x1, y1, x2, y2, (rect) => {
        if (skipToEnd) return;
        function act(cb) {
            for (let k = rect.ymin; k <= rect.ymax; k++) {
                for (let j = rect.xmin; j <= rect.xmax; j++) {
                    if (cb(j, k)) return true;
                }
            }
            return false;
        };
        if (remove) {
            if (sandboxMode) {
                act(function (x, y) {
                    grid[y][x] = pixNum.AIR;
                    fireGrid[y][x] = false;
                    monsterGrid[y][x] = false;
                    targetGrid[y][x] = false;
                    if (musicGrid[y][x]) {
                        musicPixel(musicGrid[y][x], false);
                        musicGrid[y][x] = 0;
                    }
                });
            } else {
                act(function (x, y) {
                    if (placeableGrid[y][x] && grid[y][x] != pixNum.DELETER) {
                        pixelAmounts[numPixels[grid[y][x]].id]++;
                        modifiedPixelCounts[grid[y][x]] = true;
                        grid[y][x] = pixNum.AIR;
                        if (fireGrid[y][x]) {
                            pixelAmounts['fire']++;
                            modifiedPixelCounts[pixNum.FIRE] = true;
                            fireGrid[y][x] = false;
                        }
                        if (musicGrid[y][x]) {
                            musicPixel(musicGrid[y][x], false);
                            musicGrid[y][x] = 0;
                        }
                    }
                });
            }
        } else if (brush.pixel == 'fire') {
            if (sandboxMode) act(function (x, y) {
                fireGrid[y][x] = true;
            });
            else act(function (x, y) {
                if (placeableGrid[y][x] && grid[y][x] != pixNum.DELETER) {
                    fireGrid[y][x] = true;
                    pixelAmounts[brush.pixel]--;
                }
                return pixelAmounts[brush.pixel] <= 0;
            });
        } else if (brush.pixel == 'placementRestriction') {
            if (sandboxMode) act(function (x, y) {
                placeableGrid[y][x] = false;
            })
        } else if (brush.pixel == 'placementUnRestriction') {
            if (sandboxMode) act(function (x, y) {
                placeableGrid[y][x] = true;
            })
        } else if (brush.pixel == 'monster') {
            if (sandboxMode) act(function (x, y) {
                monsterGrid[y][x] = true;
            });
        } else if (brush.pixel == 'target') {
            if (sandboxMode) act(function (x, y) {
                targetGrid[y][x] = true;
            });
        } else {
            if (sandboxMode) {
                act(function (x, y) {
                    grid[y][x] = clickPixelNum;
                    if (musicGrid[y][x]) {
                        musicPixel(musicGrid[y][x], false);
                        musicGrid[y][x] = 0;
                    }
                    if (clickPixelNum >= pixNum.MUSIC_1 && clickPixelNum <= pixNum.MUSIC_86) musicGrid[y][x] = -1;
                });
            } else {
                modifiedPixelCounts[clickPixelNum] = true;
                if (pixelAmounts[brush.pixel] <= 0) skipToEnd = true;
                else if (act(function (x, y) {
                    if (placeableGrid[y][x] && grid[y][x] != pixNum.DELETER) {
                        modifiedPixelCounts[grid[y][x]] = true;
                        pixelAmounts[numPixels[grid[y][x]].id]++;
                        grid[y][x] = clickPixelNum;
                        if (musicGrid[y][x]) {
                            musicPixel(musicGrid[y][x], false);
                            musicGrid[y][x] = 0;
                        }
                        pixelAmounts[brush.pixel]--;
                        if (clickPixelNum >= pixNum.MUSIC_1 && clickPixelNum <= pixNum.MUSIC_86) musicGrid[y][x] = -1;
                    }
                    return pixelAmounts[brush.pixel] <= 0;
                })) skipToEnd = true;
            }
        }
    });
    for (let pixelType in modifiedPixelCounts) {
        if (pixelType != pixNum.AIR) updatePixelAmount(numPixels[pixelType].id);
    }
    if (!sandboxMode) {
        saveCode = generateSaveCode();
        window.localStorage.setItem(`challenge-${currentPuzzleId}`, JSON.stringify({
            code: saveCode,
            pixels: pixelAmounts
        }));
        saveCodeText.value = saveCode;
    }
};

// inputs
window.addEventListener('DOMContentLoaded', (e) => {
    document.onkeydown = (e) => {
        if (e.target.matches('button') || e.key == 'Tab') {
            e.preventDefault();
            e.target.blur();
        }
        if (e.target.matches('input') || e.target.matches('textarea') || !acceptInputs || inWinScreen || inMenuScreen) return;
        const key = e.key.toLowerCase();
        for (let i in pixels) {
            if (pixels[i].key == key) {
                brush.pixel = i;
                pixelSelectors[brush.pixel].box.click();
            }
        }
        if (key == 'arrowup') {
            if (!brush.isSelection) {
                let bsize = brush.size;
                brush.size = Math.min(Math.ceil(gridSize / 2 + 1), brush.size + 1);
                if (brush.size != bsize) tickSound();
            }
        } else if (key == 'arrowdown') {
            if (!brush.isSelection) {
                let bsize = brush.size;
                brush.size = Math.max(1, brush.size - 1);
                if (brush.size != bsize) tickSound();
            }
        } else if (sandboxMode && key == 'x' && e.ctrlKey) {
            if (selection.show) {
                selection.grid = [];
                let xmin = Math.min(selection.x1, selection.x2);
                let xmax = Math.max(selection.x1, selection.x2);
                let ymin = Math.min(selection.y1, selection.y2);
                let ymax = Math.max(selection.y1, selection.y2);
                for (let y = ymin; y <= ymax; y++) {
                    selection.grid[y - ymin] = [];
                    for (let x = xmin; x <= xmax; x++) {
                        selection.grid[y - ymin][x - xmin] = grid[y][x];
                        grid[y][x] = pixNum.AIR;
                    }
                }
                selection.show = false;
                localStorage.setItem('clipboard', JSON.stringify(selection.grid));
            }
        } else if (sandboxMode && key == 'backspace') {
            if (selection.show) {
                let xmin = Math.min(selection.x1, selection.x2);
                let xmax = Math.max(selection.x1, selection.x2);
                let ymin = Math.min(selection.y1, selection.y2);
                let ymax = Math.max(selection.y1, selection.y2);
                for (let y = ymin; y <= ymax; y++) {
                    for (let x = xmin; x <= xmax; x++) {
                        grid[y][x] = pixNum.AIR;
                    }
                }
                selection.show = false;
            }
        } else if (sandboxMode && key == 'c' && e.ctrlKey) {
            if (selection.show) {
                selection.grid = [];
                let xmin = Math.min(selection.x1, selection.x2);
                let xmax = Math.max(selection.x1, selection.x2);
                let ymin = Math.min(selection.y1, selection.y2);
                let ymax = Math.max(selection.y1, selection.y2);
                for (let y = ymin; y <= ymax; y++) {
                    selection.grid[y - ymin] = [];
                    for (let x = xmin; x <= xmax; x++) {
                        selection.grid[y - ymin][x - xmin] = grid[y][x];
                    }
                }
                selection.show = false;
                localStorage.setItem('clipboard', JSON.stringify(selection.grid));
            }
        } else if (sandboxMode && key == 'v' && e.ctrlKey) {
            if (localStorage.getItem('clipboard') != undefined) {
                selection.grid = JSON.parse(localStorage.getItem('clipboard'));
                brush.isSelection = true;
            }
        } else if (key == 'enter') {
            if (simulationPaused) {
                runTicks = 1;
                tickSound();
            }
        } else if (key == 'w') {
            camera.mUp = true;
        } else if (key == 's') {
            camera.mDown = true;
        } else if (key == 'a') {
            camera.mLeft = true;
        } else if (key == 'd') {
            camera.mRight = true;
        } else if (key == 'i') {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation != undefined) pixelSelectors[numPixels[pixType.numId - pixType.rotation + 1].id].box.click();
        } else if (key == 'k') {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation != undefined) pixelSelectors[numPixels[(3 % possibleRotations(pixType.numId)) + pixType.numId - pixType.rotation].id].box.click();
        } else if (key == 'j') {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation != undefined) pixelSelectors[numPixels[pixType.numId - pixType.rotation].id].box.click();
        } else if (key == 'l') {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation != undefined) pixelSelectors[numPixels[(2 % possibleRotations(pixType.numId)) + pixType.numId - pixType.rotation].id].box.click();
        } else if (key == 'r') {
            if (!brush.isSelection || selection.grid[0] == undefined) return;
            const newGrid = [];
            for (let i = 0; i < selection.grid[0].length; i++) {
                newGrid[i] = [];
            }
            for (let i = 0; i < selection.grid.length; i++) {
                for (let j = 0; j < selection.grid[i].length; j++) {
                    let newPixel = selection.grid[i][j]
                    let pixType = numPixels[selection.grid[i][j]] ?? numPixels[pixNum.MISSING];
                    if (pixType.rotation != undefined) {
                        let rotations = possibleRotations(grid[y][x]);
                        newPixel = selection.grid[i][j] - pixType.rotation + ((((pixType.rotation + 1) % rotations) + rotations) % rotations);
                    }
                    newGrid[j][selection.grid.length - i - 1] = newPixel;
                }
            }
            selection.grid = newGrid;
            localStorage.setItem('clipboard', JSON.stringify(selection.grid));
        } else if (sandboxMode && key == 'n') {
            for (let i = 0; i < gridSize; i += 5) {
                for (let j = 0; j < gridSize; j += 5) {
                    grid[j][i] = pixNum.VERY_HUGE_NUKE;
                }
            }
        } else if (key == 'shift') {
            removing = true;
        } else if (key == 'control') {
            holdingControl = true;
        } else if (key == 'alt') {
            holdingAlt = true;
        }
        if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11' && key != '=' && key != '-') e.preventDefault();
    };
    document.onkeyup = (e) => {
        if (e.target.matches('#saveCode') || !acceptInputs || inWinScreen || inMenuScreen) return;
        const key = e.key.toLowerCase();
        if (key == 'z' && e.altKey) {
            debugInfo = !debugInfo;
            clickSound();
        } else if (key == 'w') {
            camera.mUp = false;
        } else if (key == 's') {
            camera.mDown = false;
        } else if (key == 'a') {
            camera.mLeft = false;
        } else if (key == 'd') {
            camera.mRight = false;
        } else if (key == 'p') {
            simulationPaused = !simulationPaused;
            fastSimulation = false;
            updateTimeControlButtons();
            clickSound();
        } else if (key == '[' && mouseOver) {
            let cScale = camera.scale;
            let percentX = (mX + camera.x) / (canvasSize * camera.scale);
            let percentY = (mY + camera.y) / (canvasSize * camera.scale);
            camera.scale = Math.max(1, Math.min(Math.round(camera.scale * 0.5), 8));
            camera.x = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentX) - mX, (canvasResolution * camera.scale) - canvasResolution));
            camera.y = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentY) - mY, (canvasResolution * camera.scale) - canvasResolution));
            forceRedraw = true;
            if (camera.scale != cScale) tickSound();
            let scale = gridSize / canvasSize / camera.scale / canvasScale;
            mXGrid = Math.floor((mX + camera.x) * scale);
            mYGrid = Math.floor((mY + camera.y) * scale);
            mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;
        } else if (key == ']' && mouseOver) {
            let cScale = camera.scale;
            let percentX = (mX + camera.x) / (canvasSize * camera.scale);
            let percentY = (mY + camera.y) / (canvasSize * camera.scale);
            camera.scale = Math.max(1, Math.min(Math.round(camera.scale * 2), 8));
            camera.x = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentX) - mX, (canvasResolution * camera.scale) - canvasResolution));
            camera.y = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentY) - mY, (canvasResolution * camera.scale) - canvasResolution));
            forceRedraw = true;
            if (camera.scale != cScale) tickSound();
            let scale = gridSize / canvasSize / camera.scale / canvasScale;
            mXGrid = Math.floor((mX + camera.x) * scale);
            mYGrid = Math.floor((mY + camera.y) * scale);
            mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;
        } else if (key == 'shift') {
            removing = false;
        } else if (key == 'control') {
            holdingControl = false;
        } else if (key == 'alt') {
            holdingAlt = false;
        } else if (key == 'escape') {
            brush.isSelection = false;
            selection.show = false;
        }
        e.preventDefault();
    };
    document.onmousemove = (e) => {
        mX = Math.round((e.pageX - 10) * canvasScale);
        mY = Math.round((e.pageY - 10) * canvasScale);
        let scale = gridSize / canvasSize / camera.scale / canvasScale;
        mXGrid = Math.floor((mX + camera.x) * scale);
        mYGrid = Math.floor((mY + camera.y) * scale);
        mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;
    };
    document.addEventListener('wheel', (e) => {
        if (mouseOver && !inMenuScreen) {
            if (holdingControl) {
                let cScale = camera.scale;
                let percentX = (mX + camera.x) / (canvasSize * camera.scale);
                let percentY = (mY + camera.y) / (canvasSize * camera.scale);
                camera.scale = Math.max(1, Math.min(Math.round(camera.scale * ((Math.abs(e.deltaY) > 10) ? (e.deltaY < 0 ? 2 : 0.5) : 1)), 8));
                camera.x = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentX) - mX, (canvasResolution * camera.scale) - canvasResolution));
                camera.y = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentY) - mY, (canvasResolution * camera.scale) - canvasResolution));
                forceRedraw = true;
                document.onmousemove(e);
                if (camera.scale != cScale) tickSound();
            } else if (!brush.isSelection) {
                let bsize = brush.size;
                if (e.deltaY > 0) {
                    brush.size = Math.max(1, brush.size - 1);
                } else {
                    brush.size = Math.min(Math.ceil(gridSize / 2 + 1), brush.size + 1);
                }
                if (brush.size != bsize) tickSound();
            }
        }
        if (holdingControl) { e.preventDefault(); }
    }, { passive: false });
    hasFocus = false;
    setInterval(() => {
        window.requestIdleCallback(() => {
            if (hasFocus && !document.hasFocus()) {
                camera.mUp = false;
                camera.mDown = false;
                camera.mLeft = false;
                camera.mRight = false;
                holdingControl = false;
                holdingAlt = false;
                removing = false;
                brush.lineMode = false;
            }
            hasFocus = document.hasFocus();
        }, { timeout: 100 });
    }, 200);
});

// game control buttons
const pauseButton = document.getElementById('pause');
const simulateSlowButton = document.getElementById('simulateSlow');
const fastSimulationButton = document.getElementById('fastSimulation');
const advanceTickButton = document.getElementById('advanceTick');
function updateTimeControlButtons() {
    if (simulationPaused) {
        pauseButton.style.backgroundColor = 'red';
        pauseButton.style.backgroundImage = 'url(/assets/play.svg)';
        pauseButton.style.fontSize = '20px';
        fastSimulationButton.style.backgroundColor = 'grey';
        fastSimulationButton.style.cursor = 'not-allowed';
        advanceTickButton.style.backgroundColor = 'lightgray';
        advanceTickButton.style.cursor = '';
        pauseMusicPixels();
    } else {
        pauseButton.style.backgroundColor = 'lime';
        pauseButton.style.backgroundImage = 'url(/assets/pause.svg)';
        pauseButton.style.fontSize = '';
        if (fastSimulation) {
            fastSimulationButton.style.backgroundColor = 'lime';
            advanceTickButton.style.backgroundColor = 'grey';
            advanceTickButton.style.cursor = 'not-allowed';
        } else {
            fastSimulationButton.style.backgroundColor = 'red';
            advanceTickButton.style.backgroundColor = 'lightgray';
            advanceTickButton.style.cursor = '';
        }
        fastSimulationButton.style.cursor = '';
        advanceTickButton.style.backgroundColor = 'grey';
        advanceTickButton.style.cursor = 'not-allowed';
        resumeMusicPixels();
    }
};
document.getElementById('sizeUp').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    if (!brush.isSelection) brush.size = Math.min(Math.ceil(gridSize / 2 + 1), brush.size + 1);
};
document.getElementById('sizeDown').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    if (!brush.isSelection) brush.size = Math.max(1, brush.size - 1);
};
pauseButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = !simulationPaused;
    fastSimulation = false;
    updateTimeControlButtons();
};
simulateSlowButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    slowSimulation = !slowSimulation;
};
fastSimulationButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    if (!simulationPaused) fastSimulation = !fastSimulation;
    updateTimeControlButtons();
};
advanceTickButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    if (simulationPaused) runTicks = 1;
};
// save code inputs
let writeSaveTimeout = setTimeout(() => { });
saveCodeText.oninput = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    let index = saveCodeText.value.indexOf(';');
    if (index > 0) {
        gridSizeText.value = saveCodeText.value.substring(0, index);
    }
    saveCode = saveCodeText.value.replace('\n', '');
    clearTimeout(writeSaveTimeout);
    writeSaveTimeout = setTimeout(() => {
        if (sandboxMode) {
            window.localStorage.setItem('saveCodeText', saveCode);
        }
    }, 1000);
};
document.getElementById('generateSave').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    saveCode = generateSaveCode();
    saveCodeText.value = saveCode;
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', saveCode);
        window.localStorage.setItem('saveCodeText', saveCode);
    }
};
document.getElementById('uploadSave').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.redpixel';
    input.click();
    input.oninput = (e) => {
        let files = input.files;
        if (files.length == 0) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (await modal('Load save?', 'Your current red simulation will be overwritten!', true)) {
                saveCode = e.target.result;
                saveCodeText.value = saveCode;
                loadSaveCode();
            }
        };
        reader.readAsText(files[0]);
    };
};
document.getElementById('downloadSave').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    saveCode = saveCodeText.value;
    const encoded = `data:text/redpixel;base64,${window.btoa(saveCode)}`;
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `red-pixel-simulator_${Math.ceil(Math.random() * 1000)}.redpixel`;
    a.click();
};
document.getElementById('reset').onclick = async (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (await modal('Reset?', 'Your current red simulation will be overwritten!', true)) {
        saveCode = saveCodeText.value.replace('\n', '');
        loadSaveCode();
        inResetState = true;
    }
};
document.getElementById('restart').onclick = async (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (await modal('Restart?', 'Your solution will be removed!', true)) {
        window.localStorage.removeItem(`challenge-${currentPuzzleId}`);
        loadPuzzle(currentPuzzleSection, currentPuzzleLevel);
    }
};
gridSizeText.oninput = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    gridSizeText.value = Math.max(1, Math.min(parseInt(gridSizeText.value.replace('e', '')), 500));
    if (gridSizeText.value != '') saveCode = gridSizeText.value + saveCode.substring(saveCode.indexOf(';'));
    saveCodeText.value = saveCode;
};
// settings
const noNoiseButton = document.getElementById('noNoise');
const noAnimationsButton = document.getElementById('noAnimation');
const fadeEffectButton = document.getElementById('fadeEffect');
noNoiseButton.onclick = (e) => {
    noNoise = !noNoise;
    if (noNoise) noNoiseButton.style.backgroundColor = 'lime';
    else noNoiseButton.style.backgroundColor = 'red';
    forceRedraw = true;
};
noAnimationsButton.onclick = (e) => {
    noAnimations = !noAnimations;
    if (!noAnimations) noAnimationsButton.style.backgroundColor = 'lime';
    else noAnimationsButton.style.backgroundColor = 'red';
    forceRedraw = true;
};
fadeEffectButton.onclick = (e) => {
    fadeEffect = fadeEffect ? 0 : 127;
    if (fadeEffect) fadeEffectButton.style.backgroundColor = 'lime';
    else fadeEffectButton.style.backgroundColor = 'red';
};
document.getElementById('changeResolution').onclick = (e) => {
    let newRes = window.prompt('Enter new resolution: ', canvasResolution);
    if (parseInt(newRes).toString() == newRes && parseInt(newRes) > 0) {
        window.localStorage.setItem('resolution', newRes);
        window.location.reload();
    }
};
// menu
document.getElementById('backToMenu').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    stopAllMusicPixels();
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', generateSaveCode());
        window.localStorage.setItem('saveCodeText', saveCodeText.value);
    }
    transitionToMenu();
};

// audio
const audioContext = new (window.AudioContext ?? window.webkitAudioContext ?? Error)();
const globalVolume = audioContext.createGain();
globalVolume.connect(audioContext.destination);
function setAudio(file, cb) {
    const request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) audioContext.decodeAudioData(request.response, cb);
    };
    request.send();
};
const musicBuffers = new Map();
const activeMusic = [];
let musicMuted = (window.localStorage.getItem('musicMuted') ?? false) == 1;
const menuMuteButton = document.getElementById('menuMuteButton');
const musicVolume = audioContext.createGain();
musicVolume.connect(globalVolume);
function playMusic(id) {
    stopAllMusic();
    if (musicBuffers.has(id)) {
        const gain = audioContext.createGain();
        const source = audioContext.createBufferSource();
        activeMusic.push({
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
function stopAllMusic() {
    for (const music of activeMusic) {
        music.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        setTimeout(() => music.source.stop(), 1000);
    }
};
function toggleMusic() {
    musicMuted = !musicMuted;
    if (musicMuted) {
        musicVolume.gain.setValueAtTime(0, audioContext.currentTime);
        menuMuteButton.style.backgroundImage = 'url(/assets/volumeMuted.svg';
    } else {
        musicVolume.gain.setValueAtTime(1, audioContext.currentTime);
        menuMuteButton.style.backgroundImage = 'url(/assets/volumeUnmuted.svg';
    }
    window.localStorage.setItem('musicMuted', musicMuted ? 1 : 0);
};
menuMuteButton.onclick = toggleMusic;
const musicPixelSounds = new Map();
const musicPixelOscillators = new Map();
async function addMusicPixelSound(id) {
    setAudio(`./assets/musicpixels/music-${id}.mp3`, (buf) => {
        const preloadQueue = [];
        for (let i = 0; i < 5; i++) {
            preloadQueue.unshift(audioContext.createBufferSource());
            preloadQueue[0].buffer = buf;
            preloadQueue[0].connect(globalVolume);
        }
        musicPixelSounds.set(id, function play() {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
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
window.addEventListener('load', (e) => {
    setAudio('./assets/click.mp3', (buf) => {
        const preloadQueue = [];
        preloadQueue.push(audioContext.createBufferSource());
        preloadQueue[0].buffer = buf;
        preloadQueue[0].connect(globalVolume);
        window.playClickSound = () => {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
        };
        document.querySelectorAll('.bclick').forEach(e => e.addEventListener('click', window.playClickSound));
        document.querySelectorAll('.pickerPixel').forEach(e => e.addEventListener('click', window.playClickSound));
        document.querySelectorAll('.levelButton').forEach(e => e.addEventListener('click', window.playClickSound));
    });
    setAudio('./assets/tick.mp3', (buf) => {
        const preloadQueue = [];
        preloadQueue.push(audioContext.createBufferSource());
        preloadQueue[0].buffer = buf;
        preloadQueue[0].connect(globalVolume);
        window.playTickSound = () => {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
        };
        document.querySelectorAll('.btick').forEach(e => e.addEventListener('click', window.playTickSound));
        document.querySelectorAll('.pickerPixel').forEach(e => e.firstChild.addEventListener('mouseover', window.playTickSound));
    });
    setAudio('./assets/monsterDeath.mp3', (buf) => {
        const preloadQueue = [];
        preloadQueue.push(audioContext.createBufferSource());
        preloadQueue[0].buffer = buf;
        preloadQueue[0].connect(globalVolume);
        window.playMonsterDeathSound = () => {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
        };
    });
    setAudio('./assets/targetFilled.mp3', (buf) => {
        const preloadQueue = [];
        preloadQueue.push(audioContext.createBufferSource());
        preloadQueue[0].buffer = buf;
        preloadQueue[0].connect(globalVolume);
        window.playTargetFillSound = () => {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
        };
    });
    setAudio('./assets/win.mp3', (buf) => {
        const preloadQueue = [];
        preloadQueue.push(audioContext.createBufferSource());
        preloadQueue[0].buffer = buf;
        preloadQueue[0].connect(globalVolume);
        window.playWinSound = () => {
            preloadQueue.shift().start();
            const nextSource = audioContext.createBufferSource();
            nextSource.buffer = buf;
            nextSource.connect(globalVolume);
            preloadQueue.push(nextSource);
        };
    });
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
    toggleMusic();
    toggleMusic();
});
function tickSound() {
    if (window.playTickSound) window.playTickSound();
};
function clickSound() {
    if (window.playClickSound) window.playClickSound();
};
function musicPixel(id, state) {
    if (musicPixelSounds.has(id)) {
        if (state) musicPixelSounds.get(id)();
    } else if (musicPixelOscillators.has(id)) {
        if (state) musicPixelOscillators.get(id).increment();
        else musicPixelOscillators.get(id).decrement();
    }
};
let waitForInteraction = setInterval(() => {
    if (navigator.userActivation.hasBeenActive) {
        audioContext.resume();
        if (inMenuScreen && !playMusic('menu')) setTimeout(function wait() {
            if (inMenuScreen && !playMusic('menu')) setTimeout(wait, 1000);
        }, 1000);
        clearInterval(waitForInteraction);
    }
}, 100);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) globalVolume.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    else globalVolume.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.5);
});

// resizing
window.onresize = (e) => {
    canvasSize = Math.min(window.innerWidth, window.innerHeight) - 21;
    canvasScale = canvasResolution / canvasSize;
    resetCanvases();
    let pickerWidth = (Math.round((window.innerWidth - canvasSize - 20) / 62) - 1) * 62 + 1;
    if (window.innerWidth / window.innerHeight <= 1) pickerWidth = (Math.round((window.innerWidth) / 62) - 1) * 62 + 1;
    pixelPicker.style.width = pickerWidth + 2 + 'px';
    pixelPickerDescription.style.width = pickerWidth - 14 + 'px';
    forceRedraw = true;
};