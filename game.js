window.addEventListener('error', (e) => {
    modal('An error occured:', `<span style="color: red;">${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
});

let gridSize = 100;
let saveCode = '100;air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser-6:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava_generator-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}5|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let puzzleSaveCode;
let sandboxMode = true;
let backgroundColor = '#ffffff';
let noNoise = false;
let fadeEffect = 127;
let debugInfo = false;

const canvasResolution = parseInt(window.localStorage.getItem('resolution') ?? 800);
const NO_OFFSCREENCANVAS = typeof OffscreenCanvas == 'undefined';
function createCanvas2(w, h) {
    if (NO_OFFSCREENCANVAS) {
        const canvas = document.createElement('canvas');
        canvas.width = w || 1;
        canvas.height = h || 1;
        return canvas;
    } else {
        return new OffscreenCanvas(w || 1, h || 1);
    }
};
const canvas = document.getElementById('canvas');
const gameCanvas = createCanvas2(canvasResolution, canvasResolution);
const gridCanvas = createCanvas2(canvasResolution, canvasResolution);
const above = createCanvas2(canvasResolution, canvasResolution);
const fire = createCanvas2(canvasResolution, canvasResolution);
const monster = createCanvas2(canvasResolution, canvasResolution);
const placeable = createCanvas2(canvasResolution, canvasResolution);
const ctx = canvas.getContext('2d');
const gamectx = gameCanvas.getContext('2d');
const gridctx = gridCanvas.getContext('2d');
const abovectx = above.getContext('2d');
const firectx = fire.getContext('2d');
const monsterctx = monster.getContext('2d');
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
    placeablectx.imageSmoothingEnabled = false;
    placeablectx.webkitImageSmoothingEnabled = false;
    placeablectx.mozImageSmoothingEnabled = false;
};
const sidebar = document.getElementById('sidebar');
const pixelPicker = document.getElementById('pixelPicker');
const pixelPickerDescription = document.getElementById('pixelPickerDescription');
const saveCodeText = document.getElementById('saveCode');
const gridSizeText = document.getElementById('gridSize');
resetCanvases();
canvas.addEventListener('contextmenu', e => e.preventDefault());

let gridScale = canvasResolution / gridSize;
let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20;
let canvasScale = canvasResolution / canvasSize;
const grid = [];
const lastGrid = [];
const nextGrid = [];
const fireGrid = [];
const lastFireGrid = [];
const nextFireGrid = [];
const monsterGrid = [];
const placeableGrid = [];
const lastPlaceableGrid = [];
const target = [0, 0];
const noiseGrid = [];
let pendingExplosions = [];
let animationTime = 0;
let ticks = 0;
let gridPaused = true;
let simulatePaused = false;
let runTicks = 0;
let frames = [];
let lastFpsList = -1;
let fpsList = [];

let clickPixel = 'wall';
let clickSize = 5;
let mX = 0;
let mY = 0;
let mXGrid = 0;
let mYGrid = 0;
let removing = false;
let zooming = false;
let camera = {
    x: 0,
    y: 0,
    scale: 1
};
let acceptInputs = true;
let mouseOver = false;
let inResetState = true;
let forceRedraw = true;

function createGrid(size) {
    if (size < 1) return;
    gridSize = size;
    gridScale = canvasResolution / gridSize;
    pendingExplosions = [];
    grid.length = 0;
    lastGrid.length = 0;
    nextGrid.length = 0;
    fireGrid.length = 0;
    lastFireGrid.length = 0;
    nextFireGrid.length = 0;
    monsterGrid.length = 0;
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
            placeableGrid[i][j] = true;
            lastPlaceableGrid[i][j] = true;
            noiseGrid[i][j] = noise(j / 2, i / 2);
        }
    }
    gridSizeText.value = gridSize;
};
function loadSaveCode() {
    if (saveCode.length != 0) {
        gridPaused = true;
        simulatePaused = false;
        runTicks = 0;
        ticks = 0;
        let sections = saveCode.split(';');
        if (isNaN(parseInt(sections[0]))) return;
        function parseSaveCode(code) {
            let x = 0;
            let y = 0;
            let i = 0;
            const loopedPixels = [];
            function addPixels(pixel, amount) {
                while (amount > 0) {
                    grid[y][x++] = pixNum[pixel.toUpperCase()];
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
        randomSeed(ticks);
        updateTimeControlButtons();
        forceRedraw = true;
    }
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', saveCode);
    }
};
function generateSaveCode() {
    let saveCode = `${gridSize};${'0000'.substring(0, 4 - ticks.toString(16).length)}${ticks.toString(16)};`;
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
    if (pixel != '') {
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
    return saveCode;
};
async function loadPremade(id) {
    if (await modal('Confirm load?', 'Your current red simulation will be overwritten!', true)) {
        document.querySelectorAll('save').forEach(e => {
            if (e.getAttribute('save-id') == id) {
                saveCode = e.innerHTML;
                saveCodeText.value = saveCode;
                loadSaveCode();
            }
        });
    }
};
function loadStoredSave() {
    saveCode = window.localStorage.getItem('saveCode') ?? saveCode;
    loadSaveCode();
    saveCode = window.localStorage.getItem(('saveCodeText')) ?? saveCode;
    saveCodeText.value = saveCode;
    gridPaused = true;
    updateTimeControlButtons();
};

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

function setup() {
    noiseDetail(3, 0.6);
    window.onresize();

    document.querySelectorAll('.p5Canvas').forEach(e => e.remove());

    loadStoredSave();

    document.onkeydown = (e) => {
        if (e.target.matches('button') && (e.key == 'Tab' || e.key == 'Enter')) {
            e.preventDefault();
            e.target.blur();
        }
        if (e.target.matches('#saveCode') || e.target.matches('#gridSize') || !acceptInputs || inWinScreen || window.inMenuScreen) return;
        const key = e.key.toLowerCase();
        for (let i in pixels) {
            if (pixels[i].key == key) {
                clickPixel = i;
                pixelSelectors[clickPixel].box.click();
            }
        }
        if (key == 'arrowup') {
            clickSize = Math.min(Math.ceil(gridSize / 2 + 1), clickSize + 1);
        } else if (key == 'arrowdown') {
            clickSize = Math.max(1, clickSize - 1);
        } else if (sandboxMode && key == 'r') {
            for (let i = 0; i < gridSize; i++) {
                if (grid[0][i] == pixNum.AIR && random() < 0.25) {
                    grid[0][i] = pixNum.WATER;
                }
            }
        } else if (sandboxMode && key == 'e') {
            for (let i = 0; i < gridSize; i++) {
                if (grid[0][i] == pixNum.AIR && random() < 0.25) {
                    grid[0][i] = pixNum.WATER;
                }
            }
        } else if (sandboxMode && key == 'b') {
            for (let i = 0; i < gridSize; i++) {
                grid[0][i] = pixNum.NUKE;
            }
        } else if (sandboxMode && key == 'n') {
            for (let i = 0; i < gridSize; i += 5) {
                for (let j = 0; j < gridSize; j += 5) {
                    grid[j][i] = pixNum.VERY_HUGE_NUKE;
                }
            }
        } else if (key == 'enter') {
            runTicks = 1;
        } else if (key == 'shift') {
            removing = true;
        } else if (key == 'control') {
            zooming = true;
        }
        if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11' && key != '=' && key != '-') e.preventDefault();
    };
    document.onkeyup = (e) => {
        if (e.target.matches('#saveCode') || !acceptInputs || inWinScreen || window.inMenuScreen) return;
        const key = e.key.toLowerCase();
        if (key == 'alt') {
            debugInfo = !debugInfo;
        } else if (key == 'p') {
            gridPaused = !gridPaused;
            simulatePaused = false;
            updateTimeControlButtons();
        } else if (key == 'shift') {
            removing = false;
        } else if (key == 'control') {
            zooming = false;
        }
        e.preventDefault();
    };
    document.addEventListener('wheel', (e) => {
        if (mouseOver && !window.inMenuScreen) {
            if (zooming) {
                let percentX = (mX + camera.x) / (canvasSize * camera.scale);
                let percentY = (mY + camera.y) / (canvasSize * camera.scale);
                camera.scale = Math.max(1, Math.min(Math.round(camera.scale * ((Math.abs(e.deltaY) > 10) ? (e.deltaY < 0 ? 2 : 0.5) : 1)), 8));
                camera.x = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentX) - mX, (canvasSize * camera.scale) - canvasSize));
                camera.y = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentY) - mY, (canvasSize * camera.scale) - canvasSize));
                forceRedraw = true;
            } else {
                if (e.deltaY > 0) {
                    clickSize = Math.max(1, clickSize - 1);
                } else {
                    clickSize = Math.min(Math.ceil(gridSize / 2 + 1), clickSize + 1);
                }
            }
        }
        if (zooming) { e.preventDefault(); }
    }, { passive: false });
    hasFocus = false;
    setInterval(function () {
        if (hasFocus && !document.hasFocus()) {
            removing = false;
            zooming = false;
        }
        hasFocus = document.hasFocus();
    }, 500);

    setInterval(() => {
        if (sandboxMode) {
            window.localStorage.setItem('saveCode', generateSaveCode());
        }
    }, 30000);

    lastFpsList = millis();
};

function drawPixels(x, y, width, height, type, opacity, ctx) {
    if (numPixels[type]) {
        numPixels[type].draw(x, y, width, height, opacity, ctx);
    } else {
        numPixels[pixNum.MISSING].draw(x, y, width, height, opacity, ctx);
    }
};
function clearPixels(x, y, width, height, ctx) {
    let scale = gridScale * camera.scale;
    ctx.clearRect(x * scale - camera.x, y * scale - camera.y, width * scale, height * scale);
};
function drawPixel(x, y, width, height, ctx) {
    let scale = gridScale * camera.scale;
    ctx.fillRect(x * scale - camera.x, y * scale - camera.y, width * scale, height * scale);
};
function colorAnimate(r1, g1, b1, r2, g2, b2, p) {
    let multiplier1 = (Math.sin(animationTime * Math.PI / p) + 1) / 2;
    let multiplier2 = (Math.sin((animationTime + p) * Math.PI / p) + 1) / 2;
    return [
        (r1 * multiplier1) + (r2 * multiplier2),
        (g1 * multiplier1) + (g2 * multiplier2),
        (b1 * multiplier1) + (b2 * multiplier2),
    ];
};
function updatePixel(x, y, i) {
    let pixelType = numPixels[grid[y][x]];
    if (pixelType != undefined && pixelType.updatePriority == i) {
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
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.DELETER;
}
function isPassableFluid(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.WATER || grid[y][x] == pixNum.LAVA || grid[y][x] == pixNum.DELETER;
};
function isPassableNonLavaFluid(x, y) {
    return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.WATER || grid[y][x] == pixNum.DELETER;
};
function canMoveTo(x, y) {
    return nextGrid[y][x] == null || nextGrid[y][x] == pixNum.AIR || nextGrid[y][x] == pixNum.DELETER;
};
function move(x1, y1, x2, y2) {
    if (grid[y2][x2] == pixNum.DELETER) {
        nextGrid[y1][x1] = pixNum.AIR;
    } else {
        nextGrid[y1][x1] = grid[y2][x2];
        nextGrid[y2][x2] = grid[y1][x1];
        nextFireGrid[y1][x1] = fireGrid[y2][x2];
        nextFireGrid[y2][x2] = fireGrid[y1][x1];
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
    if (y == gridSize) return;
    if (grid[y + 1][x] == pixNum.AIR || grid[y + 1][x] == pixNum.COLLAPSIBLE || grid[y + 1][x] == pixNum.DELETER) {
        if (canMoveTo(x, y + 1)) {
            move(x, y, x, y + 1);
        }
    } else {
        let left = x - 1;
        let right = x + 1;
        let slideLeft = 0;
        let slideRight = 0;
        let foundLeftDrop = false;
        let foundRightDrop = false;
        let incrementLeft = canMoveTo(x - 1, y) && grid[y][x - 1] == pixNum.AIR;
        let incrementRight = canMoveTo(x + 1, y) && grid[y][x + 1] == pixNum.AIR;
        while (incrementLeft || incrementRight) {
            if (incrementLeft) {
                if (grid[y][left] != pixNum.AIR) {
                    if (grid[y][left] != grid[y][x] || (y > 0 && grid[y - 1][left] != pixNum.AIR)) slideLeft = x - left;
                    incrementLeft = false;
                }
                if (grid[y + 1][left] == pixNum.AIR && grid[y][left] == pixNum.AIR) {
                    slideLeft = x - left;
                    foundLeftDrop = true;
                    incrementLeft = false;
                }
                left--;
                if (left < 0) incrementLeft = false;
            }
            if (incrementRight) {
                if (grid[y][right] != pixNum.AIR) {
                    if (grid[y][right] != grid[y][x] || (y > 0 && grid[y - 1][right] != pixNum.AIR)) slideRight = right - x;
                    incrementRight = false;
                }
                if (grid[y + 1][right] == pixNum.AIR && grid[y][right] == pixNum.AIR) {
                    slideRight = right - x;
                    foundRightDrop = true;
                    incrementRight = false;
                }
                right++;
                if (right >= gridSize) incrementRight = false;
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
            if (foundRightDrop && grid[y + 1][x + 1] == pixNum.AIR) {
                move(x, y, x + 1, y + 1);
            } else {
                move(x, y, x + 1, y);
            }
        } else if (toSlide < 0) {
            if (foundLeftDrop && grid[y + 1][x - 1] == pixNum.AIR) {
                move(x, y, x - 1, y + 1);
            } else {
                move(x, y, x - 1, y);
            }
        }
    }
};
function rotatePixel(x, y, possibleRotations) {
    if (nextGrid[y][x] != null) return;
    let rotate = 0;
    let thisPixel = numPixels[grid[y][x]];
    updateTouchingAnything(x, y, function (actionX, actionY) {
        let pixel = grid[actionY][actionX];
        if (pixel == pixNum.ROTATOR_CLOCKWISE) {
            rotate++;
        } else if (pixel == pixNum.ROTATOR_COUNTERCLOCKWISE) {
            rotate--;
        } else if ((pixel >= pixNum.ROTATOR_LEFT && pixel <= pixNum.ROTATOR_DOWN) && numPixels[pixel].rotation != thisPixel.rotation) {
            rotate += numPixels[pixel].rotation - thisPixel.rotation;
        }
    });
    if (rotate != 0) {
        nextGrid[y][x] = grid[y][x] - thisPixel.rotation + ((((thisPixel.rotation + rotate) % possibleRotations) + possibleRotations) % possibleRotations);
    }
};
function explode(x, y, size, chain) {
    chain = chain ?? 2;
    nextGrid[y][x] = pixNum.AIR;
    grid[y][x] = pixNum.WALL;
    let chained = false;
    for (let i = y - size; i <= y + size; i++) {
        for (let j = x - size; j <= x + size; j++) {
            if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
                if (random() < 1 - (dist(x, y, j, i) / (size * 1.2))) {
                    nextGrid[i][j] = pixNum.AIR;
                    monsterGrid[i][j] = false;
                    if (chain > 0 && !chained) {
                        if (grid[i][j] == pixNum.NUKE) {
                            pendingExplosions.push([j, i, 10, chain - 1]);
                            grid[i][j] = pixNum.AIR;
                            chained = true;
                        } else if (grid[i][j] == pixNum.HUGE_NUKE) {
                            pendingExplosions.push([j, i, 20, chain - 1]);
                            grid[i][j] = pixNum.AIR;
                            chained = true;
                        } else if (grid[i][j] == pixNum.VERY_HUGE_NUKE) {
                            pendingExplosions.push([j, i, 40, chain - 1]);
                            grid[i][j] = pixNum.AIR;
                            chained = true;
                        }
                    }
                    if (grid[i][j] == pixNum.GUNPOWDER) {
                        pendingExplosions.push([j, i, 5, 1]);
                        grid[i][j] = pixNum.WALL;
                    } else if (grid[i][j] == pixNum.C4) {
                        pendingExplosions.push([j, i, 15, 1]);
                        grid[i][j] = pixNum.WALL;
                    }
                }
                if (random() < 0.5 - (dist(x, y, j, i) / (size * 1.2))) {
                    fireGrid[i][j] = true;
                }
            }
        }
    }
};
function clickLine(startX, startY, endX, endY, remove) {
    if (!sandboxMode && !inResetState) return;
    let x = startX;
    let y = startY;
    let angle = atan2(endY - startY, endX - startX);
    let distance = sqrt(pow(endX - startX, 2) + pow(endY - startY, 2));
    let modifiedPixelCounts = [];
    let clickPixelNum = pixels[clickPixel].numId;
    place: for (let i = 0; i <= distance; i++) {
        let gridX = Math.floor(x);
        let gridY = Math.floor(y);
        let xmin = Math.max(0, Math.min(gridX - clickSize + 1, gridSize - 1));
        let xmax = Math.max(0, Math.min(gridX + clickSize - 1, gridSize - 1));
        let ymin = Math.max(0, Math.min(gridY - clickSize + 1, gridSize - 1));
        let ymax = Math.max(0, Math.min(gridY + clickSize - 1, gridSize - 1));
        function act(cb) {
            for (let k = ymin; k <= ymax; k++) {
                for (let j = xmin; j <= xmax; j++) {
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
                    return false;
                });
            } else {
                act(function (x, y) {
                    if (placeableGrid[y][x]) {
                        pixelAmounts[numPixels[grid[y][x]].id]++;
                        modifiedPixelCounts[grid[y][x]] = true;
                        grid[y][x] = pixNum.AIR;
                        fireGrid[y][x] = false;
                    }
                    return false;
                });
            }
        } else if (clickPixel == 'fire') {
            act(function (x, y) {
                fireGrid[y][x] = true;
                return false;
            });
        } else if (clickPixel == 'monster') {
            if (sandboxMode) act(function (x, y) {
                monsterGrid[y][x] = true;
                return false;
            });
        } else if (clickPixel == 'placementRestriction') {
            if (sandboxMode) act(function (x, y) {
                placeableGrid[y][x] = false;
            })
        } else if (clickPixel == 'placementUnRestriction') {
            if (sandboxMode) act(function (x, y) {
                placeableGrid[y][x] = true;
            })
        } else {
            if (sandboxMode) {
                act(function (x, y) {
                    grid[y][x] = clickPixelNum;
                });
            } else {
                modifiedPixelCounts[clickPixelNum] = true;
                if (pixelAmounts[clickPixel] <= 0) break place;
                if (act(function (x, y) {
                    if (placeableGrid[y][x]) {
                        modifiedPixelCounts[grid[y][x]] = true;
                        pixelAmounts[numPixels[grid[y][x]].id]++;
                        grid[y][x] = clickPixelNum;
                        pixelAmounts[clickPixel]--;
                    }
                    return pixelAmounts[clickPixel] <= 0;
                })) break place;
            }
        }
        x += cos(angle);
        y += sin(angle);
    }
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

function draw() {
    if (window.inMenuScreen) return;

    let prevMXGrid = mXGrid;
    let prevMYGrid = mYGrid;
    let prevMX = mX;
    let prevMY = mY;
    mX = Math.round((mouseX - 10) * canvasScale);
    mY = Math.round((mouseY - 10) * canvasScale);
    let scale = gridSize / canvasSize / camera.scale / canvasScale;
    mXGrid = Math.floor((mX + camera.x) * scale);
    mYGrid = Math.floor((mY + camera.y) * scale);
    mouseOver = mX >= 0 && mX < canvasResolution && mY >= 0 && mY < canvasResolution;

    // draw pixels
    ctx.resetTransform();
    gamectx.resetTransform();
    gridctx.resetTransform();
    abovectx.resetTransform();
    monsterctx.resetTransform();
    firectx.resetTransform();
    drawFrame();
    // copy layers
    gamectx.drawImage(gridCanvas, 0, 0);
    gamectx.drawImage(above, 0, 0);
    gamectx.drawImage(monster, 0, 0);
    gamectx.drawImage(fire, 0, 0);
    ctx.drawImage(gameCanvas, 0, 0);
    if (inResetState || sandboxMode) ctx.drawImage(placeable, 0, 0);
    // draw brush
    if (!gridPaused || !simulatePaused) {
        let x1 = Math.min(gridSize, Math.max(0, mXGrid - clickSize + 1));
        let x2 = Math.min(gridSize - 1, Math.max(-1, mXGrid + clickSize - 1));
        let y1 = Math.min(gridSize, Math.max(0, mYGrid - clickSize + 1));
        let y2 = Math.min(gridSize - 1, Math.max(-1, mYGrid + clickSize - 1));
        drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? pixNum.REMOVE : pixels[clickPixel].numId, 0.5, ctx);
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(x1 * gridScale * camera.scale - camera.x, y1 * gridScale * camera.scale - camera.y);
        ctx.lineTo((x2 + 1) * gridScale * camera.scale - camera.x, y1 * gridScale * camera.scale - camera.y);
        ctx.lineTo((x2 + 1) * gridScale * camera.scale - camera.x, (y2 + 1) * gridScale * camera.scale - camera.y);
        ctx.lineTo(x1 * gridScale * camera.scale - camera.x, (y2 + 1) * gridScale * camera.scale - camera.y);
        ctx.lineTo(x1 * gridScale * camera.scale - camera.x, y1 * gridScale * camera.scale - camera.y);
        ctx.lineTo((x2 + 1) * gridScale * camera.scale - camera.x, y1 * gridScale * camera.scale - camera.y);
        ctx.stroke();
    }

    // check win
    let hasMonsters = false;
    searchMonsters: for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (monsterGrid[i][j]) {
                hasMonsters = true;
                break searchMonsters;
            }
        }
    }
    if (!hasMonsters && !sandboxMode) triggerWin();

    // place pixels (also camera and pick pixel)
    if (mouseIsPressed && (!gridPaused || !simulatePaused) && acceptInputs && !inWinScreen && mouseOver) {
        if (mouseButton == CENTER) {
            if (zooming) {
                camera.x = Math.max(0, Math.min(camera.x + prevMX - mX, (canvasSize * camera.scale) - canvasSize));
                camera.y = Math.max(0, Math.min(camera.y + prevMY - mY, (canvasSize * camera.scale) - canvasSize));
                forceRedraw = true;
            } else if (numPixels[grid[mYGrid][mXGrid]].pickable && pixelSelectors[numPixels[grid[mYGrid][mXGrid]].id].box.style.display != 'none') {
                pixelSelectors[numPixels[grid[mYGrid][mXGrid]].id].box.onclick();
            }
        } else {
            clickLine(mXGrid, mYGrid, prevMXGrid, prevMYGrid, mouseButton == RIGHT || removing);
        }
    }
    // simulate pixels
    updateFrame();

    // fps
    while (frames[0] + 1000 < millis()) {
        frames.shift(1);
    }

    // ui
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    if (debugInfo) {
        if (gridPaused && simulatePaused) ctx.fillStyle = '#FFF';
        else ctx.fillStyle = '#0000004B';
        ctx.fillRect(5, 20, 200, 100);
        ctx.fillStyle = '#000';
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(5 + i * 2, 120 - fpsList[i], 2, fpsList[i]);
        }
        ctx.fillText('Last 10 seconds:', 10, 24);
    }
    if (gridPaused && simulatePaused) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(1, 1, 90, 18);
        ctx.fillStyle = '#000';
    }
    ctx.fillText(`FPS: ${frames.length}`, 3, 1);
    while (lastFpsList + 100 < millis()) {
        lastFpsList += 100;
        fpsList.push(frames.length);
        while (fpsList.length > 100) {
            fpsList.shift(1);
        }
    }
    ctx.textAlign = 'right';
    ctx.fillText(`Brush Size: ${clickSize * 2 - 1}`, canvasResolution - 3, 1);
    ctx.fillText(`Brush Pixel: ${(pixels[clickPixel] ?? numPixels[pixNum.MISSING]).name}`, canvasResolution - 3, 22);
    ctx.fillText(`Zoom: ${Math.round(camera.scale * 10) / 10}`, canvasResolution - 3, 43);
    if (gridPaused) {
        if (simulatePaused) {
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SIMULATING...', canvasResolution / 2, canvasResolution / 2);
        } else {
            ctx.fillStyle = '#000';
            ctx.fillText('PAUSED', canvasResolution - 3, 64);
        }
    }

    animationTime++;
};
function drawFrame() {
    if ((gridPaused && !simulatePaused) || !gridPaused || animationTime % 20 == 0) {
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
                    if (curr != pixNum.AIR && (redrawing || pixelType.animated || (pixelType.animatedNoise && !noNoise) || forceRedraw)) drawPixels(j - amount, i, amount, 1, curr, 1, gridctx);
                    else if (curr == pixNum.AIR) clearPixels(j - amount, i, amount, 1, gridctx);
                    curr = grid[i][j];
                    redrawing = grid[i][j] != lastGrid[i][j];
                    amount = 0;
                }
            }
            let pixelType = numPixels[curr] ?? numPixels[pixNum.MISSING];
            if (curr != pixNum.AIR && (redrawing || pixelType.animated || (pixelType.animatedNoise && !noNoise) || forceRedraw)) drawPixels(gridSize - amount - 1, i, amount + 1, 1, curr, 1, gridctx);
            else if (curr == pixNum.AIR && (redrawing || forceRedraw)) clearPixels(gridSize - amount - 1, i, amount + 1, 1, gridctx);
        }
        drawBooleanGrid(monsterGrid, monsterGrid, pixNum.MONSTER, monsterctx);
        drawBooleanGrid(fireGrid, lastFireGrid, pixNum.FIRE, firectx);
        drawBooleanGrid(placeableGrid, lastPlaceableGrid, pixNum.PLACEMENTRESTRICTION, placeablectx, true);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                lastGrid[i][j] = grid[i][j];
                lastFireGrid[i][j] = fireGrid[i][j];
                lastPlaceableGrid[i][j] = placeableGrid[i][j];
            }
        }
        forceRedraw = false;
    }
    if (gridPaused && runTicks <= 0 && !simulatePaused) {
        frames.push(millis());
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
            if (pixel) drawPixels(gridSize - amount - 1, i, amount, 1, type, 1, ctx);
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
            }
            if (pixel ^ invert && (redrawing || forceRedraw)) drawPixels(gridSize - amount - 1, i, amount + 1, 1, type, 1, ctx);
            else if (!pixel ^ invert && (redrawing || forceRedraw)) clearPixels(gridSize - amount - 1, i, amount + 1, 1, ctx);
        }
    }
};
function updateFrame() {
    if (!gridPaused || runTicks > 0 || simulatePaused) {
        let max = simulatePaused ? 10 : 1;
        for (let i = 0; i < max; i++) {
            runTicks--;
            /*
            update priority:
            -: fire
            0: nukes, plants, sponges, gunpowder, and lasers
            1, 2, 3, 4: pistons
            5, 6, 7, 8: cloners
            9: gravity solids
            10: pumps
            11: liquids, concrete, and leaves
            12: lag
            13: rotators
            -: monster
            */
            let firePixelType = numPixels[pixNum.FIRE];
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    if (monsterGrid[k][j]) grid[k][j] = pixNum.MONSTER;
                }
            }
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    if (fireGrid[k][j]) firePixelType.update(j, k);
                }
            }
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    if (grid[k][j] == pixNum.MONSTER) grid[k][j] = pixNum.AIR;
                    if (nextFireGrid[k][j] != null) {
                        fireGrid[k][j] = nextFireGrid[k][j];
                        nextFireGrid[k][j] = null;
                    }
                }
            }
            let currentExplosions = pendingExplosions;
            pendingExplosions = [];
            for (let explosion of currentExplosions) {
                explode(...explosion);
            }
            for (let j = 0; j <= 13; j++) {
                if (ticks % 2 == 0) {
                    for (let k = 0; k < gridSize; k++) {
                        for (let l = gridSize - 1; l >= 0; l--) {
                            updatePixel(l, k, j);
                        }
                    }
                } else {
                    for (let k = 0; k < gridSize; k++) {
                        for (let l = 0; l < gridSize; l++) {
                            updatePixel(l, k, j);
                        }
                    }
                }
                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        if (nextGrid[i][j] != null) {
                            grid[i][j] = nextGrid[i][j];
                            nextGrid[i][j] = null;
                        }
                    }
                }
            }
            let enemyPixelType = numPixels[pixNum.MONSTER];
            for (let j = 0; j < gridSize; j++) {
                for (let k = gridSize - 1; k > 0; k--) {
                    if (monsterGrid[k][j]) enemyPixelType.update(j, k);
                }
            }
            frames.push(millis());
            ticks = (ticks + 1) % 65536;
            randomSeed(ticks);
        }
        inResetState = false;
    }
};

const pauseButton = document.getElementById('pause');
const simulatePausedButton = document.getElementById('simulatePaused');
const advanceTickButton = document.getElementById('advanceTick');
function updateTimeControlButtons() {
    if (gridPaused) {
        pauseButton.style.backgroundColor = 'red';
        pauseButton.innerText = '▶';
        pauseButton.style.fontSize = '20px';
        if (simulatePaused) {
            simulatePausedButton.style.backgroundColor = 'lime';
            advanceTickButton.style.backgroundColor = 'grey';
            advanceTickButton.style.cursor = 'not-allowed';
        } else {
            simulatePausedButton.style.backgroundColor = 'red';
            advanceTickButton.style.backgroundColor = 'lightgray';
            advanceTickButton.style.cursor = '';
        }
        simulatePausedButton.style.cursor = '';
    } else {
        pauseButton.style.backgroundColor = 'lime';
        pauseButton.innerText = '▐ ▌';
        pauseButton.style.fontSize = '';
        simulatePausedButton.style.backgroundColor = 'grey';
        advanceTickButton.style.backgroundColor = 'grey';
        simulatePausedButton.style.cursor = 'not-allowed';
        advanceTickButton.style.cursor = 'not-allowed';
    }
};
document.getElementById('sizeUp').onclick = (e) => {
    clickSize = Math.min(Math.ceil(gridSize / 2 + 1), clickSize + 1);
};
document.getElementById('sizeDown').onclick = (e) => {
    clickSize = Math.max(1, clickSize - 1);
};
pauseButton.onclick = (e) => {
    gridPaused = !gridPaused;
    simulatePaused = false;
    updateTimeControlButtons();
};
simulatePausedButton.onclick = (e) => {
    if (gridPaused) simulatePaused = !simulatePaused;
    updateTimeControlButtons();
};
advanceTickButton.onclick = (e) => {
    runTicks = 1;
};
document.getElementById('backToMenu').onclick = (e) => {
    if (window.inMenuScreen || inWinScreen || !acceptInputs) return;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', generateSaveCode());
        window.localStorage.setItem('saveCodeText', saveCodeText.value);
    }
    transitionToMenu();
};
let writeSaveTimeout = setTimeout(() => { });
saveCodeText.oninput = (e) => {
    if (!sandboxMode) return;
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
    if (!sandboxMode) return;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    saveCode = generateSaveCode();
    saveCodeText.value = saveCode;
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', saveCode);
        window.localStorage.setItem('saveCodeText', saveCode);
    }
};
document.getElementById('uploadSave').onclick = (e) => {
    if (!sandboxMode) return;
    gridPaused = true;
    simulatePaused = false;
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
            if (await modal('Load premade?', 'Your current red simulation will be overwritten!', true)) {
                saveCode = e.target.result;
                saveCodeText.value = saveCode;
                loadSaveCode();
            }
        };
        reader.readAsText(files[0]);
    };
};
document.getElementById('downloadSave').onclick = (e) => {
    if (!sandboxMode) return;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    saveCode = saveCodeText.value;
    const encoded = `data:text/redpixel;base64,${btoa(saveCode)}`;
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `red-pixel-simulator_${Math.ceil(Math.random() * 1000)}.redpixel`;
    a.click();
};
document.getElementById('reset').onclick = async (e) => {
    if (window.inMenuScreen || inWinScreen || !acceptInputs) return;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    if (await modal('Reset?', 'Your current red simulation will be overwritten!', true)) {
        saveCode = saveCodeText.value.replace('\n', '');
        loadSaveCode();
        inResetState = true;
    }
};
document.getElementById('restart').onclick = async (e) => {
    if (window.inMenuScreen || inWinScreen || !acceptInputs) return;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    if (await modal('Restart?', 'Your solution will be removed!', true)) {
        window.localStorage.removeItem(`challenge-${currentPuzzleId}`);
        loadPuzzle(currentPuzzleSection, currentPuzzleLevel);
    }
};
gridSizeText.oninput = (e) => {
    if (!sandboxMode) return;
    gridSizeText.value = Math.max(1, Math.min(parseInt(gridSizeText.value.replace('e', '')), 500));
    if (gridSizeText.value != '') saveCode = gridSizeText.value + saveCode.substring(saveCode.indexOf(';'));
    saveCodeText.value = saveCode;
};
const noNoiseButton = document.getElementById('noNoise');
const fadeEffectButton = document.getElementById('fadeEffect');
noNoiseButton.onclick = (e) => {
    noNoise = !noNoise;
    if (noNoise) noNoiseButton.style.backgroundColor = 'lime';
    else noNoiseButton.style.backgroundColor = 'red';
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

window.onresize = (e) => {
    canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20;
    canvasScale = canvasResolution / canvasSize;
    resetCanvases();
    canvas.style.width = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';
    if (window.innerWidth - canvasSize < 400) {
        sidebar.style.top = Math.min(window.innerWidth, window.innerHeight) + 'px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - 20 + 'px');
        let pickerWidth = (Math.round((window.innerWidth - 20) / 62) - 1) * 62;
        pixelPicker.style.width = pickerWidth + 'px';
        pixelPickerDescription.style.width = pickerWidth - 14 + 'px';
    } else {
        sidebar.style.top = '0px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - canvasSize - 20 + 'px');
        let pickerWidth = (Math.round((window.innerWidth - canvasSize) / 62) - 1) * 62;
        pixelPicker.style.width = pickerWidth + 'px';
        pixelPickerDescription.style.width = pickerWidth - 14 + 'px';
    }
    forceRedraw = true;
};
const preventMotion = (e) => {
    if (mouseOver) {
        window.scrollTo(0, 0);
        e.preventDefault();
        e.stopPropagation();
    }
};
// window.addEventListener("scroll", preventMotion, false);
// window.addEventListener("touchmove", preventMotion, false);