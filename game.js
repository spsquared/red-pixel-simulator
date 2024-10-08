// Copyright (C) 2024 Sampleprovider(sp)

// canvas
const canvasResolution = parseInt(window.localStorage.getItem('resolution') ?? 800);
const NO_OFFSCREENCANVAS = typeof OffscreenCanvas == 'undefined';
function createCanvas() {
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
const gridCanvas = createCanvas();
const gridNoiseCanvas = createCanvas();
const aboveCanvas = createCanvas();
const fireCanvas = createCanvas();
const targetCanvas = createCanvas();
const placeableCanvas = createCanvas();
const noiseCanvas = createCanvas();
const noiseBufferCanvas = createCanvas();
const teamsCanvas = createCanvas();
const bufferCanvas = createCanvas();
const ctx = canvas.getContext('2d');
const gamectx = gameCanvas.getContext('2d');
const gridctx = gridCanvas.getContext('2d');
const gridnoisectx = gridNoiseCanvas.getContext('2d');
const abovectx = aboveCanvas.getContext('2d');
const firectx = fireCanvas.getContext('2d');
const targetctx = targetCanvas.getContext('2d');
const placeablectx = placeableCanvas.getContext('2d');
const noisectx = noiseCanvas.getContext('2d');
const noisebufferctx = noiseBufferCanvas.getContext('2d');
const teamsctx = teamsCanvas.getContext('2d');
const bufferctx = bufferCanvas.getContext('2d');
canvas.width = canvasResolution;
canvas.height = canvasResolution;
gameCanvas.width = canvasResolution;
gameCanvas.height = canvasResolution;
function resetCanvases() {
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    gamectx.imageSmoothingEnabled = false;
    gamectx.webkitImageSmoothingEnabled = false;
    gridctx.imageSmoothingEnabled = false;
    gridctx.webkitImageSmoothingEnabled = false;
    gridnoisectx.imageSmoothingEnabled = false;
    gridnoisectx.webkitImageSmoothingEnabled = false;
    abovectx.imageSmoothingEnabled = false;
    abovectx.webkitImageSmoothingEnabled = false;
    firectx.imageSmoothingEnabled = false;
    firectx.webkitImageSmoothingEnabled = false;
    targetctx.imageSmoothingEnabled = false;
    targetctx.webkitImageSmoothingEnabled = false;
    placeablectx.imageSmoothingEnabled = false;
    placeablectx.webkitImageSmoothingEnabled = false;
    noisectx.imageSmoothingEnabled = false;
    noisectx.webkitImageSmoothingEnabled = false;
    noisebufferctx.imageSmoothingEnabled = false;
    noisebufferctx.webkitImageSmoothingEnabled = false;
    teamsctx.imageSmoothingEnabled = false;
    teamsctx.webkitImageSmoothingEnabled = false;
    bufferctx.imageSmoothingEnabled = false;
    bufferctx.webkitImageSmoothingEnabled = false;
    noisectx.clearRect(0, 0, canvasResolution, canvasResolution);
    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            noisectx.globalAlpha = constantNoise(j / 2, i / 2);
            noisectx.fillRect(j, i, 1, 1);
        }
    }
    forceRedraw = true;
    ctx.textRendering = 'optimizeSpeed';
    rpResetCanvases();
};
const sidebar = document.getElementById('sidebar');
const pixelPicker = document.getElementById('pixelPicker');
const pixelPickerDescription = document.getElementById('pixelPickerDescription');
const pixelPickerCrafting = document.getElementById('pixelPickerCrafting');
const saveCodeText = document.getElementById('saveCode');
canvasContainer.addEventListener('contextmenu', e => e.preventDefault());
pixelPicker.addEventListener('contextmenu', e => e.preventDefault());
pixelPicker.addEventListener('wheel', (e) => { if (e.deltaY >= 0 && Math.ceil(pixelPicker.scrollTop + pixelPicker.clientHeight) >= pixelPicker.scrollHeight) e.preventDefault(); });
canvas.addEventListener('wheel', e => e.preventDefault());

// grid
let sandboxMode = true;
let gridWidth = 100;
let gridHeight = 100;
let saveCode = '100;0;air-23:wall:rotator_right:wall:air-72:wall:rotator_left:air-24:sticky_piston_right:air-99:slime:air-94:slime-6:air-94:slime:nuke_diffuser-4:slime:air-94:slime:nuke-4:slime:air-94:slime:cloner_down-4:slime:air-1875:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava_generator-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}5|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let gridScale = canvasResolution / Math.min(gridWidth, gridHeight);
let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 21;
let canvasScale = canvasResolution / canvasSize;
let drawScale = 1;
let screenScale = 1;
const grid = [];
const lastGrid = [];
const nextGrid = [];
const fireGrid = [];
const lastFireGrid = [];
const nextFireGrid = [];
const targetGrid = [];
const musicGrid = [];
const lastMusicGrid = [];
const placeableGrid = [];
const lastPlaceableGrid = [];
let pendingExplosions = [];

// camera and brush
const brush = {
    pixel: 'wall',
    size: 1,
    lineMode: false,
    selecting: false,
    isSelection: false,
    lineStartX: 0,
    lineStartY: 0,
    startsInRPE: false,
    mouseButtonStack: [],
    mouseButton: -1,
    lastMouseButton: -1,
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
    shakeIntensity: 0,
    animation: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        s1: 0,
        s2: 0,
        t0: 0,
        t1: 0,
        timing: new CubicBezier(1, 1, 0, 0, 1),
        running: false,
        timingFunctions: {
            linear: new CubicBezier(1, 1, 0, 0, 1),
            lightEase: new CubicBezier(0.4, 0, 0.6, 1),
            ease: new CubicBezier(0.5, 0, 0.5, 1),
            easeIn: new CubicBezier(0.6, 0, 1, 1),
            easeOut: new CubicBezier(0, 0, 0.4, 1),
        }
    },
    viewport: {
        xmin: 0,
        xmax: 0,
        ymin: 0,
        ymax: 0
    },
    locked: false,
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
let inResetState = true;
let forceRedraw = true;

