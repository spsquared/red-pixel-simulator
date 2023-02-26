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
function createCanvas2(size) {
    if (NO_OFFSCREENCANVAS) {
        const canvas = document.createElement('canvas');
        canvas.width = size || 1;
        canvas.height = size || 1;
        return canvas;
    } else {
        return new OffscreenCanvas(size || 1, size || 1);
    }
};
const canvas = document.getElementById('canvas');
const gameCanvas = createCanvas2(canvasResolution);
const gridCanvas = createCanvas2(canvasResolution);
const above = createCanvas2(canvasResolution);
const fire = createCanvas2(canvasResolution);
const monster = createCanvas2(canvasResolution);
const placeable = createCanvas2(canvasResolution);
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
const deleterGrid = [];
const placeableGrid = [];
const lastPlaceableGrid = [];
const noiseGrid = [];
const target = [0, 0];
let pendingExplosions = [];
let animationTime = 0;
let ticks = 0;
let gridPaused = true;
let simulatePaused = false;
let runTicks = 0;
const frames = [];
const fpsList = [];
let lastFpsList = -1;

const brush = {
    pixel: 'wall',
    size: 1,
    isSelection: false
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
    deleterGrid.length = 0;
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
        deleterGrid[i] = [];
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
            deleterGrid[i][j] = false;
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
                let pixelTypeNum = pixNum[pixel.toUpperCase()];
                while (amount > 0) {
                    if (pixelTypeNum == pixNum.DELETER) deleterGrid[y][x] = true;
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

    setInterval(() => {
        if (sandboxMode) {
            window.localStorage.setItem('saveCode', generateSaveCode());
        }
    }, 30000);
};

// pixel utilities
function PreRenderer() {
    const rendCanvas = document.createElement('canvas');
    rendCanvas.width = 60;
    rendCanvas.height = 60;
    const rendctx = rendCanvas.getContext('2d');
    return {
        ctx: rendctx,
        fillPixel: function (x, y, width, height) {
            rendctx.fillRect(x * 60, y * 60, width * 60, height * 60);
        },
        toImage: function () {
            const img = new Image(60);
            img.src = rendCanvas.toDataURL('image/png');
            return img;
        }
    }
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
}
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
        let airLeft = 0;
        let airRight = 0;
        let foundLeftDrop = false;
        let foundRightDrop = false;
        let incrementLeft = canMoveTo(x - 1, y) && grid[y][x - 1] == pixNum.AIR;
        let incrementRight = canMoveTo(x + 1, y) && grid[y][x + 1] == pixNum.AIR;
        let searchLeft = true;
        let searchRight = true;
        while (incrementLeft || incrementRight) {
            if (incrementLeft) {
                if (grid[y][left] != pixNum.AIR) {
                    if (searchLeft && y > 0 && grid[y - 1][left] != pixNum.AIR) slideLeft = x - left;
                    if (grid[y][left] == grid[y][x]) {
                        searchLeft = false;
                    } else {
                        incrementLeft = false;
                    }
                } else {
                    airLeft++;
                }
                if (searchLeft && grid[y + 1][left] == pixNum.AIR && grid[y][left] == pixNum.AIR) {
                    slideLeft = x - left;
                    foundLeftDrop = true;
                    incrementLeft = false;
                }
                left--;
                if (left < 0) incrementLeft = false;
            }
            if (incrementRight) {
                if (grid[y][right] != pixNum.AIR) {
                    if (searchRight && y > 0 && grid[y - 1][right] != pixNum.AIR) slideRight = right - x;
                    if (grid[y][right] == grid[y][x]) {
                        searchRight = false;
                    } else {
                        incrementRight = false;
                    }
                } else {
                    airRight++;
                }
                if (searchRight && grid[y + 1][right] == pixNum.AIR && grid[y][right] == pixNum.AIR) {
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
        } else if (airLeft > airRight) {
            toSlide = -1;
        } else if (airLeft < airRight) {
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

// draw loop
function draw() {
    if (inMenuScreen) return;

    prevMXGrid = mXGrid;
    prevMYGrid = mYGrid;
    prevMX = mX;
    prevMY = mY;
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
    ctx.globalAlpha = 1;
    gamectx.globalAlpha = 1;
    gridctx.globalAlpha = 1;
    abovectx.globalAlpha = 1;
    monsterctx.globalAlpha = 1;
    firectx.globalAlpha = 1;
    // copy layers
    gamectx.drawImage(gridCanvas, 0, 0);
    gamectx.drawImage(above, 0, 0);
    gamectx.drawImage(monster, 0, 0);
    gamectx.drawImage(fire, 0, 0);
    ctx.drawImage(gameCanvas, 0, 0);
    if (inResetState || sandboxMode) ctx.drawImage(placeable, 0, 0);
    // mouse controls + brush
    updateMouseControls();
    drawBrush();
    ctx.globalAlpha = 1;

    // update camera
    updateCamera();

    // check win
    let hasMonsters = false;
    searchMonsters: for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (monsterGrid[y][x]) {
                hasMonsters = true;
                break searchMonsters;
            }
        }
    }
    if (!hasMonsters && !sandboxMode) triggerWin();
    // simulate pixels
    updateFrame();

    // fps
    while (frames[0] + 1000 < millis()) {
        frames.shift(1);
    }

    // ui
    drawUI();

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
function updateMouseControls() {
    if ((mouseIsPressed && mouseButton == RIGHT) || removing) brush.isSelection = false;
    if (mouseIsPressed && (!gridPaused || !simulatePaused) && acceptInputs && !inWinScreen && mouseOver) {
        if (brush.isSelection && selection.grid[0] != undefined && sandboxMode) {
            let offsetX = Math.floor(mXGrid - selection.grid[0].length / 2);
            let offsetY = Math.floor(mYGrid - selection.grid.length / 2);
            for (let y = 0; y < selection.grid.length; y++) {
                if (y + offsetY >= 0 && y + offsetX < gridSize) for (let x = 0; x < selection.grid[y].length; x++) {
                    if (x + offsetX >= 0 && x + offsetX < gridSize && selection.grid[y][x] != pixNum.AIR) {
                        grid[y + offsetY][x + offsetX] = selection.grid[y][x];
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
            selection.x2 = Math.max(selection.x1, mXGrid);
            selection.y2 = Math.max(selection.y1, mYGrid);
            selection.x1 = Math.min(selection.x1, mXGrid);
            selection.y1 = Math.min(selection.y1, mYGrid);
        } else {
            clickLine(mXGrid, mYGrid, prevMXGrid, prevMYGrid, mouseButton == RIGHT || removing);
        }
    }
    if (!mouseIsPressed || mouseButton != LEFT || !holdingControl) selecting = false;
};
function drawBrush() {
    if ((!gridPaused || !simulatePaused) && !selecting) {
        if (brush.isSelection && selection.grid[0] != undefined && !((mouseIsPressed && mouseButton == RIGHT) || removing)) {
            let x1 = Math.min(gridSize, Math.max(0, Math.floor(mXGrid - selection.grid[0].length / 2)));
            let x2 = Math.min(gridSize - 1, Math.max(-1, Math.floor(mXGrid + selection.grid[0].length / 2) - 1));
            let y1 = Math.min(gridSize, Math.max(0, Math.floor(mYGrid - selection.grid.length / 2)));
            let y2 = Math.min(gridSize - 1, Math.max(-1, Math.floor(mYGrid + selection.grid.length / 2) - 1));
            let offsetX = Math.floor(mXGrid - selection.grid[0].length / 2);
            let offsetY = Math.floor(mYGrid - selection.grid.length / 2);
            for (let y = 0; y < selection.grid.length; y++) {
                for (let x = 0; x < selection.grid[y].length; x++) {
                    drawPixels(x + offsetX, y + offsetY, 1, 1, selection.grid[y][x], 0.5, ctx);
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
        } else {
            let x1 = Math.min(gridSize, Math.max(0, mXGrid - brush.size + 1));
            let x2 = Math.min(gridSize - 1, Math.max(-1, mXGrid + brush.size - 1));
            let y1 = Math.min(gridSize, Math.max(0, mYGrid - brush.size + 1));
            let y2 = Math.min(gridSize - 1, Math.max(-1, mYGrid + brush.size - 1));
            drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId, 0.5, ctx);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            let scale = gridScale * camera.scale;
            ctx.setLineDash([]);
            ctx.lineWidth = 2 * camera.scale;
            ctx.beginPath();
            ctx.strokeRect(x1 * scale - camera.x, y1 * scale - camera.y, (x2 - x1 + 1) * scale, (y2 - y1 + 1) * scale);
            ctx.stroke();
        }
    }
    if (selection.show) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        fillPixel(selection.x1, selection.y1, selection.x2 - selection.x1 + 1, selection.y2 - selection.y1 + 1, ctx);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        let scale = gridScale * camera.scale;
        ctx.setLineDash([scale / 2, scale / 2]);
        ctx.lineWidth = 2 * camera.scale;
        ctx.beginPath();
        ctx.strokeRect(selection.x1 * scale - camera.x, selection.y1 * scale - camera.y, (selection.x2 - selection.x1 + 1) * scale, (selection.y2 - selection.y1 + 1) * scale);
        ctx.stroke();
    }
};
function outlineRect(x1, y1, x2, y2, ctx) {
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
};
function updateCamera() {
    if ((!gridPaused || !simulatePaused) && acceptInputs && !inWinScreen) {
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
    }
};
function clickLine(startX, startY, endX, endY, remove) {
    if (!sandboxMode && !inResetState) return;
    let x = startX;
    let y = startY;
    let angle = atan2(endY - startY, endX - startX);
    let distance = sqrt(pow(endX - startX, 2) + pow(endY - startY, 2));
    let modifiedPixelCounts = [];
    let clickPixelNum = pixels[brush.pixel].numId;
    place: for (let i = 0; i <= distance; i++) {
        let gridX = Math.floor(x);
        let gridY = Math.floor(y);
        let xmin = Math.max(0, Math.min(gridX - brush.size + 1, gridSize - 1));
        let xmax = Math.max(0, Math.min(gridX + brush.size - 1, gridSize - 1));
        let ymin = Math.max(0, Math.min(gridY - brush.size + 1, gridSize - 1));
        let ymax = Math.max(0, Math.min(gridY + brush.size - 1, gridSize - 1));
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
                    deleterGrid[y][x] = false;
                });
            } else {
                act(function (x, y) {
                    if (placeableGrid[y][x] && !deleterGrid[y][x]) {
                        pixelAmounts[numPixels[grid[y][x]].id]++;
                        modifiedPixelCounts[grid[y][x]] = true;
                        grid[y][x] = pixNum.AIR;
                        if (fireGrid[y][x]) {
                            pixelAmounts['fire']++;
                            modifiedPixelCounts[pixNum.FIRE] = true;
                            fireGrid[y][x] = false;
                        }
                    }
                });
            }
        } else if (brush.pixel == 'fire') {
            if (sandboxMode) act(function (x, y) {
                fireGrid[y][x] = true;
            });
            else act(function (x, y) {
                if (placeableGrid[y][x] && !deleterGrid[y][x]) {
                    fireGrid[y][x] = true;
                    pixelAmounts[brush.pixel]--;
                }
                return pixelAmounts[brush.pixel] <= 0;
            });
        } else if (brush.pixel == 'deleter') {
            if (sandboxMode) act(function (x, y) {
                deleterGrid[y][x] = true;
                grid[y][x] = clickPixelNum;
            });
        } else if (brush.pixel == 'monster') {
            if (sandboxMode) act(function (x, y) {
                monsterGrid[y][x] = true;
            });
        } else if (brush.pixel == 'placementRestriction') {
            if (sandboxMode) act(function (x, y) {
                placeableGrid[y][x] = false;
            })
        } else if (brush.pixel == 'placementUnRestriction') {
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
                if (pixelAmounts[brush.pixel] <= 0) break place;
                if (act(function (x, y) {
                    if (placeableGrid[y][x] && !deleterGrid[y][x]) {
                        modifiedPixelCounts[grid[y][x]] = true;
                        pixelAmounts[numPixels[grid[y][x]].id]++;
                        grid[y][x] = clickPixelNum;
                        pixelAmounts[brush.pixel]--;
                    }
                    return pixelAmounts[brush.pixel] <= 0;
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
function drawUI() {
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
    ctx.fillText(`Brush Size: ${brush.size * 2 - 1}`, canvasResolution - 3, 1);
    ctx.fillText(`Brush Pixel: ${(pixels[brush.pixel] ?? numPixels[pixNum.MISSING]).name}`, canvasResolution - 3, 22);
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
            10: liquids, concrete, and leaves
            11: pumps
            12: lag
            13: rotators
            -: monster
            */
            let monsterCount = 0;
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (monsterGrid[y][x]) {
                        grid[y][x] = pixNum.MONSTER;
                        monsterCount++;
                    }
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
                }
            }
            let currentExplosions = pendingExplosions;
            pendingExplosions = [];
            for (let explosion of currentExplosions) {
                explode(...explosion);
            }
            for (let updateStage = 0; updateStage <= 13; updateStage++) {
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
            for (let y = gridSize - 1; y > 0; y--) {
                for (let x = 0; x < gridSize; x++) {
                    if (deleterGrid[y][x]) grid[y][x] = pixNum.DELETER;
                    else if (grid[y][x] == pixNum.DELETER && !deleterGrid[y][x]) grid[y][x] = pixNum.AIR;
                    if (monsterGrid[y][x]) monsterPixelType.update(x, y);
                }
            }
            let newMonsterCount = 0;
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (monsterGrid[y][x]) newMonsterCount++;
                }
            }
            if (newMonsterCount != monsterCount && window.playMonsterDeathSound != null) window.playMonsterDeathSound();
            frames.push(millis());
            ticks = (ticks + 1) % 65536;
            randomSeed(ticks);
        }
        inResetState = false;
    }
};

// game control buttons
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
    if (!brush.isSelection) brush.size = Math.min(Math.ceil(gridSize / 2 + 1), brush.size + 1);
};
document.getElementById('sizeDown').onclick = (e) => {
    if (!brush.isSelection) brush.size = Math.max(1, brush.size - 1);
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
// save code inputs
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
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
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
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
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
// settings
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
// menu
document.getElementById('backToMenu').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs) return;
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    if (sandboxMode) {
        window.localStorage.setItem('saveCode', generateSaveCode());
        window.localStorage.setItem('saveCodeText', saveCodeText.value);
    }
    transitionToMenu();
};

// inputs
document.onkeydown = (e) => {
    if (e.target.matches('button') && (e.key == 'Tab' || e.key == 'Enter')) {
        e.preventDefault();
        e.target.blur();
    }
    if (e.target.matches('#saveCode') || e.target.matches('#gridSize') || !acceptInputs || inWinScreen || inMenuScreen) return;
    const key = e.key.toLowerCase();
    for (let i in pixels) {
        if (pixels[i].key == key) {
            brush.pixel = i;
            pixelSelectors[brush.pixel].box.click();
            clickSound();
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
    } else if (sandboxMode && key == 'd' && e.ctrlKey) {
        if (selection.show) {
            selection.grid = [];
            for (let y = selection.y1; y <= selection.y2; y++) {
                selection.grid[y - selection.y1] = [];
                for (let x = selection.x1; x <= selection.x2; x++) {
                    selection.grid[y - selection.y1][x - selection.x1] = grid[y][x];
                }
            }
            brush.isSelection = true;
            selection.show = false;
        }
    } else if (key == 'w') {
        camera.mUp = true;
    } else if (key == 's') {
        camera.mDown = true;
    } else if (key == 'a') {
        camera.mLeft = true;
    } else if (key == 'd') {
        camera.mRight = true;
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
        tickSound();
    } else if (key == 'shift') {
        removing = true;
    } else if (key == 'control') {
        holdingControl = true;
    }
    if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11' && key != '=' && key != '-') e.preventDefault();
};
document.onkeyup = (e) => {
    if (e.target.matches('#saveCode') || !acceptInputs || inWinScreen || inMenuScreen) return;
    const key = e.key.toLowerCase();
    if (key == 'alt') {
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
        gridPaused = !gridPaused;
        simulatePaused = false;
        updateTimeControlButtons();
        clickSound();
    } else if (key == 'shift') {
        removing = false;
    } else if (key == 'control') {
        holdingControl = false;
    }
    e.preventDefault();
};
document.addEventListener('wheel', (e) => {
    if (mouseOver && !inMenuScreen) {
        if (holdingControl) {
            let percentX = (mX + camera.x) / (canvasSize * camera.scale);
            let percentY = (mY + camera.y) / (canvasSize * camera.scale);
            camera.scale = Math.max(1, Math.min(Math.round(camera.scale * ((Math.abs(e.deltaY) > 10) ? (e.deltaY < 0 ? 2 : 0.5) : 1)), 8));
            camera.x = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentX) - mX, (canvasResolution * camera.scale) - canvasResolution));
            camera.y = Math.max(0, Math.min(Math.round(canvasSize * camera.scale * percentY) - mY, (canvasResolution * camera.scale) - canvasResolution));
            tickSound();
            forceRedraw = true;
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
setInterval(function () {
    if (hasFocus && !document.hasFocus()) {
        removing = false;
        holdingControl = false;
    }
    hasFocus = document.hasFocus();
}, 500);

// audio
const audioContext = AudioContext ? new AudioContext() : false;
function setAudio(n, fn) {
    const request = new XMLHttpRequest();
    request.open('GET', n, true);
    request.responseType = 'arraybuffer';
    request.onload = () => audioContext.decodeAudioData(request.response, fn);
    request.send();
};
setAudio('./menu.mp3', (buf) => {
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    window.startMenuMusic = () => {
        if (window.stopMenuMusic) window.stopMenuMusic();
        const musicSource = audioContext.createBufferSource();
        musicSource.buffer = buf;
        musicSource.loop = true;
        musicSource.connect(gain);
        gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 1);
        musicSource.start();
        window.stopMenuMusic = () => {
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
            setTimeout(() => musicSource.stop(), 1000);
            window.stopMenuMusic = null;
        };
    };
});
setAudio('./click.mp3', (buf) => {
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
    const preloadQueue = [];
    preloadQueue.push(audioContext.createBufferSource());
    preloadQueue[0].buffer = buf;
    preloadQueue[0].connect(gain);
    window.playClickSound = () => {
        preloadQueue.shift().start();
        const nextSource = audioContext.createBufferSource();
        nextSource.buffer = buf;
        nextSource.connect(gain);
        preloadQueue.push(nextSource);
    };
    document.querySelectorAll('.bclick').forEach(e => e.addEventListener('click', window.playClickSound));
    document.querySelectorAll('.pickerPixel').forEach(e => e.addEventListener('click', window.playClickSound));
});
setAudio('./tick.mp3', (buf) => {
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    const preloadQueue = [];
    preloadQueue.push(audioContext.createBufferSource());
    preloadQueue[0].buffer = buf;
    preloadQueue[0].connect(gain);
    window.playTickSound = () => {
        preloadQueue.shift().start();
        const nextSource = audioContext.createBufferSource();
        nextSource.buffer = buf;
        nextSource.connect(gain);
        preloadQueue.push(nextSource);
    };
    document.querySelectorAll('.btick').forEach(e => e.addEventListener('click', window.playTickSound));
    document.querySelectorAll('.pickerPixel').forEach(e => e.firstChild.addEventListener('mouseover', window.playTickSound));
});
setAudio('./monsterDeath.mp3', (buf) => {
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
    const preloadQueue = [];
    preloadQueue.push(audioContext.createBufferSource());
    preloadQueue[0].buffer = buf;
    preloadQueue[0].connect(gain);
    window.playMonsterDeathSound = () => {
        preloadQueue.shift().start();
        const nextSource = audioContext.createBufferSource();
        nextSource.buffer = buf;
        nextSource.connect(gain);
        preloadQueue.push(nextSource);
    };
});
setAudio('./win.mp3', (buf) => {
    const preloadQueue = [];
    preloadQueue.push(audioContext.createBufferSource());
    preloadQueue[0].buffer = buf;
    preloadQueue[0].connect(audioContext.destination);
    window.playWinSound = () => {
        preloadQueue.shift().start();
        const nextSource = audioContext.createBufferSource();
        nextSource.buffer = buf;
        nextSource.connect(audioContext.destination);
        preloadQueue.push(nextSource);
    };
});
function tickSound() {
    if (window.playTickSound) window.playTickSound();
};
function clickSound() {
    if (window.playClickSound) window.playClickSound();
};
document.addEventListener('mousedown', function startAudio(e) {
    audioContext.resume();
    if (inMenuScreen) {
        if (window.startMenuMusic) window.startMenuMusic();
        else setTimeout(function wait() {
            if (window.startMenuMusic) { if (inMenuScreen) window.startMenuMusic(); }
            else setTimeout(wait, 1000);
        }, 1000);
    }
    document.removeEventListener('mousedown', startAudio);
});

// resizing
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
// const preventMotion = (e) => {
//     if (mouseOver) {
//         window.scrollTo(0, 0);
//         e.preventDefault();
//         e.stopPropagation();
//     }
// };
// window.addEventListener("scroll", preventMotion, false);
// window.addEventListener("touchmove", preventMotion, false);