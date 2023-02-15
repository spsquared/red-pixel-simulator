// no documentation here!

window.addEventListener('error', (e) => {
    document.getElementById('confirmationModalContainer').style.opacity = '1';
    document.getElementById('confirmationModalContainer').style.pointerEvents = 'all';
    document.getElementById('confirmationModal').style.transform = 'translateY(0px)';
    document.getElementById('confirmationModal').innerHTML = `<span style="color: red;"><br>${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`;
});

let gridSize = 100;
let saveCode = '100;air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser-6:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-16:wall:rotator_right:piston_left:air:rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:rotator_right:piston_left:air-70:rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava_generator-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}5|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let startPaused = false;
let backgroundColor = '#ffffff';


let noNoise = false;
let optimizedLags = false;
let fadeEffect = 127;

const canvasResolution = 600;
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
const ctx = canvas.getContext('2d');
const below = createCanvas2(canvasResolution, canvasResolution);
const above = createCanvas2(canvasResolution, canvasResolution);
const belowctx = below.getContext('2d');
const abovectx = above.getContext('2d');
const sidebar = document.getElementById('sidebar');
const pixelPicker = document.getElementById('pixelPicker');
const pixelPickerDescription = document.getElementById('pixelPickerDescription');
const saveCodeText = document.getElementById('saveCode');
canvas.width = canvasResolution;
canvas.height = canvasResolution;
below.width = canvasResolution;
below.height = canvasResolution;
above.width = canvasResolution;
above.height = canvasResolution;

let xScale = canvasResolution / gridSize;
let yScale = canvasResolution / gridSize;
let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20;
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
let gridPaused = startPaused;
let simulatePaused = false;
let clickPixel = 'wall';
let clickSize = 5;
let removing = false;
let runTicks = 0;
let acceptInputs = true;
let mouseOver = false;
let forcedRedraw = true;

function createGrid() {
    xScale = canvasResolution / gridSize;
    yScale = canvasResolution / gridSize;
    grid.length = 0;
    lastGrid.length = 0;
    nextGrid.length = 0;
    noiseGrid.length = 0;
    fireGrid.length = 0;
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        lastGrid[i] = [];
        nextGrid[i] = [];
        noiseGrid[i] = [];
        fireGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 'air';
            lastGrid[i][j] = null;
            nextGrid[i][j] = null;
            noiseGrid[i][j] = noise(j / 2, i / 2);
            fireGrid[i][j] = false;
        }
    }
};
function loadSaveCode() {
    if (saveCode.length != 0) {
        gridPaused = true;
        simulatePaused = false;
        runTicks = 0;
        forcedRedraw = true;
        try {
            let x = 0;
            let y = 0;
            function incrementPosition() {
                x++;
                if (x == gridSize) {
                    x = 0;
                    y++;
                }
                if (y == gridSize) {
                    y--;
                    x = gridSize - 1;
                }
            };
            function parseSaveCode(inputSaveCode) {
                let stringStartIndex = 0;
                let string = '';
                let numberStartIndex = 0;
                let loopedSaveCodeStartIndex = 0;
                let loopTimesStartIndex = 0;
                let inLoop = 0;
                for (let i = 0; i < inputSaveCode.length; i++) {
                    if (inputSaveCode[i] == ':' && inLoop == 0) {
                        if (string == '') {
                            string = inputSaveCode.substring(stringStartIndex, i);
                            grid[y][x] = string;
                            incrementPosition();
                            string = '';
                            stringStartIndex = i + 1;
                        } else {
                            for (let j = 0; j < parseInt(inputSaveCode.substring(numberStartIndex, i), 10); j++) {
                                grid[y][x] = string;
                                incrementPosition();
                            }
                            string = '';
                            stringStartIndex = i + 1;
                        }
                    }
                    if (inputSaveCode[i] == '-' && inLoop == 0) {
                        string = inputSaveCode.substring(stringStartIndex, i);
                        numberStartIndex = i + 1;
                    }
                    if (inputSaveCode[i] == ';' && inLoop == 0) {
                        gridSize = parseInt(inputSaveCode.substring(0, i), 10);
                        createGrid();
                        string = '';
                        stringStartIndex = i + 1;
                    }
                    if (inputSaveCode[i] == '{') {
                        if (inLoop == 0) {
                            loopedSaveCodeStartIndex = i + 1;
                        }
                        inLoop++;
                    }
                    if (inputSaveCode[i] == '}') {
                        inLoop--;
                        if (inLoop == 0) {
                            loopTimesStartIndex = i + 1;
                        }
                    }
                    if (inputSaveCode[i] == '|') {
                        if (inLoop == 0) {
                            let loopTimes = parseInt(inputSaveCode.substring(loopTimesStartIndex, i), 10);
                            for (let j = 0; j < loopTimes; j++) {
                                parseSaveCode(inputSaveCode.substring(loopedSaveCodeStartIndex, loopTimesStartIndex - 1));
                            }
                            string = '';
                            stringStartIndex = i + 1;
                        }
                    }
                }
            };
            parseSaveCode(saveCode);
        }
        catch (error) {
            throw 'Invalid Save Code';
        }
        gridPaused = startPaused;
        updateTimeControlButtons();
    }
};
function generateSaveCode() {
    let saveCode = '';
    let string = '';
    let number = 0;
    saveCode += gridSize + ';';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            number++;
            if (grid[i][j] != string) {
                if (string != '' && number != 0) {
                    if (number == 1) {
                        saveCode += string + ':';
                    } else {
                        saveCode += string + '-' + number + ':';
                    }
                }
                string = grid[i][j];
                number = 0;
            }
        }
    }
    if (string != '' && number != 0) {
        if (number == 1) {
            saveCode += string + ':';
        } else {
            saveCode += string + '-' + number + ':';
        }
    }
    return saveCode;
};

