// no documentation here!

window.onerror = document.write;

let gridSize = 100;
let saveCode = '100;air-16:wall:piston_rotator_right:piston_left:air:piston_rotator_left:nuke_diffuser-6:piston_rotator_right:piston_left:air-70:piston_rotator_left:air-16:wall:piston_rotator_right:piston_left:air:piston_rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:piston_rotator_right:piston_left:air-70:piston_rotator_left:air-16:wall:piston_rotator_right:piston_left:air:piston_rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:piston_rotator_right:piston_left:air-70:piston_rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava-11:wall:air-3:nuke_diffuser:air-83:wall:super_cloner_down-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}4|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let startPaused = false;

let optimizedLiquids = false;
let optimizedLags = false;
let fadeEffect = 127;

let xScale = 600 / gridSize;
let yScale = 600 / gridSize;
let canvasScale = Math.min(window.innerWidth / 600, window.innerHeight / 600);
let debugInfo = false;
let animationTime = 0;
let ticks = 0;
let frames = [];
let lastFpsList = 0;
let fpsList = [];
let grid = [];
let nextGrid = [];
// let lastGrids = [];
let gridPaused = startPaused;
let simulatePaused = false;
let clickPixel = 'wall';
let clickSize = 5;
let runTicks = 0;

function createGrid() {
    xScale = width / gridSize;
    yScale = height / gridSize;
    grid = [];
    nextGrid = [];
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        nextGrid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push('air');
            nextGrid[i].push(null);
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
                x += 1;
                if (x == gridSize) {
                    x = 0;
                    y += 1;
                }
                if (y == gridSize) {
                    y -= 1;
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
                        }
                        else {
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
                        inLoop += 1;
                    }
                    if (inputSaveCode[i] == '}') {
                        inLoop -= 1;
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
    }
};
function generateSaveCode() {
    let saveCode = '';
    let string = '';
    let number = 0;
    saveCode += gridSize + ';';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            number += 1;
            if (grid[i][j] != string) {
                if (string != '' && number != 0) {
                    if (number == 1) {
                        saveCode += string + ':';
                    }
                    else {
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
        }
        else {
            saveCode += string + '-' + number + ':';
        }
    }
    return saveCode;
};

function setup() {
    createCanvas(600, 600);
    frameRate(60);
    noiseDetail(3, 0.6);
    windowResized();

    createGrid();
    loadSaveCode();
    document.getElementById('saveCode').value = saveCode;

    document.onkeydown = function (e) {
        if (e.ctrlKey || e.target.matches('#saveCode')) return;
        const key = e.key.toLowerCase();
        for (let i in pixels) {
            if (pixels[i].key == key) {
                clickPixel = i;
            }
        }
        if (key == 'arrowup') {
            clickSize += 1;
            clickSize = min(gridSize / 2 + 1, clickSize);
        } else if (key == 'arrowdown') {
            clickSize -= 1;
            clickSize = max(1, clickSize);
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
        }
        if (key != 'i' || !e.shiftKey || !e.ctrlKey) e.preventDefault();
        if (e.target.matches('button')) e.target.blur();
    };
    document.onkeyup = function (e) {
        if (e.ctrlKey || e.target.matches('#saveCode')) return;
        const key = e.key.toLowerCase();
        // if (keyCode == 90) {
        //     for (let i = 0; i < gridSize; i++) {
        //         for (let j = 0; j < gridSize; j++) {
        //             grid[i][j] = lastGrids[lastGrids.length - 1][i][j];
        //         }
        //     }
        //     lastGrids.pop();
        // }
        if (key == 'alt') {
            debugInfo = !debugInfo;
        } else if (key == 'p') {
            gridPaused = !gridPaused;
            simulatePaused = false;
            frameRate(60);
        }
        if (key == 'shift') {
            if (gridPaused) simulatePaused = !simulatePaused;
            // if (simulatePaused && gridPaused) {
            //     frameRate(240);
            // } else {
            //     frameRate(60);
            // }
        }
        e.preventDefault();
    };
    document.querySelector('.p5Canvas').addEventListener('contextmenu', (e) => e.preventDefault());

    document.getElementById('reset').onclick = function (e) {
        saveCode = document.getElementById('saveCode').value;
        loadSaveCode();
    };
    document.getElementById('copySave').onclick = function (e) {
        let saveCode = generateSaveCode();
        window.navigator.clipboard.writeText(saveCode);
    };
    document.getElementById('startPaused').onclick = function (e) {
        startPaused = !startPaused;
        if (startPaused) document.getElementById('startPaused').style.backgroundColor = 'lime';
        else document.getElementById('startPaused').style.backgroundColor = 'red';
    };
    document.getElementById('optimizedLiquids').onclick = function (e) {
        optimizedLiquids = !optimizedLiquids;
        if (optimizedLiquids) document.getElementById('optimizedLiquids').style.backgroundColor = 'lime';
        else document.getElementById('optimizedLiquids').style.backgroundColor = 'red';
    };
    document.getElementById('fadeEffect').onclick = function (e) {
        fadeEffect = fadeEffect ? 0 : 127;
        if (fadeEffect) document.getElementById('fadeEffect').style.backgroundColor = 'lime';
        else document.getElementById('fadeEffect').style.backgroundColor = 'red';
    };
};

function drawPixels(x, y, width, height, type, opacity) {
    if (pixels[type]) {
        pixels[type].draw(x, y, width, height, opacity);
    }
    else {
        noStroke();
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                fill(255, 0, 255, opacity * 255);
                drawPixel(x + i, y + j, 1 / 2, 1 / 2);
                drawPixel(x + 1 / 2 + i, y + 1 / 2 + j, 1 / 2, 1 / 2);
                fill(0, 0, 0, opacity * 255);
                drawPixel(x + 1 / 2 + i, y + j, 1 / 2, 1 / 2);
                drawPixel(x + i, y + 1 / 2 + j, 1 / 2, 1 / 2);
            }
        }
    }
};
function drawPixel(x, y, width, height) {
    rect(x * xScale, y * yScale, xScale * width, yScale * height);
};
function updatePixel(x, y, i) {
    if (pixels[grid[y][x]] && pixels[grid[y][x]].updatePriority == i) {
        pixels[grid[y][x]].update(x, y);
    }
};
function updateTouchingPixel(x, y, range, type, action) {
    let touchingPixel = false;
    for (let i = -range; i <= range; i++) {
        if (x + i >= 0 && x + i <= gridSize - 1) {
            for (let j = -range; j <= range; j++) {
                if (y + j >= 0 && y + j <= gridSize - 1) {
                    if (abs(i) + abs(j) <= range && abs(i) + abs(j) != 0) {
                        if (grid[y + j][x + i] == type) {
                            action(x + i, y + j);
                            touchingPixel = true;
                        }
                    }
                }
            }
        }
    }
    return touchingPixel;
};
function updateTouchingAnything(x, y, range, action) {
    let touchingPixel = false;
    for (let i = -range; i <= range; i++) {
        if (x + i >= 0 && x + i <= gridSize - 1) {
            for (let j = -range; j <= range; j++) {
                if (y + j >= 0 && y + j <= gridSize - 1) {
                    if (abs(i) + abs(j) <= range && abs(i) + abs(j) != 0) {
                        if (grid[y + j][x + i] != 'air') {
                            action(x + i, y + j);
                            touchingPixel = true;
                        }
                    }
                }
            }
        }
    }
    return touchingPixel;
};
function explode(x, y, size, chain) {
    nextGrid[y][x] = 'air';
    grid[y][x] = 'wall';
    for (let i = -size; i <= size; i++) {
        for (let j = -size; j <= size; j++) {
            if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
                if (random() < 1 - (dist(x, y, x + i, y + j) / (size * 1.2))) {
                    // if (grid[y + j][x + i] == 'nuke' || nextGrid[y + j][x + i] == 'nuke2') {
                    //     explode(x+i, y+j, 10/chain, chain + 0.5);
                    // } else if (nextGrid[y + j][x + i] == 'huge_nuke') {
                    //     explode(x+i, y+j, 20/chain, chain + 0.5);
                    // } else if (nextGrid[y + j][x + i] == 'very_huge_nuke') {
                    //     explode(x+i, y+j, 40/chain, chain + 0.5);
                    // } else {
                    nextGrid[y + j][x + i] = 'air';
                    // }
                }
            }
        }
    }
};
const pixels = {
    air: {
        draw: function (x, y, width, height, opacity) { },
        update: function (x, y) { },
        key: Infinity,
        updatePriority: -1
    },
    sand: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 225, 125, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'sand';
                    }
                }
                else if (grid[y + 1][x] == 'water') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'water';
                        nextGrid[y + 1][x] = 'sand';
                    }
                }
                else {
                    let validSlidingPositions = [];
                    if (x > 0) {
                        if (grid[y][x - 1] == 'air' && grid[y + 1][x - 1] == 'air') {
                            validSlidingPositions.push(-1);
                        }
                    }
                    if (x < gridSize - 1) {
                        if (grid[y][x + 1] == 'air' && grid[y + 1][x + 1] == 'air') {
                            validSlidingPositions.push(1);
                        }
                    }
                    if (validSlidingPositions.length > 0) {
                        let slidePosition = validSlidingPositions[floor(random(0, validSlidingPositions.length))];
                        if (nextGrid[y][x] == null && nextGrid[y + 1][x + slidePosition] == null) {
                            nextGrid[y][x] = 'air';
                            nextGrid[y + 1][x + slidePosition] = 'sand';
                        }
                    }
                }
            }
        },
        key: '1',
        updatePriority: 2
    },
    water: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            if (optimizedLiquids) {
                fill(75, 50, 255, opacity * 255);
                drawPixel(x, y, width, height);
            }
            else {
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        fill(100, 225, 255, opacity * 255);
                        drawPixel(x + i, y + j, 1, 1);
                        fill(75, 0, 125, round(noise((x + i) / 3, (y + j) / 3, animationTime / 20) * 127) * opacity + 60);
                        drawPixel(x + i, y + j, 1, 1);
                    }
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 1, 'lava', function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'concrete';
                }
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'water';
                    }
                    return;
                }
                if (grid[y + 1][x] == 'collapsible') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'collapsible';
                        nextGrid[y + 1][x] = 'water';
                    }
                    return;
                }
                if (grid[y + 1][x] == 'sponge') return;
                let validSlidingPositions = [];
                let leftX = 0;
                while (x + leftX > 0) {
                    if (grid[y][x + leftX - 1] == 'air') {
                        if (grid[y + 1][x + leftX - 1] == 'air') {
                            validSlidingPositions.push(leftX - 1);
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    leftX -= 1;
                }
                let rightX = 0;
                while (x + rightX < gridSize - 1) {
                    if (grid[y][x + rightX + 1] == 'air') {
                        if (grid[y + 1][x + rightX + 1] == 'air') {
                            validSlidingPositions.push(rightX + 1);
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    rightX += 1;
                }
                if (validSlidingPositions.length > 0) {
                    let slidePosition;
                    for (let i = 0; i < validSlidingPositions.length; i++) {
                        if (slidePosition == undefined) {
                            slidePosition = validSlidingPositions[i];
                        }
                        else if (abs(validSlidingPositions[i]) < abs(slidePosition)) {
                            slidePosition = validSlidingPositions[i];
                        }
                        else if (abs(validSlidingPositions[i]) == abs(slidePosition)) {
                            if (random() < 0.5) {
                                slidePosition = validSlidingPositions[i];
                            }
                        }
                    }
                    if (nextGrid[y][x] == null) {
                        if (slidePosition == -1 && nextGrid[y + 1][x + slidePosition] == null) {
                            nextGrid[y][x] = 'air';
                            nextGrid[y + 1][x + slidePosition] = 'water';
                        }
                        else if (slidePosition == 1 && nextGrid[y + 1][x + slidePosition] == null) {
                            nextGrid[y][x] = 'air';
                            nextGrid[y + 1][x + slidePosition] = 'water';
                        }
                        else if (nextGrid[y][x + slidePosition / abs(slidePosition)] == null) {
                            nextGrid[y][x] = grid[y][x + slidePosition / abs(slidePosition)];
                            nextGrid[y][x + slidePosition / abs(slidePosition)] = 'water';
                        }
                    }
                    return;
                }
            }
            let slide = 0;
            if (grid[y][x - 2] == 'water' && grid[y][x - 1] == 'air' && nextGrid[y][x - 1] == null) slide--;
            if (grid[y][x + 2] == 'water' && grid[y][x + 1] == 'air' && nextGrid[y][x + 1] == null) slide++;
            if ((grid[y][x - 1] == 'air') && nextGrid[y][x - 1] == null) slide -= 2;
            if ((grid[y][x + 1] == 'air') && nextGrid[y][x + 1] == null) slide += 2;
            if (slide < 0) {
                nextGrid[y][x] = 'air';
                nextGrid[y][x - 1] = 'water';
            } else if (slide > 0) {
                nextGrid[y][x] = 'air';
                nextGrid[y][x + 1] = 'water'
            }
        },
        key: '2',
        updatePriority: 3
    },
    lava: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            if (optimizedLiquids) {
                fill(255, 125, 0, opacity * 255);
                drawPixel(x, y, width, height);
            }
            else {
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        fill(255, 0, 0, opacity * 255);
                        drawPixel(x + i, y + j, 1, 1);
                        fill(255, 255, 0, round(noise((x + i) / 5, (y + j) / 5, animationTime / 20) * 255) * opacity);
                        drawPixel(x + i, y + j, 1, 1);
                    }
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 1, 'water', function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'concrete';
                }
            });
            updateTouchingPixel(x, y, 1, 'collapsible', function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'sand';
                }
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null && random() < 0.5) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'lava';
                    }
                }
                else {
                    let validSlidingPositions = [];
                    let leftX = 0;
                    while (x + leftX > 0) {
                        if (grid[y][x + leftX - 1] == 'air' || grid[y][x + leftX - 1] == 'concrete') {
                            if (grid[y + 1][x + leftX - 1] == 'air') {
                                validSlidingPositions.push(leftX - 1);
                                break;
                            }
                        }
                        else {
                            break;
                        }
                        leftX -= 1;
                    }
                    let rightX = 0;
                    while (x + rightX < gridSize - 1) {
                        if (grid[y][x + rightX + 1] == 'air' || grid[y][x + rightX + 1] == 'concrete') {
                            if (grid[y + 1][x + rightX + 1] == 'air') {
                                validSlidingPositions.push(rightX + 1);
                                break;
                            }
                        }
                        else {
                            break;
                        }
                        rightX += 1;
                    }
                    if (validSlidingPositions.length > 0) {
                        let slidePosition;
                        for (let i = 0; i < validSlidingPositions.length; i++) {
                            if (slidePosition == undefined) {
                                slidePosition = validSlidingPositions[i];
                            }
                            else if (abs(validSlidingPositions[i]) < abs(slidePosition)) {
                                slidePosition = validSlidingPositions[i];
                            }
                            else if (abs(validSlidingPositions[i]) == abs(slidePosition)) {
                                if (random() < 0.5) {
                                    slidePosition = validSlidingPositions[i];
                                }
                            }
                        }
                        if (nextGrid[y][x] == null && random() < 0.5) {
                            if (slidePosition == -1 && nextGrid[y + 1][x + slidePosition] == null) {
                                nextGrid[y][x] = 'air';
                                nextGrid[y + 1][x + slidePosition] = 'lava';
                            }
                            else if (slidePosition == 1 && nextGrid[y + 1][x + slidePosition] == null) {
                                nextGrid[y][x] = 'air';
                                nextGrid[y + 1][x + slidePosition] = 'lava';
                            }
                            else if (nextGrid[y][x + slidePosition / abs(slidePosition)] == null) {
                                nextGrid[y][x] = grid[y][x + slidePosition / abs(slidePosition)];
                                nextGrid[y][x + slidePosition / abs(slidePosition)] = 'lava';
                            }
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
        key: '3',
        updatePriority: 3
    },
    concrete_powder: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(150, 150, 150, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (y > 0) {
                if (grid[y - 1][x] == 'water') {
                    if (nextGrid[y][x] == null && nextGrid[y - 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y - 1][x] = 'concrete';
                    }
                }
                else if (grid[y - 1][x] == 'lava') {
                    if (nextGrid[y][x] == null && nextGrid[y - 1][x] == null && random() < 0.5) {
                        nextGrid[y][x] = 'lava';
                        nextGrid[y - 1][x] = 'concrete';
                    }
                }
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'concrete_powder';
                    }
                }
            }
            updateTouchingPixel(x, y, 1, 'water', function (actionX, actionY) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = 'concrete';
                }
            });
            if (y < gridSize - 2) {
                let validSlidingPositions = [];
                if (x > 0) {
                    if (grid[y][x - 1] == 'air' && grid[y + 1][x - 1] == 'air' && grid[y + 2][x - 1] == 'air') {
                        validSlidingPositions.push(-1);
                    }
                }
                if (x < gridSize - 1) {
                    if (grid[y][x + 1] == 'air' && grid[y + 1][x + 1] == 'air' && grid[y + 2][x + 1] == 'air') {
                        validSlidingPositions.push(1);
                    }
                }
                if (validSlidingPositions.length > 0) {
                    let slidePosition = validSlidingPositions[floor(random(0, validSlidingPositions.length))];
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x + slidePosition] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x + slidePosition] = 'concrete_powder';
                    }
                }
            }
        },
        key: '4',
        updatePriority: 2
    },
    concrete: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(75, 75, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (y > 0) {
                if (grid[y - 1][x] == 'lava') {
                    if (nextGrid[y][x] == null && nextGrid[y - 1][x] == null && random() < 0.25) {
                        nextGrid[y][x] = 'lava';
                        nextGrid[y - 1][x] = 'concrete_powder';
                    }
                }
            }
            // if(y < gridSize - 1){
            //     if(grid[y + 1][x] == 'water'){
            //         if(nextGrid[y][x] == null && nextGrid[y + 1][x] == null){
            //             nextGrid[y][x] = 'water';
            //             nextGrid[y + 1][x] = 'concrete';
            //         }
            //     }
            // }
        },
        key: '5',
        updatePriority: 3
    },
    nuke: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(100, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            let explosion = false;
            let diffused = false;
            updateTouchingPixel(x, y, 1, 'nuke_diffuser', function (actionX, actionY) {
                diffused = true;
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'nuke';
                    }
                }
            }
            if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { })) {
                explosion = true;
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'nuke') {
                    explosion = false;
                }
            }
            else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 10);
            }
        },
        key: '6',
        updatePriority: 0
    },
    plant: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            let validPlant = false;
            updateTouchingPixel(x, y, 1, 'air', function (actionX, actionY) {
                validPlant = true;
            });
            updateTouchingPixel(x, y, 1, 'water', function (actionX, actionY) {
                validPlant = true;
            });
            // updateTouchingPixel(x,y,1,'plant',function(actionX,actionY){
            //     validPlant = true;
            // });
            // updateTouchingPixel(x,y,1,'lava',function(actionX,actionY){
            //     validPlant = false;
            // });
            if (!validPlant) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = 'water';
                }
            }
            updateTouchingPixel(x, y, 1, 'concrete', function (actionX, actionY) {
                nextGrid[y][x] = 'water';
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[actionY][actionX] = 'plant';
                }
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'plant';
                    }
                }
                if (random() < 0.5) {
                    if (grid[y + 1][x] == 'water') {
                        if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                            nextGrid[y][x] = 'water';
                            nextGrid[y + 1][x] = 'plant';
                        }
                    }
                }
            }
        },
        key: '7',
        updatePriority: 4
    },
    sponge: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(225, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 1, 'water', function (actionX, actionY) {
                nextGrid[y][x] = 'air';
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[actionY][actionX] = 'sponge';
                }
            });
            let validSponge = false;
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'sponge';
                    }
                }
                if (random() < 0.25) {
                    if (grid[y + 1][x] == 'lava') {
                        if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                            nextGrid[y][x] = 'lava';
                            nextGrid[y + 1][x] = 'sponge';
                        }
                    }
                }
                if (grid[y + 1][x] == 'sand') {
                    validSponge = true;
                }
            }
            if (!validSponge && random() < 0.125) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = 'air';
                }
            }
        },
        key: '8',
        updatePriority: 4
    },
    pump: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(25, 125, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 1, 'lava', function (actionX, actionY) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = 'water';
                }
            });
            updateTouchingPixel(x, y, 1, 'air', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.125) {
                    nextGrid[actionY][actionX] = 'water';
                }
            });
        },
        key: '9',
        updatePriority: 5
    },
    cloner_left: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                if (grid[y][x + 1] != 'air' && grid[y][x + 1] != 'cloner_left' && grid[y][x + 1] != 'cloner_up' && grid[y][x + 1] != 'cloner_right' && grid[y][x + 1] != 'cloner_down') {
                    if (grid[y][x - 1] == 'air') {
                        if (nextGrid[y][x - 1] == null) {
                            nextGrid[y][x - 1] = grid[y][x + 1];
                        }
                    }
                }
            }
        },
        key: 'a',
        updatePriority: 5
    },
    cloner_up: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                if (grid[y + 1][x] != 'air' && grid[y + 1][x] != 'cloner_left' && grid[y + 1][x] != 'cloner_up' && grid[y + 1][x] != 'cloner_right' && grid[y + 1][x] != 'cloner_down') {
                    if (grid[y - 1][x] == 'air') {
                        if (nextGrid[y - 1][x] == null) {
                            nextGrid[y - 1][x] = grid[y + 1][x];
                        }
                    }
                }
            }
        },
        key: 'w',
        updatePriority: 5
    },
    cloner_right: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                if (grid[y][x - 1] != 'air' && grid[y][x - 1] != 'cloner_left' && grid[y][x - 1] != 'cloner_up' && grid[y][x - 1] != 'cloner_right' && grid[y][x - 1] != 'cloner_down') {
                    if (grid[y][x + 1] == 'air') {
                        if (nextGrid[y][x + 1] == null) {
                            nextGrid[y][x + 1] = grid[y][x - 1];
                        }
                    }
                }
            }
        },
        key: 'd',
        updatePriority: 5
    },
    cloner_down: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                if (grid[y - 1][x] != 'air' && grid[y - 1][x] != 'cloner_left' && grid[y - 1][x] != 'cloner_up' && grid[y - 1][x] != 'cloner_right' && grid[y - 1][x] != 'cloner_down') {
                    if (grid[y + 1][x] == 'air') {
                        if (nextGrid[y + 1][x] == null) {
                            nextGrid[y + 1][x] = grid[y - 1][x];
                        }
                    }
                }
            }
        },
        key: 's',
        updatePriority: 5
    },
    super_cloner_left: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                // if(grid[y][x + 1] != 'air'){
                // if(grid[y][x - 1] == 'air'){
                if (nextGrid[y][x - 1] == null) {
                    nextGrid[y][x - 1] = grid[y][x + 1];
                }
                // }
                // }
            }
        },
        key: Infinity,
        updatePriority: 5
    },
    super_cloner_up: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                // if(grid[y + 1][x] != 'air'){
                // if(grid[y - 1][x] == 'air'){
                if (nextGrid[y - 1][x] == null) {
                    nextGrid[y - 1][x] = grid[y + 1][x];
                }
                // }
                // }
            }
        },
        key: Infinity,
        updatePriority: 5
    },
    super_cloner_right: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                // if(grid[y][x - 1] != 'air'){
                // if(grid[y][x + 1] == 'air'){
                if (nextGrid[y][x + 1] == null) {
                    nextGrid[y][x + 1] = grid[y][x - 1];
                }
                // }
                // }
            }
        },
        key: Infinity,
        updatePriority: 5
    },
    super_cloner_down: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(125, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                    fill(255, 255, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                // if(grid[y - 1][x] != 'air'){
                // if(grid[y + 1][x] == 'air'){
                if (nextGrid[y + 1][x] == null) {
                    nextGrid[y + 1][x] = grid[y - 1][x];
                }
                // }
                // }
            }
        },
        key: Infinity,
        updatePriority: 5
    },
    piston_left: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(75, 125, 255, opacity * 255);
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            let validPiston = true;
            updateTouchingPixel(x, y, 1, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                    return;
                }
            });
            if (!validPiston) {
                return;
            }
            let moveX = null;
            for (let i = x; i >= 0; i -= 1) {
                if (grid[y][i] == 'air') {
                    moveX = i;
                    break;
                }
                if (i != x && (grid[y][i] == 'piston_left' || grid[y][i] == 'piston_up' || grid[y][i] == 'piston_right' || grid[y][i] == 'piston_down' || grid[y][i] == 'wall')) {
                    break;
                }
            }
            if (moveX == null) {
                for (let i = x; i >= 0; i -= 1) {
                    if (grid[y][i] == 'collapsible') {
                        moveX = i;
                        break;
                    }
                    if (i != x && (grid[y][i] == 'piston_left' || grid[y][i] == 'piston_up' || grid[y][i] == 'piston_right' || grid[y][i] == 'piston_down' || grid[y][i] == 'wall')) {
                        break;
                    }
                }
            }
            if (moveX != null) {
                let pushable = true;
                for (let i = moveX; i < x; i += 1) {
                    if (nextGrid[y][i + 1] != null) {
                        pushable = false;
                    }
                }
                if (nextGrid[y][x] != null) {
                    pushable = false;
                }
                if (pushable) {
                    for (let i = moveX; i < x; i += 1) {
                        nextGrid[y][i] = grid[y][i + 1];
                    }
                    nextGrid[y][x] = 'air';
                }
            }
            else {
                if (updateTouchingPixel(x, y, 1, 'piston_rotator_up', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_up';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_right', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_right';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_down', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_down';
                        return;
                    }
                }
                if (updateTouchingPixel(x, y, 1, 'shimmer_slime', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_right';
                        return;
                    }
                }
            }
        },
        key: 'j',
        updatePriority: 1
    },
    piston_up: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(75, 125, 255, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            let validPiston = true;
            updateTouchingPixel(x, y, 1, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                    return;
                }
            });
            if (!validPiston) {
                return;
            }
            let moveY = null;
            for (let i = y; i >= 0; i -= 1) {
                if (grid[i][x] == 'air') {
                    moveY = i;
                    break;
                }
                if (i != y && (grid[i][x] == 'piston_left' || grid[i][x] == 'piston_up' || grid[i][x] == 'piston_right' || grid[i][x] == 'piston_down' || grid[i][x] == 'wall')) {
                    break;
                }
            }
            if (moveY == null) {
                for (let i = y; i >= 0; i -= 1) {
                    if (grid[i][x] == 'collapsible') {
                        moveY = i;
                        break;
                    }
                    if (i != y && (grid[i][x] == 'piston_left' || grid[i][x] == 'piston_up' || grid[i][x] == 'piston_right' || grid[i][x] == 'piston_down' || grid[i][x] == 'wall')) {
                        break;
                    }
                }
            }
            if (moveY != null) {
                let pushable = true;
                for (let i = moveY; i < y; i += 1) {
                    if (nextGrid[i + 1][x] != null) {
                        pushable = false;
                    }
                }
                if (nextGrid[y][x] != null) {
                    pushable = false;
                }
                if (pushable) {
                    for (let i = moveY; i < y; i += 1) {
                        nextGrid[i][x] = grid[i + 1][x];
                    }
                    nextGrid[y][x] = 'air';
                }
            }
            else {
                if (updateTouchingPixel(x, y, 1, 'piston_rotator_left', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_left';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_right', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_right';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_down', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_down';
                        return;
                    }
                }
                if (updateTouchingPixel(x, y, 1, 'shimmer_slime', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_down';
                        return;
                    }
                }
            }
        },
        key: 'i',
        updatePriority: 1
    },
    piston_right: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(75, 125, 255, opacity * 255);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            let validPiston = true;
            updateTouchingPixel(x, y, 1, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                    return;
                }
            });
            if (!validPiston) {
                return;
            }
            let moveX = null;
            for (let i = x; i <= gridSize - 1; i += 1) {
                if (grid[y][i] == 'air') {
                    moveX = i;
                    break;
                }
                if (i != x && (grid[y][i] == 'piston_left' || grid[y][i] == 'piston_up' || grid[y][i] == 'piston_right' || grid[y][i] == 'piston_down' || grid[y][i] == 'wall')) {
                    break;
                }
            }
            if (moveX == null) {
                for (let i = x; i <= gridSize - 1; i += 1) {
                    if (grid[y][i] == 'collapsible') {
                        moveX = i;
                        break;
                    }
                    if (i != x && (grid[y][i] == 'piston_left' || grid[y][i] == 'piston_up' || grid[y][i] == 'piston_right' || grid[y][i] == 'piston_down' || grid[y][i] == 'wall')) {
                        break;
                    }
                }
            }
            if (moveX != null) {
                let pushable = true;
                for (let i = moveX; i > x; i -= 1) {
                    if (nextGrid[y][i - 1] != null) {
                        pushable = false;
                    }
                }
                if (nextGrid[y][x] != null) {
                    pushable = false;
                }
                if (pushable) {
                    for (let i = moveX; i > x; i -= 1) {
                        nextGrid[y][i] = grid[y][i - 1];
                    }
                    nextGrid[y][x] = 'air';
                }
            }
            else {
                if (updateTouchingPixel(x, y, 1, 'piston_rotator_left', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_left';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_up', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_up';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_down', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_down';
                        return;
                    }
                }
                if (updateTouchingPixel(x, y, 1, 'shimmer_slime', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_left';
                        return;
                    }
                }
            }
        },
        key: 'l',
        updatePriority: 1
    },
    piston_down: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(75, 125, 255, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
            let validPiston = true;
            updateTouchingPixel(x, y, 1, 'lava', function (actionX, actionY) {
                validPiston = false;
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = 'air';
                    nextGrid[actionY][actionX] = 'air';
                    return;
                }
            });
            if (!validPiston) {
                return;
            }
            let moveY = null;
            for (let i = y; i <= gridSize - 1; i += 1) {
                if (grid[i][x] == 'air') {
                    moveY = i;
                    break;
                }
                if (i != y && (grid[i][x] == 'piston_left' || grid[i][x] == 'piston_up' || grid[i][x] == 'piston_right' || grid[i][x] == 'piston_down' || grid[i][x] == 'wall')) {
                    break;
                }
            }
            if (moveY == null) {
                for (let i = y; i <= gridSize - 1; i += 1) {
                    if (grid[i][x] == 'collapsible') {
                        moveY = i;
                        break;
                    }
                    if (i != y && (grid[i][x] == 'piston_left' || grid[i][x] == 'piston_up' || grid[i][x] == 'piston_right' || grid[i][x] == 'piston_down' || grid[i][x] == 'wall')) {
                        break;
                    }
                }
            }
            if (moveY != null) {
                let pushable = true;
                for (let i = moveY; i > y; i -= 1) {
                    if (nextGrid[i - 1][x] != null) {
                        pushable = false;
                    }
                }
                if (nextGrid[y][x] != null) {
                    pushable = false;
                }
                if (pushable) {
                    for (let i = moveY; i > y; i -= 1) {
                        nextGrid[i][x] = grid[i - 1][x];
                    }
                    nextGrid[y][x] = 'air';
                }
            }
            else {
                if (updateTouchingPixel(x, y, 1, 'piston_rotator_left', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_left';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_up', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_up';
                        return;
                    }
                }
                else if (updateTouchingPixel(x, y, 1, 'piston_rotator_right', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_right';
                        return;
                    }
                }
                if (updateTouchingPixel(x, y, 1, 'shimmer_slime', function (actionX, actionY) { })) {
                    if (nextGrid[y][x] == null) {
                        nextGrid[y][x] = 'piston_up';
                        return;
                    }
                }
            }
        },
        key: 'k',
        updatePriority: 1
    },
    piston_rotator_left: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(225, 255, 0, opacity * 255);
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        key: 'f',
        updatePriority: -1
    },
    piston_rotator_up: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(225, 255, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        key: 't',
        updatePriority: -1
    },
    piston_rotator_right: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(225, 255, 0, opacity * 255);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        key: 'h',
        updatePriority: -1
    },
    piston_rotator_down: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(225, 255, 0, opacity * 255);
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        key: 'g',
        updatePriority: -1
    },
    collapsible: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            if (optimizedLiquids) {
                fill(200, 80, 200, opacity * 255);
                drawPixel(x, y, width, height);
            }
            else {
                fill(255, 90, 200, opacity * 255);
                drawPixel(x, y, width, height);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        fill(255, 255, 255, round(noise((x + i) / 5, (y + j) / 5, animationTime / 20) * 100) * opacity);
                        drawPixel(x + i, y + j, 1, 1);
                    }
                }
            }
        },
        update: function (x, y) {
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'collapsible';
                    }
                }
            }
        },
        key: '0',
        updatePriority: 2
    },
    nuke_diffuser: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(175, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(225, 125, 0, opacity * 255);
                    drawPixel(x + i, y + j, 1 / 3, 1 / 3);
                    drawPixel(x + i + 2 / 3, y + j, 1 / 3, 1 / 3);
                    drawPixel(x + i, y + j + 2 / 3, 1 / 3, 1 / 3);
                    drawPixel(x + i + 2 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        key: '-',
        updatePriority: -1
    },
    wall: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(0, 0, 0, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) { },
        key: '=',
        updatePriority: -1
    },
    lag_spike_generator: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 255, 255, opacity * 255);
                    drawPixel(x + i, y + j, 1, 1);
                    fill(125, 255, 0, (random(225) + 30) * opacity);
                    drawPixel(x + i, y + j, 1, 1);
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, 1, 'air', function (actionX, actionY) {
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
            updateTouchingPixel(x, y, 1, 'lag_spike_generator', function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.005) {
                    nextGrid[actionY][actionX] = 'nuke';
                }
            });
        },
        key: '[',
        updatePriority: 6
    },
    corruption: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    for (let k = 0; k < random(1, 5); k++) {
                        let rotationAmount = floor(random(0, 360));
                        translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                        let translateX = random(-10 * xScale, 10 * xScale);
                        let translateY = random(-10 * yScale, 10 * yScale);
                        translate(translateX, translateY);
                        rotate(rotationAmount);
                        let borkXScale = random(0, 4);
                        let borkYScale = random(0, 2);
                        fill(0, 0, 0, opacity * 255);
                        drawPixel(0, 0, borkXScale, borkYScale);
                        fill(100, 255, 0, (random(155) + 100) * opacity);
                        drawPixel(0, 0, borkXScale, borkYScale);
                        rotate(-rotationAmount);
                        translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                    }
                }
            }
            if (!optimizedLags) {
                for (let i = 0; i < gridSize; i++) {
                    let string = '';
                    let number = 0;
                    let j = 0;
                    while (j < gridSize) {
                        number += 1;
                        if (grid[i][j] != string) {
                            if (string != '' && string != 'air' && number != 0) {
                                if (random() < 0.0001) drawPixels(j - number, i, number, 1, string, 1);
                            }
                            string = grid[i][j];
                            number = 0;
                        }
                        j++;
                    }
                    number += 1;
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
                    nextGrid[actionY][actionX] = 'asdf';
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
            };
            updateTouchingPixel(x, y, 2, 'air', chaos);
            updateTouchingAnything(x, y, 2, chaos);
        },
        key: ']',
        updatePriority: 6
    },
    nuke2: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(100, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'nuke2';
                    }
                }
                if (grid[y + 1][x] == 'water') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'water';
                        nextGrid[y + 1][x] = 'nuke2';
                    }
                }
                if (grid[y + 1][x] == 'lava') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'lava';
                        nextGrid[y + 1][x] = 'nuke2';
                    }
                }
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'water' || grid[y + 1][x] == 'lava' || grid[y + 1][x] == 'nuke') {
                    return;
                }
            }
            else {
                explode(x, y, 10, 1.5);
            }
            if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { })) {
                explode(x, y, 10, 1.5);
            }
        },
        key: Infinity,
        updatePriority: 0
    },
    huge_nuke: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(225, 120, 112, 255 * opacity);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            let explosion = false;
            let diffused = false;
            updateTouchingPixel(x, y, 1, 'nuke_diffuser', function (actionX, actionY) {
                diffused = true;
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'huge_nuke';
                    }
                }
            }
            if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { })) {
                explosion = true;
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'huge_nuke') {
                    explosion = false;
                }
            }
            else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 20, 1.5);
            }
        },
        key: '\\',
        updatePriority: 0
    },
    very_huge_nuke: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 0, 70, 255 * opacity);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            let explosion = false;
            let diffused = false;
            updateTouchingPixel(x, y, 1, 'nuke_diffuser', function (actionX, actionY) {
                diffused = true;
            });
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'very_huge_nuke';
                    }
                }
            }
            if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { })) {
                explosion = true;
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'very_huge_nuke') {
                    explosion = false;
                }
            }
            else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 40, 1.5);
            }
        },
        key: Infinity,
        updatePriority: 0
    },
    spin: {
        draw: function (x, y, width, height, opacity) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                    let translateX = random(-10 * xScale, 10 * xScale);
                    let translateY = random(-10 * yScale, 10 * yScale);
                    translate(translateX, translateY);
                    let rotationAmount = floor(random(0, 360));
                    rotate(rotationAmount);
                }
            }
        },
        update: function (x, y) { },
        key: Infinity,
        updatePriority: -1
    },
    remove: {
        draw: function (x, y, width, height, opacity) {
            noStroke();
            fill(255, 0, 0);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) { },
        key: Infinity,
        updatePriority: -1
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
        for (let j = gridX - clickSize + 1; j <= gridX + clickSize - 1; j++) {
            if (j >= 0 && j <= gridSize - 1) {
                for (let k = gridY - clickSize + 1; k <= gridY + clickSize - 1; k++) {
                    if (k >= 0 && k <= gridSize - 1) {
                        grid[k][j] = remove ? 'air' : clickPixel;
                    }
                }
            }
        }
        x += cos(angle);
        y += sin(angle);
    }
};

