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
let backgroundColor = 'ffffff';

let noNoise = false;
let optimizedLags = false;
let fadeEffect = 127;
let gridResolution = 600;

let below;
let above;
let main;
let xScale = gridResolution / gridSize;
let yScale = gridResolution / gridSize;
let canvasScale = Math.min(window.innerWidth / gridResolution, window.innerHeight / gridResolution);
let debugInfo = false;
let animationTime = 0;
let ticks = 0;
let frames = [];
let lastFpsList = -1;
let fpsList = [];
const grid = [];
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

function createGrid() {
    xScale = width / gridSize;
    yScale = height / gridSize;
    grid.length = 0;
    nextGrid.length = 0;
    noiseGrid.length = 0;
    fireGrid.length = 0;
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        nextGrid[i] = [];
        noiseGrid[i] = [];
        fireGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 'air';
            nextGrid[i][j] = null;
            noiseGrid[i][j] = round(noise(j / 2, i / 2) * 255);
            fireGrid[i][j] = false;
        }
    }
};
function loadSaveCode() {
    if (saveCode.length != 0) {
        gridPaused = true;
        simulatePaused = false;
        runTicks = 0;
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

function setup() {
    main = createCanvas(gridResolution, gridResolution);
    below = createGraphics(gridResolution, gridResolution);
    above = createGraphics(gridResolution, gridResolution);
    frameRate(60);
    noCursor();
    noStroke();
    below.noStroke();
    above.noStroke();

    noiseDetail(3, 0.6);
    windowResized();

    createGrid();
    loadSaveCode();
    const saveCodeText = document.getElementById('saveCode');
    saveCodeText.value = saveCode;
    // store in local storage

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
            clickSize = min(ceil(gridSize / 2 + 1), clickSize + 1);
        } else if (key == 'arrowdown') {
            clickSize = max(1, clickSize - 1);
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
    document.querySelector('.p5Canvas').addEventListener('contextmenu', e => e.preventDefault());

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

    const pixelPicker = document.getElementById('pixelPicker');
    const pixelPickerDescription = document.getElementById('pixelPickerDescription');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 50;
    for (const id in pixels) {
        if (pixels[id].pickable) {
            const box = document.createElement('div');
            box.id = `picker-${id}`;
            box.classList.add('pickerPixel');
            box.onclick = (e) => {
                clickPixel = id;
                pixelPicker.children.forEach(div => div.classList.remove('pickerPixelSelected'));
                box.classList.add('pickerPixelSelected');
                pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[id].name}</span><br>${pixels[id].description}`;
            };
            box.onmouseover = (e) => {
                pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[id].name}</span><br>${pixels[id].description}`;
            };
            box.onmouseout = (e) => {
                pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[clickPixel].name}</span><br>${pixels[clickPixel].description}`;
            };
            const img = new Image(50, 50);
            pixels[id].drawPreview(ctx);
            img.src = canvas.toDataURL('image/png');
            box.appendChild(img);
            pixelPicker.appendChild(box);
        }
    }
    document.getElementById(`picker-${clickPixel}`).classList.add('pickerPixelSelected');
    pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[clickPixel].name}</span><br>${pixels[clickPixel].description}`;

    document.getElementById('sizeUp').onclick = (e) => {
        clickSize = min(ceil(gridSize / 2 + 1), clickSize + 1);
    };
    document.getElementById('sizeDown').onclick = (e) => {
        clickSize = max(1, clickSize - 1);
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

    const preventMotion = (e) => {
        if (mouseOver) {
            window.scrollTo(0, 0);
            e.preventDefault();
            e.stopPropagation();
        }
    };
    window.addEventListener("scroll", preventMotion, false);
    window.addEventListener("touchmove", preventMotion, false);

    lastFpsList = millis();
};

function drawPixels(x, y, width, height, type, opacity, renderer) {
    if (pixels[type]) {
        pixels[type].draw(x, y, width, height, opacity, renderer);
    } else {
        pixels['missing'].draw(x, y, width, height, opacity, renderer);
    }
};
function clearPixels(x, y, width, height, renderer) {
    renderer.erase();
    renderer.rect(x * xScale, y * yScale, xScale * width, yScale * height);
    renderer.noErase();
};
function drawPixel(x, y, width, height, renderer) {
    renderer.rect(x * xScale, y * yScale, xScale * width, yScale * height);
};
function updatePixel(x, y, i) {
    if (pixels[grid[y][x]] && pixels[grid[y][x]].updatePriority == i) {
        pixels[grid[y][x]].update(x, y);
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
// seeds that grow trees
// music pixels
// fire
// ice
const pixels = {
    air: {
        name: 'Air',
        description: 'It\'s air... What else would it be?',
        draw: function (x, y, width, height, opacity, rend) { },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    },
    wall: {
        name: 'Wall',
        description: 'An immovable wall',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(0, 0, 0, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    dirt: {
        name: 'Dirt',
        description: 'Wash your hands after handling it, it\'s pretty dirty',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(125, 75, 0, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else if (y < gridSize - 2) {
                    let slideLeft = x > 0 && isPassableFluid(x - 1, y) && isPassableFluid(x - 1, y + 1) && isPassableFluid(x - 1, y + 2);
                    let slideRight = x < gridSize - 1 && isPassableFluid(x + 1, y) && isPassableFluid(x + 1, y + 1) && isPassableFluid(x + 1, y + 2);
                    if (slideLeft && slideRight) {
                        if (ticks % 2 == 0) {
                            move(x, y, x - 1, y + 1);
                        } else {
                            move(x, y, x + 1, y + 1);
                        }
                    } else if (slideLeft) {
                        move(x, y, x - 1, y + 1);
                    } else if (slideRight) {
                        move(x, y, x + 1, y + 1);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 75, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 2,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    grass: {
        name: 'Grass',
        description: 'Go touch some',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(25, 175, 25, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let dead = random() < 0.1;
            if (dead) updateTouchingPixel(x, y, 'air', function (actionX, actionY) {
                if (actionY <= y) dead = false;
            });
            if (!dead) dead = updateTouchingPixel(x, y, 'lava');
            if (dead) {
                nextGrid[y][x] = 'dirt';
                return;
            }
            for (let i = Math.max(y - 1, 0); i <= Math.min(y + 1, gridSize - 1); i++) {
                for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, gridSize - 1); j++) {
                    if (grid[i][j] == 'dirt' && (i != y || j != x) && random() < 0.2) {
                        let canGrow = false;
                        updateTouchingPixel(j, i, 'air', function (actionX2, actionY2) {
                            if (actionY2 <= i) canGrow = true;
                        });
                        if (canGrow) {
                            nextGrid[i][j] = 'grass';
                        }
                    }
                }
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else if (y < gridSize - 2) {
                    let slideLeft = x > 0 && isPassableFluid(x - 1, y) && isPassableFluid(x - 1, y + 1) && isPassableFluid(x - 1, y + 2);
                    let slideRight = x < gridSize - 1 && isPassableFluid(x + 1, y) && isPassableFluid(x + 1, y + 1) && isPassableFluid(x + 1, y + 2);
                    if (slideLeft && slideRight) {
                        if (ticks % 2 == 0) {
                            move(x, y, x - 1, y + 1);
                        } else {
                            move(x, y, x + 1, y + 1);
                        }
                    } else if (slideLeft) {
                        move(x, y, x - 1, y + 1);
                    } else if (slideRight) {
                        move(x, y, x + 1, y + 1);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 175, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 2,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    sand: {
        name: 'Sand',
        description: 'Weird yellow powdery stuff that falls',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(255, 225, 125, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else {
                    let slideLeft = x > 0 && canMoveTo(x - 1, y + 1) && isPassableFluid(x - 1, y) && isPassableFluid(x - 1, y + 1);
                    let slideRight = x < gridSize - 1 && canMoveTo(x + 1, y + 1) && isPassableFluid(x + 1, y) && isPassableFluid(x + 1, y + 1);
                    if (slideLeft && slideRight) {
                        if (ticks % 2 == 0) {
                            move(x, y, x - 1, y + 1);
                        } else {
                            move(x, y, x + 1, y + 1);
                        }
                    } else if (slideLeft) {
                        move(x, y, x - 1, y + 1);
                    } else if (slideRight) {
                        move(x, y, x + 1, y + 1);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 225, 125)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 2,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    water: {
        name: 'Water',
        description: 'Unrealistically flows and may or may not be wet',
        draw: function (x, y, width, height, opacity, rend) {
            if (noNoise) {
                rend.fill(75, 100, 255, opacity * 255);
                drawPixel(x, y, width, height, rend);
            } else {
                rend.fill(100, 175, 255, opacity * 255);
                drawPixel(x, y, width, height, rend);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        rend.fill(75, 50, 255, round(noise((x + i) / 4, (y + j) / 4, animationTime / 10) * 127) * opacity + 30);
                        drawPixel(x + i, y + j, 1, 1, rend);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'concrete';
                }
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'collapsible') {
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
                    let incrementLeft = canMoveTo(x - 1, y) && grid[y][x - 1] == 'air';
                    let incrementRight = canMoveTo(x + 1, y) && grid[y][x + 1] == 'air';
                    while (incrementLeft || incrementRight) {
                        if (incrementLeft) {
                            if (grid[y][left] != 'air') {
                                if (grid[y][left] != 'water' || (y > 0 && grid[y - 1][left] != 'air')) slideLeft = x - left;
                                incrementLeft = false;
                            }
                            if (grid[y + 1][left] == 'air') {
                                slideLeft = x - left;
                                foundLeftDrop = true;
                                incrementLeft = false;
                            }
                            left--;
                            if (left < 0) incrementLeft = false;
                        }
                        if (incrementRight) {
                            if (grid[y][right] != 'air') {
                                if (grid[y][right] != 'water' || (y > 0 && grid[y - 1][right] != 'air')) slideRight = right - x;
                                incrementRight = false;
                            }
                            if (grid[y + 1][right] == 'air') {
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
                        if (slideLeft > slideRight) {
                            toSlide = -1;
                        } else if (slideLeft < slideRight) {
                            toSlide = 1;
                        } else {// implies both slides are not 0
                            if (random() <= 0.5) {
                                toSlide = -1;
                            } else {
                                toSlide = 1;
                            }
                        }
                    } else if (foundLeftDrop) {
                        toSlide = -1;
                    } else if (foundRightDrop) {
                        toSlide = 1;
                    } else if (slideLeft > slideRight) {
                        toSlide = -1;
                    } else if (slideLeft < slideRight) {
                        toSlide = 1;
                    } else if (slideLeft != 0) { // implies slideRight also isn't 0
                        if (random() <= 0.5) {
                            toSlide = -1;
                        } else {
                            toSlide = 1;
                        }
                    }
                    if (toSlide > 0) {
                        if (foundRightDrop && grid[y + 1][x + 1] == 'air') {
                            move(x, y, x + 1, y + 1);
                        } else {
                            move(x, y, x + 1, y);
                        }
                    } else if (toSlide < 0) {
                        if (foundLeftDrop && grid[y + 1][x - 1] == 'air') {
                            move(x, y, x - 1, y + 1);
                        } else {
                            move(x, y, x - 1, y);
                        }
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 3,
        animatedNoise: true,
        animated: true,
        above: false,
        pickable: true
    },
    lava: {
        name: 'Lava',
        description: 'Try not to get burned, it also melts concrete and other things',
        draw: function (x, y, width, height, opacity, rend) {
            if (noNoise) {
                rend.fill(255, 125, 0, opacity * 255);
                drawPixel(x, y, width, height, rend);
            } else {
                rend.fill(255, 0, 0, opacity * 255);
                drawPixel(x, y, width, height, rend);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        rend.fill(255, 255, 0, round(noise((x + i) / 6, (y + j) / 6, animationTime / 30) * 255) * opacity);
                        drawPixel(x + i, y + j, 1, 1, rend);
                    }
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 'collapsible', function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'sand';
                }
            });
            updateTouchingPixel(x, y, 'laser_scatterer', function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'sand';
                }
            });
            let cooldownSpeed = 2;
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                cooldownSpeed--;
            });
            updateTouchingPixel(x, y, 'air', function (actionX, actionY) {
                cooldownSpeed++;
            });
            if (random() < 0.0001 * cooldownSpeed) {
                nextGrid[y][x] = 'concrete_powder';
            }
            if (y < gridSize - 1 && random() < 0.5) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'collapsible') {
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
                    let incrementLeft = canMoveTo(x - 1, y) && grid[y][x - 1] == 'air';
                    let incrementRight = canMoveTo(x + 1, y) && grid[y][x + 1] == 'air';
                    while (incrementLeft || incrementRight) {
                        if (incrementLeft) {
                            if (grid[y][left] != 'air') {
                                if (grid[y][left] != 'lava' || (y > 0 && grid[y - 1][left] != 'air')) slideLeft = x - left;
                                incrementLeft = false;
                            }
                            if (grid[y + 1][left] == 'air') {
                                slideLeft = x - left;
                                foundLeftDrop = true;
                                incrementLeft = false;
                            }
                            left--;
                            if (left < 0) incrementLeft = false;
                        }
                        if (incrementRight) {
                            if (grid[y][right] != 'air') {
                                if (grid[y][right] != 'lava' || (y > 0 && grid[y - 1][right] != 'air')) slideRight = right - x;
                                incrementRight = false;
                            }
                            if (grid[y + 1][right] == 'air') {
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
                        if (slideLeft > slideRight) {
                            toSlide = -1;
                        } else if (slideLeft < slideRight) {
                            toSlide = 1;
                        } else {// implies both slides are not 0
                            if (random() <= 0.5) {
                                toSlide = -1;
                            } else {
                                toSlide = 1;
                            }
                        }
                    } else if (foundLeftDrop) {
                        toSlide = -1;
                    } else if (foundRightDrop) {
                        toSlide = 1;
                    } else if (slideLeft > slideRight) {
                        toSlide = -1;
                    } else if (slideLeft < slideRight) {
                        toSlide = 1;
                    } else if (slideLeft != 0) { // implies slideRight also isn't 0
                        if (random() <= 0.5) {
                            toSlide = -1;
                        } else {
                            toSlide = 1;
                        }
                    }
                    if (toSlide > 0) {
                        if (foundRightDrop && grid[y + 1][x + 1] == 'air') {
                            move(x, y, x + 1, y + 1);
                        } else {
                            move(x, y, x + 1, y);
                        }
                    } else if (toSlide < 0) {
                        if (foundLeftDrop && grid[y + 1][x - 1] == 'air') {
                            move(x, y, x - 1, y + 1);
                        } else {
                            move(x, y, x - 1, y);
                        }
                    }
                }
            }
            if (y > 0) {
                if (random() < 0.125) {
                    let validSlidingPositions = [];
                    if (x > 0) {
                        if ((grid[y][x - 1] == 'concrete' || grid[y][x - 1] == 'concrete_powder') && (grid[y - 1][x - 1] == 'concrete' || grid[y - 1][x - 1] == 'concrete_powder')) {
                            validSlidingPositions.push(-1);
                        }
                    }
                    if (x < gridSize - 1) {
                        if ((grid[y][x + 1] == 'concrete' || grid[y][x + 1] == 'concrete_powder') && (grid[y - 1][x + 1] == 'concrete' || grid[y - 1][x + 1] == 'concrete_powder')) {
                            validSlidingPositions.push(1);
                        }
                    }
                    if (validSlidingPositions.length > 0) {
                        let slidePosition = validSlidingPositions[floor(random(0, validSlidingPositions.length))];
                        if (nextGrid[y][x] == null && nextGrid[y - 1][x + slidePosition] == null) {
                            nextGrid[y][x] = grid[y - 1][x + slidePosition];
                            nextGrid[y - 1][x + slidePosition] = 'lava';
                        }
                    }
                }
            }
            if (y > 0) {
                if (random() < 0.5) {
                    if (y == gridSize - 1 || grid[y + 1][x] == 'lava') {
                        if (grid[y - 1][x] == 'concrete_powder' || grid[y - 1][x] == 'concrete') {
                            if (nextGrid[y][x] == null && nextGrid[y - 1][x] == null) {
                                nextGrid[y][x] = grid[y - 1][x];
                                nextGrid[y - 1][x] = 'lava';
                            }
                        }
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 3,
        animatedNoise: true,
        animated: true,
        above: false,
        pickable: true
    },
    concrete_powder: {
        name: 'Concrete Powder',
        description: 'Like sand, but hardens into concrete when in contact with water',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(150, 150, 150, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let ret = false;
            updateTouchingPixel(x, y, 'water', function (actionX, actionY) {
                nextGrid[y][x] = 'concrete';
                ret = true;
            });
            if (ret) return;
            if (y > 0 && grid[y - 1][x] == 'lava') {
                if (canMoveTo(x, y - 1) && random() < 0.5) {
                    nextGrid[y][x] = 'lava';
                    nextGrid[y - 1][x] = 'concrete';
                }
            }
            if (y < gridSize - 1) {
                if (isPassableNonLavaFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else if (y < gridSize - 2) {
                    let slideLeft = x > 0 && isPassableNonLavaFluid(x - 1, y) && isPassableNonLavaFluid(x - 1, y + 1) && isPassableNonLavaFluid(x - 1, y + 2);
                    let slideRight = x < gridSize - 1 && isPassableNonLavaFluid(x + 1, y) && isPassableNonLavaFluid(x + 1, y + 1) && isPassableNonLavaFluid(x + 1, y + 2);
                    if (slideLeft && slideRight) {
                        if (ticks % 2 == 0) {
                            move(x, y, x - 1, y + 1);
                        } else {
                            move(x, y, x + 1, y + 1);
                        }
                    } else if (slideLeft) {
                        move(x, y, x - 1, y + 1);
                    } else if (slideRight) {
                        move(x, y, x + 1, y + 1);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(150, 150, 150)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 2,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    concrete: {
        name: 'Concrete',
        description: 'Hard stuff that doesn\'t move easily',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(75, 75, 75, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y > 0) {
                if (grid[y - 1][x] == 'lava') {
                    if (canMoveTo(x, y - 1) && random() < 0.25) {
                        nextGrid[y][x] = 'lava';
                        nextGrid[y - 1][x] = 'concrete_powder';
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 75, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 3,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    plant: {
        name: 'P.L.A.N.T.',
        description: '<span style="font-style: italic;">Persistent Loud Aesthetic Nail Tables.</span><br>No, it doesn\'t actually stand for anything. But it does consume concrete alarmingly fast',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(125, 255, 75, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let validPlant = updateTouchingPixel(x, y, 'air') || updateTouchingPixel(x, y, 'water');
            if (!validPlant) {
                nextGrid[y][x] = 'water';
            }
            updateTouchingPixel(x, y, 'concrete', function (actionX, actionY) {
                nextGrid[y][x] = 'water';
                nextGrid[actionY][actionX] = 'plant';
            });
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1)) {
                    if (canMoveTo(x, y + 1) && (grid[y + 1][x] == 'water') ? random() < 0.5 : true) {
                        move(x, y, x, y + 1);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    sponge: {
        name: 'S.P.O.N.G.E.',
        description: '<span style="font-style: italic;">Sample Providing Oceanic Nucleolic Green Egg</span><br>Don\'t ask',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(225, 255, 75, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            updateTouchingPixel(x, y, 'water', function (actionX, actionY) {
                nextGrid[y][x] = 'air';
                nextGrid[actionY][actionX] = 'sponge';
            });
            let validSponge = false;
            if (y < gridSize - 1) {
                if ((isPassableNonLavaFluid(x, y + 1) || (grid[y + 1][x] == 'lava' && random() < 0.25)) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                }
                if (grid[y + 1][x] == 'sand') {
                    validSponge = true;
                }
            }
            if (!validSponge && random() < 0.125) {
                nextGrid[y][x] = 'air';
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(225, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    fire: {
        name: 'Fire',
        description: 'AAAAAA! It burns!',
        draw: function (x, y, width, height, opacity, rend) {
            if (noNoise) {
                rend.fill(255, 180, 0, opacity * 127);
                drawPixel(x, y, width, height, rend);
            } else {
                rend.fill(255, 100, 0, opacity * 127);
                drawPixel(x, y, width, height, rend);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        rend.fill(255, 255, 0, noiseGrid[y + j][x + i] * opacity * 0.5);
                        drawPixel(x + i, y + j, 1, 1, rend);
                    }
                }
            }
        },
        update: function (x, y) {

        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: true,
        pickable: true
    },
    gunpowder: {
        name: 'Gunpowder',
        description: 'A low explosive that explodes when lit on fire',
        draw: function (x, y, width, height, opacity, rend) {
            if (noNoise) {
                rend.fill(50, 25, 25, opacity * 255);
                drawPixel(x, y, width, height, rend);
            } else {
                rend.fill(30, 20, 20, opacity * 255);
                drawPixel(x, y, width, height, rend);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        rend.fill(55, 40, 40, noiseGrid[y + j][x + i] * opacity);
                        drawPixel(x + i, y + j, 1, 1, rend);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            let explosion = updateTouchingPixel(x, y, 'lava') || fireGrid[y][x];
            if (explosion) explode(x, y, 5, 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(50, 25, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    c4: {
        name: 'C-4',
        description: 'A high explosive that can only be triggered by other explosions',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(245, 245, 200, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(245, 245, 200)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    pump: {
        name: 'Water Pump',
        description: 'Violates the Laws of Thermodynamics to create water',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(25, 125, 75, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 100, 255, opacity * 255);
            drawPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3, rend);
            rend.fill(25, 125, 75, opacity * 255);
            for (let i = 0; i < width - 1; i++) {
                drawPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3, rend);
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = 'water';
                }
            });
            updateTouchingPixel(x, y, 'air', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.125) {
                    nextGrid[actionY][actionX] = 'water';
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    lava_generator: {
        name: 'Lava Heater',
        description: 'Violates the Laws of Thermodynamics to create lava',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(25, 125, 75, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(255, 125, 0, opacity * 255);
            drawPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3, rend);
            rend.fill(25, 125, 75, opacity * 255);
            for (let i = 0; i < width - 1; i++) {
                drawPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3, rend);
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 'water', function (actionX, actionY) {
                explode(x, y, 5);
            });
            updateTouchingPixel(x, y, 'air', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = 'lava';
                }
            });
            updateTouchingPixel(x, y, 'concrete', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = 'lava';
                }
            });
            updateTouchingPixel(x, y, 'concrete_powder', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = 'lava';
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    cloner_up: {
        name: 'Cloner (Up)',
        description: 'Copies stuff from below it to above it',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (y > 0 && y < gridSize - 1
                && grid[y + 1][x] != 'air' && !grid[y + 1][x].includes('cloner')
                && grid[y - 1][x] == 'air' && canMoveTo(x, y - 1)) {
                nextGrid[y - 1][x] = grid[y + 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    cloner_down: {
        name: 'Cloner (Down)',
        description: 'Copies stuff from above it to below it',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (y > 0 && y < gridSize - 1
                && grid[y - 1][x] != 'air' && !grid[y - 1][x].includes('cloner')
                && grid[y + 1][x] == 'air' && canMoveTo(x, y + 1)) {
                nextGrid[y + 1][x] = grid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    cloner_right: {
        name: 'Cloner (Right)',
        description: 'Copies stuff from its left to its right',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (x > 0 && x < gridSize - 1
                && grid[y][x - 1] != 'air' && !grid[y][x - 1].includes('cloner')
                && grid[y][x + 1] == 'air' && canMoveTo(x + 1, y)) {
                nextGrid[y][x + 1] = grid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    cloner_left: {
        name: 'Cloner (Left)',
        description: 'Copies stuff from its right to its left',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (x > 0 && x < gridSize - 1
                && grid[y][x + 1] != 'air' && !grid[y][x + 1].includes('cloner')
                && grid[y][x - 1] == 'air' && canMoveTo(x - 1, y)) {
                nextGrid[y][x - 1] = grid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    super_cloner_up: {
        name: 'Super Cloner (Up)',
        description: 'Copies stuff from below it to above it, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (y > 0 && y < gridSize - 1) {
                nextGrid[y - 1][x] = grid[y + 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    },
    super_cloner_down: {
        name: 'Super Cloner (Down)',
        description: 'Copies stuff from above it to below it, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (y > 0 && y < gridSize - 1) {
                nextGrid[y + 1][x] = grid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    },
    super_cloner_left: {
        name: 'Super Cloner (Left)',
        description: 'Copies stuff from its right to its left, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (x > 0 && x < gridSize - 1) {
                nextGrid[y][x - 1] = grid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    },
    super_cloner_right: {
        name: 'Super Cloner (Right)',
        description: 'Copies stuff from its left to its right, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
            rend.fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (x > 0 && x < gridSize - 1) {
                nextGrid[y][x + 1] = grid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    },
    piston_up: {
        name: 'Piston (Up)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 2, rend);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let validPiston = true;
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                }
            });
            if (!validPiston) return;
            let moveY = null;
            let lastCollapsible = null;
            for (let i = y; i >= 0; i--) {
                if (grid[i][x] == 'air') {
                    moveY = i;
                    break;
                }
                if (grid[i][x] == 'collapsible') {
                    lastCollapsible = i;
                }
                if (i != y && ((grid[i][x].includes('piston') && grid[i][x].length <= 12) || grid[i][x] == 'wall' || grid[i][x] == 'slider_horizontal')) {
                    break;
                }
            }
            if (moveY == null && lastCollapsible != null) {
                moveY = lastCollapsible;
            }
            if (moveY != null) {
                for (let i = moveY; i < y; i++) {
                    if (!canMoveTo(x, i + 1)) return;
                }
                for (let i = moveY; i < y; i++) {
                    nextGrid[i][x] = grid[i + 1][x];
                }
                nextGrid[y][x] = 'air';
            } else {
                detectRotate(x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        key: Infinity,
        updatePriority: 1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    piston_down: {
        name: 'Piston (Down)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, rend);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let validPiston = true;
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                }
            });
            if (!validPiston) return;
            let moveY = null;
            let lastCollapsible = null;
            for (let i = y; i <= gridSize - 1; i++) {
                if (grid[i][x] == 'air') {
                    moveY = i;
                    break;
                }
                if (grid[i][x] == 'collapsible') {
                    lastCollapsible = i;
                }
                if (i != y && ((grid[i][x].includes('piston') && grid[i][x].length <= 12) || grid[i][x] == 'wall' || grid[i][x] == 'slider_horizontal')) {
                    break;
                }
            }
            if (moveY == null && lastCollapsible != null) {
                moveY = lastCollapsible;
            }
            if (moveY != null) {
                for (let i = moveY; i > y; i--) {
                    if (!canMoveTo(x, i - 1)) return;
                }
                for (let i = moveY; i > y; i--) {
                    nextGrid[i][x] = grid[i - 1][x];
                }
                nextGrid[y][x] = 'air';
            } else {
                detectRotate(x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        key: 'k',
        updatePriority: 1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    piston_left: {
        name: 'Piston (Left)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 2, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let validPiston = true;
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                }
            });
            if (!validPiston) return;
            let moveX = null;
            let lastCollapsible = null;
            for (let i = x; i >= 0; i--) {
                if (grid[y][i] == 'air') {
                    moveX = i;
                    break;
                }
                if (grid[y][i] == 'collapsible') {
                    lastCollapsible = i;
                }
                if (i != x && ((grid[y][i].includes('piston') && grid[y][i].length <= 12) || grid[y][i] == 'wall' || grid[y][i] == 'slider_vertical')) {
                    break;
                }
            }
            if (moveX == null && lastCollapsible != null) {
                moveX = lastCollapsible;
            }
            if (moveX != null) {
                for (let i = moveX; i < x; i++) {
                    if (!canMoveTo(i + 1, y)) return;
                }
                for (let i = moveX; i < x; i++) {
                    nextGrid[y][i] = grid[y][i + 1];
                }
                nextGrid[y][x] = 'air';
            } else {
                detectRotate(x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        key: Infinity,
        updatePriority: 1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    piston_right: {
        name: 'Piston (Right)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 2, y + j + 1 / 3, 1 / 2, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let validPiston = true;
            updateTouchingPixel(x, y, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                }
            });
            if (!validPiston) return;
            let moveX = null;
            let lastCollapsible = null;
            for (let i = x; i <= gridSize - 1; i++) {
                if (grid[y][i] == 'air') {
                    moveX = i;
                    break;
                }
                if (grid[y][i] == 'collapsible') {
                    lastCollapsible = i;
                }
                if (i != x && ((grid[y][i].includes('piston') && grid[y][i].length <= 12) || grid[y][i] == 'wall' || grid[y][i] == 'slider_vertical')) {
                    break;
                }
            }
            if (moveX == null && lastCollapsible != null) {
                moveX = lastCollapsible;
            }
            if (moveX != null) {
                for (let i = moveX; i > x; i--) {
                    if (!canMoveTo(i - 1, y)) return;
                }
                for (let i = moveX; i > x; i--) {
                    nextGrid[y][i] = grid[y][i - 1];
                }
                nextGrid[y][x] = 'air';
            } else {
                detectRotate(x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        key: Infinity,
        updatePriority: 1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    rotator_up: {
        name: 'Piston Rotator (Up)',
        description: 'Rotates directional pixels to face up',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 255, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 2, rend);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        key: Infinity,
        updatePriority: 5,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    rotator_down: {
        name: 'Piston Rotator (Down)',
        description: 'Rotates directional pixels to face down',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 255, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, rend);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        key: Infinity,
        updatePriority: 5,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    rotator_left: {
        name: 'Piston Rotator (Left)',
        description: 'Rotates directional pixels to face left',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 255, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 2, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        key: Infinity,
        updatePriority: 5,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    rotator_right: {
        name: 'Piston Rotator (Right)',
        description: 'Rotates directional pixels to face right',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 255, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 2, y + j + 1 / 3, 1 / 2, 1 / 3, rend);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        key: Infinity,
        updatePriority: 5,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    rotator_clockwise: {
        name: 'Rotator (Clockwise)',
        description: 'Rotates directional pixels clockwise',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 255, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    switch (floor(animationTime / 10) % 4) {
                        case 0:
                            drawPixel(x + i, y + j, 2 / 3, 1 / 3, rend);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 2 / 3, 1 / 3, rend);
                            break;
                        case 1:
                            drawPixel(x + i + 1 / 3, y + j, 2 / 3, 1 / 3, rend);
                            drawPixel(x + i, y + j + 2 / 3, 2 / 3, 1 / 3, rend);
                            break;
                        case 2:
                            drawPixel(x + i + 2 / 3, y + j, 1 / 3, 2 / 3, rend);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 2 / 3, rend);
                            break;
                        case 3:
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 2 / 3, rend);
                            drawPixel(x + i, y + j, 1 / 3, 2 / 3, rend);
                            break;
                    }
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgba(75, 255, 255, 1)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.66)';
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.33)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.2)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    rotator_counterclockwise: {
        name: 'Rotator (Counterclockwise)',
        description: 'Rotates directional pixels counterclockwise',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(75, 255, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    switch (floor(animationTime / 10) % 4) {
                        case 3:
                            drawPixel(x + i + 2 / 3, y + j, 1 / 3, 2 / 3, rend);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 2 / 3, rend);
                            break;
                        case 2:
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 2 / 3, rend);
                            drawPixel(x + i, y + j, 1 / 3, 2 / 3, rend);
                            break;
                        case 1:
                            drawPixel(x + i, y + j, 2 / 3, 1 / 3, rend);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 2 / 3, 1 / 3, rend);
                            break;
                        case 0:
                            drawPixel(x + i + 1 / 3, y + j, 2 / 3, 1 / 3, rend);
                            drawPixel(x + i, y + j + 2 / 3, 2 / 3, 1 / 3, rend);
                            break;
                    }
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgba(75, 255, 255, 1)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.66)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.33)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.2)';
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    slider_horizontal: {
        name: 'Horizontal Slider',
        description: 'Can only be pushed left and right',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(255, 180, 0, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(200, 100, 0, opacity * 255);
            for (let i = 0; i < height; i++) {
                drawPixel(x, y + i + 1 / 4, width, 1 / 2, rend);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            ctx.fillRect(0, 25 / 2, 50, 25);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    slider_vertical: {
        name: 'Vertical Slider',
        description: 'Can only be pushed up and down',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(250, 180, 0, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(200, 100, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                drawPixel(x + i + 1 / 4, y, 1 / 2, height, rend);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            ctx.fillRect(25 / 2, 0, 25, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    collapsible: {
        name: 'Collapsible Box',
        description: 'A box that will disintegrate when squished',
        draw: function (x, y, width, height, opacity, rend) {
            if (noNoise) {
                rend.fill(255, 120, 210, opacity * 255);
                drawPixel(x, y, width, height, rend);
            } else {
                rend.fill(255, 100, 200, opacity * 255);
                drawPixel(x, y, width, height, rend);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        rend.fill(255, 140, 255, noiseGrid[y + j][x + i] * opacity);
                        drawPixel(x + i, y + j, 1, 1, rend);
                    }
                }
            }
        },
        update: function (x, y) {
            if (validMovingPixel(x, y) && y < gridSize - 1 && grid[y + 1][x] == 'air' && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 120, 210)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 2,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    nuke_diffuser: {
        name: 'Nuke Diffuser',
        description: 'Doesn\'t cause diffusion, but will defuse nukes touching it',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(175, 50, 0, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(225, 125, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                drawPixel(x + i + 1 / 3, y, 1 / 3, height, rend);
            }
            for (let i = 0; i < height; i++) {
                drawPixel(x, y + i + 1 / 3, width, 1 / 3, rend);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(175, 50, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 50 / 3, 50, 50 / 3);
            ctx.fillRect(50 / 3, 0, 50 / 3, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    laser_scatterer: {
        name: 'Laser Scatterer',
        description: 'Scatters lasers that pass through it and makes them useless',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(220, 220, 255, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(210, 210, 220, opacity * 255, rend);
            for (let i = 0; i < width; i++) {
                drawPixel(x + i, y, 1 / 4, height, rend);
                drawPixel(x + i + 1 / 2, y, 1 / 4, height, rend);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(210, 210, 220)';
            ctx.fillRect(0, 0, 25 / 2, 50);
            ctx.fillRect(25, 0, 25 / 2, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        above: false,
        pickable: true
    },
    laser_up: {
        name: "L.A.S.E.R. (Up)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Upwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(...colorAnimate(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 3 + i, y + j, 1 / 3, 1 / 2, rend);
                }
            }
            rend.fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < width; i++) {
                let endY = y;
                while (endY >= 0) {
                    endY--;
                    if (endY >= 0 && grid[endY][x + i] != 'air') break;
                }
                drawPixel(x + 1 / 3 + i, endY + 1, 1 / 3, y - endY - 1, rend);
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (random() < 0.2) {
                let removeY = y;
                while (removeY > 0) {
                    removeY--;
                    if (grid[removeY][x] != 'air') {
                        if (grid[removeY][x] != 'laser_scatterer') nextGrid[removeY][x] = 'air';
                        if (grid[removeY][x] == 'gunpowder') explode(x, removeY, 5, 1);
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    laser_down: {
        name: "L.A.S.E.R. (Down)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Downwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(...colorAnimate(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 3 + i, y + 1 / 2 + j, 1 / 3, 1 / 2, rend);
                }
            }
            rend.fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < width; i++) {
                let endY = y + height - 1;
                while (endY < gridSize) {
                    endY++;
                    if (endY < gridSize && grid[endY][x + i] != 'air') break;
                }
                drawPixel(x + 1 / 3 + i, y + height, 1 / 3, endY - y - height, rend);
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (random() < 0.2) {
                let removeY = y;
                while (removeY < gridSize - 1) {
                    removeY++;
                    if (grid[removeY][x] != 'air') {
                        if (grid[removeY][x] != 'laser_scatterer') nextGrid[removeY][x] = 'air';
                        if (grid[removeY][x] == 'gunpowder') explode(x, removeY, 5, 1);
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    laser_left: {
        name: "L.A.S.E.R. (Left)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Leftwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(...colorAnimate(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + 1 / 3 + j, 1 / 2, 1 / 3, rend);
                }
            }
            rend.fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < height; i++) {
                let endX = x;
                while (endX >= 0) {
                    endX--;
                    if (grid[y + i][endX] != 'air') break;
                }
                drawPixel(endX + 1, y + 1 / 3 + i, x - endX - 1, 1 / 3, rend);
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (random() < 0.2) {
                let removeX = x;
                while (removeX > 0) {
                    removeX--;
                    if (grid[y][removeX] != 'air') {
                        if (grid[y][removeX] != 'laser_scatterer') nextGrid[y][removeX] = 'air';
                        if (grid[y][removeX] == 'gunpowder') explode(removeX, y, 5, 1);
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    laser_right: {
        name: "L.A.S.E.R. (Right)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Rightwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height, rend);
            rend.fill(...colorAnimate(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 2 + i, y + 1 / 3 + j, 1 / 2, 1 / 3, rend);
                }
            }
            rend.fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < height; i++) {
                let endX = x + width - 1;
                while (endX < gridSize) {
                    endX++;
                    if (grid[y + i][endX] != 'air') break;
                }
                drawPixel(x + width, y + 1 / 3 + i, endX - x - width, 1 / 3, rend);
            }
        },
        update: function (x, y) {
            if (detectRotate(x, y)) return;
            if (random() < 0.2) {
                let removeX = x;
                while (removeX < gridSize - 1) {
                    removeX++;
                    if (grid[y][removeX] != 'air') {
                        if (grid[y][removeX] != 'laser_scatterer') nextGrid[y][removeX] = 'air';
                        if (grid[y][removeX] == 'gunpowder') explode(removeX, y, 5, 1);
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    nuke: {
        name: 'Nuke',
        description: 'TBH, kinda weak',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 255, 75, opacity * 255);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, 'nuke_diffuser');
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == 'nuke') {
                    explosion = false;
                }
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 10);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    huge_nuke: {
        name: 'Huge Nuke',
        description: 'KABOOM!',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(100, 60, 255, 255 * opacity);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, 'nuke_diffuser');
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == 'huge_nuke') {
                    explosion = false;
                }
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 20);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 60, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    very_huge_nuke: {
        name: 'Very Huge Nuke',
        description: 'AAAAAAAAAAAAAAAAAAAAA',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(255, 0, 70, 255 * opacity);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, 'nuke_diffuser');
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == 'very_huge_nuke') {
                    explosion = false;
                }
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 40);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 70)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: true
    },
    lag_spike_generator: {
        name: 'lag_spike_generator',
        description: 'Not that laggy',
        draw: function (x, y, width, height, opacity, rend) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    rend.fill(255, 255, 255, opacity * 255);
                    drawPixel(x + i, y + j, 1, 1, rend);
                    rend.fill(125, 255, 0, (random(225) + 30) * opacity);
                    drawPixel(x + i, y + j, 1, 1, rend);
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 'air', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = 'lag_spike_generator';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.025) {
                    nextGrid[actionY][actionX] = 'pump';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.025) {
                    nextGrid[actionY][actionX] = 'cloner';
                }
            });
            updateTouchingPixel(x, y, 'lag_spike_generator', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.005) {
                    nextGrid[actionY][actionX] = 'nuke';
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 255, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 5,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    corruption: {
        name: '�',
        description: '<span style="color: red">�</span>',
        draw: function (x, y, width, height, opacity, rend) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    for (let k = 0; k < random(1, 5); k++) {
                        let rotationAmount = floor(random(0, 360));
                        rend.translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                        let translateX = random(-10 * xScale, 10 * xScale);
                        let translateY = random(-10 * yScale, 10 * yScale);
                        let skewX = random(-PI / 6, PI / 6);
                        let skewY = random(-PI / 6, PI / 6);
                        rend.translate(translateX, translateY);
                        rend.rotate(rotationAmount);
                        rend.shearX(skewX);
                        rend.shearY(skewY);
                        let borkXScale = random(0, 4);
                        let borkYScale = random(0, 2);
                        rend.fill(0, 0, 0, opacity * 255);
                        drawPixel(0, 0, borkXScale, borkYScale, rend);
                        rend.fill(100, 255, 0, (random(155) + 100) * opacity);
                        drawPixel(0, 0, borkXScale, borkYScale, rend);
                        rend.shearY(-skewY);
                        rend.shearX(-skewX);
                        rend.rotate(-rotationAmount);
                        rend.translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                    }
                    if (random(1, 5) < 1.2) {
                        for (let k = 0; k < random(1, 10); k++) {
                            let rotationAmount = floor(random(0, 360));
                            rend.translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                            let translateX = random(-20 * xScale, 20 * xScale);
                            let translateY = random(-20 * yScale, 20 * yScale);
                            rend.translate(translateX, translateY);
                            rend.rotate(rotationAmount);
                            drawPixels(0, 0, 1, 1, 'missing', opacity);
                            rend.rotate(-rotationAmount);
                            rend.translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                        }
                        let rotationAmount = floor(random(0, 360));
                        rend.translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                        let translateX = random(-gridSize * xScale, gridSize * xScale);
                        let translateY = random(-gridSize * yScale, gridSize * yScale);
                        let skewX = random(-PI / 6, PI / 6);
                        let skewY = random(-PI / 6, PI / 6);
                        rend.translate(translateX, translateY);
                        rend.rotate(rotationAmount);
                        rend.shearX(skewX);
                        rend.shearY(skewY);
                        rend.fill(255, 0, 0, opacity * 255);
                        rend.rect(0, 0, 90, 90);
                        rend.fill(255, 255, 0, opacity * 255);
                        rend.rect(10, 10, 70, 70);
                        rend.fill(255, 0, 0, opacity * 255);
                        rend.rect(40, 20, 10, 30);
                        rend.rect(40, 60, 10, 10);
                        rend.shearY(-skewY);
                        rend.shearX(-skewX);
                        rend.rotate(-rotationAmount);
                        rend.translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                    }
                }
            }
            if (!optimizedLags) {
                for (let i = 0; i < gridSize; i++) {
                    stroke(color(255, 255, 255, 255));
                    noStroke();
                    cursor();
                    noCursor();
                    rend.fill(color(255, 255, 255, 255));
                    noFill();
                    let string = '';
                    let number = 0;
                    let j = 0;
                    while (j < gridSize) {
                        number++;
                        if (grid[i][j] != string) {
                            if (string != '' && string != 'air' && number != 0) {
                                if (random() < 0.0001) drawPixels(j - number, i, number, 1, string, 1);
                            }
                            string = grid[i][j];
                            number = 0;
                        }
                        j++;
                    }
                    number++;
                    if (string != '') {
                        if (random() < 0.0001) drawPixels(j - number, i, number, 1, string, 1);
                    }
                }
            }
        },
        update: function (x, y) {
            function chaos(actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.4) {
                    nextGrid[actionY][actionX] = 'corruption';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = 'lava';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = 'water';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.4) {
                    nextGrid[actionY][actionX] = 'missing';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = 'air';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = 'pump';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = 'cloner_down';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = 'cloner_left';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = 'cloner_right';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = 'cloner_up';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = 'piston_left';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = 'piston_right';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = 'piston_up';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = 'piston_down';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.03) {
                    nextGrid[actionY][actionX] = 'nuke';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.02) {
                    nextGrid[actionY][actionX] = 'huge_nuke';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.01) {
                    nextGrid[actionY][actionX] = 'very_huge_nuke';
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.001) {
                    nextGrid[actionY][actionX] = 'spin';
                }
                move(min(max(round(random(x - 5, x + 5)), 0), gridSize - 1), min(max(round(random(y - 5, y + 5)), 0), gridSize - 1), min(max(round(random(x - 5, x + 5)), 0), gridSize - 1), min(max(round(random(y - 5, y + 5)), 0), gridSize - 1));
            };
            updateTouchingPixel(x, y, 'air', chaos);
            updateTouchingAnything(x, y, chaos);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(4, 4, 42, 42);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(22, 8, 6, 22);
            ctx.fillRect(22, 36, 6, 6);
        },
        key: Infinity,
        updatePriority: 5,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: true
    },
    spin: {
        name: 'Spin',
        description: 'SPINNY CARRIER GO WEEEEEEEEEEEEEEEEEEEEEEEEE!!',
        draw: function (x, y, width, height, opacity, rend) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    rend.translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                    let translateX = random(-10 * xScale, 10 * xScale);
                    let translateY = random(-10 * yScale, 10 * yScale);
                    rend.translate(translateX, translateY);
                    let rotationAmount = floor(random(0, 360));
                    rend.rotate(rotationAmount);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        above: false,
        pickable: false
    },
    remove: {
        name: "Remove (brush only)",
        description: `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&rel=0&controls=0&disablekb=1" width=${window.innerWidth} height=${window.innerHeight} style="position: absolute; top: -2px; left: -2px; pointer-events: none;"></iframe><div style="position: absolute; top: 0px, left: 0px; width: 100vw; height: 100vh; z-index: 100;"></div>`,
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(255, 0, 0);
            drawPixel(x, y, width, height, rend);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    },
    missing: {
        name: 'Missing Pixel',
        description: 'Check your save code, it probably has pixels that don\'t exist in it',
        draw: function (x, y, width, height, opacity, rend) {
            rend.fill(0, 0, 0, opacity * 255);
            drawPixel(x, y, width, height, rend);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    rend.fill(255, 0, 255, opacity * 255);
                    drawPixel(x + i, y + j, 1 / 2, 1 / 2, rend);
                    drawPixel(x + 1 / 2 + i, y + 1 / 2 + j, 1 / 2, 1 / 2, rend);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 255)';
            ctx.fillRect(0, 0, 25, 25);
            ctx.fillRect(25, 25, 25, 25);
        },
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animatedNoise: false,
        animated: false,
        above: false,
        pickable: false
    }
};

function clickLine(startX, startY, endX, endY, remove) {
    let x = startX;
    let y = startY;
    let angle = atan2(endY - startY, endX - startX);
    let distance = sqrt(pow(endX - startX, 2) + pow(endY - startY, 2));
    for (let i = 0; i <= distance; i++) {
        let gridX = floor(x);
        let gridY = floor(y);
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
    let x = floor(mouseX * gridSize / width);
    let y = floor(mouseY * gridSize / height);
    mouseOver = x >= 0 && x <= gridSize && y >= 0 && y <= gridSize;

    // draw pixels
    if ((gridPaused && !simulatePaused) || !gridPaused || animationTime % 20 == 0) {
        let r = parseInt(backgroundColor.substring(0, 2), 16);
        let g = parseInt(backgroundColor.substring(2, 4), 16);
        let b = parseInt(backgroundColor.substring(4, 6), 16);
        fill(r, g, b, 255 - fadeEffect);
        rect(0, 0, width, height);
        below.clear();
        above.clear();
        for (let i = 0; i < gridSize; i++) {
            let curr = 'air';
            let amount = 0;
            let j;
            for (j = 0; j < gridSize; j++) {
                amount++;
                if (grid[i][j] != curr) {
                    drawPixels(j - amount, i , amount, 1, curr, 1, pixels[curr].above ? above : below);
                    curr = grid[i][j]
                    amount = 0;
                }
            }
            if (curr != 'air') drawPixels(gridSize - amount - 1, i, amount + 1, 1, curr, 1, pixels[curr].above ? above : below);
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
    }
    if (gridPaused && runTicks <= 0 && !simulatePaused) {
        frames.push(millis());
    }
    // copy layers
    image(below, 0, 0);
    image(above, 0, 0);
    // draw brush
    if (!gridPaused || !simulatePaused) {
        stroke(color(0, 0, 0));
        let x1 = max(0, floor(mouseX * gridSize / width) - clickSize + 1);
        let x2 = min(gridSize - 1, floor(mouseX * gridSize / width) + clickSize - 1);
        let y1 = max(0, floor(mouseY * gridSize / height) - clickSize + 1);
        let y2 = min(gridSize - 1, floor(mouseY * gridSize / height) + clickSize - 1);
        drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? 'remove' : clickPixel, 0.5, main);
        noStroke();
    }

    // place pixels
    if (mouseIsPressed && (!gridPaused || !simulatePaused) && acceptInputs && mouseOver) {
        clickLine(x, y, floor(pmouseX * gridSize / width), floor(pmouseY * gridSize / height), mouseButton == RIGHT || removing);
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
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    if (fireGrid[k][j]) pixels['fire'].update(j, k);
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
        fill(255, 255, 255);
        rect(1, 1, 70, 14);
        if (debugInfo) {
            rect(5, 0, 200, 120);
        }
    }
    fill(0, 0, 0);
    textFont('Arial', 14);
    textAlign(LEFT, TOP);
    text('FPS: ' + frames.length, 3, 1);
    while (lastFpsList + 100 < millis()) {
        lastFpsList += 100;
        fpsList.push(frames.length);
        while (fpsList.length > 100) {
            fpsList.shift(1);
        }
    }
    if (debugInfo) {
        fill(0, 0, 0, 75);
        rect(5, 20, 200, 100);
        for (let i = 0; i < 100; i++) {
            fill(0, 0, 0);
            rect(5 + i * 2, 120 - fpsList[i], 2, fpsList[i]);
        }
        text('Last 10 seconds:', 10, 22);
    }
    textAlign(RIGHT, TOP);
    text('Brush Size: ' + (clickSize * 2 - 1), width - 3, 1);
    text('Brush Pixel: ' + (pixels[clickPixel] ?? pixels['missing']).name, width - 3, 16);
    if (gridPaused) {
        fill(0, 0, 0);
        text('PAUSED', width - 3, 33);
        if (simulatePaused) {
            textAlign(CENTER, CENTER);
            textFont('Arial', 40);
            text('SIMULATING...', width / 2, height / 2);
        }
    }

    animationTime++;
};

function mouseWheel(e) {
    if (e.deltaY > 0) {
        clickSize = max(1, clickSize - 1);
    } else {
        clickSize = min(ceil(gridSize / 2 + 1), clickSize + 1);
    }
};

function windowResized() {
    xScale = gridResolution / gridSize;
    yScale = gridResolution / gridSize;
    resizeCanvas(gridResolution, gridResolution);
    below.remove();
    above.remove();
    below = createGraphics(gridResolution, gridResolution);
    above = createGraphics(gridResolution, gridResolution);
    below.noStroke();
    above.noStroke();
    canvasScale = Math.min(window.innerWidth / gridResolution, window.innerHeight / gridResolution);
    document.querySelector('.p5Canvas').style.width = gridResolution * canvasScale - 20 + 'px';
    document.querySelector('.p5Canvas').style.height = gridResolution * canvasScale - 20 + 'px';
    if (window.innerWidth - gridResolution * canvasScale < 300) {
        document.getElementById('sidebar').style.top = Math.min(window.innerWidth, window.innerHeight) + 'px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - 20 + 'px');
        let pickerWidth = (Math.round((window.innerWidth - 20) / 62) - 1) * 62;
        document.getElementById('pixelPicker').style.width = pickerWidth + 'px';
        document.getElementById('pixelPickerDescription').style.width = pickerWidth - 14 + 'px';
    } else {
        document.getElementById('sidebar').style.top = '0px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - gridResolution * canvasScale - 20 + 'px');
        let pickerWidth = (Math.round((window.innerWidth - gridResolution * canvasScale - 20) / 62) - 1) * 62;
        document.getElementById('pixelPicker').style.width = pickerWidth + 'px';
        document.getElementById('pixelPickerDescription').style.width = pickerWidth - 14 + 'px';
    }
};