function updateTimeControlButtons() {
    if (gridPaused) {
        document.getElementById('pause').style.backgroundColor = 'red';
        if (simulatePaused) {
            document.getElementById('simulatePaused').style.backgroundColor = 'lime';
        } else {
            document.getElementById('simulatePaused').style.backgroundColor = 'red';
        }
        document.getElementById('advanceTick').style.backgroundColor = '';
        document.getElementById('simulatePaused').style.cursor = '';
        document.getElementById('advanceTick').style.cursor = '';
    } else {
        document.getElementById('pause').style.backgroundColor = 'lime';
        document.getElementById('simulatePaused').style.backgroundColor = 'grey';
        document.getElementById('advanceTick').style.backgroundColor = 'grey';
        document.getElementById('simulatePaused').style.cursor = 'not-allowed';
        document.getElementById('advanceTick').style.cursor = 'not-allowed';
    }
};

function confirmationModal() {
    acceptInputs = false;
    const confirmationModalContainer = document.getElementById('confirmationModalContainer');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationModalYes = document.getElementById('confirmationModalYes');
    const confirmationModalNo = document.getElementById('confirmationModalNo');
    confirmationModalContainer.style.opacity = '1';
    confirmationModalContainer.style.pointerEvents = 'all';
    confirmationModal.style.transform = 'translateY(0px)';
    const hide = () => {
        confirmationModalContainer.style.opacity = '';
        confirmationModalContainer.style.pointerEvents = '';
        confirmationModal.style.transform = '';
        acceptInputs = true;
    };
    return new Promise((resolve, reject) => {
        confirmationModalYes.onclick = (e) => {
            hide();
            resolve(true);
        };
        confirmationModalNo.onclick = (e) => {
            hide();
            resolve(false);
        };
    });
};

function setup() {
    noiseDetail(3, 0.6);
    window.onresize();

    document.querySelectorAll('.p5Canvas').forEach(e => e.remove());

    createGrid();
    loadSaveCode();
    saveCodeText.value = saveCode;
    // store in local storage

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
    ctx.clearRect(x * xScale, y * yScale, xScale * width, yScale * height);
};
function drawPixel(x, y, width, height, ctx) {
    ctx.fillRect(x * xScale, y * yScale, xScale * width, yScale * height);
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
                            explode(j, i, 10, chain - 1);
                            chained = true;
                        } else if (grid[i][j] == 'huge_nuke') {
                            explode(j, i, 20, chain - 1);
                            chained = true;
                        } else if (grid[i][j] == 'very_huge_nuke') {
                            explode(j, i, 40, chain - 1);
                            chained = true;
                        } else if (grid[i][j] == 'gunpowder') {
                            explode(j, i, 5, 1);
                            // chained = true;
                        } else if (grid[i][j] == 'c4') {
                            explode(j, i, 15, 1);
                            // chained = true;
                        }
                    }
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
    for (let i = 0; i <= distance; i++) {
        let gridX = Math.floor(x);
        let gridY = Math.floor(y);
        let xmin = Math.max(0, Math.min(gridX - clickSize + 1, gridSize - 1));
        let xmax = Math.max(0, Math.min(gridX + clickSize - 1, gridSize - 1));
        let ymin = Math.max(0, Math.min(gridY - clickSize + 1, gridSize - 1));
        let ymax = Math.max(0, Math.min(gridY + clickSize - 1, gridSize - 1));
        for (let j = xmin; j <= xmax; j++) {
            for (let k = ymin; k <= ymax; k++) {
                if (remove) {
                    nextGrid[k][j] = 'air';
                    fireGrid[k][j] = false;
                } else if (clickPixel == 'fire') {
                    fireGrid[k][j] = true;
                } else {
                    nextGrid[k][j] = clickPixel;
                }
            }
        }
        x += cos(angle);
        y += sin(angle);
    }
};