// save codes
function createGrid(width = 100, height = 100) {
    if (width < 1 || height < 1) return;
    gridWidth = width;
    gridHeight = height;
    gridScale = canvasResolution / Math.min(gridWidth, gridHeight);
    drawScale = gridScale * camera.scale;
    screenScale = (gridWidth < gridHeight ? gridWidth : gridHeight) / canvasSize / camera.scale / canvasScale;
    noiseCanvas.width = gridWidth;
    noiseCanvas.height = gridHeight;
    pendingExplosions = [];
    forceRedraw = true;
    selection.show = false;
    grid.length = 0;
    lastGrid.length = 0;
    nextGrid.length = 0;
    fireGrid.length = 0;
    lastFireGrid.length = 0;
    nextFireGrid.length = 0;
    targetGrid.length = 0;
    musicGrid.length = 0;
    lastMusicGrid.length = 0;
    placeableGrid.length = 0;
    lastPlaceableGrid.length = 0;
    noisectx.clearRect(0, 0, canvasResolution, canvasResolution);
    noisectx.fillStyle = 'rgb(0, 0, 0)';
    for (let i = 0; i < gridHeight; i++) {
        grid[i] = new Array(gridWidth);
        lastGrid[i] = new Array(gridWidth);
        nextGrid[i] = new Array(gridWidth);
        fireGrid[i] = new Array(gridWidth);
        lastFireGrid[i] = new Array(gridWidth);
        nextFireGrid[i] = new Array(gridWidth);
        targetGrid[i] = new Array(gridWidth);
        musicGrid[i] = new Array(gridWidth);
        lastMusicGrid[i] = new Array(gridWidth);
        placeableGrid[i] = new Array(gridWidth);
        lastPlaceableGrid[i] = new Array(gridWidth);
        for (let j = 0; j < gridWidth; j++) {
            grid[i][j] = pixNum.AIR;
            lastGrid[i][j] = -1;
            nextGrid[i][j] = -1;
            fireGrid[i][j] = false;
            lastFireGrid[i][j] = false;
            nextFireGrid[i][j] = -1;
            targetGrid[i][j] = false;
            musicGrid[i][j] = 0;
            lastMusicGrid[i][j] = 0;
            placeableGrid[i][j] = true;
            lastPlaceableGrid[i][j] = true;
            noisectx.globalAlpha = constantNoise(j / 2, i / 2);
            noisectx.fillRect(j, i, 1, 1);
        }
    }
    PixSimAPI.gridSize = { width: gridWidth, height: gridHeight };
    createPixSimGrid();
};
function loadSaveCode(code = saveCode) {
    saveCode = code;
    if (saveCode.length > 0) {
        runTicks = 0;
        ticks = 0;
        stopAllMusicPixels();
        let sections = saveCode.split(';');
        function parseSaveCode(code, base) {
            let x = 0;
            let y = 0;
            let i = 0;
            const loopedPixels = [];
            function addPixels(pixel, amount) {
                let pixelTypeNum = pixNum[pixel.toUpperCase()];
                for (let j = 0; j < amount; j++) {
                    grid[y][x++] = pixelTypeNum;
                    if (x == gridWidth) {
                        y++;
                        x = 0;
                        if (y == gridHeight) return true;
                    }
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
                    let iterations = parseInt(code.substring(nextCloseBracket + 1, nextPipeline), base);
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
                    let amount = parseInt(code.substring(nextDash + 1, nextColon), base);
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
        function parseBooleanCode(grid, code, base) {
            let x = 0;
            let y = 0;
            let i = 0;
            let pixel = false;
            place: while (i < code.length) {
                let next = code.indexOf(':', i);
                if (next == -1) break;
                let amount = parseInt(code.substring(i, next), base);
                for (let j = 0; j < amount; j++) {
                    grid[y][x++] = pixel;
                    if (x == gridWidth) {
                        y++;
                        x = 0;
                        if (y == gridHeight) break place;
                    }
                }
                pixel = !pixel;
                i = next + 1;
            }
        };
        if (sections[0] == '&1') {
            sections.shift();
            if (isNaN(parseInt(sections[0]))) return;
            createGrid(parseInt(sections[0].split('-')[0]), parseInt(sections[0].split('-')[1] ?? sections[0]));
            if (sections[1]) ticks = parseInt(sections[1], 16);
            if (sections[2]) parseSaveCode(sections[2], 16);
            if (sections[3]) parseBooleanCode(fireGrid, sections[3], 16);
            if (sections[4]) parseBooleanCode(placeableGrid, sections[4], 16);
            if (sections[5]) parseBooleanCode(targetGrid, sections[5], 16);
        } else {
            if (isNaN(parseInt(sections[0]))) return;
            createGrid(parseInt(sections[0].split('-')[0]), parseInt(sections[0].split('-')[1] ?? sections[0]));
            if (sections[1]) ticks = parseInt(sections[1], 16);
            if (sections[2]) parseSaveCode(sections[2], 10);
            if (sections[3]) parseBooleanCode(fireGrid, sections[3], 16);
            if (sections[4]) parseBooleanCode(placeableGrid, sections[4], 16);
            if (sections[5]) {
                let x = 0;
                let y = 0;
                let i = 0;
                function addPixels(monster, amount) {
                    while (amount > 0) {
                        if (monster) grid[y][x++] = pixNum.MONSTER;
                        else x++;
                        if (x == gridWidth) {
                            y++;
                            x = 0;
                            if (y == gridHeight) return true;
                        }
                        amount--;
                    }
                    return false;
                };
                let monster = false;
                while (i < sections[5].length) {
                    let next = sections[5].indexOf(':', i);
                    if (next == -1) break;
                    let amount = parseInt(sections[5].substring(i, next), 16);
                    if (addPixels(monster, amount)) break;
                    monster = !monster;
                    i = next + 1;
                }
            }
            if (sections[6]) parseBooleanCode(targetGrid, sections[6], 16);
        }
        updateTimeControlButtons();
        camera.x = Math.max(0, Math.min(camera.x, (canvasResolution * (gridWidth / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
        camera.y = Math.max(0, Math.min(camera.y, (canvasResolution * (gridHeight / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
    }
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', LZString.compressToBase64(saveCode));
    }
};
function generateSaveCode() {
    let saveCode = `&1;${gridWidth}-${gridHeight};${'0000'.substring(0, 4 - (ticks % 65536).toString(16).length)}${(ticks % 65536).toString(16)};`;
    let pixel = -1;
    let amount = 0;
    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            amount++;
            if (grid[i][j] != pixel) {
                if (pixel != -1 && amount != 0) {
                    if (amount == 1) {
                        saveCode += `${pixelData(pixel).id}:`;
                    } else {
                        saveCode += `${pixelData(pixel).id}-${amount.toString(16)}:`;
                    }
                }
                pixel = grid[i][j];
                amount = 0;
            }
        }
    }
    amount++;
    if (pixel != -1) {
        if (amount == 1) {
            saveCode += `${pixelData(pixel).id}:`;
        } else {
            saveCode += `${pixelData(pixel).id}-${amount}:`;
        }
    }
    function createBooleanCode(grid) {
        saveCode += ';';
        let pixel = grid[0][0];
        amount = -1;
        if (pixel) saveCode += '0:';
        for (let i = 0; i < gridHeight; i++) {
            for (let j = 0; j < gridWidth; j++) {
                amount++;
                if (grid[i][j] != pixel) {
                    saveCode += `${amount.toString(16)}:`;
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
                saveCodeText.value = e.innerHTML;
                loadSaveCode(e.innerHTML);
                window.localStorage.setItem('saveCode', LZString.compressToBase64(generateSaveCode()));
                window.localStorage.setItem('saveCodeText', LZString.compressToBase64(saveCodeText.value));
            }
        });
    }
};
function loadStoredSave() {
    let savedSaveCode = window.localStorage.getItem('saveCode');
    if (savedSaveCode !== null) {
        saveCode = LZString.decompressFromBase64(savedSaveCode);
        if (saveCode == null || saveCode == '') saveCode = savedSaveCode;
    }
    loadSaveCode();
    resetStateSave = saveCode;
    let savedSaveText = window.localStorage.getItem('saveCodeText');
    if (savedSaveText !== null) {
        saveCode = LZString.decompressFromBase64(savedSaveText);
        if (saveCode == null || saveCode == '') saveCode = savedSaveText;
    }
    saveCodeText.value = saveCode;
    saveCodeText.oninput();
    undoStates.length = 0;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
};
window.addEventListener('load', (e) => {
    loadStoredSave();
    if (typeof window.requestIdleCallback == 'function') {
        setInterval(() => {
            window.requestIdleCallback(() => {
                if (sandboxMode) window.localStorage.setItem('saveCode', LZString.compressToBase64(generateSaveCode()));
            }, { timeout: 5000 });
        }, 30000);
    } else {
        setInterval(() => {
            if (sandboxMode) window.localStorage.setItem('saveCode', LZString.compressToBase64(generateSaveCode()));
        }, 30000);
    }
    window.addEventListener('beforeunload', (e) => {
        if (sandboxMode) window.localStorage.setItem('saveCode', LZString.compressToBase64(generateSaveCode()));
    });
});

// shared pixel functions
function PreRenderer(size = 60) {
    const rendCanvas = document.createElement('canvas');
    rendCanvas.width = size;
    rendCanvas.height = size;
    const rendctx = rendCanvas.getContext('2d');
    rendctx.imageSmoothingEnabled = false;
    rendctx.webkitImageSmoothingEnabled = false;
    rendctx.mozImageSmoothingEnabled = false;
    return {
        ctx: rendctx,
        fillPixels: function (x, y, width, height) {
            rendctx.fillRect(x * size, y * size, width * size, height * size);
        },
        clearPixels: function (x, y, width, height) {
            rendctx.clearRect(x * size, y * size, width * size, height * size);
        },
        toImage: function () {
            const img = new Image(size, size);
            img.src = rendCanvas.toDataURL('image/png');
            return img;
        }
    }
};
// draw
function drawPixels(type, rectangles, ctx, avoidGrid = false) {
    (numPixels[type] ?? numPixels[pixNum.MISSING]).draw(rectangles, ctx, avoidGrid);
};
function forRectangles(rectangles, cb) {
    for (let rect of rectangles) {
        cb(...rect);
    }
};
function forEachPixel(x, y, width, height, cb) {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            cb(x + j, y + i);
        }
    }
};
function fillPixels(x, y, width, height, ctx) {
    ctx.fillRect(x * drawScale - camera.x, y * drawScale - camera.y, width * drawScale, height * drawScale);
};
function clearPixels(x, y, width, height, ctx) {
    ctx.clearRect(x * drawScale - camera.x, y * drawScale - camera.y, width * drawScale, height * drawScale);
};
function imagePixels(x, y, width, height, source, ctx) {
    for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
            ctx.drawImage(source, j * drawScale - camera.x, i * drawScale - camera.y, drawScale, drawScale);
        }
    }
};
function colorAnimate(r1, g1, b1, r2, g2, b2, p) {
    let multiplier1 = (Math.sin(deltaTime * Math.PI / p) + 1) / 2;
    let multiplier2 = 1 - multiplier1;
    return [
        Math.round((r1 * multiplier1) + (r2 * multiplier2)),
        Math.round((g1 * multiplier1) + (g2 * multiplier2)),
        Math.round((b1 * multiplier1) + (b2 * multiplier2)),
    ];
};
// update
function updatePixel(x, y, i) {
    if (grid[y][x] !== 0 && numPixels[grid[y][x]] !== undefined && numPixels[grid[y][x]].updateStage === i) {
        randomSeed(ticks, x, y);
        numPixels[grid[y][x]].update(x, y);
    }
};
function touchingPixel(x, y, types, action) {
    types = new Set(Array.isArray(types) ? types : [types]);
    if (typeof action == 'function') {
        let touchingPixel = false;
        if (x > 0 && types.has(grid[y][x - 1])) touchingPixel = (action(x - 1, y) ?? true) || touchingPixel;
        if (x < gridWidth - 1 && types.has(grid[y][x + 1])) touchingPixel = (action(x + 1, y) ?? true) || touchingPixel;
        if (y > 0 && types.has(grid[y - 1][x])) touchingPixel = (action(x, y - 1) ?? true) || touchingPixel;
        if (y < gridHeight - 1 && types.has(grid[y + 1][x])) touchingPixel = (action(x, y + 1) ?? true) || touchingPixel;
        return touchingPixel;
    } else {
        return (x > 0 && types.has(grid[y][x - 1])) || (x < gridWidth - 1 && types.has(grid[y][x + 1])) || (y > 0 && types.has(grid[y - 1][x])) || (y < gridHeight - 1 && types.has(grid[y + 1][x]));
    }
};
function touchingAnything(x, y, action) {
    if (typeof action == 'function') {
        let touchingPixel = false;
        if (x > 0 && grid[y][x - 1] !== pixNum.AIR) touchingPixel = (action(x - 1, y) ?? true) || touchingPixel;
        if (x < gridWidth - 1 && grid[y][x + 1] !== pixNum.AIR) touchingPixel = (action(x + 1, y) ?? true) || touchingPixel;
        if (y > 0 && grid[y - 1][x] !== pixNum.AIR) touchingPixel = (action(x, y - 1) ?? true) || touchingPixel;
        if (y < gridHeight - 1 && grid[y + 1][x] !== pixNum.AIR) touchingPixel = (action(x, y + 1) ?? true) || touchingPixel;
        return touchingPixel;
    } else {
        return (x > 0 && grid[y][x - 1] !== pixNum.AIR) || (x < gridWidth - 1 && grid[y][x + 1] !== pixNum.AIR) || (y > 0 && grid[y - 1][x] !== pixNum.AIR) || (y < gridHeight - 1 && grid[y + 1][x] !== pixNum.AIR);
    }
};
function pixelAt(x, y) {
    return numPixels[grid[y][x]] ?? numPixels[pixNum.MISSING];
};
function pixelData(numId) {
    return numPixels[numId] ?? numPixels[pixNum.MISSING];
};
function isOnGrid(x, y) {
    return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
};
function validChangingPixel(x, y) {
    return nextGrid[y][x] == -1;
};
function isAir(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.STEAM || grid[y][x] == pixNum.DELETER || grid[y][x] == pixNum.MONSTER;
};
function isPassableFluid(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.WATER || grid[y][x] == pixNum.LAVA || grid[y][x] == pixNum.STEAM || grid[y][x] == pixNum.DELETER || grid[y][x] == pixNum.MONSTER;
};
function isPassableLiquid(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.WATER || grid[y][x] == pixNum.LAVA || grid[y][x] == pixNum.DELETER || grid[y][x] == pixNum.MONSTER;
};
function isTransparent(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.GLASS || grid[y][x] == pixNum.REINFORCED_GLASS;
};
function move(x1, y1, x2, y2) {
    if (grid[y2][x2] == pixNum.DELETER) {
        nextGrid[y1][x1] = pixNum.AIR;
        fireGrid[y1][x1] = false;
        teamGrid[y1][x1] = 0;
    } else if (grid[y2][x2] == pixNum.MONSTER) {
        nextGrid[y1][x1] = pixNum.AIR;
        nextGrid[y2][x2] = pixNum.AIR;
        fireGrid[y1][x1] = false;
        fireGrid[y2][x2] = false;
        teamGrid[y1][x1] = 0;
        teamGrid[y2][x2] = 0;
    } else {
        nextGrid[y1][x1] = grid[y2][x2];
        nextGrid[y2][x2] = grid[y1][x1];
        let temp = fireGrid[y1][x1];
        fireGrid[y1][x1] = fireGrid[y2][x2];
        fireGrid[y2][x2] = temp;
        temp = teamGrid[y1][x1];
        teamGrid[y1][x1] = teamGrid[y2][x2];
        teamGrid[y2][x2] = temp;
    }
};
function fall(x, y, xTravel, yTravel, isPassable = isPassableFluid) {
    if (y < gridHeight - 1) {
        if (isPassable(x, y + 1) && validChangingPixel(x, y + 1)) {
            move(x, y, x, y + 1);
        } else if (y < gridHeight - yTravel) {
            let slideLeft = validChangingPixel(x - 1, y) && isPassable(x - 1, y);
            let slideRight = validChangingPixel(x + 1, y) && isPassable(x + 1, y);
            let canMoveLeftDiagonal = false;
            let canMoveRightDiagonal = false;
            if (slideLeft) {
                let xmin = Math.max(x - xTravel, 0);
                for (let i = x - 1; i >= xmin; i--) {
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
                        canMoveLeftDiagonal = i == x - 1 && validChangingPixel(i, y + 1);
                        break;
                    }
                    if (i == x - xTravel) slideLeft = false;
                }
            }
            if (slideRight) {
                let xmax = Math.min(gridWidth - 1, x + xTravel);
                for (let i = x + 1; i <= xmax; i++) {
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
                        canMoveRightDiagonal = i == x + 1 && validChangingPixel(i, y + 1);
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
function flow(x, y, isPassable = isAir) {
    if (y == gridHeight - 1) {
        // still have to flow left and right to fill air gaps
        return;
    }
    if (isPassable(x, y + 1)) {
        if (validChangingPixel(x, y + 1)) move(x, y, x, y + 1);
    } else {
        let left = x;
        let right = x;
        let slideLeft = 0;
        let slideRight = 0;
        let foundLeftDrop = false;
        let foundRightDrop = false;
        let incrementLeft = validChangingPixel(x - 1, y) && isPassable(x - 1, y);
        let incrementRight = validChangingPixel(x + 1, y) && isPassable(x + 1, y);
        if (!incrementLeft && !incrementRight) return;
        // move directly to destination?
        while (incrementLeft) {
            left--;
            if (!isPassable(left, y) && grid[y + 1][left] != grid[y][x]) {
                if (grid[y][left] != grid[y][x]) slideLeft = x - left;
                incrementLeft = false;
            } else if (isPassable(left, y + 1)) {
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
            if (!isPassable(right, y) && grid[y + 1][right] != grid[y][x]) {
                if (grid[y][right] != grid[y][x]) slideRight = right - x;
                incrementRight = false;
            } else if (isPassable(right, y + 1)) {
                slideRight = right - x;
                foundRightDrop = true;
                incrementRight = false;
            }
            if (right >= gridWidth) {
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
            if (foundRightDrop && isPassable(x + 1, y + 1) && validChangingPixel(x + 1, y + 1)) {
                move(x, y, x + 1, y + 1);
            } else if (validChangingPixel(x + 1, y)) {
                move(x, y, x + 1, y);
            }
        } else if (toSlide < 0) {
            if (foundLeftDrop && isPassable(x - 1, y + 1) && validChangingPixel(x - 1, y + 1)) {
                move(x, y, x - 1, y + 1);
            } else if (validChangingPixel(x - 1, y)) {
                move(x, y, x - 1, y);
            }
        }
    }
};
function canPush(x, y, dir, stickPush = 0, ignorePistons = false) {
    if (!validChangingPixel(x, y) || !pixelAt(x, y).pushable || (stickPush != 0 && !pixelAt(x, y).stickable) || (stickPush == 1 && grid[y][x] == pixNum.UNSLIME) || (stickPush == 2 && grid[y][x] == pixNum.SLIME) || (grid[y][x] == pixNum.GOAL && targetGrid[y][x])) return false;
    switch (dir) {
        case 0:
            return grid[y][x] != pixNum.SLIDER_VERTICAL && (ignorePistons || (grid[y][x] != pixNum.PISTON_RIGHT && grid[y][x] != pixNum.STICKY_PISTON_RIGHT && grid[y][x] != pixNum.PUSH_PISTON_RIGHT) || isDeactivated(x, y));
        case 1:
            return grid[y][x] != pixNum.SLIDER_HORIZONTAL && (ignorePistons || (grid[y][x] != pixNum.PISTON_DOWN && grid[y][x] != pixNum.STICKY_PISTON_DOWN && grid[y][x] != pixNum.PUSH_PISTON_DOWN) || isDeactivated(x, y));
        case 2:
            return grid[y][x] != pixNum.SLIDER_VERTICAL && (ignorePistons || (grid[y][x] != pixNum.PISTON_LEFT && grid[y][x] != pixNum.STICKY_PISTON_LEFT && grid[y][x] != pixNum.PUSH_PISTON_LEFT) || isDeactivated(x, y));
        case 3:
            return grid[y][x] != pixNum.SLIDER_HORIZONTAL && (ignorePistons || (grid[y][x] != pixNum.PISTON_UP && grid[y][x] != pixNum.STICKY_PISTON_UP && grid[y][x] != pixNum.PUSH_PISTON_UP) || isDeactivated(x, y));
    }
    return false;
};
function push(x, y, dir, movePusher = true, ignorePistons = false) {
    if (!validChangingPixel(x, y)) return false;
    const pushes = [];
    const deletions = [];
    const deletions2 = [];
    const visitedPixels = new Set();
    let collapsiblable = false;
    let visited = (x, y) => {
        return visitedPixels.has(y * gridWidth + x);
    };
    let addVisit = (x, y) => {
        visitedPixels.add(y * gridWidth + x);
    };
    let isSlime = (x, y) => {
        return grid[y][x] == pixNum.SLIME;
    };
    let isUnslime = (x, y) => {
        return grid[y][x] == pixNum.UNSLIME;
    };
    let isCollector = (x, y) => {
        return grid[y][x] == pixNum.COLLECTOR || grid[y][x] == pixNum.INSTANT_COLLECTOR || grid[y][x] == pixNum.COLOR_COLLECTOR;
    };
    let adjustPosition = (x, y) => {
        let startsSlime = isSlime(x, y);
        if (startsSlime) {
            switch (dir) {
                case 0:
                    while (x < gridWidth - 1 && isSlime(x, y)) x++;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.UNSLIME) x--;
                    break;
                case 1:
                    while (y < gridHeight - 1 && isSlime(x, y)) y++;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.UNSLIME) y--;
                    break;
                case 2:
                    while (x > 0 && isSlime(x, y)) x--;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.UNSLIME) x++;
                    break;
                case 3:
                    while (y > 0 && isSlime(x, y)) y--;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.UNSLIME) y++;
                    break;
            }
        }
        let startsUnslime = isUnslime(x, y);
        if (startsUnslime) {
            switch (dir) {
                case 0:
                    while (x < gridWidth - 1 && isUnslime(x, y)) x++;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.SLIME) x--;
                    break;
                case 1:
                    while (y < gridHeight - 1 && isUnslime(x, y)) y++;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.SLIME) y--;
                    break;
                case 2:
                    while (x > 0 && isUnslime(x, y)) x--;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.SLIME) x++;
                    break;
                case 3:
                    while (y > 0 && isUnslime(x, y)) y--;
                    if (isAir(x, y) || !pixelAt(x, y).pushable || !pixelAt(x, y).stickable || grid[y][x] == pixNum.SLIME) y++;
                    break;
            }
        }
        let startsCollectorHandle = grid[y][x] == pixNum.COLLECTOR_HANDLE;
        if (startsCollectorHandle) {
            switch (dir) {
                case 0:
                    if (x < gridWidth - 1 && isCollector(x + 1, y)) x++;
                    break;
                case 1:
                    if (y < gridHeight - 1 && isCollector(x, y + 1)) y++;
                    break;
                case 2:
                    if (x > 0 && isCollector(x - 1, y)) x--;
                    break;
                case 3:
                    if (y > 0 && isCollector(x, y - 1)) y--;
                    break;
            }
        }
        return [x, y, startsSlime, startsUnslime, startsCollectorHandle];
    };
    let addPush = () => { };
    let stationaryX = movePusher ? -1 : x;
    let stationaryY = movePusher ? -1 : y;
    let pistonOverride = grid[y][x] == pixNum.PUSH_PISTON_LEFT || grid[y][x] == pixNum.PUSH_PISTON_UP || (grid[y][x] >= pixNum.FAN_LEFT && grid[y][x] <= pixNum.FAN_DOWN);
    switch (dir) {
        case 0:
            addPush = (x, y, movePusher) => {
                let moveX = -1, firstCollapsible = -1;
                let startsSlime, startsUnslime, startsCollectorHandle;
                [x, y, startsSlime, startsUnslime, startsCollectorHandle] = adjustPosition(x, y);
                let stickPush = (x, y, stickable, stickType) => {
                    if (stickable(x, y) && y > 0 && !visited(x, y - 1) && !isAir(x, y - 1) && canPush(x, y - 1, 0, stickType, ignorePistons)) { addVisit(x, y - 1); if (!addPush(x, y - 1, true)) return false; }
                    if (stickable(x, y) && y < gridHeight - 1 && !visited(x, y + 1) && !isAir(x, y + 1) && canPush(x, y + 1, 0, stickType, ignorePistons)) { addVisit(x, y + 1); if (!addPush(x, y + 1, true)) return false; }
                    return true;
                };
                for (let i = x - !(startsSlime || startsUnslime || startsCollectorHandle); i >= 0; i--) {
                    addVisit(i, y);
                    if (isAir(i, y) || (collapsiblable && grid[y][i] == pixNum.COLLAPSIBLE)) {
                        moveX = i;
                        if (grid[y][i] == pixNum.DELETER) moveX++;
                        break;
                    }
                    if (!canPush(i, y, 0, 0, ignorePistons)) break;
                    if (!stickPush(i, y, isSlime, 1)) break;
                    if (!stickPush(i, y, isUnslime, 2)) break;
                    if (grid[y][i] == pixNum.COLLECTOR_HANDLE && y > 0 && !visited(i, y - 1) && isCollector(i, y - 1)) { addVisit(i, y - 1); if (!addPush(i, y - 1, true)) break; }
                    if (grid[y][i] == pixNum.COLLECTOR_HANDLE && y < gridHeight - 1 && !visited(i, y + 1) && isCollector(i, y + 1)) { addVisit(i, y + 1); if (!addPush(i, y + 1, true)) break; }
                }
                if (moveX == -1 && firstCollapsible != -1) moveX = firstCollapsible;
                if (moveX != -1) {
                    for (let i = moveX; i < x; i++) if (!validChangingPixel(i, y)) return false;
                    if (pistonOverride && moveX > 0 && grid[y][moveX - 1] == pixNum.PUSH_PISTON_RIGHT && !isDeactivated(moveX - 1, y)) return false;
                    if (!movePusher) x--;
                    for (let i = moveX; i < x; i++) {
                        if (i == stationaryX && y == stationaryY) return false;
                        pushes.push([i, y]);
                    }
                    if (grid[y][x] != pixNum.DELETER) deletions.push([x, y]);
                    if (grid[y][moveX] == pixNum.MONSTER) deletions2.push([moveX, y]);
                    return true;
                }
                return false;
            };
            break;
        case 1:
            addPush = (x, y, movePusher) => {
                let moveY = -1, firstCollapsible = -1;
                let startsSlime, startsUnslime, startsCollectorHandle;
                [x, y, startsSlime, startsUnslime, startsCollectorHandle] = adjustPosition(x, y);
                let stickPush = (x, y, stickable, stickType) => {
                    if (stickable(x, y) && x > 0 && !visited(x - 1, y) && !isAir(x - 1, y) && canPush(x - 1, y, 1, stickType, ignorePistons)) { addVisit(x - 1, y); if (!addPush(x - 1, y, true)) return false; }
                    if (stickable(x, y) && x < gridWidth - 1 && !visited(x + 1, y) && !isAir(x + 1, y) && canPush(x + 1, y, 1, stickType, ignorePistons)) { addVisit(x + 1, y); if (!addPush(x + 1, y, true)) return false; }
                    return true;
                };
                for (let i = y - !(startsSlime || startsUnslime || startsCollectorHandle); i >= 0; i--) {
                    addVisit(x, i);
                    if (isAir(x, i) || (collapsiblable && grid[i][x] == pixNum.COLLAPSIBLE)) {
                        moveY = i;
                        if (grid[i][x] == pixNum.DELETER) moveY++;
                        break;
                    }
                    if (!canPush(x, i, 1, 0, ignorePistons)) break;
                    if (!stickPush(x, i, isSlime, 1)) break;
                    if (!stickPush(x, i, isUnslime, 2)) break;
                    if (grid[i][x] == pixNum.COLLECTOR_HANDLE && x > 0 && !visited(x - 1, i) && isCollector(x - 1, i)) { addVisit(x - 1, i); if (!addPush(x - 1, i, true)) break; }
                    if (grid[i][x] == pixNum.COLLECTOR_HANDLE && x < gridWidth - 1 && !visited(x + 1, i) && isCollector(x + 1, i)) { addVisit(x + 1, i); if (!addPush(x + 1, i, true)) break; }
                }
                if (moveY == -1 && firstCollapsible != -1) moveY = firstCollapsible;
                if (moveY != -1) {
                    for (let i = moveY; i < y; i++) if (!validChangingPixel(x, i)) return false;
                    if (pistonOverride && moveY > 0 && grid[moveY - 1][x] == pixNum.PUSH_PISTON_DOWN && !isDeactivated(x, moveY - 1)) return false;
                    if (!movePusher) y--;
                    for (let i = moveY; i < y; i++) {
                        if (x == stationaryX && i == stationaryY) return false;
                        pushes.push([x, i]);
                    }
                    if (grid[y][x] != pixNum.DELETER) deletions.push([x, y]);
                    if (grid[moveY][x] == pixNum.MONSTER) deletions2.push([x, moveY]);
                    return true;
                }
                return false;
            };
            break;
        case 2:
            addPush = (x, y, movePusher) => {
                let moveX = -1, firstCollapsible = -1;
                let startsSlime, startsUnslime, startsCollectorHandle;
                [x, y, startsSlime, startsUnslime, startsCollectorHandle] = adjustPosition(x, y);
                let stickPush = (x, y, stickable, stickType) => {
                    if (stickable(x, y) && y > 0 && !visited(x, y - 1) && !isAir(x, y - 1) && canPush(x, y - 1, 0, stickType, ignorePistons)) { addVisit(x, y - 1); if (!addPush(x, y - 1, true)) return false; }
                    if (stickable(x, y) && y < gridHeight - 1 && !visited(x, y + 1) && !isAir(x, y + 1) && canPush(x, y + 1, 0, stickType, ignorePistons)) { addVisit(x, y + 1); if (!addPush(x, y + 1, true)) return false; }
                    return true;
                };
                for (let i = x + !(startsSlime || startsUnslime || startsCollectorHandle); i < gridWidth; i++) {
                    addVisit(i, y);
                    if (isAir(i, y) || (collapsiblable && grid[y][i] == pixNum.COLLAPSIBLE)) {
                        moveX = i;
                        if (grid[y][i] == pixNum.DELETER) moveX--;
                        break;
                    }
                    if (!canPush(i, y, 2, 0, ignorePistons)) break;
                    if (!stickPush(i, y, isSlime, 1)) break;
                    if (!stickPush(i, y, isUnslime, 2)) break;
                    if (grid[y][i] == pixNum.COLLECTOR_HANDLE && y > 0 && !visited(i, y - 1) && isCollector(i, y - 1)) { addVisit(i, y - 1); if (!addPush(i, y - 1, true)) break; }
                    if (grid[y][i] == pixNum.COLLECTOR_HANDLE && y < gridHeight - 1 && !visited(i, y + 1) && isCollector(i, y + 1)) { addVisit(i, y + 1); if (!addPush(i, y + 1, true)) break; }
                }
                if (moveX == -1 && firstCollapsible != -1) moveX = firstCollapsible;
                if (moveX != -1) {
                    for (let i = moveX; i > x; i--) if (!validChangingPixel(i, y)) return false;
                    if (pistonOverride && moveX < gridWidth - 1 && grid[y][moveX + 1] == pixNum.PUSH_PISTON_LEFT && !isDeactivated(moveX + 1, y)) return false;
                    if (!movePusher) x++;
                    for (let i = moveX; i > x; i--) {
                        if (i == stationaryX && y == stationaryY) return false;
                        pushes.push([i, y]);
                    }
                    if (grid[y][x] != pixNum.DELETER) deletions.push([x, y]);
                    if (grid[y][moveX] == pixNum.MONSTER) deletions2.push([moveX, y]);
                    return true;
                }
                return false;
            };
            break;
        case 3:
            addPush = (x, y, movePusher) => {
                let moveY = -1, firstCollapsible = -1;
                let startsSlime, startsUnslime, startsCollectorHandle;
                [x, y, startsSlime, startsUnslime, startsCollectorHandle] = adjustPosition(x, y);
                let stickPush = (x, y, stickable, stickType) => {
                    if (stickable(x, y) && x > 0 && !visited(x - 1, y) && !isAir(x - 1, y) && canPush(x - 1, y, 1, stickType, ignorePistons)) { addVisit(x - 1, y); if (!addPush(x - 1, y, true)) return false; }
                    if (stickable(x, y) && x < gridWidth - 1 && !visited(x + 1, y) && !isAir(x + 1, y) && canPush(x + 1, y, 1, stickType, ignorePistons)) { addVisit(x + 1, y); if (!addPush(x + 1, y, true)) return false; }
                    return true;
                };
                for (let i = y + !(startsSlime || startsUnslime || startsCollectorHandle); i < gridHeight; i++) {
                    addVisit(x, i);
                    if (isAir(x, i) || (collapsiblable && grid[i][x] == pixNum.COLLAPSIBLE)) {
                        moveY = i;
                        if (grid[i][x] == pixNum.DELETER) moveY--;
                        break;
                    }
                    if (!canPush(x, i, 3, 0, ignorePistons)) break;
                    if (!stickPush(x, i, isSlime, 1)) break;
                    if (!stickPush(x, i, isUnslime, 2)) break;
                    if (grid[i][x] == pixNum.COLLECTOR_HANDLE && x > 0 && !visited(x - 1, i) && isCollector(x - 1, i)) { addVisit(x - 1, i); if (!addPush(x - 1, i, true)) break; }
                    if (grid[i][x] == pixNum.COLLECTOR_HANDLE && x < gridWidth - 1 && !visited(x + 1, i) && isCollector(x + 1, i)) { addVisit(x + 1, i); if (!addPush(x + 1, i, true)) break; }
                }
                if (moveY == -1 && firstCollapsible != -1) moveY = firstCollapsible;
                if (moveY != -1) {
                    for (let i = moveY; i > y; i--) if (!validChangingPixel(x, i)) return false;
                    if (pistonOverride && moveY < gridHeight - 1 && grid[moveY + 1][x] == pixNum.PUSH_PISTON_UP && !isDeactivated(x, moveY + 1)) return false;
                    if (!movePusher) y++;
                    for (let i = moveY; i > y; i--) {
                        if (x == stationaryX && i == stationaryY) return false;
                        pushes.push([x, i]);
                    }
                    if (grid[y][x] != pixNum.DELETER) deletions.push([x, y]);
                    if (grid[moveY][x] == pixNum.MONSTER) deletions2.push([x, moveY]);
                    return true;
                }
                return false;
            };
            break;
        default:
            return false;
    }
    if (!addPush(x, y, movePusher)) {
        collapsiblable = true;
        visitedPixels.clear();
        pushes.length = 0;
        deletions.length = 0;
        deletions2.length = 0;
        if (!addPush(x, y, movePusher)) return false;
    }
    for (let [x, y] of deletions) {
        nextGrid[y][x] = pixNum.AIR;
        fireGrid[y][x] = false;
    }
    switch (dir) {
        case 0:
            for (let [x, y] of pushes) {
                nextGrid[y][x] = grid[y][x + 1];
                fireGrid[y][x] = fireGrid[y][x + 1];
                teamGrid[y][x] = teamGrid[y][x + 1];
            }
            break;
        case 1:
            for (let [x, y] of pushes) {
                nextGrid[y][x] = grid[y + 1][x];
                fireGrid[y][x] = fireGrid[y + 1][x];
                teamGrid[y][x] = teamGrid[y + 1][x];
            }
            break;
        case 2:
            for (let [x, y] of pushes) {
                nextGrid[y][x] = grid[y][x - 1];
                fireGrid[y][x] = fireGrid[y][x - 1];
                teamGrid[y][x] = teamGrid[y][x - 1];
            }
            break;
        case 3:
            for (let [x, y] of pushes) {
                nextGrid[y][x] = grid[y - 1][x];
                fireGrid[y][x] = fireGrid[y - 1][x];
                teamGrid[y][x] = teamGrid[y - 1][x];
            }
            break;
    }
    for (let [x, y] of deletions) {
        teamGrid[y][x] = 0;
    }
    for (let [x, y] of deletions2) {
        nextGrid[y][x] = pixNum.AIR;
        fireGrid[y][x] = false;
        teamGrid[y][x] = 0;
    }
    return true;
};
function rayTrace(x1, y1, x2, y2, cb) {
    let slope = (y2 - y1) / (x2 - x1);
    if (!isFinite(slope)) {
        let start = Math.max(0, Math.min(y2, y1));
        let end = Math.min(gridHeight - 1, Math.max(y2, y1));
        for (let y = start; y <= end; y++) {
            if (cb(x1, y)) break;
        }
    } else if (slope == 0) {
        let start = Math.max(0, Math.min(x2, x1));
        let end = Math.min(gridWidth - 1, Math.max(x2, x1));
        for (let x = start; x <= end; x++) {
            if (cb(x, y1)) break;
        }
    } else if (Math.abs(slope) > 1) {
        slope = 1 / slope;
        let xmin = y2 < y1 ? x2 : x1;
        let start = Math.max(0, Math.min(y2, y1));
        let end = Math.min(gridHeight - 1, Math.max(y2, y1));
        for (let y = start, x = 0; y <= end; y++) {
            x = Math.round(slope * (y - start)) + xmin;
            if (x < 0 || x >= gridWidth || cb(x, y)) break;
        }
    } else {
        let ymin = x2 < x1 ? y2 : y1;
        let start = Math.max(0, Math.min(x2, x1));
        let end = Math.min(gridWidth - 1, Math.max(x2, x1));
        for (let x = start, y = 0; x <= end; x++) {
            y = Math.round(slope * (x - start)) + ymin;
            if (y < 0 || y >= gridHeight || cb(x, y)) break;
        }
    }
};
function possibleRotations(id) {
    if (id == pixNum.SLIDER_HORIZONTAL || id == pixNum.SLIDER_VERTICAL || id == pixNum.MIRROR_1 || id == pixNum.MIRROR_2 || id == pixNum.ROTATOR_CLOCKWISE || id == pixNum.ROTATOR_COUNTERCLOCKWISE) return 2;
    if ((id >= pixNum.PISTON_LEFT && id <= pixNum.ROTATOR_DOWN) || (id >= pixNum.COMPARATOR_LEFT && id <= pixNum.COMPARATOR_DOWN) || (id >= pixNum.CARRIAGE_LEFT && id <= pixNum.CARRIAGE_DOWN) || (id >= pixNum.LASER_LEFT && id <= pixNum.LASER_DOWN) || (id >= pixNum.FLAMETHROWER_LEFT && id <= pixNum.FLAMETHROWER_DOWN)) return 4;
    return 1;
};
function rotatePixel(x, y) {
    if (nextGrid[y][x] != -1) return;
    let thisPixel = numPixels[grid[y][x]];
    if (thisPixel === undefined) return;
    let rotate = 0;
    let touchedRotators = [];
    touchingAnything(x, y, function (ax, ay) {
        const pixel = grid[ay][ax];
        if (touchingPixel(ax, ay, pixNum.DEACTIVATOR)) return;
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
    if (!isOnGrid(x, y)) return [[-1, -1]];
    let path = [];
    let cdir = dir;
    let startX = x;
    let startY = y;
    path.push([startX, startY]);
    let iterations = 0;
    while (iterations < maxLaserDepth && isOnGrid(startX, startY)) {
        let endX = startX;
        let endY = startY;
        switch (cdir) {
            case 0:
                endX = startX - 1;
                while (endX >= 0) {
                    if (!isTransparent(endX, endY)) break;
                    endX--;
                }
                path.push([endX, endY]);
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
                path.push([endX, endY]);
                if (endY >= 0 && grid[endY][endX] == pixNum.MIRROR_1) cdir = 2;
                else if (endY >= 0 && grid[endY][endX] == pixNum.MIRROR_2) cdir = 0;
                else return path;
                break;
            case 2:
                endX = startX + 1;
                while (endX < gridWidth) {
                    if (!isTransparent(endX, endY)) break;
                    endX++;
                }
                path.push([endX, endY]);
                if (endX < gridWidth && grid[endY][endX] == pixNum.MIRROR_1) cdir = 1;
                else if (endX < gridWidth && grid[endY][endX] == pixNum.MIRROR_2) cdir = 3;
                else return path;
                break;
            case 3:
                endY = startY + 1;
                while (endY < gridHeight) {
                    if (!isTransparent(endX, endY)) break;
                    endY++;
                }
                path.push([endX, endY]);
                if (endY < gridHeight && grid[endY][endX] == pixNum.MIRROR_1) cdir = 0;
                else if (endY < gridHeight && grid[endY][endX] == pixNum.MIRROR_2) cdir = 2;
                else return path;
                break;
            default:
                path.push([endX, endY]);
                return path;
        }
        startX = endX;
        startY = endY;
        iterations++;
    }
    return path;
};
function drawLaserPath(path) {
    if (path.length <= 1) return;
    abovectx.lineWidth = 1 / 3 * drawScale;
    abovectx.lineJoin = 'bevel';
    abovectx.lineCap = 'butt';
    abovectx.beginPath();
    let first = path.shift();
    if (first[1] == path[0][1]) {
        if (first[0] < path[0][0]) abovectx.moveTo((first[0] + 1) * drawScale - camera.x, (first[1] + 0.5) * drawScale - camera.y);
        else abovectx.moveTo(first[0] * drawScale - camera.x, (first[1] + 0.5) * drawScale - camera.y);
    } else {
        if (first[1] < path[0][1]) abovectx.moveTo((first[0] + 0.5) * drawScale - camera.x, (first[1] + 1) * drawScale - camera.y);
        else abovectx.moveTo((first[0] + 0.5) * drawScale - camera.x, first[1] * drawScale - camera.y);
    }
    let last = path.pop();
    for (let point of path) {
        abovectx.lineTo((point[0] + 0.5) * drawScale - camera.x, (point[1] + 0.5) * drawScale - camera.y);
    }
    let beforeLast = path.pop() ?? first;
    if (last[1] == beforeLast[1]) {
        if (beforeLast[0] < last[0]) abovectx.lineTo(last[0] * drawScale - camera.x, (last[1] + 0.5) * drawScale - camera.y);
        else abovectx.lineTo((last[0] + 1) * drawScale - camera.x, (last[1] + 0.5) * drawScale - camera.y);
    } else {
        if (beforeLast[1] < last[1]) abovectx.lineTo((last[0] + 0.5) * drawScale - camera.x, last[1] * drawScale - camera.y);
        else abovectx.lineTo((last[0] + 0.5) * drawScale - camera.x, (last[1] + 1) * drawScale - camera.y);
    }
    abovectx.stroke();
};
function isDeactivated(x, y) {
    return touchingPixel(x, y, pixNum.DEACTIVATOR) || (isOnGrid(x - 1, y) && grid[y][x - 1] == pixNum.COMPARATOR_RIGHT && numPixels[pixNum.COMPARATOR_RIGHT].isActivated(x - 1, y)) || (isOnGrid(x, y - 1) && grid[y - 1][x] == pixNum.COMPARATOR_DOWN && numPixels[pixNum.COMPARATOR_DOWN].isActivated(x, y - 1)) || (isOnGrid(x + 1, y) && grid[y][x + 1] == pixNum.COMPARATOR_LEFT && numPixels[pixNum.COMPARATOR_LEFT].isActivated(x + 1, y)) || (isOnGrid(x, y + 1) && grid[y + 1][x] == pixNum.COMPARATOR_UP && numPixels[pixNum.COMPARATOR_UP].isActivated(x, y + 1));
};
function explode(x1, y1, size, defer) {
    if (defer) {
        pendingExplosions.push([x1, y1, size]);
        return;
    }
    nextGrid[y1][x1] = pixNum.AIR;
    grid[y1][x1] = pixNum.AIR;
    teamGrid[y1][x1] = 0;
    function destroy(x, y, power) {
        if (random() < (power / size) * ((20 - pixelAt(x, y).blastResistance) / (85 - power))) {
            nextGrid[y][x] = pixNum.AIR;
            if (random() < 0.5 * power / size) {
                nextFireGrid[y][x] = true;
            }
            switch (grid[y][x]) {
                case pixNum.AIR:
                    return 0;
                case pixNum.WATER:
                case pixNum.SNOW:
                case pixNum.ICE:
                    if (random() < (power * power / size) * 0.2) nextGrid[y][x] = pixNum.STEAM;
                    break;
                case pixNum.GUNPOWDER:
                    pendingExplosions.push([x, y, 5]);
                    grid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    break;
                case pixNum.C4:
                    pendingExplosions.push([x, y, 15]);
                    grid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    break;
                case pixNum.FLAMETHROWER_LEFT:
                case pixNum.FLAMETHROWER_UP:
                case pixNum.FLAMETHROWER_RIGHT:
                case pixNum.FLAMETHROWER_DOWN:
                    pendingExplosions.push([x, y, 15]);
                    grid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    break;
                case pixNum.NUKE:
                    pendingExplosions.push([x, y, 20]);
                    grid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    break;
                case pixNum.HUGE_NUKE:
                    pendingExplosions.push([x, y, 40]);
                    grid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    break;
                case pixNum.VERY_HUGE_NUKE:
                    pendingExplosions.push([x, y, 80]);
                    grid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    break;
                default:
                    if (random() < 1.2 - (power / size)) {
                        switch (grid[y][x]) {
                            case pixNum.STONE:
                            case pixNum.BASALT:
                            case pixNum.CONCRETE:
                            case pixNum.STONE_BRICKS:
                            case pixNum.BRICKS:
                                nextGrid[y][x] = pixNum.GRAVEL;
                                break;
                            default:
                                nextGrid[y][x] = pixNum.ASH;
                                break;
                        }
                    } else teamGrid[y][x] = 0;
            }
            return pixelAt(x, y).blastResistance / 40;
        }
        return pixelAt(x, y).blastResistance / 5;
    };
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / (size * 4)) {
        let power = size;
        let x2 = Math.floor(Math.cos(angle) * size) + x1;
        let y2 = Math.floor(Math.sin(angle) * size) + y1;
        let slope = (y2 - y1) / (x2 - x1);
        if (!isFinite(slope)) {
            if (y2 < y1) {
                let step = size / (y1 - y2);
                for (let y = y1; y >= y2 && power > 1 && y >= 0 && y < gridHeight; y--) {
                    power -= destroy(x1, y, power);
                    power -= step;
                }
            } else {
                let step = size / (y2 - y1);
                for (let y = y1; y <= y2 && power > 1 && y >= 0 && y < gridHeight; y++) {
                    power -= destroy(x1, y, power);
                    power -= step;
                }
            }
        } else if (slope == 0) {
            if (x2 < x1) {
                let step = size / (x1 - x2);
                for (let x = x1; x >= x2 && power > 1 && x >= 0 && x < gridWidth; x--) {
                    power -= destroy(x, y1, power);
                    power -= step;
                }
            } else {
                let step = size / (x2 - x1);
                for (let x = x1; x <= x2 && power > 1 && x >= 0 && x < gridWidth; x++) {
                    power -= destroy(x, y1, power);
                    power -= step;
                }
            }
        } else if (Math.abs(slope) > 1) {
            slope = 1 / slope;
            if (y2 < y1) {
                let step = size / (y1 - y2);
                for (let y = y1; y >= y2 && power > 1 && y >= 0 && y < gridHeight; y--) {
                    let x = Math.round(slope * (y - y1)) + x1;
                    if (x < 0 || x >= gridWidth) break;
                    power -= destroy(x, y, power);
                    power -= step;
                }
            } else {
                let step = size / (y2 - y1);
                for (let y = y1; y <= y2 && power > 1 && y >= 0 && y < gridHeight; y++) {
                    let x = Math.round(slope * (y - y1)) + x1;
                    if (x < 0 || x >= gridWidth) break;
                    power -= destroy(x, y, power);
                    power -= step;
                }
            }
        } else {
            if (x2 < x1) {
                let step = size / (x1 - x2);
                for (let x = x1; x >= x2 && power > 1 && x >= 0 && x < gridWidth; x--) {
                    let y = Math.round(slope * (x - x1)) + y1;
                    if (y < 0 || y >= gridHeight) break;
                    power -= destroy(x, y, power);
                    power -= step;
                }
            } else {
                let step = size / (x2 - x1);
                for (let x = x1; x <= x2 && power > 1 && x >= 0 && x < gridWidth; x++) {
                    let y = Math.round(slope * (x - x1)) + y1;
                    if (y < 0 || y >= gridHeight) break;
                    power -= destroy(x, y, power);
                    power -= step;
                }
            }
        }
    }
    let distance = cameraDistance(x1, y1);
    cameraShake(x1, y1, size);
    let intensity = size * Math.min(1, Math.max(0, 1 - (distance / 150)));
    sounds.explosion(4 * ((intensity / 80) ** 2));
};
// craft
function craftPixel(id, team) {
    if (team == 0) return false;
    const inventory = teamPixelAmounts[team - 1];
    const recipe = pixels[id].recipe;
    for (let requirement in recipe) {
        if (requirement.endsWith('_any')) {
            let remain = recipe[requirement];
            let pixel = requirement.substring(0, requirement.lastIndexOf('_any'));
            let removePixels = (id) => {
                if (remain == 0) return;
                let before = inventory[id];
                inventory[id] = Math.max(0, inventory[id] - remain);
                remain -= before - inventory[id];
            };
            if (pixel == 'slider') {
                removePixels(pixel + '_horizontal');
                removePixels(pixel + '_vertical');
            } else if (pixel == 'mirror') {
                removePixels(pixel + '_1');
                removePixels(pixel + '_2');
            } else {
                removePixels(pixel + '_left');
                removePixels(pixel + '_up');
                removePixels(pixel + '_right');
                removePixels(pixel + '_down');
            }
        } else {
            inventory[requirement] -= recipe[requirement];
        }
    }
    inventory[id]++;
};
function canCraft(id, team) {
    if (team == 0) return false;
    const inventory = teamPixelAmounts[team - 1];
    const recipe = pixels[id].recipe;
    for (let requirement in recipe) {
        let total = inventory[requirement] ?? 0;
        if (requirement.endsWith('_any')) {
            let pixel = requirement.substring(0, requirement.lastIndexOf('_any'));
            if (pixel == 'slider') {
                total = inventory[pixel + '_horizontal'] + inventory[pixel + '_vertical'];
            } else if (pixel == 'mirror') {
                total = inventory[pixel + '_1'] + inventory[pixel + '_2'];
            } else {
                total = inventory[pixel + '_left'] + inventory[pixel + '_up'] + inventory[pixel + '_right'] + inventory[pixel + '_down'];
            }
        }
        if (total < recipe[requirement]) {
            return false;
        }
    }
    return true;
};

// draw and update
let deltaTime = 0;
let lastDeltaTime = 0;
let ticks = 0;
let simulationPaused = true;
let slowSimulation = false;
let fastSimulation = false;
let runTicks = 0;
let diffuseMode = false;
let fps = parseInt(window.localStorage.getItem('fps') ?? 60);
let targetFps = fps;
const frameList = [];
const fpsList = [];
const timingList = [];
const frameModulo = new Map();
frameModulo.set(10, 0); // yes jank
frameModulo.set(30, 0);
let lastFpsList = 0;
let lastTick = 0;
let frameTime = 0;
let tickTime = 0;
let averageFrameTime = 0;
let averageTickTime = 0;
const timingGradient = ctx.createLinearGradient(0, 141, 0, 241);
timingGradient.addColorStop(0, '#F0F');
timingGradient.addColorStop(0.1, '#F00');
timingGradient.addColorStop(0.25, '#F00');
timingGradient.addColorStop(0.4, '#FF0');
timingGradient.addColorStop(0.7, '#0F0');
timingGradient.addColorStop(1, '#0F0');
let forceDrawTeamGrid = false;
function draw() {
    if ((inMenuScreen || document.hidden) && !PixSimAPI.inGame) {
        targetFps = 5;
        return;
    } else targetFps = fps;

    // reset stuff
    ctx.resetTransform();
    gamectx.resetTransform();
    gridctx.resetTransform();
    gridnoisectx.resetTransform();
    abovectx.resetTransform();
    firectx.resetTransform();
    targetctx.resetTransform();
    placeablectx.resetTransform();
    teamsctx.resetTransform();
    bufferctx.resetTransform();
    ctx.globalAlpha = 1;
    gamectx.globalAlpha = 1;
    gridctx.globalAlpha = 1;
    gridnoisectx.globalAlpha = 1;
    abovectx.globalAlpha = 1;
    firectx.globalAlpha = 1;
    targetctx.globalAlpha = 1;
    placeablectx.globalAlpha = 1;
    teamsctx.globalAlpha = 1;
    bufferctx.globalAlpha = 1;
    bufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
    bufferctx.globalCompositeOperation = 'source-over';
    ctx.setLineDash([]);

    updateBrush();
    updateCamera();
    drawFrame();
    updateTick();

    let now = performance.now();
    while (frameList[0] + 1000 <= now) {
        frameList.shift();
    }
    drawUI();

    // mouse cursor
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.globalCompositeOperation = 'difference';
    ctx.fillRect(mX - 4, mY - 4, 8, 8);
    ctx.globalCompositeOperation = 'source-over';

    prevMXGrid = mXGrid;
    prevMYGrid = mYGrid;
    prevMX = mX;
    prevMY = mY;

    deltaTime = Math.round(performance.now() * 0.06);
};
function drawFrame() {
    let frameStart = performance.now();
    ctx.clearRect(0, 0, canvasResolution, canvasResolution);
    if (!fastSimulation || frameModulo.get(10) >= 10) {
        // set up draw
        gamectx.globalAlpha = (255 - fadeEffect) / 255;
        gamectx.fillStyle = backgroundColor;
        gamectx.fillRect(0, 0, canvasResolution, canvasResolution);
        gamectx.globalAlpha = 1;
        if (forceRedraw) {
            gamectx.fillRect(0, 0, canvasResolution, canvasResolution);
            gridctx.clearRect(0, 0, canvasResolution, canvasResolution);
            firectx.clearRect(0, 0, canvasResolution, canvasResolution);
            teamsctx.clearRect(0, 0, canvasResolution, canvasResolution);
            placeablectx.clearRect(0, 0, canvasResolution, canvasResolution);
            if (!noNoise) {
                noisebufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
                noisebufferctx.drawImage(noiseCanvas, -camera.x, -camera.y, gridWidth * drawScale, gridHeight * drawScale);
            }
        }
        gridnoisectx.clearRect(0, 0, canvasResolution, canvasResolution);
        abovectx.clearRect(0, 0, canvasResolution, canvasResolution);

        // get rectangles to draw
        let drawTeamGrid = PixSimAPI.inGame || forceDrawTeamGrid;
        for (let i in numPixels) {
            numPixels[i].rectangles.length = 0;
        }
        for (let y = camera.viewport.ymin; y <= camera.viewport.ymax; y++) {
            let curr = grid[y][camera.viewport.xmin];
            let redrawing = grid[y][camera.viewport.xmin] != lastGrid[y][camera.viewport.xmin];
            let amount = 0;
            for (let x = camera.viewport.xmin + 1; x <= camera.viewport.xmax; x++) {
                amount++;
                if (grid[y][x] != curr || (grid[y][x] != lastGrid[y][x]) != redrawing) {
                    const pixelType = pixelData(curr);
                    if (curr != pixNum.AIR && (forceRedraw || redrawing || pixelType.alwaysRedraw || (pixelType.animated && !noAnimations) || (pixelType.animatedNoise && !noNoise && !noAnimations))) {
                        pixelType.rectangles.push([x - amount, y, amount, 1, redrawing]);
                    } else if (curr == pixNum.AIR && (forceRedraw || redrawing)) {
                        clearPixels(x - amount, y, amount, 1, gridctx);
                    }
                    curr = grid[y][x];
                    redrawing = grid[y][x] != lastGrid[y][x];
                    amount = 0;
                }
                lastGrid[y][x] = grid[y][x];
            }
            const pixelType = pixelData(curr);
            if (curr != pixNum.AIR && (forceRedraw || redrawing || pixelType.alwaysRedraw || (pixelType.animated && !noAnimations) || (pixelType.animatedNoise && !noNoise && !noAnimations))) {
                pixelType.rectangles.push([camera.viewport.xmax - amount, y, amount + 1, 1, redrawing]);
            } else if (curr == pixNum.AIR && (forceRedraw || redrawing)) {
                clearPixels(camera.viewport.xmax - amount, y, amount + 1, 1, gridctx);
            }
        }
        const teamPixelRects = [[], []];
        if (drawTeamGrid) {
            for (let y = camera.viewport.ymin; y <= camera.viewport.ymax; y++) {
                let curr = teamGrid[y][camera.viewport.xmin];
                let redrawing = teamGrid[y][camera.viewport.xmin] != lastTeamGrid[y][camera.viewport.xmin];
                let amount = -1;
                for (let x = camera.viewport.xmin; x <= camera.viewport.xmax; x++) {
                    amount++;
                    if (teamGrid[y][x] != curr || (teamGrid[y][x] != lastTeamGrid[y][x]) != redrawing) {
                        if (curr > 0 && (forceRedraw || redrawing)) {
                            clearPixels(x - amount, y, amount, 1, teamsctx);
                            teamPixelRects[curr - 1].push([x - amount, y, amount, 1]);
                        } else if (curr == 0 && (forceRedraw || redrawing)) {
                            clearPixels(x - amount, y, amount, 1, teamsctx);
                        }
                        curr = teamGrid[y][x];
                        redrawing = teamGrid[y][x] != lastTeamGrid[y][x];
                        amount = 0;
                    }
                    lastTeamGrid[y][x] = teamGrid[y][x];
                }
                if (curr > 0 && (forceRedraw || redrawing)) {
                    clearPixels(camera.viewport.xmax - amount, y, amount + 1, 1, teamsctx);
                    teamPixelRects[curr - 1].push([camera.viewport.xmax - amount, y, amount + 1, 1]);
                } else if (curr == 0 && (forceRedraw || redrawing)) {
                    clearPixels(camera.viewport.xmax - amount, y, amount + 1, 1, teamsctx);
                }
            }
        }

        // draw calls
        for (let i in numPixels) {
            if (numPixels[i].rectangles.length > 0) numPixels[i].draw(numPixels[i].rectangles, gridctx, false);
        }
        drawBooleanGrid(fireGrid, lastFireGrid, pixNum.FIRE, firectx);
        drawBooleanGrid(targetGrid, targetGrid, pixNum.TARGET, targetctx);
        if (!PixSimAPI.inGame) drawBooleanGrid(placeableGrid, lastPlaceableGrid, pixNum.PLACEMENTRESTRICTION, placeablectx, true);
        else drawBooleanGrid(PixSimAPI.team ? teamPlaceableGrids[1] : teamPlaceableGrids[0], lastPlaceableGrid, pixNum.PLACEMENTRESTRICTION, placeablectx, true);
        if (!noNoise) {
            gridnoisectx.globalAlpha = 1;
            gridnoisectx.globalCompositeOperation = 'destination-in';
            gridnoisectx.drawImage(noiseBufferCanvas, 0, 0);
            gridnoisectx.globalCompositeOperation = 'source-over';
        }
        if (drawTeamGrid) {
            teamsctx.globalAlpha = 0.3;
            teamsctx.fillStyle = '#FF0099';
            forRectangles(teamPixelRects[0], (x, y, width, height) => {
                fillPixels(x, y, width, height, teamsctx);
            });
            teamsctx.fillStyle = '#3C70FF';
            forRectangles(teamPixelRects[1], (x, y, width, height) => {
                fillPixels(x, y, width, height, teamsctx);
            });
            // bufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
            // bufferctx.globalAlpha = 1;
            // bufferctx.fillStyle = '#FF0099';
            // forRectangles(teamPixelRects[0], (x, y, width, height) => {
            //     fillPixels(x, y, width, height, bufferctx);
            // });
            // bufferctx.fillStyle = '#3C70FF';
            // forRectangles(teamPixelRects[1], (x, y, width, height) => {
            //     fillPixels(x, y, width, height, bufferctx);
            // });
            // bufferctx.globalCompositeOperation = 'destination-in';
            // bufferctx.globalAlpha = 0.5;
            // bufferctx.drawImage(noiseBufferCanvas, 0, 0);
            // bufferctx.globalCompositeOperation = 'source-over';
            // teamsctx.drawImage(bufferCanvas, 0, 0);
        }

        // copy layers
        ctx.globalAlpha = 1;
        gamectx.globalAlpha = 1;
        gridctx.drawImage(gridNoiseCanvas, 0, 0);
        gamectx.drawImage(gridCanvas, 0, 0);
        gamectx.drawImage(aboveCanvas, 0, 0);
        gamectx.drawImage(targetCanvas, 0, 0);
        gamectx.drawImage(fireCanvas, 0, 0);
        gamectx.drawImage(teamsCanvas, 0, 0);

        forceRedraw = false;
    }
    if (enableCameraShake && Math.round(camera.shakeIntensity * 10) > 0) {
        let intensity = camera.shakeIntensity * drawScale;
        let shakeX = Math.round(Math.random() * (2 * intensity) - intensity);
        let shakeY = Math.round(Math.random() * (2 * intensity) - intensity);
        let shakeSizeIncrease = Math.max(Math.abs(shakeX), Math.abs(shakeY));
        ctx.drawImage(gameCanvas, Math.min(shakeX, 0), Math.min(shakeY, 0), canvasResolution + shakeSizeIncrease, canvasResolution + shakeSizeIncrease);
    } else {
        ctx.drawImage(gameCanvas, 0, 0);
    }
    if (inResetState || sandboxMode || PixSimAPI.inGame) {
        ctx.globalAlpha = 0.2;
        ctx.drawImage(placeableCanvas, 0, 0);
    }

    drawBrush();

    if (simulationPaused && runTicks <= 0 || (!simulationPaused && !fastSimulation && slowSimulation && performance.now() - lastTick < 100)) {
        frameList.push(performance.now());
    }

    frameTime = performance.now() - frameStart;
    averageFrameTime = 0.95 * averageFrameTime + 0.05 * frameTime;
    frameModulo.forEach((v, k) => {
        if (v >= k) frameModulo.set(k, 0);
        frameModulo.set(k, v + deltaTime - lastDeltaTime);
    });
    lastDeltaTime = deltaTime;
};
function drawBooleanGrid(grid, lastGrid, type, ctx, invert = false) {
    const pixelD = pixelData(type);
    pixelD.rectangles.length = 0;
    if (grid === lastGrid) {
        ctx.clearRect(0, 0, canvasResolution, canvasResolution);
        for (let y = camera.viewport.ymin; y <= camera.viewport.ymax; y++) {
            let pixel = false;
            let amount = 0;
            for (let x = camera.viewport.xmin; x <= camera.viewport.xmax; x++) {
                amount++;
                if (grid[y][x] != pixel) {
                    if (pixel ^ invert) pixelD.rectangles.push([x - amount, y, amount, 1, true]);
                    pixel = grid[y][x];
                    amount = 0;
                }
            }
            if (pixel) pixelD.rectangles.push([camera.viewport.xmax - amount, y, amount + 1, 1, true]);
        }
    } else {
        for (let y = camera.viewport.ymin; y <= camera.viewport.ymax; y++) {
            let pixel = false;
            let redrawing = grid[y][0] != lastGrid[y][0];
            let amount = 0;
            for (let x = camera.viewport.xmin; x <= camera.viewport.xmax; x++) {
                amount++;
                if (grid[y][x] != pixel || (grid[y][x] != lastGrid[y][x]) != redrawing) {
                    if (pixel ^ invert && (forceRedraw || redrawing)) pixelD.rectangles.push([x - amount, y, amount, 1, true]);
                    else if (!pixel ^ invert && (forceRedraw || redrawing)) clearPixels(x - amount, y, amount, 1, ctx);
                    pixel = grid[y][x];
                    redrawing = grid[y][x] != lastGrid[y][x];
                    amount = 0;
                }
                lastGrid[y][x] = grid[y][x];
            }
            if (pixel ^ invert && (forceRedraw || redrawing)) pixelD.rectangles.push([camera.viewport.xmax - amount, y, amount + 1, 1, true]);
            else if (!pixel ^ invert && (forceRedraw || redrawing)) clearPixels(camera.viewport.xmax - amount, y, amount + 1, 1, ctx);
        }
    }
    if (pixelD.rectangles.length > 0) pixelD.draw(pixelD.rectangles, ctx, false);
};
function drawBrush() {
    if (!fastSimulation && !brush.selecting && !inWinScreen) {
        if (brush.isSelection && selection.grid[0] !== undefined) {
            let x1 = Math.min(gridWidth, Math.max(0, Math.ceil(mXGrid - selection.grid[0].length / 2)));
            let x2 = Math.min(gridWidth - 1, Math.max(-1, Math.ceil(mXGrid + selection.grid[0].length / 2) - 1));
            let y1 = Math.min(gridHeight, Math.max(0, Math.ceil(mYGrid - selection.grid.length / 2)));
            let y2 = Math.min(gridHeight - 1, Math.max(-1, Math.ceil(mYGrid + selection.grid.length / 2) - 1));
            let offsetX = Math.ceil(mXGrid - selection.grid[0].length / 2);
            let offsetY = Math.ceil(mYGrid - selection.grid.length / 2);
            bufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
            bufferctx.globalCompositeOperation = 'source-over';
            for (let y = 0; y < selection.grid.length; y++) {
                for (let x = 0; x < selection.grid[y].length; x++) {
                    if (isOnGrid(x + offsetX, y + offsetY)) drawPixels(selection.grid[y][x], [[x + offsetX, y + offsetY, 1, 1, true]], bufferctx, true);
                }
            }
            ctx.globalAlpha = 0.5;
            ctx.drawImage(bufferCanvas, 0, 0, canvasResolution, canvasResolution);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            ctx.setLineDash([drawScale / 2, drawScale / 2]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.lineJoin = 'miter';
            ctx.strokeRect(x1 * drawScale - camera.x, y1 * drawScale - camera.y, (x2 - x1 + 1) * drawScale, (y2 - y1 + 1) * drawScale);
        } else if (brush.lineMode && !brush.startsInRPE) {
            const placePixelNum = (brush.mouseButton == 2 || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId;
            bufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
            bufferctx.globalCompositeOperation = 'source-over';
            brushActionLine(brush.lineStartX, brush.lineStartY, mXGrid, mYGrid, brush.size, (rect) => {
                drawPixels(placePixelNum, [[rect.xmin, rect.ymin, rect.xmax - rect.xmin + 1, rect.ymax - rect.ymin + 1, true]], bufferctx, true);
            });
            ctx.globalAlpha = 0.5;
            ctx.drawImage(bufferCanvas, 0, 0, canvasResolution, canvasResolution);
            let rect = calcBrushRectCoordinates(mXGrid, mYGrid);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.setLineDash([]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.lineJoin = 'miter';
            ctx.globalCompositeOperation = 'difference';
            ctx.strokeRect(rect.xmin * drawScale - camera.x, rect.ymin * drawScale - camera.y, (rect.xmax - rect.xmin + 1) * drawScale, (rect.ymax - rect.ymin + 1) * drawScale);
            ctx.globalCompositeOperation = 'source-over';
        } else {
            let rect = calcBrushRectCoordinates(mXGrid, mYGrid);
            bufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
            bufferctx.globalCompositeOperation = 'source-over';
            drawPixels((brush.mouseButton == 2 || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId, [[rect.xmin, rect.ymin, rect.xmax - rect.xmin + 1, rect.ymax - rect.ymin + 1, true]], bufferctx, true);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(bufferCanvas, 0, 0, canvasResolution, canvasResolution);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.setLineDash([]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.lineJoin = 'miter';
            ctx.globalCompositeOperation = 'difference';
            ctx.strokeRect(rect.xmin * drawScale - camera.x, rect.ymin * drawScale - camera.y, (rect.xmax - rect.xmin + 1) * drawScale, (rect.ymax - rect.ymin + 1) * drawScale);
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
        fillPixels(xmin, ymin, xmax - xmin + 1, ymax - ymin + 1, ctx);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.setLineDash([drawScale / 2, drawScale / 2]);
        ctx.lineWidth = 2 * camera.scale;
        ctx.lineJoin = 'miter';
        ctx.strokeRect(xmin * drawScale - camera.x, ymin * drawScale - camera.y, (xmax - xmin + 1) * drawScale, (ymax - ymin + 1) * drawScale);
    }
};
function updateCamera() {
    if ((!simulationPaused || !fastSimulation) && !inWinScreen) {
        if (camera.animation.t1 >= performance.now() || camera.animation.running) {
            let t = camera.animation.timing.at((performance.now() - camera.animation.t0) / (camera.animation.t1 - camera.animation.t0));
            camera.x = (camera.animation.x2 - camera.animation.x1) * t + camera.animation.x1;
            camera.y = (camera.animation.y2 - camera.animation.y1) * t + camera.animation.y1;
            camera.scale = Math.round(((camera.animation.s2 - camera.animation.s1) * t + camera.animation.s1) * 1000) / 1000;
            drawScale = gridScale * camera.scale;
            screenScale = (gridWidth < gridHeight ? gridWidth : gridHeight) / canvasSize / camera.scale / canvasScale;
            forceRedraw = true;
            if (camera.animation.t1 < performance.now()) camera.animation.running = false;
        } else if (acceptInputs) {
            if (camera.mUp && !camera.mDown) {
                camera.y = Math.max(0, Math.min(camera.y - 20, (canvasResolution * (gridHeight / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
                forceRedraw = true;
            } else if (camera.mDown && !camera.mUp) {
                camera.y = Math.max(0, Math.min(camera.y + 20, (canvasResolution * (gridHeight / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
                forceRedraw = true;
            }
            if (camera.mLeft && !camera.mRight) {
                camera.x = Math.max(0, Math.min(camera.x - 20, (canvasResolution * (gridWidth / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
                forceRedraw = true;
            } else if (camera.mRight && !camera.mLeft) {
                camera.x = Math.max(0, Math.min(camera.x + 20, (canvasResolution * (gridWidth / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
                forceRedraw = true;
            }
        }
        if (forceRedraw) {
            mXGrid = Math.floor((mX + camera.x) * screenScale);
            mYGrid = Math.floor((mY + camera.y) * screenScale);
        }
        camera.viewport.xmin = Math.max(0, Math.floor(camera.x * screenScale) - 1);
        camera.viewport.xmax = Math.min(gridWidth - 1, Math.floor((camera.x + canvasResolution) * screenScale) + 1);
        camera.viewport.ymin = Math.max(0, Math.floor(camera.y * screenScale) - 1);
        camera.viewport.ymax = Math.min(gridHeight - 1, Math.floor((camera.y + canvasResolution) * screenScale) + 1);
    }
    camera.shakeIntensity *= 0.9;
};
function drawUI() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.font = '20px Source Code Pro';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    if (debugInfo) {
        if (simulationPaused && fastSimulation) ctx.fillStyle = '#FFF';
        else ctx.fillStyle = '#7F7F7F7F';
        ctx.fillRect(5, 46, 300, 200);
        ctx.fillStyle = '#000';
        for (let i = 0; i < fpsList.length; i++) {
            ctx.fillRect(5 + i * 3, 146 - Math.min(100, fpsList[i]), 3, Math.min(100, fpsList[i]));
        }
        ctx.strokeStyle = timingGradient;
        ctx.lineJoin = 'bevel';
        ctx.lineCap = 'butt';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        let timingRatio = fps * 0.075;
        ctx.moveTo(5, Math.max(147, 245 - timingList[0][0] * timingRatio));
        for (let i = 1; i < timingList.length; i++) {
            ctx.lineTo(5 + i * 3, Math.max(147, 245 - timingList[i][0] * timingRatio));
        }
        ctx.moveTo(5, Math.max(147, 245 - timingList[0][0] * timingRatio - timingList[0][1] * timingRatio));
        for (let i = 1; i < timingList.length; i++) {
            ctx.lineTo(5 + i * 3, Math.max(147, 245 - timingList[i][0] * timingRatio - timingList[i][1] * timingRatio));
        }
        ctx.stroke();
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(8, 181);
        ctx.lineTo(302, 181);
        ctx.stroke();
        ctx.fillText('FPS (10s)', 10, 47);
        ctx.fillText('Timings (10s)', 10, 147);
        // oops deprecated features
        let heapUsed = Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100;
        let heapAvailable = Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100;
        let heapText = `Heap: ${heapUsed}/${heapAvailable}MB (${Math.round(heapUsed / heapAvailable * 1000) / 10}%)`;
        ctx.fillStyle = '#FFF5';
        ctx.fillRect(1, 246, ctx.measureText(heapText).width + 4, 20);
        ctx.fillStyle = '#000';
        ctx.fillText(heapText, 3, 247);
    }
    let fpsText = `FPS: ${frameList.length} ${debugInfo ? `(${frameTime.toFixed(1)}ms/${averageFrameTime.toFixed(1)}ms)` : ''}`;
    let tickText = `Tick: ${ticks} ${debugInfo ? `(${tickTime.toFixed(1)}ms/${averageTickTime.toFixed(1)}ms)` : ''}`;
    let brushPixelText = (brush.isSelection && selection.grid[0] !== undefined) ? `Brush: Paste` : `Brush Pixel: ${(pixels[brush.pixel] ?? numPixels[pixNum.MISSING]).name}`;
    let brushSizeText = `Brush Size: ${(brush.isSelection && selection.grid[0] !== undefined) ? '-' : brush.size * 2 - 1}`;
    let brushLocationText = `${pixelAt(Math.max(camera.viewport.xmin, Math.min(camera.viewport.xmax, mXGrid)), Math.max(camera.viewport.ymin, Math.min(camera.viewport.ymax, mYGrid))).name} (${Math.max(camera.viewport.xmin, Math.min(camera.viewport.xmax, mXGrid))}, ${Math.max(camera.viewport.ymin, Math.min(camera.viewport.ymax, mYGrid))})`;
    let zoomText = `Zoom: ${Math.round(camera.scale * 10) / 10}`;
    ctx.fillStyle = '#FFF5';
    ctx.fillRect(4, 4, ctx.measureText(fpsText).width + 4, 20);
    ctx.fillRect(4, 25, ctx.measureText(tickText).width + 4, 20);
    ctx.fillRect(canvasResolution - 4, 4, -ctx.measureText(brushSizeText).width - 4, 20);
    ctx.fillRect(canvasResolution - 4, 25, -ctx.measureText(brushPixelText).width - 4, 20);
    ctx.fillRect(canvasResolution - 4, 46, -ctx.measureText(zoomText).width - 4, 20);
    ctx.fillRect(canvasResolution - 4, 67, -ctx.measureText(brushLocationText).width - 4, 20);
    ctx.fillStyle = '#000';
    ctx.fillText(fpsText, 6, 5);
    ctx.fillText(tickText, 6, 26);
    while (lastFpsList + 100 < performance.now()) {
        lastFpsList += 100;
        fpsList.push(frameList.length);
        timingList.push([tickTime, frameTime]);
        while (fpsList.length > 100) {
            fpsList.shift();
        }
        while (timingList.length > 101) {
            timingList.shift();
        }
    }
    ctx.textAlign = 'right';
    ctx.fillText(brushSizeText, canvasResolution - 6, 5);
    ctx.fillText(brushPixelText, canvasResolution - 6, 26);
    ctx.fillText(zoomText, canvasResolution - 6, 47);
    ctx.fillText(brushLocationText, canvasResolution - 6, 68);
    if (fastSimulation) {
        ctx.font = '60px Source Code Pro';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SIMULATING...', canvasResolution / 2, canvasResolution / 2);
    } else if (simulationPaused) {
        ctx.fillStyle = '#FFF5';
        ctx.fillRect(canvasResolution - 4, 88, -76, 20);
        ctx.fillStyle = '#000';
        ctx.fillText('PAUSED', canvasResolution - 6, 89);
    } else if (slowSimulation) {
        ctx.fillStyle = '#FFF5';
        ctx.fillRect(canvasResolution - 4, 88, -100, 20);
        ctx.fillStyle = '#000';
        ctx.fillText('SLOWMODE', canvasResolution - 6, 89);
    }
    if (PixSimAPI.inGame) drawPixSimUI();
};
// TODO: Decouple ticking from drawing (but both draw and update need shared pixel functions)
function updateTick() {
    let tickStart = performance.now();
    if ((!PixSimAPI.inGame || PixSimAPI.isHost) && ((!simulationPaused && (!slowSimulation || fastSimulation)) || runTicks > 0 || (!simulationPaused && !fastSimulation && slowSimulation && performance.now() - lastTick >= 100))) {
        runTicks = 0; // lol
        let max = fastSimulation ? 10 : 1;
        for (let i = 0; i < max; i++) {
            /*
            update priority:
            -: fire
            0: nukes, plants, moss, sponges, flamethrowers, gunpowder, detonators, lasers, spongy rice, lag, music pixels
            1, 2, 3, 4: pushers, sticky pushers, copiers, cloners, super copiers, carriages
            5: gravity solids, stone, ice, rotators, saplings, monsters, water, lava, steam, leaves, pumps, lava generators, freezers, wells, color wells, color generators, color collectors
            */
            let monsterCount = 0;
            let fulfilledTargetCount = 0;
            const firePixelType = numPixels[pixNum.FIRE];
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    if (grid[y][x] == pixNum.MONSTER) monsterCount++;
                    if (targetGrid[y][x] && grid[y][x] == pixNum.GOAL) fulfilledTargetCount++;
                    if (fireGrid[y][x]) {
                        randomSeed(ticks, x, y);
                        firePixelType.update(x, y);
                    }
                }
            }
            let currentExplosions = pendingExplosions;
            pendingExplosions = [];
            for (let explosion of currentExplosions) {
                explode(...explosion);
            }
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    if (nextFireGrid[y][x] !== -1) {
                        fireGrid[y][x] = nextFireGrid[y][x];
                        nextFireGrid[y][x] = -1;
                    }
                    if (nextGrid[y][x] !== -1) {
                        grid[y][x] = nextGrid[y][x];
                        nextGrid[y][x] = -1;
                    }
                    lastMusicGrid[y][x] = musicGrid[y][x];
                    musicGrid[y][x] = 0;
                }
            }
            for (let updateStage = 0; updateStage <= 5; updateStage++) {
                switch (updateStage) {
                    case 1:
                        for (let y = gridHeight - 1; y >= 0; y--) {
                            for (let x = 0; x < gridWidth; x++) {
                                grid[y][x] !== pixNum.AIR && updatePixel(x, y, updateStage);
                            }
                        }
                        break;
                    case 2:
                        for (let y = 0; y < gridHeight; y++) {
                            for (let x = 0; x < gridWidth; x++) {
                                grid[y][x] !== pixNum.AIR && updatePixel(x, y, updateStage);
                            }
                        }
                        break;
                    case 3:
                        for (let y = 0; y < gridHeight; y++) {
                            for (let x = gridWidth - 1; x >= 0; x--) {
                                grid[y][x] !== pixNum.AIR && updatePixel(x, y, updateStage);
                            }
                        }
                        break;
                    case 4:
                        for (let y = 0; y < gridHeight; y++) {
                            for (let x = 0; x < gridWidth; x++) {
                                grid[y][x] !== pixNum.AIR && updatePixel(x, y, updateStage);
                            }
                        }
                        break;
                    default:
                        if (ticks % 2 == 0) {
                            for (let y = 0; y < gridHeight; y++) {
                                for (let x = gridWidth - 1; x >= 0; x--) {
                                    grid[y][x] !== pixNum.AIR && updatePixel(x, y, updateStage);
                                }
                            }
                        } else {
                            for (let y = 0; y < gridHeight; y++) {
                                for (let x = 0; x < gridWidth; x++) {
                                    grid[y][x] !== pixNum.AIR && updatePixel(x, y, updateStage);
                                }
                            }
                        }
                        break;
                }
                for (let y = 0; y < gridHeight; y++) {
                    for (let x = 0; x < gridWidth; x++) {
                        if (nextGrid[y][x] !== -1) {
                            grid[y][x] = nextGrid[y][x];
                            nextGrid[y][x] = -1;
                        }
                    }
                }
            }
            if (diffuseMode) {
                for (let y = 0; y < gridHeight; y++) {
                    for (let x = gridWidth - 1; x >= 0; x--) {
                        if (validChangingPixel(x, y) && Math.random() < 0.5) {
                            if (Math.random() < 0.5) {
                                if (Math.random() < 0.5) {
                                    if (isOnGrid(x - 1, y) && validChangingPixel(x - 1, y)) move(x, y, x - 1, y);
                                } else {
                                    if (isOnGrid(x + 1, y) && validChangingPixel(x + 1, y)) move(x, y, x + 1, y);
                                }
                            } else {
                                if (Math.random() < 0.5) {
                                    if (isOnGrid(x, y - 1) && validChangingPixel(x, y - 1)) move(x, y, x, y - 1);
                                } else {
                                    if (isOnGrid(x, y + 1) && validChangingPixel(x, y + 1)) move(x, y, x, y + 1);
                                }
                            }
                        }
                    }
                }
                for (let y = 0; y < gridHeight; y++) {
                    for (let x = 0; x < gridWidth; x++) {
                        if (nextGrid[y][x] !== -1) {
                            grid[y][x] = nextGrid[y][x];
                            nextGrid[y][x] = -1;
                        }
                    }
                }
            }
            let newMonsterCount = 0;
            let newFulfilledTargetCount = 0;
            let hasUnfulfilledTargets = false;
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    if (grid[y][x] == pixNum.MONSTER) newMonsterCount++;
                    if (nextFireGrid[y][x] !== -1) {
                        fireGrid[y][x] = nextFireGrid[y][x];
                        nextFireGrid[y][x] = -1;
                    }
                    if (targetGrid[y][x]) {
                        if (grid[y][x] == pixNum.GOAL) newFulfilledTargetCount++;
                        else hasUnfulfilledTargets = true;
                    }
                    if (musicGrid[y][x] != lastMusicGrid[y][x]) {
                        if (musicGrid[y][x] != 0) musicPixel(musicGrid[y][x], true);
                        else if (musicGrid[y][x] == 0) musicPixel(lastMusicGrid[y][x], false);
                    }
                }
            }
            if (newMonsterCount != monsterCount) sounds.monsterDeath();
            if (newFulfilledTargetCount != fulfilledTargetCount) sounds.targetFill();
            frameList.push(performance.now());
            resolveQueuedPixelAmountUpdates();
            ticks++;
            if (!sandboxMode && newMonsterCount == 0 && !hasUnfulfilledTargets && !PixSimAPI.inGame) {
                triggerWin();
                break;
            }
            inResetState = false;
        }

        // multiplayer tick and send
        if (PixSimAPI.inGame && PixSimAPI.gameRunning) {
            new Promise(async (resolve, reject) => {
                await pixsimData.scriptRunner.tick();
                PixSimAPI.sendTick(grid, teamGrid, [
                    fireGrid,
                    targetGrid,
                    teamPlaceableGrids[0],
                    teamPlaceableGrids[1]
                ], {
                    tick: ticks,
                    pixelAmounts: getPixSimPixelAmounts(),
                    pixeliteCounts: pixsimData.pixeliteCounts,
                    cameraShake: camera.shakeIntensity
                });
            });
        }

        lastTick = performance.now();
    }
    tickTime = performance.now() - tickStart;
    averageTickTime = 0.95 * averageTickTime + 0.05 * tickTime;
};
async function startDrawLoop() {
    window.startDrawLoop = undefined;
    let start;
    while (true) {
        start = performance.now();
        await new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {
                draw();
                setTimeout(resolve, ~~(1000 / targetFps - (performance.now() - start) - 1));
            });
        });
    }
};
window.addEventListener('load', startDrawLoop);

// brush
function calcBrushRectCoordinates(x, y, size = brush.size) {
    return {
        xmin: Math.max(0, Math.min(x - size + 1, gridWidth)),
        xmax: Math.max(-1, Math.min(x + size - 1, gridWidth - 1)),
        ymin: Math.max(0, Math.min(y - size + 1, gridHeight)),
        ymax: Math.max(-1, Math.min(y + size - 1, gridHeight - 1))
    };
};
function updateBrush() {
    const inventory = PixSimAPI.inGame ? (PixSimAPI.team ? teamPixelAmounts[1] : teamPixelAmounts[0]) : pixelAmounts;
    const placeable = PixSimAPI.inGame ? (pxteam ? teamPlaceableGrids[1] : teamPlaceableGrids[0]) : placeableGrid;
    if (brush.mouseButton == 2 || removing) brush.isSelection = false;
    if (!fastSimulation && acceptInputs && !inWinScreen && mouseOver && (!brush.lineMode || !brush.startsInRPE)) {
        if (((brush.mouseButton != -1 && holdingAlt) || brush.lineMode) && !(brush.isSelection && selection.grid[0] !== undefined)) {
            if (!brush.lineMode) {
                brush.lineMode = true;
                brush.lineStartX = mXGrid;
                brush.lineStartY = mYGrid;
                brush.startsInRPE = false;
            }
            if (brush.mouseButton == -1) {
                brush.lineMode = false;
                clickLine(brush.lineStartX, brush.lineStartY, mXGrid, mYGrid, brush.lastMouseButton == 2 || removing);
            }
        } else if (brush.mouseButton != -1) {
            brush.lineMode = false;
            if (brush.isSelection && selection.grid[0] !== undefined && (!PixSimAPI.inGame || !PixSimAPI.spectating)) {
                let offsetX = Math.ceil(mXGrid - selection.grid[0].length / 2);
                let offsetY = Math.ceil(mYGrid - selection.grid.length / 2);
                let modifiedPixelCounts = [];
                let changed = false;
                for (let y = 0; y < selection.grid.length; y++) {
                    if (y + offsetY >= 0 && y + offsetY < gridHeight) for (let x = 0; x < selection.grid[y].length; x++) {
                        if (x + offsetX >= 0 && x + offsetX < gridWidth) {
                            if (sandboxMode || (placeable[y + offsetY][x + offsetX] && grid[y + offsetY][x + offsetX] != pixNum.DELETER)) {
                                if (!sandboxMode) {
                                    let pid = pixelData(selection.grid[y][x]).id;
                                    if (inventory[pid] <= 0) continue;
                                    modifiedPixelCounts[grid[y + offsetY][x + offsetX]] = true;
                                    inventory[pixelAt(x + offsetX, y + offsetY).id]++;
                                    modifiedPixelCounts[selection.grid[y][x]] = true;
                                    inventory[pid]--;
                                }
                                changed = changed || grid[y + offsetY][x + offsetX] != selection.grid[y][x];
                                grid[y + offsetY][x + offsetX] = selection.grid[y][x];
                                if (musicGrid[y + offsetY][x + offsetX]) {
                                    musicPixel(musicGrid[y + offsetY][x + offsetX], false);
                                    musicGrid[y + offsetY][x + offsetX] = 0;
                                }
                                if (selection.grid[y][x] >= pixNum.MUSIC_1 && selection.grid[y][x] <= pixNum.MUSIC_88) musicGrid[y + offsetY][x + offsetX] = 0;
                            }
                        }
                    }
                }
                for (let pixelType in modifiedPixelCounts) {
                    if (pixelType != pixNum.AIR) updatePixelAmount(numPixels[pixelType].id, inventory);
                }
                if (!sandboxMode && !PixSimAPI.inGame) {
                    saveCode = generateSaveCode();
                    window.localStorage.setItem(`challenge-${currentPuzzle.id}`, LZString.compressToBase64(JSON.stringify({
                        code: saveCode,
                        pixels: getPixelAmounts(),
                        completed: currentPuzzle.completed
                    })));
                    saveCodeText.value = saveCode;
                }
                if (inResetState && changed && sandboxMode) {
                    let code = generateSaveCode();
                    quicksave = code;
                    quickloadButton.disabled = false;
                    undoStates.push(code);
                }
            } else if (brush.mouseButton == 1) {
                if (holdingControl) {
                    camera.x = Math.max(0, Math.min(camera.x + prevMX - mX, (canvasResolution * (gridWidth / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
                    camera.y = Math.max(0, Math.min(camera.y + prevMY - mY, (canvasResolution * (gridHeight / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
                    forceRedraw = true;
                } else if (pixelAt(mXGrid, mYGrid).pickable && pixelSelectors[pixelAt(mXGrid, mYGrid).id].box.style.display != 'none') {
                    pixelSelectors[pixelAt(mXGrid, mYGrid).id].box.onclick();
                }
            } else if (brush.mouseButton == 0 && holdingControl) {
                if (!brush.selecting) {
                    brush.selecting = true;
                    selection.x1 = mXGrid;
                    selection.y1 = mYGrid;
                    selection.show = true;
                }
                selection.x2 = mXGrid;
                selection.y2 = mYGrid;
            } else {
                clickLine(prevMXGrid, prevMYGrid, mXGrid, mYGrid, brush.lastMouseButton == 2 || removing);
            }
        }
    } else if (brush.mouseButton == -1 && brush.lineMode && !(brush.isSelection && selection.grid[0] !== undefined) && !brush.startsInRPE) {
        brush.lineMode = false;
        clickLine(brush.lineStartX, brush.lineStartY, mXGrid, mYGrid, brush.lastMouseButton == 2 || removing);
    }
    if (brush.mouseButton == -1 || !holdingControl) brush.selecting = false;
    brush.lastMouseButton = brush.mouseButton;
};
function brushActionLine(x1, y1, x2, y2, size, cb) {
    let slope = (y2 - y1) / (x2 - x1);
    if (!isFinite(slope)) {
        cb({
            xmin: Math.max(0, Math.min(x1 - size + 1, gridWidth - 1)),
            xmax: Math.max(0, Math.min(x1 + size - 1, gridWidth - 1)),
            ymin: Math.max(0, Math.min(Math.min(y2, y1) - size + 1, gridHeight - 1)),
            ymax: Math.max(0, Math.min(Math.max(y2, y1) + size - 1, gridHeight - 1))
        });
    } else if (slope == 0) {
        cb({
            xmin: Math.max(0, Math.min(Math.min(x2, x1) - size + 1, gridWidth - 1)),
            xmax: Math.max(0, Math.min(Math.max(x2, x1) + size - 1, gridWidth - 1)),
            ymin: Math.max(0, Math.min(y1 - size + 1, gridHeight - 1)),
            ymax: Math.max(0, Math.min(y1 + size - 1, gridHeight - 1))
        });
    } else {
        rayTrace(x1, y1, x2, y2, (x, y) => cb(calcBrushRectCoordinates(x, y, size)));
    }
};
function clickLine(x1, y1, x2, y2, remove, placePixel = brush.pixel, size = brush.size, pxteam = PixSimAPI.team) {
    if ((!sandboxMode && !PixSimAPI.inGame && !inResetState) || (PixSimAPI.inGame && PixSimAPI.spectating)) return;
    const inventory = PixSimAPI.inGame ? (pxteam ? teamPixelAmounts[1] : teamPixelAmounts[0]) : pixelAmounts;
    const placeable = PixSimAPI.inGame ? (pxteam ? teamPlaceableGrids[1] : teamPlaceableGrids[0]) : placeableGrid;
    let modifiedPixelCounts = [];
    let placePixelNum = (pixels[placePixel] ?? numPixels[pixNum.MISSING]).numId;
    let skipToEnd = false;
    let changed = false;
    brushActionLine(x1, y1, x2, y2, size, (rect) => {
        if (skipToEnd) return;
        function act(cb) {
            for (let i = rect.ymin; i <= rect.ymax; i++) {
                for (let j = rect.xmin; j <= rect.xmax; j++) {
                    if (cb(j, i)) return true;
                }
            }
            return false;
        };
        if (remove) {
            if (sandboxMode) {
                if (placePixel == 'target') act((x, y) => {
                    changed = changed || targetGrid[y][x];
                    targetGrid[y][x] = false;
                });
                else if (placePixel == 'placementRestriction') act((x, y) => {
                    changed = changed || placeable[y][x];
                    placeable[y][x] = true;
                });
                else act((x, y) => {
                    changed = changed || grid[y][x] != pixNum.AIR;
                    grid[y][x] = pixNum.AIR;
                    fireGrid[y][x] = false;
                    if (musicGrid[y][x]) {
                        musicPixel(musicGrid[y][x], false);
                        musicGrid[y][x] = 0;
                    }
                });
            } else act((x, y) => {
                if (placeable[y][x] && grid[y][x] != pixNum.DELETER && grid[y][x] != pixNum.MONSTER && (!PixSimAPI.inGame || (2 - teamGrid[y][x] !== pxteam && (grid[y][x] < pixNum.COLOR_RED || grid[y][x] > pixNum.COLOR_BROWN) && (grid[y][x] < pixNum.GENERIC_COLOR_WELL || grid[y][x] > pixNum.GENERIC_COLOR_WELL)))) {
                    let pixel = pixelAt(x, y).id;
                    if (inventory[pixel] == -Infinity) inventory[pixel] = 0;
                    inventory[pixel]++;
                    modifiedPixelCounts[grid[y][x]] = true;
                    changed = changed || grid[y][x] != pixNum.AIR;
                    grid[y][x] = pixNum.AIR;
                    if (fireGrid[y][x] && !PixSimAPI.inGame) {
                        inventory['fire']++;
                        modifiedPixelCounts[pixNum.FIRE] = true;
                        fireGrid[y][x] = false;
                    }
                    if (musicGrid[y][x]) {
                        musicPixel(musicGrid[y][x], false);
                        musicGrid[y][x] = 0;
                    }
                    teamGrid[y][x] = 0;
                }
            });
        } else if (placePixel == 'fire') {
            if (sandboxMode) {
                act((x, y) => {
                    changed = changed || !fireGrid[y][x];
                    fireGrid[y][x] = true;
                });
            } else {
                modifiedPixelCounts[placePixelNum] = true;
                if (inventory[placePixel] <= 0) skipToEnd = true;
                else if (act((x, y) => {
                    if (placeable[y][x] && grid[y][x] != pixNum.DELETER && !fireGrid[y][x]) {
                        changed = true;
                        fireGrid[y][x] = true;
                        inventory[placePixel]--;
                    }
                    return inventory[placePixel] <= 0;
                })) skipToEnd = true;
            }
        } else if (placePixel == 'teamNone') {
            if (sandboxMode) act((x, y) => {
                teamGrid[y][x] = 0;
            });
        } else if (placePixel == 'teamAlpha') {
            if (sandboxMode) act((x, y) => {
                teamGrid[y][x] = 1;
            });
        } else if (placePixel == 'teamBeta') {
            if (sandboxMode) act((x, y) => {
                teamGrid[y][x] = 2;
            });
        } else if (placePixel == 'placementRestriction') {
            if (sandboxMode) act((x, y) => {
                changed = changed || placeable[y][x];
                placeable[y][x] = false;
            });
        } else if (placePixel == 'target') {
            if (sandboxMode) act((x, y) => {
                changed = changed || !targetGrid[y][x];
                targetGrid[y][x] = true;
            });
        } else {
            if (sandboxMode) {
                act((x, y) => {
                    changed = changed || grid[y][x] != placePixelNum;
                    grid[y][x] = placePixelNum;
                    if (musicGrid[y][x]) {
                        musicPixel(musicGrid[y][x], false);
                        musicGrid[y][x] = 0;
                    }
                    if (placePixelNum >= pixNum.MUSIC_1 && placePixelNum <= pixNum.MUSIC_88) musicGrid[y][x] = 0;
                });
            } else {
                modifiedPixelCounts[placePixelNum] = true;
                if (inventory[placePixel] <= 0) skipToEnd = true;
                else if (act((x, y) => {
                    if (placeable[y][x] && grid[y][x] != pixNum.DELETER && grid[y][x] != pixNum.MONSTER && grid[y][x] != placePixelNum && (!PixSimAPI.inGame || (2 - teamGrid[y][x] !== pxteam && (grid[y][x] < pixNum.COLOR_RED || grid[y][x] > pixNum.COLOR_BROWN) && (placePixelNum < pixNum.COLOR_RED || placePixelNum > pixNum.COLOR_BROWN)))) {
                        modifiedPixelCounts[grid[y][x]] = true;
                        let pixel = pixelAt(x, y).id;
                        if (inventory[pixel] == -Infinity) inventory[pixel] = 0;
                        inventory[pixel]++;
                        changed = true;
                        grid[y][x] = placePixelNum;
                        if (musicGrid[y][x]) {
                            musicPixel(musicGrid[y][x], false);
                            musicGrid[y][x] = 0;
                        }
                        inventory[placePixel]--;
                        if (placePixelNum >= pixNum.MUSIC_1 && placePixelNum <= pixNum.MUSIC_88) musicGrid[y][x] = 0;
                        if (PixSimAPI.inGame) teamGrid[y][x] = pxteam + 1;
                    }
                    return inventory[placePixel] <= 0;
                })) skipToEnd = true;
            }
        }
    });
    if (!PixSimAPI.inGame || PixSimAPI.team === pxteam) for (let pixelType in modifiedPixelCounts) {
        if (pixelType != pixNum.AIR) updatePixelAmount(numPixels[pixelType].id, inventory);
    }
    if (PixSimAPI.inGame && PixSimAPI.gameRunning && !PixSimAPI.isHost) {
        PixSimAPI.sendInput(0, { x1: x1, y1: y1, x2: x2, y2: y2, size: brush.size, pixel: remove ? -1 : placePixelNum });
    }
    if (!sandboxMode && !PixSimAPI.inGame) {
        saveCode = generateSaveCode();
        window.localStorage.setItem(`challenge-${currentPuzzle.id}`, LZString.compressToBase64(JSON.stringify({
            code: saveCode,
            pixels: getPixelAmounts(),
            completed: currentPuzzle.completed
        })));
        saveCodeText.value = saveCode;
    }
    if (inResetState && changed && sandboxMode) {
        let code = generateSaveCode();
        quicksave = code;
        quickloadButton.disabled = false;
        undoStates.push(code);
    }
    return changed;
};

// camera stuff
function moveCamera(x, y, s, t, curve = camera.animation.timingFunctions.linear) {
    if (t == 0) {
        camera.x = x;
        camera.y = y;
        camera.scale = 2 ** Math.round(Math.log2(s));
        drawScale = gridScale * camera.scale;
        screenScale = (gridWidth < gridHeight ? gridWidth : gridHeight) / canvasSize / camera.scale / canvasScale;
        forceRedraw = true;
        return;
    }
    camera.animation.x1 = camera.x;
    camera.animation.y1 = camera.y;
    camera.animation.s1 = camera.scale;
    camera.animation.x2 = Math.round(x);
    camera.animation.y2 = Math.round(y);
    camera.animation.s2 = 2 ** Math.round(Math.log2(s));
    camera.animation.t0 = performance.now();
    camera.animation.t1 = camera.animation.t0 + t;
    camera.animation.timing = curve;
    camera.animation.running = true;
};
function cameraDistance(x, y) {
    return Math.sqrt((Math.max(camera.viewport.xmin - x, x - camera.viewport.xmax, 0) ** 2) + (Math.max(camera.viewport.ymin - y, y - camera.viewport.ymax, 0) ** 2));
};
function cameraShake(x, y, intensity) {
    let distance = cameraDistance(x, y);
    let adjustedIntensity = intensity * Math.min(1, Math.max(0, 1 - (distance / 150)));
    camera.shakeIntensity += (adjustedIntensity / (1 + camera.shakeIntensity * 0.5)) * 0.2;
};

// PixSim multiplayer addons
const teamGrid = [];
const lastTeamGrid = [];
const teamPlaceableGrids = [[], []];
function createPixSimGrid() {
    teamGrid.length = 0;
    lastTeamGrid.length = 0;
    teamPlaceableGrids[0].length = 0;
    teamPlaceableGrids[1].length = 0;
    for (let i = 0; i < gridHeight; i++) {
        teamGrid[i] = [];
        lastTeamGrid[i] = [];
        teamPlaceableGrids[0][i] = [];
        teamPlaceableGrids[1][i] = [];
        for (let j = 0; j < gridWidth; j++) {
            teamGrid[i][j] = 0;
            lastTeamGrid[i][j] = 0;
            teamPlaceableGrids[0][i][j] = true;
            teamPlaceableGrids[1][i][j] = true;
        }
    }
};
const teamPixelAmounts = [{}, {}];
const pixsimData = {
    gameStart: 0,
    pixeliteCounts: [0, 0],
    scriptRunner: null,
    scripts: {}
};
function resetPixSimPixelAmounts() {
    for (const id in pixels) {
        teamPixelAmounts[0][id] = 0;
        teamPixelAmounts[1][id] = 0;
    }
    teamPixelAmounts[0]['air'] = Infinity;
    teamPixelAmounts[1]['air'] = Infinity;
};
function getPixSimPixelAmounts() {
    return teamPixelAmounts.map(amounts => {
        const mappedAmounts = [];
        for (let id in amounts) {
            mappedAmounts[pixels[id].numId] = !isFinite(amounts[id]) ? (amounts[id] < 0 ? '-i' : 'i') : amounts[id];
        }
        return mappedAmounts;
    });
};
function extractBooleanGrid(grid, compressed) {
    // behold - pointlessly one-lined code!
    for (let i = 0, loc = 0, pixel = false; i < compressed.length; i++) {
        for (let j = 0; j < compressed[i]; j++, loc++) {
            grid[~~(loc / gridWidth)][loc % gridWidth] = pixel;
        }
        if (compressed[i] != 255) pixel = !pixel;
    }
};
function generateTeamCode() {
    let code = '';
    let len = 0;
    let curr = teamGrid[0][0];
    for (let i = 0; i < teamGrid.length; i++) {
        for (let j = 0; j < teamGrid[i].length; j++) {
            if (teamGrid[i][j] != curr) {
                code += curr + '-' + len.toString(16) + ':';
                curr = teamGrid[i][j];
                len = 0;
            }
            len++;
        }
    }
    code += curr + '-' + len.toString(16) + ':';
    return code;
};
function loadTeamCode(code) {
    let loc = 0;
    let i = 0;
    while (i < code.length) {
        let next = code.indexOf(':', i);
        if (next == -1) break;
        let tokens = code.substring(i, next).split('-');
        if (tokens.length != 2) break;
        let team = parseInt(tokens[0]);
        let run = parseInt(tokens[1], 16);
        for (let j = 0; j < run; j++, loc++) {
            teamGrid[~~(loc / gridWidth)][loc % gridWidth] = team;
        }
        i = next + 1;
    }
};
function drawPixSimUI() {
    switch (PixSimAPI.gameModeData.id) {
        case 'pixelcrash':
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#FF009955';
            ctx.fillRect(canvasResolution / 4 - 3, canvasResolution - 26, canvasResolution / 4, 20);
            ctx.fillStyle = '#3C70FF55';
            ctx.fillRect(canvasResolution / 2 + 3, canvasResolution - 26, canvasResolution / 4, 20);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#000000';
            ctx.strokeRect(canvasResolution / 4 - 3, canvasResolution - 26, canvasResolution / 4, 20);
            ctx.strokeRect(canvasResolution / 2 + 3, canvasResolution - 26, canvasResolution / 4, 20);
            ctx.fillStyle = '#FF0099';
            ctx.beginPath();
            let width = (((canvasResolution / 4) - 4) * (pixsimData.pixeliteCounts[0] / 5));
            ctx.moveTo(canvasResolution / 2 - 5, canvasResolution - 24);
            ctx.lineTo(canvasResolution / 2 - 5, canvasResolution - 8);
            ctx.lineTo(Math.max(canvasResolution / 4 - 1, canvasResolution / 2 - width - 10), canvasResolution - 8);
            ctx.lineTo(canvasResolution / 2 - width - 5, canvasResolution - 24);
            ctx.lineTo(canvasResolution / 2 - 5, canvasResolution - 24);
            ctx.fill();
            ctx.fillStyle = '#3C70FF';
            ctx.beginPath();
            width = (((canvasResolution / 4) - 4) * (pixsimData.pixeliteCounts[1] / 5));
            ctx.moveTo(canvasResolution / 2 + 5, canvasResolution - 24);
            ctx.lineTo(canvasResolution / 2 + 5, canvasResolution - 8);
            ctx.lineTo(Math.min(canvasResolution * 3 / 4 + 1, canvasResolution / 2 + width + 10), canvasResolution - 8);
            ctx.lineTo(canvasResolution / 2 + width + 5, canvasResolution - 24);
            ctx.lineTo(canvasResolution / 2 + 5, canvasResolution - 24);
            ctx.fill();
            break;
    }
};
// oh no sound design
PixSimAPI.onGameStart = () => {
    sandboxMode = false;
    transitionToGame(async () => {
        resetPixSimPixelAmounts();
        if (PixSimAPI.isHost) {
            const map = await PixSimAPI.getMap();
            loadSaveCode(`&1;${map.width}-${map.height};0000;${map.data}`);
            loadTeamCode(map.teamData);
            for (let i = 0; i <= 1; i++) {
                let data = map.placeableData[i].split(':');
                let x = 0;
                let y = 0;
                let placeable = false;
                place: for (let j in data) {
                    let amount = parseInt(data[j], 16);
                    for (let k = 0; k < amount; k++) {
                        teamPlaceableGrids[i][y][x++] = placeable;
                        if (x == gridWidth) {
                            y++;
                            x = 0;
                            if (y == gridHeight) break place;
                        }
                    }
                    placeable = !placeable;
                }
            }
            pixsimData.scriptRunner = new PXASMRunner();
            pixsimData.scripts = {};
            if (map.scripts.main !== undefined) pixsimData.scriptRunner.run(await PixSimAPI.getScript(map.scripts.main));
            for (let i in map.scripts) {
                pixsimData.scripts[i] = map.scripts[i];
            }
            pixsimData.gameStart = Date.now(); // game timer
        }
        pixsimMenu._open = false;
        pixsimMenu.style.transform = '';
        pixsimHostCancelGame.onclick = null;
        pixsimHostStartGame.onclick = null;
        pixsimWaitLeaveGame.onclick = null;
        slowSimulation = true;
        simulationPaused = false;
        ticks = 0;
        backgroundColor = '#ffffff';
        camera.scale = 1;
        camera.x = 0;
        camera.y = 0;
        updateTimeControlButtons();
        levelDetails.style.display = 'none';
        pixelPickerCrafting.style.display = '';
        restartButton.style.display = '';
        quicksaveButton.disabled = true;
        quickloadButton.disabled = true;
        pauseButton.disabled = true;
        fastSimulationButton.disabled = true;
        slowSimulationButton.disabled = true;
        advanceTickButton.disabled = true;
        resetButton.disabled = true;
        restartButton.disabled = true;
        saveCodeText.disabled = true;
        saveCodeText.value = '';
        generateSaveButton.disabled = true;
        uploadSaveButton.disabled = true;
        downloadSaveButton.disabled = true;
        document.getElementById('premadeSaves').style.display = 'none';
        resetPixelAmounts();
        // animate the camera and useless glitch text thing
    });
};
PixSimAPI.onGameRound = (winner) => {
    // sort of like win screen
    // wow round stuff next round after timer
};
PixSimAPI.onGameEnd = (winner) => {
    // win screen like level win screen but more graphics (color of winning team as accent)
    // statistics and stuff
    // option to go back to lobby or quit to menu
};
PixSimAPI.onNewGridSize = createGrid;
PixSimAPI.onGameTick = (compressedGrid, compressedTeamGrid, compressedBooleanGrids, tickData) => {
    // sync to framerate to reduce tearing (probably not necessary)?
    ticks = tickData.tick;
    PixSimAPI.decompressGrid(compressedGrid, grid);
    let loc = 0, state, run;
    for (let i = 0; i < compressedTeamGrid.length; i++) {
        state = compressedTeamGrid[i] >> 6;
        run = compressedTeamGrid[i] & 63;
        for (let j = 0; j < run; j++, loc++) {
            teamGrid[~~(loc / gridWidth)][loc % gridWidth] = state;
        }
    }
    extractBooleanGrid(fireGrid, compressedBooleanGrids[0]);
    extractBooleanGrid(targetGrid, compressedBooleanGrids[1]);
    extractBooleanGrid(teamPlaceableGrids[0], compressedBooleanGrids[2]);
    extractBooleanGrid(teamPlaceableGrids[1], compressedBooleanGrids[3]);
    let teamPixelAmount1 = tickData.teamPixelAmounts[PixSimAPI.team];
    let teamPixelAmount2 = teamPixelAmounts[PixSimAPI.team];
    if (teamPixelAmount1 !== undefined) {
        for (let n in teamPixelAmount1) {
            let id = pixelData(n).id;
            if (teamPixelAmount1[n] !== teamPixelAmount2[id]) {
                teamPixelAmount2[id] = teamPixelAmount1[n] === '-i' ? -Infinity : (teamPixelAmount1[n] === 'i' ? Infinity : teamPixelAmount1[n]);
                updatePixelAmount(id, teamPixelAmount2);
            }
        }
    }
    pixsimData.pixeliteCounts = tickData.pixeliteCounts;
    camera.shakeIntensity = tickData.cameraShake;
};
PixSimAPI.onGameInput = (type, data, team) => {
    switch (type) {
        case 0:
            clickLine(data.x1, data.y1, data.x2, data.y2, data.pixel == -1, (numPixels[data.pixel] ?? pixNum.MISSING).id, data.size, team);
            break;
        case 1:
            // buh paste
            break;
    }
};
window.addEventListener('load', (e) => {
    resetPixSimPixelAmounts();
});

// inputs
let reassigningPixelKeybind = false;
const keybindChangeButton = document.createElement('button');
keybindChangeButton.id = 'pixelPickerKeybindButton';
keybindChangeButton.title = 'Change keybind';
const keybindScreen = document.getElementById('keybindScreen');
const disallowedKeybinds = ['w', 'a', 's', 'd', 'r', 'f', 'g', 'i', 'j', 'k', 'l', 'p', '[', ']', 'enter', 'control', 'shift', 'alt', 'meta', 'backspace', 'arrowup', 'arrowdown'];
keybindChangeButton.onclick = (e) => {
    reassigningPixelKeybind = true;
    keybindChangeButton.style.color = '#FFAA00';
    keybindScreen.style.opacity = 1;
    keybindScreen.style.pointerEvents = 'all';
    const pixel = pixels[brush.pixel];
    document.addEventListener('keydown', async function rebind(e) {
        if (!acceptInputs) return;
        const key = e.key.toLowerCase();
        if (disallowedKeybinds.includes(key)) {
            sounds.deny();
            return;
        }
        if (key == 'escape') {
            pixelKeybinds[pixel.keybind] = undefined;
            pixel.keybind = null;
            pixelSelectors[pixel.id].keybind.innerText = '';
        } else {
            if (pixelKeybinds[key] !== undefined) {
                if (!(await modal('Conflicting keybinds!', `Are you sure you want to overwrite your existing keybind for ${pixels[pixelKeybinds[key]].name}?`, true))) return;
                pixels[pixelKeybinds[key]].keybind = null;
                pixelSelectors[pixelKeybinds[key]].keybind.innerText = '';
            }
            pixelKeybinds[key] = pixel.id;
            if (pixel.keybind !== null) pixelKeybinds[pixel.keybind] = undefined;
            pixel.keybind = key;
            pixelSelectors[pixel.id].keybind.innerText = (key == ' ' ? 'SPACE' : key).toUpperCase();
        }
        reassigningPixelKeybind = false;
        keybindChangeButton.style.color = '';
        keybindScreen.style.opacity = 0;
        keybindScreen.style.pointerEvents = '';
        document.removeEventListener('keydown', rebind);
        pixelSelectors[pixel.id].box.onmouseover();
        window.localStorage.setItem('pixelKeybinds', JSON.stringify(pixelKeybinds));
        sounds.shortDing();
        e.preventDefault();
    });
    sounds.click();
};
window.addEventListener('DOMContentLoaded', (e) => {
    function scaleCamera(scale) {
        let cScale = camera.scale;
        let percentX = (mX + camera.x) / (canvasSize * camera.scale);
        let percentY = (mY + camera.y) / (canvasSize * camera.scale);
        camera.scale = Math.max(1, Math.min(Math.round(camera.scale * scale), 8));
        camera.x = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentX) - mX, (canvasResolution * (gridWidth / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
        camera.y = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentY) - mY, (canvasResolution * (gridHeight / Math.min(gridWidth, gridHeight)) * camera.scale) - canvasResolution));
        drawScale = gridScale * camera.scale;
        screenScale = (gridWidth < gridHeight ? gridWidth : gridHeight) / canvasSize / camera.scale / canvasScale;
        forceRedraw = true;
        if (camera.scale != cScale) sounds.tick();
    };
    function writeClipboard() {
        window.localStorage.setItem('clipboard', LZString.compressToBase64(JSON.stringify(selection.grid)));
    };
    document.onkeydown = (e) => {
        if (e.target.matches('button') || e.key == 'Tab') {
            e.preventDefault();
            e.target.blur();
        }
        if (e.target.matches('input') || e.target.matches('textarea') || !acceptInputs || reassigningPixelKeybind || inWinScreen || inMenuScreen) return;
        const key = e.key.toLowerCase();
        if (pixelKeybinds[key] !== undefined && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const pixel = pixels[pixelKeybinds[key]];
            if (pixel.pickable && (!PixSimAPI.inGame || pixel.pixsimPickable)) pixelSelectors[pixel.id].box.click();
        }
        if (key == 'arrowup') {
            if (!brush.isSelection) {
                let bsize = brush.size;
                brush.size = Math.min(Math.ceil(Math.max(gridWidth, gridHeight) / 2 + 1), brush.size + 1);
                if (brush.size != bsize) sounds.tick();
            }
        } else if (key == 'arrowdown') {
            if (!brush.isSelection) {
                let bsize = brush.size;
                brush.size = Math.max(1, brush.size - 1);
                if (brush.size != bsize) sounds.tick();
            }
        } else if (key == 'enter' && !e.ctrlKey) {
            if (simulationPaused && !PixSimAPI.inGame) {
                runTicks = 1;
                sounds.tick();
            }
        } else if (key == 'w' && !e.ctrlKey) {
            camera.mUp = true;
        } else if (key == 's' && !e.ctrlKey) {
            camera.mDown = true;
        } else if (key == 'a' && !e.ctrlKey) {
            camera.mLeft = true;
        } else if (key == 'd' && !e.ctrlKey) {
            camera.mRight = true;
        } else if (key == 'i' && !e.ctrlKey) {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation !== undefined) pixelSelectors[numPixels[pixType.numId - pixType.rotation + 1].id].box.click();
        } else if (key == 'k' && !e.ctrlKey) {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation !== undefined) pixelSelectors[numPixels[(3 % possibleRotations(pixType.numId)) + pixType.numId - pixType.rotation].id].box.click();
        } else if (key == 'j' && !e.ctrlKey) {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation !== undefined) pixelSelectors[numPixels[pixType.numId - pixType.rotation].id].box.click();
        } else if (key == 'l' && !e.ctrlKey) {
            let pixType = pixels[brush.pixel];
            if (pixType && pixType.rotation !== undefined) pixelSelectors[numPixels[(2 % possibleRotations(pixType.numId)) + pixType.numId - pixType.rotation].id].box.click();
        } else if (key == 'shift') {
            removing = true;
        } else if (key == 'control') {
            holdingControl = true;
        } else if (key == 'alt') {
            holdingAlt = true;
        } else if (key == 'r' && !e.ctrlKey) {
            if (brush.isSelection && selection.grid[0] !== undefined) {
                const newGrid = [];
                for (let i = 0; i < selection.grid[0].length; i++) {
                    newGrid[i] = [];
                }
                for (let i = 0; i < selection.grid.length; i++) {
                    for (let j = 0; j < selection.grid[i].length; j++) {
                        let newPixel = selection.grid[i][j];
                        const pixType = pixelData(selection.grid[i][j]);
                        if (pixType.rotation !== undefined) {
                            let rotations = possibleRotations(selection.grid[i][j]);
                            newPixel = selection.grid[i][j] - pixType.rotation + ((((pixType.rotation + 1) % rotations) + rotations) % rotations);
                        }
                        newGrid[j][selection.grid.length - i - 1] = newPixel;
                    }
                }
                selection.grid = newGrid;
                writeClipboard();
            } else {
                const pixType = pixels[brush.pixel];
                let rotations = possibleRotations(pixType.numId);
                if (pixType && pixType.rotation !== undefined) pixelSelectors[numPixels[pixType.numId - pixType.rotation + ((((pixType.rotation + 1) % rotations) + rotations) % rotations)].id].box.click();
            }
        } else if (key == 'f' && !e.ctrlKey) {
            if (brush.isSelection && selection.grid[0] !== undefined) {
                const newGrid = [];
                for (let i = 0; i < selection.grid.length; i++) {
                    newGrid[i] = [];
                }
                for (let i = 0; i < selection.grid.length; i++) {
                    for (let j = 0; j < selection.grid[i].length; j++) {
                        let newPixel = selection.grid[i][j];
                        const pixType = pixelData(selection.grid[i][j]);
                        if (pixType.rotation !== undefined && pixType.rotation % 2 == 0) {
                            let rotations = possibleRotations(selection.grid[i][j]);
                            newPixel = selection.grid[i][j] - pixType.rotation + ((pixType.rotation + 2) % rotations);
                        }
                        newGrid[i][selection.grid[i].length - j - 1] = newPixel;
                    }
                }
                selection.grid = newGrid;
                writeClipboard();
            } else {
                const pixType = pixels[brush.pixel];
                let rotations = possibleRotations(pixType.numId);
                if (pixType && pixType.rotation !== undefined && pixType.rotation % 2 == 0) pixelSelectors[numPixels[pixType.numId - pixType.rotation + ((pixType.rotation + 2) % rotations)].id].box.click();
            }
        } else if (key == 'g' && !e.ctrlKey) {
            if (brush.isSelection && selection.grid[0] !== undefined) {
                const newGrid = [];
                for (let i = 0; i < selection.grid.length; i++) {
                    newGrid[i] = [];
                }
                for (let i = 0; i < selection.grid.length; i++) {
                    for (let j = 0; j < selection.grid[i].length; j++) {
                        let newPixel = selection.grid[i][j];
                        const pixType = pixelData(selection.grid[i][j]);
                        if (pixType.rotation !== undefined && pixType.rotation % 2 == 1) {
                            let rotations = possibleRotations(selection.grid[i][j]);
                            newPixel = selection.grid[i][j] - pixType.rotation + ((pixType.rotation + 2) % rotations);
                        }
                        newGrid[selection.grid.length - i - 1][j] = newPixel;
                    }
                }
                selection.grid = newGrid;
                writeClipboard();
            } else {
                const pixType = pixels[brush.pixel];
                let rotations = possibleRotations(pixType.numId);
                if (pixType && pixType.rotation !== undefined && pixType.rotation % 2 == 1) pixelSelectors[numPixels[pixType.numId - pixType.rotation + ((pixType.rotation + 2) % rotations)].id].box.click();
            }
        } else if (key == 'x' && e.ctrlKey) {
            if (selection.show && (!PixSimAPI.inGame || !PixSimAPI.spectating)) {
                const inventory = PixSimAPI.inGame ? (PixSimAPI.team ? teamPixelAmounts[1] : teamPixelAmounts[0]) : pixelAmounts;
                selection.grid = [];
                let xmin = Math.min(selection.x1, selection.x2);
                let xmax = Math.max(selection.x1, selection.x2);
                let ymin = Math.min(selection.y1, selection.y2);
                let ymax = Math.max(selection.y1, selection.y2);
                let modifiedPixelCounts = [];
                for (let y = ymin; y <= ymax; y++) {
                    selection.grid[y - ymin] = [];
                    for (let x = xmin; x <= xmax; x++) {
                        if (sandboxMode) {
                            selection.grid[y - ymin][x - xmin] = grid[y][x];
                            grid[y][x] = pixNum.AIR;
                            if (musicGrid[y][x]) {
                                musicPixel(musicGrid[y][x], false);
                                musicGrid[y][x] = 0;
                            }
                        } else if (placeableGrid[y][x] && grid[y][x] != pixNum.DELETER) {
                            selection.grid[y - ymin][x - xmin] = grid[y][x];
                            inventory[pixelAt(x, y).id]++;
                            modifiedPixelCounts[grid[y][x]] = true;
                            grid[y][x] = pixNum.AIR;
                            if (musicGrid[y][x]) {
                                musicPixel(musicGrid[y][x], false);
                                musicGrid[y][x] = 0;
                            }
                        } else {
                            selection.grid[y - ymin][x - xmin] = pixNum.AIR;
                        }
                    }
                }
                selection.show = false;
                for (let pixelType in modifiedPixelCounts) {
                    if (pixelType != pixNum.AIR) updatePixelAmount(numPixels[pixelType].id, inventory);
                }
                writeClipboard();
            }
        } else if (key == 'backspace') {
            if (selection.show && (!PixSimAPI.inGame || !PixSimAPI.spectating)) {
                const inventory = PixSimAPI.inGame ? (PixSimAPI.team ? teamPixelAmounts[1] : teamPixelAmounts[0]) : pixelAmounts;
                let xmin = Math.min(selection.x1, selection.x2);
                let xmax = Math.max(selection.x1, selection.x2);
                let ymin = Math.min(selection.y1, selection.y2);
                let ymax = Math.max(selection.y1, selection.y2);
                let modifiedPixelCounts = [];
                for (let y = ymin; y <= ymax; y++) {
                    for (let x = xmin; x <= xmax; x++) {
                        if (sandboxMode) {
                            grid[y][x] = pixNum.AIR;
                            if (musicGrid[y][x]) {
                                musicPixel(musicGrid[y][x], false);
                                musicGrid[y][x] = 0;
                            }
                        } else if (placeableGrid[y][x] && grid[y][x] != pixNum.DELETER) {
                            inventory[pixelAt(x, y).id]++;
                            modifiedPixelCounts[grid[y][x]] = true;
                            grid[y][x] = pixNum.AIR;
                            if (musicGrid[y][x]) {
                                musicPixel(musicGrid[y][x], false);
                                musicGrid[y][x] = 0;
                            }
                        }
                    }
                }
                selection.show = false;
                for (let pixelType in modifiedPixelCounts) {
                    if (pixelType != pixNum.AIR) updatePixelAmount(numPixels[pixelType].id, inventory);
                }
            }
        } else if (key == 'c' && e.ctrlKey) {
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
                writeClipboard();
            }
        } else if (key == 'v' && e.ctrlKey) {
            if (window.localStorage.getItem('clipboard') !== null) {
                selection.grid = JSON.parse(LZString.decompressFromBase64(window.localStorage.getItem('clipboard')));
                brush.isSelection = true;
            }
        } else if (key == 'z' && e.ctrlKey) {
            if (inResetState && sandboxMode) {
                if (undoStates.length) sounds.tick();
                undoStates.pop();
                if (undoStates.at(-1)) {
                    loadSaveCode(undoStates.at(-1));
                    quicksave = undoStates.at(-1);
                } else {
                    loadSaveCode(resetStateSave);
                    quicksave = resetStateSave;
                }
            }
        } else if (key == 'p' && e.ctrlKey) {
            e.preventDefault();
        }
        if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11' && key != '=' && key != '-') e.preventDefault();
    };
    document.onkeyup = (e) => {
        if (e.target.matches('input') || e.target.matches('textarea') || !acceptInputs || inWinScreen || inMenuScreen) return;
        const key = e.key.toLowerCase();
        if (key == 'w') {
            camera.mUp = false;
        } else if (key == 's') {
            camera.mDown = false;
        } else if (key == 'a') {
            camera.mLeft = false;
        } else if (key == 'd') {
            camera.mRight = false;
        } else if (key == 'shift') {
            removing = false;
        } else if (key == 'control') {
            holdingControl = false;
        } else if (key == 'alt') {
            holdingAlt = false;
        } else if (key == 'z' && e.altKey) {
            debugInfo = !debugInfo;
            sounds.click();
        } else if (key == 'p' && !e.ctrlKey) {
            if (!PixSimAPI.inGame) {
                simulationPaused = !simulationPaused;
                fastSimulation = false;
                updateTimeControlButtons();
                sounds.click();
            }
        } else if (key == '[' && mouseOver) {
            scaleCamera(0.5);
            mXGrid = Math.floor((mX + camera.x) * screenScale);
            mYGrid = Math.floor((mY + camera.y) * screenScale);
            mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;
        } else if (key == ']' && mouseOver) {
            scaleCamera(2);
            mXGrid = Math.floor((mX + camera.x) * screenScale);
            mYGrid = Math.floor((mY + camera.y) * screenScale);
            mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;
        } else if (key == 'escape') {
            brush.isSelection = false;
            selection.show = false;
        } else if (key == 'r' && e.ctrlKey) {
            sidebar.scrollTo({ top: levelDetails.getBoundingClientRect().height, behavior: 'smooth' });
            // pixelPicker.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else if (key == 'p' && e.ctrlKey) {
            const encoded = `data:image/png;base64,${gameCanvas.toDataURL('image/png')}`;
            const a = document.createElement('a');
            a.href = encoded;
            a.download = `red-pixel-simulator_${Math.ceil(Math.random() * 1000)}.png`;
            a.click();
        }
    };
    document.onmousedown = (e) => {
        brush.mouseButtonStack.unshift(e.button);
        brush.mouseButton = brush.mouseButtonStack[0];
        brush.lastMouseButton = brush.mouseButton;
    };
    document.onmouseup = (e) => {
        // most efficient code ever
        if (brush.mouseButtonStack.indexOf(e.button) != -1) {
            brush.mouseButtonStack.splice(brush.mouseButtonStack.indexOf(e.button), 1);
            brush.mouseButton = brush.mouseButtonStack[0] ?? -1;
        }
    };
    document.onmousemove = (e) => {
        mX = Math.round((e.pageX - 10) * canvasScale);
        mY = Math.round((e.pageY - 10) * canvasScale);
        mXGrid = Math.floor((mX + camera.x) * screenScale);
        mYGrid = Math.floor((mY + camera.y) * screenScale);
        mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;
    };
    document.addEventListener('wheel', (e) => {
        if (mouseOver && acceptInputs && !inMenuScreen && !inWinScreen) {
            if (holdingControl) {
                scaleCamera((Math.abs(e.deltaY) > 10) ? (e.deltaY < 0 ? 2 : 0.5) : 1);
                document.onmousemove(e);
            } else if (!brush.isSelection) {
                let bsize = brush.size;
                if (e.deltaY > 0) {
                    brush.size = Math.max(1, brush.size - 1);
                } else {
                    brush.size = Math.min(Math.ceil(Math.max(gridWidth, gridHeight) / 2 + 1), brush.size + 1);
                }
                if (brush.size != bsize) sounds.tick();
            }
        }
        if (holdingControl || reassigningPixelKeybind) { e.preventDefault(); }
    }, { passive: false });
    hasFocus = false;
    if (typeof window.requestIdleCallback == 'function') {
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
                    brush.mouseButtonStack.length = 0;
                    brush.mouseButton = -1;
                }
                hasFocus = document.hasFocus();
            }, { timeout: 40 });
        }, 50);
    } else {
        setInterval(() => {
            if (hasFocus && !document.hasFocus()) {
                camera.mUp = false;
                camera.mDown = false;
                camera.mLeft = false;
                camera.mRight = false;
                holdingControl = false;
                holdingAlt = false;
                removing = false;
                brush.lineMode = false;
                brush.mouseButtonStack.length = 0;
                brush.mouseButton = -1;
            }
            hasFocus = document.hasFocus();
        }, 50);
    }
});

// game control buttons
let quicksave = null;
let resetStateSave = saveCode;
const undoStates = [];
const pauseButton = document.getElementById('pause');
const fastSimulationButton = document.getElementById('fastSimulation');
const slowSimulationButton = document.getElementById('slowSimulation');
const advanceTickButton = document.getElementById('advanceTick');
const quicksaveButton = document.getElementById('quicksave');
const quickloadButton = document.getElementById('quickload');
function updateTimeControlButtons() {
    if (simulationPaused) {
        pauseButton.style.backgroundColor = 'red';
        pauseButton.style.backgroundImage = 'url(./assets/svg/play.svg)';
        pauseButton.title = 'Play';
        fastSimulationButton.style.backgroundColor = '';
        fastSimulationButton.title = 'Disabled while paused';
        fastSimulationButton.disabled = true;
        advanceTickButton.disabled = false;
        pauseMusicPixels();
    } else {
        pauseButton.style.backgroundColor = 'lime';
        pauseButton.style.backgroundImage = 'url(./assets/svg/pause.svg)';
        pauseButton.title = 'Pause';
        if (fastSimulation) {
            fastSimulationButton.style.backgroundColor = 'lime';
            fastSimulationButton.title = 'Stop Simulation warp';
        } else {
            fastSimulationButton.style.backgroundColor = 'red';
            fastSimulationButton.title = 'Start Simulation warp';
        }
        fastSimulationButton.disabled = false;
        advanceTickButton.disabled = true;
        resumeMusicPixels();
    }
    if (slowSimulation) {
        slowSimulationButton.style.backgroundColor = 'red';
        slowSimulationButton.title = 'Disable slow-mode';
    } else {
        slowSimulationButton.style.backgroundColor = 'lightgray';
        slowSimulationButton.title = 'Enable slow-mode';
    }
};
pauseButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = !simulationPaused;
    fastSimulation = false;
    updateTimeControlButtons();
};
slowSimulationButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    slowSimulation = !slowSimulation;
    updateTimeControlButtons();
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
quicksaveButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    quicksave = generateSaveCode();
    undoStates.length = 0;
    resetStateSave = quicksave;
    quickloadButton.disabled = false;
};
quickloadButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (quicksave != null) {
        loadSaveCode(quicksave);
        inResetState = true;
    }
};

// save code controls
let writeSaveTimeout = setTimeout(() => { });
const generateSaveButton = document.getElementById('generateSave');
const uploadSaveButton = document.getElementById('uploadSave');
const downloadSaveButton = document.getElementById('downloadSave');
const resetButton = document.getElementById('reset');
const restartButton = document.getElementById('restart');
saveCodeText.oninput = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    saveCode = saveCodeText.value.replace('\n', '');
    clearTimeout(writeSaveTimeout);
    writeSaveTimeout = setTimeout(() => {
        if (sandboxMode) {
            window.localStorage.setItem('saveCodeText', LZString.compressToBase64(saveCode));
        }
    }, 1000);
};
generateSaveButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    saveCode = generateSaveCode();
    saveCodeText.value = saveCode;
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', LZString.compressToBase64(generateSaveCode()));
        window.localStorage.setItem('saveCodeText', LZString.compressToBase64(saveCode));
    }
};
uploadSaveButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.redpixel';
    input.oninput = (e) => {
        let files = input.files;
        if (files.length == 0) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (await modal('Load save?', 'Your current red simulation will be overwritten!', true)) {
                simulationPaused = true;
                fastSimulation = false;
                updateTimeControlButtons();
                saveCode = LZString.decompressFromBase64(e.target.result);
                if (saveCode == null || saveCode == '') saveCode = e.target.result;
                saveCodeText.value = saveCode;
                loadSaveCode();
                window.localStorage.setItem('saveCodeText', LZString.compressToBase64(saveCode));
                quicksave = null;
                undoStates.length = 0;
                resetStateSave = saveCode;
                quickloadButton.disabled = true;
            }
        };
        reader.readAsText(files[0]);
    };
    input.click();
};
downloadSaveButton.onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    saveCode = saveCodeText.value;
    const encoded = `data:text/redpixel;base64,${window.btoa(LZString.compressToBase64(saveCode))}`;
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `red-pixel-simulator_${Math.ceil(Math.random() * 1000)}.redpixel`;
    a.click();
};
resetButton.onclick = async (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (await modal('Reset?', 'Your current red simulation will be overwritten!', true)) {
        loadSaveCode(saveCodeText.value.replace('\n', ''));
        undoStates.length = 0;
        resetStateSave = saveCode;
        inResetState = true;
    }
};
restartButton.onclick = async (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    if (await modal('Restart?', 'Your solution will be removed!', true)) {
        window.localStorage.removeItem(`challenge-${currentPuzzle.id}`);
        loadPuzzle(currentPuzzle.section, currentPuzzle.level);
        quicksave = null;
        undoStates.length = 0;
        resetStateSave = saveCode;
        quickloadButton.disabled = true;
    }
};

// settings
let backgroundColor = '#ffffff';
let noNoise = window.localStorage.getItem('noNoise') === '1';
let noAnimations = window.localStorage.getItem('noAnimations') === '1';
let maxLaserDepth = 512;
let fadeEffect = parseInt(window.localStorage.getItem('fadeEffect') ?? 127);
let enableCameraShake = (window.localStorage.getItem('cameraShake') ?? '1') === '1';
let debugInfo = false;
const noNoiseButton = document.getElementById('noNoise');
const noAnimationsButton = document.getElementById('noAnimation');
const fadeEffectButton = document.getElementById('fadeEffect');
const cameraShakeButton = document.getElementById('cameraShake');
noNoiseButton.onclick = (e) => {
    noNoise = !noNoise;
    if (!noNoise) noNoiseButton.style.backgroundColor = 'lime';
    else noNoiseButton.style.backgroundColor = 'red';
    forceRedraw = true;
    window.localStorage.setItem('noNoise', noNoise ? 1 : 0);
};
noAnimationsButton.onclick = (e) => {
    noAnimations = !noAnimations;
    if (!noAnimations) noAnimationsButton.style.backgroundColor = 'lime';
    else noAnimationsButton.style.backgroundColor = 'red';
    forceRedraw = true;
    window.localStorage.setItem('noAnimations', noAnimations ? 1 : 0);
};
fadeEffectButton.onclick = (e) => {
    fadeEffect = fadeEffect ? 0 : 127;
    if (fadeEffect) fadeEffectButton.style.backgroundColor = 'lime';
    else fadeEffectButton.style.backgroundColor = 'red';
    window.localStorage.setItem('fadeEffect', fadeEffect);
};
cameraShakeButton.onclick = (e) => {
    enableCameraShake = !enableCameraShake;
    if (enableCameraShake) cameraShakeButton.style.backgroundColor = 'lime';
    else cameraShakeButton.style.backgroundColor = 'red';
    forceRedraw = true;
    window.localStorage.setItem('cameraShake', enableCameraShake ? 1 : 0);
};
window.addEventListener('load', () => {
    if (!noNoise) noNoiseButton.style.backgroundColor = 'lime';
    else noNoiseButton.style.backgroundColor = 'red';
    if (!noAnimations) noAnimationsButton.style.backgroundColor = 'lime';
    else noAnimationsButton.style.backgroundColor = 'red';
    if (fadeEffect) fadeEffectButton.style.backgroundColor = 'lime';
    else fadeEffectButton.style.backgroundColor = 'red';
    if (enableCameraShake) cameraShakeButton.style.backgroundColor = 'lime';
    else cameraShakeButton.style.backgroundColor = 'red';
});
document.getElementById('changeResolution').onclick = (e) => {
    let newRes = window.prompt('Enter new resolution: ', canvasResolution);
    if (parseInt(newRes).toString() == newRes && parseInt(newRes) > 0) {
        window.localStorage.setItem('resolution', newRes);
        window.location.reload();
    }
};
window.animateBackgroundColor = () => {
    window.animateBackgroundColor = null;
    let t = 0;
    setInterval(() => {
        let gradient = ctx.createLinearGradient(0, 0, canvasResolution, canvasResolution);
        for (let i = 0; i < 360; i += 10) {
            gradient.addColorStop(((i + t) % 360) / 360, `hsl(${i}, 80%, 50%)`);
        }
        backgroundColor = gradient;
        t += 4;
    }, 50);
};

// to menu
const menuButton = document.getElementById('backToMenu');
menuButton.onclick = async (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    if (PixSimAPI.inGame && !await modal('Leave game?', 'Are you sure you want to leave the game? You will NOT be able to rejoin!<br><i style="color: red;">You will lose rating!</i>', true)) return;
    if (PixSimAPI.inGame) {
        PixSimAPI.leaveGame();
        PixSimAPI.disconnect();
    }
    simulationPaused = true;
    fastSimulation = false;
    updateTimeControlButtons();
    stopAllMusicPixels();
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', LZString.compressToBase64(generateSaveCode()));
        window.localStorage.setItem('saveCodeText', LZString.compressToBase64(saveCodeText.value));
    }
    transitionToMenu();
};

// resizing
window.onresize = (e) => {
    canvasSize = Math.min(window.innerWidth, window.innerHeight) - 21;
    canvasScale = canvasResolution / canvasSize;
    resetCanvases();
    let pickerWidth = (Math.round((window.innerWidth - canvasSize - 20) / 62) - 1) * 62 + 1;
    if ((window.innerWidth - 249) / window.innerHeight <= 1) {
        pickerWidth = (Math.round((window.innerWidth) / 62) - 1) * 62 + 1;
        document.body.classList.add('bodyVertical');
        sidebar.classList.add('sidebarVertical');
        canvasContainer.classList.add('canvasContainerVertical');
    } else {
        document.body.classList.remove('bodyVertical');
        sidebar.classList.remove('sidebarVertical');
        canvasContainer.classList.remove('canvasContainerVertical');
    }
    pixelPicker.style.width = pickerWidth + 2 + 'px';
    pixelPickerDescription.style.width = pickerWidth - 14 + 'px';
    pixelPickerCrafting.style.width = pickerWidth + 2 + 'px';
    forceRedraw = true;
};
window.addEventListener('load', window.onresize);