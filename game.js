window.addEventListener('error', (e) => {
    modal('An error occured:', `<span style="color: red;"><br>${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
});

let gridSize = 100;
let saveCode = '100;air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser-6:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava_generator-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}5|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let startPaused = false;
let backgroundColor = '#ffffff';
let sandboxMode = true;

let noNoise = false;
let optimizedLags = false;
let fadeEffect = 127;

const canvasResolution = parseInt(window.localStorage.getItem('resolution') ?? 1000);
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
const below = createCanvas2(canvasResolution, canvasResolution);
const above = createCanvas2(canvasResolution, canvasResolution);
const fire = createCanvas2(canvasResolution, canvasResolution);
const deleter = createCanvas2(canvasResolution, canvasResolution);
const placeable = createCanvas2(canvasResolution, canvasResolution);
const ctx = canvas.getContext('2d');
const belowctx = below.getContext('2d');
const abovectx = above.getContext('2d');
const firectx = fire.getContext('2d');
const deleterctx = deleter.getContext('2d');
const placeablectx = placeable.getContext('2d');
function resetCanvases() {
    canvas.width = canvasResolution;
    canvas.height = canvasResolution;
    below.width = canvasResolution;
    below.height = canvasResolution;
    above.width = canvasResolution;
    above.height = canvasResolution;
    fire.width = canvasResolution;
    fire.height = canvasResolution;
    deleter.width = canvasResolution;
    deleter.height = canvasResolution;
    placeable.width = canvasResolution;
    placeable.height = canvasResolution;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    belowctx.imageSmoothingEnabled = false;
    belowctx.webkitImageSmoothingEnabled = false;
    belowctx.mozImageSmoothingEnabled = false;
    abovectx.imageSmoothingEnabled = false;
    abovectx.webkitImageSmoothingEnabled = false;
    abovectx.mozImageSmoothingEnabled = false;
    firectx.imageSmoothingEnabled = false;
    firectx.webkitImageSmoothingEnabled = false;
    firectx.mozImageSmoothingEnabled = false;
    deleterctx.imageSmoothingEnabled = false;
    deleterctx.webkitImageSmoothingEnabled = false;
    deleterctx.mozImageSmoothingEnabled = false;
    placeablectx.imageSmoothingEnabled = false;
    placeablectx.webkitImageSmoothingEnabled = false;
    placeablectx.mozImageSmoothingEnabled = false;
};
const sidebar = document.getElementById('sidebar');
const pixelPicker = document.getElementById('pixelPicker');
const pixelPickerDescription = document.getElementById('pixelPickerDescription');
const saveCodeText = document.getElementById('saveCode');
resetCanvases();
canvas.addEventListener('contextmenu', e => e.preventDefault());

let gridScale = canvasResolution / gridSize;
let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20;
let canvasScale = canvasResolution / canvasSize;
let debugInfo = false;
let animationTime = 0;
let ticks = 0;
let frames = [];
let lastFpsList = -1;
let fpsList = [];
const grid = [];
const lastGrid = [];
const nextGrid = [];
const noiseGrid = [];
const fireGrid = [];
const lastFireGrid = [];
const nextFireGrid = [];
const deleterGrid = [];
const placeableGrid = [];
const lastPlaceableGrid = [];
const target = [0, 0];
let pendingExplosions = [];
let gridPaused = true;
let simulatePaused = false;
let runTicks = 0;
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
let forceRedraw = true;

function createGrid(size) {
    if (size < 1) return;
    gridSize = size;
    gridScale = canvasResolution / gridSize;
    pendingExplosions = [];
    grid.length = 0;
    lastGrid.length = 0;
    nextGrid.length = 0;
    noiseGrid.length = 0;
    fireGrid.length = 0;
    lastFireGrid.length = 0;
    nextFireGrid.length = 0;
    deleterGrid.length = 0;
    placeableGrid.length = 0;
    lastPlaceableGrid.length = 0;
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        lastGrid[i] = [];
        nextGrid[i] = [];
        noiseGrid[i] = [];
        fireGrid[i] = [];
        lastFireGrid[i] = [];
        nextFireGrid[i] = [];
        deleterGrid[i] = [];
        placeableGrid[i] = [];
        lastPlaceableGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 'air';
            lastGrid[i][j] = null;
            nextGrid[i][j] = null;
            noiseGrid[i][j] = noise(j / 2, i / 2);
            fireGrid[i][j] = false;
            lastFireGrid[i][j] = false;
            nextFireGrid[i][j] = false;
            deleterGrid[i][j] = false;
            placeableGrid[i][j] = true;
            lastPlaceableGrid[i][j] = true;
        }
    }
    document.getElementById('gridSize').value = gridSize;
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
        if (sections[4]) parseBooleanCode(deleterGrid, sections[4]);
        if (sections[5]) parseBooleanCode(placeableGrid, sections[5]);
        randomSeed(ticks);
        gridPaused = startPaused;
        updateTimeControlButtons();
        forceRedraw = true;
    }
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', saveCode);
    }
};
function generateSaveCode() {
    let saveCode = `${gridSize};${'0000'.substring(0, 4 - ticks.toString(16).length)}${ticks.toString(16)};`;
    let pixel = '';
    let amount = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            amount++;
            if (grid[i][j] != pixel) {
                if (pixel != '' && amount != 0) {
                    if (amount == 1) {
                        saveCode += `${pixel}:`;
                    } else {
                        saveCode += `${pixel}-${amount}:`;
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
            saveCode += `${pixel}:`;
        } else {
            saveCode += `${pixel}-${amount}:`;
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
    createBooleanCode(deleterGrid);
    createBooleanCode(placeableGrid);
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

function modal(title, subtitle, confirmation) {
    if (!acceptInputs) return new Promise((resolve, reject) => reject());
    acceptInputs = false;
    const modalContainer = document.getElementById('modalContainer');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalYes = document.getElementById('modalYes');
    const modalNo = document.getElementById('modalNo');
    const modalOk = document.getElementById('modalOk');
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
    modal.style.transform = 'translateY(0px)';
    const hide = () => {
        modalContainer.style.opacity = '';
        modalContainer.style.pointerEvents = '';
        modal.style.transform = '';
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
        if (e.target.matches('#saveCode') || e.target.matches('#gridSize') || !acceptInputs || window.inMenuScreen) return;
        const key = e.key.toLowerCase();
        for (let i in pixels) {
            if (pixels[i].key == key) {
                clickPixel = i;
                pixelPicker.children.forEach(div => div.classList.remove('pickerPixelSelected'));
                document.getElementById(`picker-${i}`).classList.add('pickerPixelSelected');
                pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[i].name}</span><br>${pixels[i].description}`;
            }
        }
        if (key == 'arrowup') {
            clickSize = Math.min(Math.ceil(gridSize / 2 + 1), clickSize + 1);
        } else if (key == 'arrowdown') {
            clickSize = Math.max(1, clickSize - 1);
        } else if (key == 'r') {
            for (let i = 0; i < gridSize; i++) {
                if (grid[0][i] == 'air' && random() < 0.25) {
                    grid[0][i] = 'water';
                }
            }
        } else if (key == 'e') {
            for (let i = 0; i < gridSize; i++) {
                if (grid[0][i] == 'air' && random() < 0.25) {
                    grid[0][i] = 'lava';
                }
            }
        } else if (key == 'b') {
            for (let i = 0; i < gridSize; i++) {
                grid[0][i] = 'nuke';
            }
        } else if (key == 'n') {
            for (let i = 0; i < gridSize; i += 5) {
                for (let j = 0; j < gridSize; j += 5) {
                    grid[j][i] = 'very_huge_nuke';
                }
            }
        } else if (key == 'enter') {
            runTicks = 1;
        } else if (key == 'shift') {
            removing = true;
        } else if (key == 'control') {
            zooming = true;
        }
        if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11') e.preventDefault();
        if (e.target.matches('button')) e.target.blur();
    };
    document.onkeyup = (e) => {
        if (e.target.matches('#saveCode') || !acceptInputs || window.inMenuScreen) return;
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
    if (pixels[type]) {
        pixels[type].draw(x, y, width, height, opacity, ctx);
    } else {
        pixels['missing'].draw(x, y, width, height, opacity, ctx);
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
function updatePixel(x, y, i) {
    let pixelType = pixels[grid[y][x]];
    if (pixelType != null && pixelType.updatePriority == i) {
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
    if (x > 0 && grid[y][x - 1] != 'air') {
        if (typeof action == 'function') touchingPixel = (action(x - 1, y) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (x < gridSize - 1 && grid[y][x + 1] != 'air') {
        if (typeof action == 'function') touchingPixel = (action(x + 1, y) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (y > 0 && grid[y - 1][x] != 'air') {
        if (typeof action == 'function') touchingPixel = (action(x, y - 1) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    if (y < gridSize - 1 && grid[y + 1][x] != 'air') {
        if (typeof action == 'function') touchingPixel = (action(x, y + 1) ?? true) || touchingPixel;
        else touchingPixel = true;
    }
    return touchingPixel;
};
function validMovingPixel(x, y) {
    return nextGrid[y][x] == null;
};
function isPassableFluid(x, y) {
    return grid[y][x] == 'air' || grid[y][x] == 'water' || grid[y][x] == 'lava';
};
function isPassableNonLavaFluid(x, y) {
    return grid[y][x] == 'air' || grid[y][x] == 'water';
};
function canMoveTo(x, y) {
    return nextGrid[y][x] == null || nextGrid[y][x] == 'air';
};
function move(x1, y1, x2, y2) {
    nextGrid[y1][x1] = grid[y2][x2];
    nextGrid[y2][x2] = grid[y1][x1];
    nextFireGrid[y2][x2] = fireGrid[y1][x1];
    nextFireGrid[y2][x2] = fireGrid[y1][x1];
};
function detectRotate(x, y) {
    return updateTouchingAnything(x, y, function (actionX, actionY) {
        if (grid[actionY][actionX] == 'rotator_clockwise') {
            const selfType = grid[y][x].replace(/_up|_down|_left|_right/g, '');
            const selfDir = grid[y][x].replace(selfType + '_', '');
            switch (selfDir) {
                case 'up':
                    nextGrid[y][x] = selfType + '_right';
                    break;
                case 'down':
                    nextGrid[y][x] = selfType + '_left';
                    break;
                case 'left':
                    nextGrid[y][x] = selfType + '_up';
                    break;
                case 'right':
                    nextGrid[y][x] = selfType + '_down';
                    break;
            }
            return true;
        } else if (grid[actionY][actionX] == 'rotator_counterclockwise') {
            const selfType = grid[y][x].replace(/_up|_down|_left|_right/g, '');
            const selfDir = grid[y][x].replace(selfType + '_', '');
            switch (selfDir) {
                case 'up':
                    nextGrid[y][x] = selfType + '_left';
                    break;
                case 'down':
                    nextGrid[y][x] = selfType + '_right';
                    break;
                case 'left':
                    nextGrid[y][x] = selfType + '_down';
                    break;
                case 'right':
                    nextGrid[y][x] = selfType + '_up';
                    break;
            }
            return true;
        } else if (grid[actionY][actionX].startsWith('rotator_')) {
            const selfType = grid[y][x].replace(/_up|_down|_left|_right/g, '');
            if (grid[actionY][actionX].replace('rotator', '') != grid[y][x].replace(selfType, '')) {
                nextGrid[y][x] = selfType + grid[actionY][actionX].replace('rotator', '');
                return true;
            }
        }
        return false;
    });
};
function explode(x, y, size, chain) {
    chain = chain ?? 2;
    nextGrid[y][x] = 'air';
    grid[y][x] = 'wall';
    let chained = false;
    for (let i = y - size; i <= y + size; i++) {
        for (let j = x - size; j <= x + size; j++) {
            if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
                if (random() < 1 - (dist(x, y, j, i) / (size * 1.2))) {
                    nextGrid[i][j] = 'air';
                    if (chain > 0 && !chained) {
                        if (grid[i][j] == 'nuke') {
                            pendingExplosions.push([j, i, 10, chain - 1]);
                            grid[i][j] = 'air';
                            chained = true;
                        } else if (grid[i][j] == 'huge_nuke') {
                            pendingExplosions.push([j, i, 20, chain - 1]);
                            grid[i][j] = 'air';
                            chained = true;
                        } else if (grid[i][j] == 'very_huge_nuke') {
                            pendingExplosions.push([j, i, 40, chain - 1]);
                            grid[i][j] = 'air';
                            chained = true;
                        }
                    }
                    if (grid[i][j] == 'gunpowder') {
                        pendingExplosions.push([j, i, 5, 1]);
                        grid[i][j] = 'wall';
                    } else if (grid[i][j] == 'c4') {
                        pendingExplosions.push([j, i, 15, 1]);
                        grid[i][j] = 'wall';
                    }
                }
                if (random() < 0.5 - (dist(x, y, j, i) / (size * 1.2))) {
                    fireGrid[i][j] = true;
                }
            }
        }
    }
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

function clickLine(startX, startY, endX, endY, remove) {
    let x = startX;
    let y = startY;
    let angle = atan2(endY - startY, endX - startX);
    let distance = sqrt(pow(endX - startX, 2) + pow(endY - startY, 2));
    let modifiedPixelCounts = [];
    place: for (let i = 0; i <= distance; i++) {
        let gridX = Math.floor(x);
        let gridY = Math.floor(y);
        let xmin = Math.max(0, Math.min(gridX - clickSize + 1, gridSize - 1));
        let xmax = Math.max(0, Math.min(gridX + clickSize - 1, gridSize - 1));
        let ymin = Math.max(0, Math.min(gridY - clickSize + 1, gridSize - 1));
        let ymax = Math.max(0, Math.min(gridY + clickSize - 1, gridSize - 1));
        function act(cb) {
            for (let j = xmin; j <= xmax; j++) {
                for (let k = ymin; k <= ymax; k++) {
                    if (cb(j, k)) return true;
                }
            }
            return false;
        };
        if (remove) {
            if (sandboxMode) {
                act(function (x, y) {
                    grid[y][x] = 'air';
                    fireGrid[y][x] = false;
                    deleterGrid[y][x] = false;
                    return false;
                });
            } else {
                act(function (x, y) {
                    pixelAmounts[grid[k][j]]++;
                    modifiedPixelCounts[grid[k][j]] = true;
                    grid[y][x] = 'air';
                    fireGrid[y][x] = false;
                    deleterGrid[y][x] = false;
                    return false;
                });
            }
        } else if (clickPixel == 'fire') {
            act(function (x, y) {
                fireGrid[y][x] = true;
                return false;
            });
        } else if (clickPixel == 'deleter') {
            if (sandboxMode) {
                act(function (x, y) {
                    deleterGrid[y][x] = true;
                    return false;
                });
            } else {
                modifiedPixelCounts[clickPixel] = true;
                if (act(function (x, y) {
                    modifiedPixelCounts[grid[k][j]] = true;
                    deleterGrid[y][x] = true;
                    pixelAmounts[clickPixel]--;
                    return pixelAmounts[clickPixel] <= 0;
                })) break place;
            }
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
                    grid[y][x] = clickPixel;
                });
            } else {
                if (act(function (x, y) {
                    modifiedPixelCounts[grid[y][x]] = true;
                    pixelAmounts[grid[y][x]]++;
                    grid[y][x] = clickPixel;
                    pixelAmounts[clickPixel]--;
                    return pixelAmounts[clickPixel] <= 0;
                })) break place;
            }
        }
        x += cos(angle);
        y += sin(angle);
    }
};

function draw() {
    if (window.inMenuScreen) return;

    ctx.resetTransform();
    belowctx.resetTransform();
    abovectx.resetTransform();
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
    drawFrame();
    // copy layers
    ctx.drawImage(below, 0, 0);
    ctx.drawImage(above, 0, 0);
    ctx.drawImage(fire, 0, 0);
    ctx.drawImage(deleter, 0, 0);
    ctx.drawImage(placeable, 0, 0);
    // draw brush
    if (!gridPaused || !simulatePaused) {
        let x1 = Math.min(gridSize, Math.max(0, mXGrid - clickSize + 1));
        let x2 = Math.min(gridSize - 1, Math.max(-1, mXGrid + clickSize - 1));
        let y1 = Math.min(gridSize, Math.max(0, mYGrid - clickSize + 1));
        let y2 = Math.min(gridSize - 1, Math.max(-1, mYGrid + clickSize - 1));
        drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? 'remove' : clickPixel, 0.5, ctx);
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

    // place pixels (also camera)
    if (mouseIsPressed && (!gridPaused || !simulatePaused) && acceptInputs && mouseOver) {
        if (mouseButton == CENTER) {
            if (zooming) {
                camera.x = Math.max(0, Math.min(camera.x + prevMX - mX, (canvasSize * camera.scale) - canvasSize));
                camera.y = Math.max(0, Math.min(camera.y + prevMY - mY, (canvasSize * camera.scale) - canvasSize));
                forceRedraw = true;
            } else {
                if (pixels[grid[mYGrid][mXGrid]].pickable) clickPixel = grid[mYGrid][mXGrid];
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
    ctx.fillText(`Brush Pixel: ${(pixels[clickPixel] ?? pixels['missing']).name}`, canvasResolution - 3, 22);
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
        ctx.fillStyle = backgroundColor + (255 - fadeEffect).toString(16);
        ctx.fillRect(0, 0, canvasResolution, canvasResolution);
        if (forceRedraw) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvasResolution, canvasResolution);
            belowctx.clearRect(0, 0, canvasResolution, canvasResolution);
            abovectx.clearRect(0, 0, canvasResolution, canvasResolution);
            firectx.clearRect(0, 0, canvasResolution, canvasResolution);
            deleterctx.clearRect(0, 0, canvasResolution, canvasResolution);
            placeablectx.clearRect(0, 0, canvasResolution, canvasResolution);
        }
        for (let i = 0; i < gridSize; i++) {
            let curr = 'air';
            let redrawing = grid[i][0] != lastGrid[i][0];
            let amount = 0;
            for (let j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != curr || (grid[i][j] != lastGrid[i][j]) != redrawing) {
                    let pixelType = pixels[curr] ?? pixels['missing'];
                    if (curr != 'air' && (redrawing || pixelType.animated || (pixelType.animatedNoise && !noNoise) || forceRedraw)) drawPixels(j - amount, i, amount, 1, curr, 1, pixelType.above ? abovectx : belowctx);
                    else if (curr == 'air') clearPixels(j - amount, i, amount, 1, pixelType.above ? abovectx : belowctx);
                    curr = grid[i][j];
                    redrawing = grid[i][j] != lastGrid[i][j];
                    amount = 0;
                }
            }
            let pixelType = pixels[curr] ?? pixels['missing'];
            if (curr != 'air' && (redrawing || pixelType.animated || (pixelType.animatedNoise && !noNoise) || forceRedraw)) drawPixels(gridSize - amount - 1, i, amount + 1, 1, curr, 1, pixelType.above ? abovectx : belowctx);
            else if (curr == 'air' && (redrawing || forceRedraw)) clearPixels(gridSize - amount - 1, i, amount + 1, 1, pixelType.above ? abovectx : belowctx);
        }
        drawBooleanGrid(fireGrid, lastFireGrid, 'fire', firectx);
        drawBooleanGrid(deleterGrid, deleterGrid, 'deleter', deleterctx);
        drawBooleanGrid(placeableGrid, lastPlaceableGrid, 'placementRestriction', placeablectx, true);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                lastGrid[i][j] = grid[i][j];
                lastFireGrid[i][j] = fireGrid[i][j];
                lastPlaceableGrid[i][j] = placeableGrid[i][j];
            }
        }
        if (!sandboxMode) {

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
            1: pistons
            2: gravity pixels
            3: liquids and concrete
            4: pumps and cloners
            5: lag
            */
            let firePixelType = pixels['fire'];
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    if (fireGrid[k][j]) firePixelType.update(j, k);
                }
            }
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
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
            for (let j = 0; j <= 5; j++) {
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
            let deleterPixelType = pixels['deleter'];
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    if (deleterGrid[k][j]) deleterPixelType.update(j, k);
                }
            }
            frames.push(millis());
            ticks = (ticks + 1) % 65536;
            randomSeed(ticks);
        }
    }
};