function draw() {
    let x = Math.floor((mouseX - 10) * gridSize / canvasSize);
    let y = Math.floor((mouseY - 10) * gridSize / canvasSize);
    mouseOver = x >= 0 && x < gridSize && y >= 0 && y < gridSize;

    // draw pixels
    if ((gridPaused && !simulatePaused) || !gridPaused || animationTime % 20 == 0) {
        ctx.fillStyle = backgroundColor + (255 - fadeEffect).toString(16);
        ctx.fillRect(0, 0, canvasResolution, canvasResolution);
        abovectx.clearRect(0, 0, canvasResolution, canvasResolution);
        for (let i = 0; i < gridSize; i++) {
            let curr = 'air';
            let redrawing = grid[i][0] != lastGrid[i][0];
            let amount = 0;
            let j;
            for (j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != curr || (grid[i][j] != lastGrid[i][j]) != redrawing) {
                    let pixelType = pixels[curr];
                    if (curr != 'air' && (redrawing || pixelType.animated || (pixelType.animatedNoise && !noNoise) || forcedRedraw)) drawPixels(j - amount, i, amount, 1, curr, 1, pixelType.above ? abovectx : belowctx);
                    else if (curr == 'air') clearPixels(j - amount, i, amount, 1, pixelType.above ? abovectx : belowctx);
                    curr = grid[i][j]
                    redrawing = grid[i][j] != lastGrid[i][j];
                    amount = 0;
                }
            }
            let pixelType = pixels[curr];
            if (curr != 'air' && (redrawing || pixelType.animated || (pixelType.animatedNoise && !noNoise) || forcedRedraw)) drawPixels(gridSize - amount - 1, i, amount + 1, 1, curr, 1, pixelType.above ? abovectx : belowctx);
            else if (curr == 'air') clearPixels(gridSize - amount - 1, i, amount + 1, 1, pixelType.above ? abovectx : belowctx);
        }
        // for (let i = 0; i < gridSize; i++) {
        //     let j = 0;
        //     let fire = false;
        //     let number = 0;
        //     while (j < gridSize) {
        //         number++;
        //         if (fireGrid[i][j] != fire) {
        //             if (fire) {
        //                 drawPixels(j - number, i, number, 1, 'fire', 1, above);
        //             }
        //             fire = fireGrid[i][j];
        //             number = 0;
        //         }
        //         j++;
        //     }
        //     number++;
        //     if (fire) {
        //         drawPixels(j - number, i, number, 1, 'fire', 1, above);
        //     }
        // }
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                lastGrid[i][j] = grid[i][j];
            }
        }
        forcedRedraw = false;
    }
    if (gridPaused && runTicks <= 0 && !simulatePaused) {
        frames.push(millis());
    }
    // copy layers
    ctx.drawImage(below, 0, 0);
    ctx.drawImage(above, 0, 0);
    // draw brush
    if (!gridPaused || !simulatePaused) {
        let x1 = Math.min(gridSize - 1, Math.max(0, x - clickSize + 1));
        let x2 = Math.min(gridSize - 1, Math.max(0, x + clickSize - 1));
        let y1 = Math.min(gridSize - 1, Math.max(0, y - clickSize + 1));
        let y2 = Math.min(gridSize - 1, Math.max(0, y + clickSize - 1));
        drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? 'remove' : clickPixel, 0.5, ctx);
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'miter';
        ctx.beginPath();
        ctx.moveTo(x1 * xScale, y1 * yScale);
        ctx.lineTo((x2 + 1) * xScale, y1 * yScale);
        ctx.lineTo((x2 + 1) * xScale, (y2 + 1) * yScale);
        ctx.lineTo(x1 * xScale, (y2 + 1) * yScale);
        ctx.lineTo(x1 * xScale, y1 * yScale);
        ctx.lineTo((x2 + 1) * xScale, y1 * yScale);
        ctx.stroke();
    }

    // place pixels
    if (mouseIsPressed && (!gridPaused || !simulatePaused) && acceptInputs && mouseOver) {
        clickLine(x, y, Math.floor((pmouseX - 10) * gridSize / canvasSize), Math.floor((pmouseY - 10) * gridSize / canvasSize), mouseButton == RIGHT || removing);
    }
    // simulate pixels
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
            frames.push(millis());
            ticks++;
        }
    }

    // fps
    while (frames[0] + 1000 < millis()) {
        frames.shift(1);
    }

    // ui
    if (gridPaused && simulatePaused) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(1, 1, 70, 14);
        if (debugInfo) {
            ctx.fillRect(5, 0, 200, 120);
        }
    }
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${frames.length}`, 3, 1);
    while (lastFpsList + 100 < millis()) {
        lastFpsList += 100;
        fpsList.push(frames.length);
        while (fpsList.length > 100) {
            fpsList.shift(1);
        }
    }
    if (debugInfo) {
        ctx.fillStyle = '#0000004B';
        ctx.fillRect(5, 20, 200, 100);
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = '#000';
            ctx.fillRect(5 + i * 2, 120 - fpsList[i], 2, fpsList[i]);
        }
        ctx.fillText('Last 10 seconds:', 10, 22);
    }
    ctx.textAlign = 'right';
    ctx.fillText(`Brush Size: ${clickSize * 2 - 1}`, canvasResolution - 3, 1);
    ctx.fillText(`Brush Pixel: ${(pixels[clickPixel] ?? pixels['missing']).name}`, canvasResolution - 3, 16);
    if (gridPaused) {
        ctx.fillStyle = '#000';
        ctx.fillText('PAUSED', canvasResolution - 3, 33);
        if (simulatePaused) {
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'center';
            ctx.fillText('SIMULATING...', canvasResolution / 2, canvasResolution / 2);
        }
    }

    animationTime++;
};

canvas.addEventListener('contextmenu', e => e.preventDefault());

document.onkeydown = (e) => {
    if (e.ctrlKey || e.target.matches('#saveCode') || e.target.matches('#gridSize') || !acceptInputs) return;
    const key = e.key.toLowerCase();
    for (let i in pixels) {
        if (pixels[i].key == key) {
            clickPixel = i;
            document.getElementById('pixelPicker').children.forEach(div => div.classList.remove('pickerPixelSelected'));
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
    }
    if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11') e.preventDefault();
    if (e.target.matches('button')) e.target.blur();
};
document.onkeyup = (e) => {
    if (e.ctrlKey || e.target.matches('#saveCode') || !acceptInputs) return;
    const key = e.key.toLowerCase();
    if (key == 'alt') {
        debugInfo = !debugInfo;
    } else if (key == 'p') {
        gridPaused = !gridPaused;
        simulatePaused = false;
        updateTimeControlButtons();
    } else if (key == 'shift') {
        removing = false;
    }
    e.preventDefault();
};
document.onwheel = (e) => {
    if (e.deltaY > 0) {
        clickSize = Math.max(1, clickSize - 1);
    } else {
        clickSize = Math.min(Math.ceil(gridSize / 2 + 1), clickSize + 1);
    }
};

document.getElementById('copySave').onclick = (e) => {
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    saveCode = generateSaveCode();
    saveCodeText.value = saveCode;
    window.navigator.clipboard.writeText(saveCode);
};
document.getElementById('uploadSave').onclick = (e) => {
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
            if (await confirmationModal()) {
                saveCode = e.target.result;
                saveCodeText.value = saveCode;
                loadSaveCode();
            }
        };
        reader.readAsText(files[0]);
    };
};
document.getElementById('downloadSave').onclick = (e) => {
    gridPaused = true;
    simulatePaused = false;
    updateTimeControlButtons();
    saveCode = generateSaveCode();
    saveCodeText.value = saveCode;
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
    if (await confirmationModal()) {
        saveCode = saveCodeText.value;
        loadSaveCode();
    }
};
document.getElementById('gridSize').oninput = (e) => {
    document.getElementById('gridSize').value = Math.max(1, Math.min(parseInt(document.getElementById('gridSize').value.replace('e', '')), 500));
    if (document.getElementById('gridSize').value != '') saveCode = document.getElementById('gridSize').value + saveCode.substring(saveCode.indexOf(';'));
    saveCodeText.value = saveCode;
};
document.getElementById('noNoise').onclick = (e) => {
    noNoise = !noNoise;
    if (noNoise) document.getElementById('noNoise').style.backgroundColor = 'lime';
    else document.getElementById('noNoise').style.backgroundColor = 'red';
};
document.getElementById('fadeEffect').onclick = (e) => {
    fadeEffect = fadeEffect ? 0 : 127;
    if (fadeEffect) document.getElementById('fadeEffect').style.backgroundColor = 'lime';
    else document.getElementById('fadeEffect').style.backgroundColor = 'red';
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

window.onresize = (e) => {
    canvasSize = Math.min(window.innerWidth, window.innerHeight) - 20;
    canvas.width = canvasResolution;
    canvas.height = canvasResolution;
    below.width = canvasResolution;
    below.height = canvasResolution;
    above.width = canvasResolution;
    above.height = canvasResolution;
    canvas.style.width = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';
    if (window.innerWidth - canvasSize < 500) {
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
    forcedRedraw = true;
};
const preventMotion = (e) => {
    if (mouseOver) {
        window.scrollTo(0, 0);
        e.preventDefault();
        e.stopPropagation();
    }
};
window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);