function draw() {
    if (mouseIsPressed && (!gridPaused || !simulatePaused)) {
        // lastGrids.push([]);
        // for (let i = 0; i < gridSize; i++) {
        //     lastGrids[lastGrids.length - 1].push([]);
        //     for (let j = 0; j < gridSize; j++) {
        //         lastGrids[lastGrids.length - 1][i].push(grid[i][j]);
        //     }
        // }
        // if (lastGrids.length > 20) {
        //     lastGrids.shift(1);
        // }
        clickLine(floor(mouseX * gridSize / width), floor(mouseY * gridSize / height), floor(pmouseX * gridSize / width), floor(pmouseY * gridSize / height), mouseButton == RIGHT);
    }
    if ((gridPaused && !simulatePaused) || !gridPaused) {
        fill(255, 255, 255, 255 - fadeEffect);
        rect(0, 0, width, height);
        for (let i = 0; i < gridSize; i++) {
            let string = '';
            let number = 0;
            let j = 0;
            while (j < gridSize) {
                number += 1;
                if (grid[i][j] != string) {
                    if (string != '' && string != 'air' && number != 0) {
                        drawPixels(j - number, i, number, 1, string, 1);
                    }
                    string = grid[i][j];
                    number = 0;
                }
                j++;
            }
            number += 1;
            if (string != '') {
                drawPixels(j - number, i, number, 1, string, 1);
            }
        }
    }
    if (gridPaused && runTicks <= 0 && !simulatePaused) {
        frames.push(millis());
    }
    if (!gridPaused || runTicks > 0 || simulatePaused) {
        let max = simulatePaused ? 10 : 1;
        for (let i = 0; i < max; i++) {
            runTicks--;
            if (ticks % 2 == 0) {
                for (let j = 0; j <= 6; j++) {
                    for (let k = 0; k < gridSize; k++) {
                        for (let l = gridSize - 1; l >= 0; l--) {
                            updatePixel(l, k, j);
                        }
                    }
                }
            } else {
                for (let j = 0; j <= 6; j++) {
                    for (let k = 0; k < gridSize; k++) {
                        for (let l = 0; l < gridSize; l++) {
                            updatePixel(l, k, j);
                        }
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
            frames.push(millis());
            ticks++;
        }
    }

    if (!gridPaused || !simulatePaused) {
        let x1 = max(0, floor(mouseX * gridSize / width) - clickSize + 1);
        let x2 = min(gridSize - 1, floor(mouseX * gridSize / width) + clickSize - 1);
        let y1 = max(0, floor(mouseY * gridSize / height) - clickSize + 1);
        let y2 = min(gridSize - 1, floor(mouseY * gridSize / height) + clickSize - 1);
        drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, mouseIsPressed && mouseButton == RIGHT ? 'remove' : clickPixel, 0.5);
    }

    while (frames[0] + 1000 < millis()) {
        frames.shift(1);
    }

    if (gridPaused && simulatePaused) {
        fill(255, 255, 255);
        rect(1, 3, 100, 14);
        if (debugInfo) {
            rect(5, 0, 200, 120);
        }
    }
    fill(0, 0, 0);
    textFont('Arial', 14);
    textAlign(LEFT, TOP);
    text('FPS: ' + frames.length, 3, 1);
    if (lastFpsList + 100 < millis()) {
        lastFpsList = millis();
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
    text('Brush Size: ' + clickSize, width - 3, 1);
    text('Brush Pixel: ' + clickPixel, width - 3, 16);
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

function windowResized() {
    xScale = 600 / gridSize;
    yScale = 600 / gridSize;
    resizeCanvas(600, 600);
    canvasScale = Math.min(window.innerWidth / 600, window.innerHeight / 600);
    document.querySelector('.p5Canvas').style.width = 600 * canvasScale - 20 + 'px';
    document.querySelector('.p5Canvas').style.height = 600 * canvasScale - 20 + 'px';
    if (window.innerWidth - 600 * canvasScale < 200) {
        document.getElementById('sidebar').style.top = Math.min(window.innerWidth, window.innerHeight) + 'px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - 20 + 'px');
    } else {
        document.getElementById('sidebar').style.top = '0px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - 600 * canvasScale - 20 + 'px');
    }
};