function updateTimeControlButtons() {
    if (gridPaused) {
        document.getElementById('pause').style.backgroundColor = 'red';
        document.getElementById('pause').innerText = '▶';
        document.getElementById('pause').style.fontSize = '20px';
        if (simulatePaused) {
            document.getElementById('simulatePaused').style.backgroundColor = 'lime';
            document.getElementById('advanceTick').style.backgroundColor = 'grey';
            document.getElementById('advanceTick').style.cursor = 'not-allowed';
        } else {
            document.getElementById('simulatePaused').style.backgroundColor = 'red';
            document.getElementById('advanceTick').style.backgroundColor = 'lightgray';
            document.getElementById('advanceTick').style.cursor = '';
        }
        document.getElementById('simulatePaused').style.cursor = '';
    } else {
        document.getElementById('pause').style.backgroundColor = 'lime';
        document.getElementById('pause').innerText = '▐ ▌';
        document.getElementById('pause').style.fontSize = '';
        document.getElementById('simulatePaused').style.backgroundColor = 'grey';
        document.getElementById('advanceTick').style.backgroundColor = 'grey';
        document.getElementById('simulatePaused').style.cursor = 'not-allowed';
        document.getElementById('advanceTick').style.cursor = 'not-allowed';
    }
};
document.getElementById('sizeUp').onclick = (e) => {
    clickSize = Math.min(Math.ceil(gridSize / 2 + 1), clickSize + 1);
};
document.getElementById('sizeDown').onclick = (e) => {
    clickSize = Math.max(1, clickSize - 1);
};
document.getElementById('pause').onclick = (e) => {
    gridPaused = !gridPaused;
    simulatePaused = false;
    updateTimeControlButtons();
};
document.getElementById('simulatePaused').onclick = (e) => {
    if (gridPaused) simulatePaused = !simulatePaused;
    updateTimeControlButtons();
};
document.getElementById('advanceTick').onclick = (e) => {
    runTicks = 1;
};
document.getElementById('backToMenu').onclick = (e) => {
    if (window.inMenuScreen) return;
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
document.getElementById('saveCode').oninput = (e) => {
    if (!sandboxMode) return;
    let index = saveCodeText.value.indexOf(';');
    if (index > 0) {
        document.getElementById('gridSize').value = saveCodeText.value.substring(0, index);
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
            if (await modal('Confirm load?', 'Your current red simulation will be overwritten!', true)) {
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
document.getElementById('startPaused').onclick = (e) => {
    startPaused = !startPaused;
    if (startPaused) document.getElementById('startPaused').style.backgroundColor = 'lime';
    else document.getElementById('startPaused').style.backgroundColor = 'red';
};
document.getElementById('reset').onclick = async (e) => {
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    if (await modal('Confirm reset?', 'Your current red simulation will be overwritten!', true)) {
        saveCode = saveCodeText.value.replace('\n', '');
        loadSaveCode();
    }
};
document.getElementById('gridSize').oninput = (e) => {
    if (!sandboxMode) return;
    document.getElementById('gridSize').value = Math.max(1, Math.min(parseInt(document.getElementById('gridSize').value.replace('e', '')), 500));
    if (document.getElementById('gridSize').value != '') saveCode = document.getElementById('gridSize').value + saveCode.substring(saveCode.indexOf(';'));
    saveCodeText.value = saveCode;
};
document.getElementById('noNoise').onclick = (e) => {
    noNoise = !noNoise;
    if (noNoise) document.getElementById('noNoise').style.backgroundColor = 'lime';
    else document.getElementById('noNoise').style.backgroundColor = 'red';
    forceRedraw = true;
};
document.getElementById('fadeEffect').onclick = (e) => {
    fadeEffect = fadeEffect ? 0 : 127;
    if (fadeEffect) document.getElementById('fadeEffect').style.backgroundColor = 'lime';
    else document.getElementById('fadeEffect').style.backgroundColor = 'red';
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
    canvas.width = canvasResolution;
    canvas.height = canvasResolution;
    below.width = canvasResolution;
    below.height = canvasResolution;
    above.width = canvasResolution;
    above.height = canvasResolution;
    fire.width = canvasResolution;
    fire.height = canvasResolution;
    deleter.width = canvasResolution;
    deleter.height = canvasResolution;
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