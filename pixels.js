// no documentation here!

window.onerror = e => document.write(e);

let gridSize = 100;
let saveCode = '100;air-16:wall:piston_rotator_right:piston_left:air:piston_rotator_left:nuke_diffuser-6:piston_rotator_right:piston_left:air-70:piston_rotator_left:air-16:wall:piston_rotator_right:piston_left:air:piston_rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:piston_rotator_right:piston_left:air-70:piston_rotator_left:air-16:wall:piston_rotator_right:piston_left:air:piston_rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:piston_rotator_right:piston_left:air-70:piston_rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:wall-13:air-3:nuke_diffuser:air-83:wall:lava_generator-11:wall:air-3:nuke_diffuser:{air-83:wall:air-11:wall:air-3:nuke_diffuser:}5|{air-83:wall:air-11:wall:air-4:}7|air-83:{wall:air-99:}52|';
let startPaused = false;
let backgroundColor = 'ffffff';

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
let lastFpsList = -1;
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
            grid[i][j] = 'air';
            nextGrid[i][j] = null;
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
    createCanvas(600, 600);
    frameRate(60);
    noCursor();
    noStroke();

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
        }
        if ((key != 'i' || !e.shiftKey || !e.ctrlKey) && key != 'f11') e.preventDefault();
        if (e.target.matches('button')) e.target.blur();
    };
    document.onkeyup = function (e) {
        if (e.ctrlKey || e.target.matches('#saveCode')) return;
        const key = e.key.toLowerCase();
        if (key == 'alt') {
            debugInfo = !debugInfo;
        } else if (key == 'p') {
            gridPaused = !gridPaused;
            simulatePaused = false;
            updateTimeControlButtons();
        }
        if (key == 'shift') {
            if (gridPaused) simulatePaused = !simulatePaused;
            updateTimeControlButtons();
        }
        e.preventDefault();
    };
    document.querySelector('.p5Canvas').addEventListener('contextmenu', e => e.preventDefault());

    document.getElementById('reset').onclick = function (e) {
        saveCode = document.getElementById('saveCode').value;
        loadSaveCode();
    };
    document.getElementById('copySave').onclick = function (e) {
        let saveCode = generateSaveCode();
        window.navigator.clipboard.writeText(saveCode);
    };
    document.getElementById('uploadSave').onclick = function (e) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.redpixel';
        input.click();
        input.oninput = () => {
            let files = input.files;
            if (files.length == 0) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('saveCode').value = e.target.result;
            };
            reader.readAsText(files[0]);
        };
    };
    document.getElementById('downloadSave').onclick = function (e) {
        const encoded = `data:text/redpixel;base64,${btoa(generateSaveCode())}`;
        const a = document.createElement('a');
        a.href = encoded;
        a.download = `red-pixel-simulator_${Math.ceil(Math.random()*1000)}.redpixel`;
        a.click();
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
            box.onclick = function (e) {
                clickPixel = id;
                pixelPicker.children.forEach(div => div.classList.remove('pickerPixelSelected'));
                box.classList.add('pickerPixelSelected');
                pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[id].name}</span><br>${pixels[id].description}`;
            };
            box.onmouseover = function (e) {
                pixelPickerDescription.innerHTML = `<span style="font-size: 16px; font-weight: bold;">${pixels[id].name}</span><br>${pixels[id].description}`;
            };
            box.onmouseout = function (e) {
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

    document.getElementById('sizeUp').onclick = function (e) {
        clickSize = min(ceil(gridSize / 2 + 1), clickSize + 1);
    };
    document.getElementById('sizeDown').onclick = function (e) {
        clickSize = max(1, clickSize - 1);
    };
    document.getElementById('pause').onclick = function (e) {
        gridPaused = !gridPaused;
        simulatePaused = false;
        updateTimeControlButtons();
    };
    document.getElementById('simulatePaused').onclick = function (e) {
        if (gridPaused) simulatePaused = !simulatePaused;
        updateTimeControlButtons();
    };
    document.getElementById('advanceTick').onclick = function (e) {
        runTicks = 1;
    };

    lastFpsList = millis();
};

function drawPixels(x, y, width, height, type, opacity) {
    if (pixels[type]) {
        pixels[type].draw(x, y, width, height, opacity);
    } else {
        pixels['missing'].draw(x, y, width, height, opacity);
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
function updateTouchingPixel(x, y, type, action) {
    let touchingPixel = false;
    if (x > 0 && grid[y][x - 1] == type) {
        typeof action == 'function' && action(x - 1, y);
        touchingPixel = true;
    }
    if (x < gridSize - 1 && grid[y][x + 1] == type) {
        typeof action == 'function' && action(x + 1, y);
        touchingPixel = true;
    }
    if (y > 0 && grid[y - 1][x] == type) {
        typeof action == 'function' && action(x, y - 1);
        touchingPixel = true;
    }
    if (y < gridSize - 1 && grid[y + 1][x] == type) {
        typeof action == 'function' && action(x, y + 1);
        touchingPixel = true;
    }
    return touchingPixel;
};
function updateTouchingAnything(x, y, action) {
    let touchingPixel = false;
    if (x > 0 && grid[y][x - 1] != 'air') {
        typeof action == 'function' && action(x - 1, y);
        touchingPixel = true;
    }
    if (x < gridSize - 1 && grid[y][x + 1] != 'air') {
        typeof action == 'function' && action(x + 1, y);
        touchingPixel = true;
    }
    if (y > 0 && grid[y - 1][x] != 'air') {
        typeof action == 'function' && action(x, y - 1);
        touchingPixel = true;
    }
    if (y < gridSize - 1 && grid[y + 1][x] != 'air') {
        typeof action == 'function' && action(x, y + 1);
        touchingPixel = true;
    }
    return touchingPixel;
};
function validMovingPixel(x, y) {
    return nextGrid[y][x] == null;
};
function isPassableFluid(x, y) {
    return grid[y][x] == 'air' || grid[y][x] == 'water';
};
function canMoveTo(x, y) {
    return nextGrid[y][x] == null || nextGrid[y][x] == 'air';
};
function move(x1, y1, x2, y2) {
    nextGrid[y1][x1] = grid[y2][x2];
    nextGrid[y2][x2] = grid[y1][x1];
};
function explode(x, y, size) {
    nextGrid[y][x] = 'air';
    grid[y][x] = 'wall';
    for (let i = -size; i <= size; i++) {
        for (let j = -size; j <= size; j++) {
            if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
                if (random() < 1 - (dist(x, y, x + i, y + j) / (size * 1.2))) {
                    nextGrid[y + j][x + i] = 'air';
                }
            }
        }
    }
};
function colorLerp(r1, g1, b1, r2, g2, b2, p) {
    return [
        (r1 * (Math.sin(animationTime * Math.PI / p) + 1) / 2) + (r2 * (Math.sin((animationTime + p) * Math.PI / p) + 1) / 2),
        (g1 * (Math.sin(animationTime * Math.PI / p) + 1) / 2) + (g2 * (Math.sin((animationTime + p) * Math.PI / p) + 1) / 2),
        (b1 * (Math.sin(animationTime * Math.PI / p) + 1) / 2) + (b2 * (Math.sin((animationTime + p) * Math.PI / p) + 1) / 2),
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
        draw: function (x, y, width, height, opacity) { },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: false
    },
    dirt: {
        name: 'Dirt',
        description: 'Wash your hands after handling it, it\'s pretty dirty',
        draw: function (x, y, width, height, opacity) {
            fill(125, 75, 0, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y < gridSize - 1) {
                if ((grid[y + 1][x] == 'air' || grid[y + 1][x] == 'water') && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else if (y < gridSize - 2) {
                    let slideLeft = x > 0 && (grid[y][x - 1] == 'air') && isPassableFluid(x - 1, y + 1) && isPassableFluid(x - 1, y + 2);
                    let slideRight = x < gridSize - 1 && (grid[y][x + 1] == 'air') && isPassableFluid(x + 1, y + 1) && isPassableFluid(x + 1, y + 2);
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
        pickable: true
    },
    grass: {
        name: 'Grass',
        description: 'Go touch some',
        draw: function (x, y, width, height, opacity) {
            fill(25, 175, 25, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let dead = random() < 0.1;
            if (dead) updateTouchingPixel(x, y, 'air', function (actionX, actionY) {
                if (actionY <= y) dead = false;
            });
            if (dead) {
                nextGrid[y][x] = 'dirt';
                return;
            }
            for (let i = Math.max(y - 1, 0); i <= Math.min(y + 1, gridSize - 1); i++) {
                for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, gridSize - 1); j++) {
                    if (grid[i][j] == 'dirt' && (i != y || j != x)) {
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
                if ((grid[y + 1][x] == 'air' || grid[y + 1][x] == 'water') && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else if (y < gridSize - 2) {
                    let slideLeft = x > 0 && (grid[y][x - 1] == 'air') && isPassableFluid(x - 1, y + 1) && isPassableFluid(x - 1, y + 2);
                    let slideRight = x < gridSize - 1 && (grid[y][x + 1] == 'air') && isPassableFluid(x + 1, y + 1) && isPassableFluid(x + 1, y + 2);
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
        pickable: true
    },
    sand: {
        name: 'Sand',
        description: 'Weird yellow powdery stuff that falls',
        draw: function (x, y, width, height, opacity) {
            fill(255, 225, 125, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y < gridSize - 1) {
                if ((grid[y + 1][x] == 'air' || grid[y + 1][x] == 'water') && canMoveTo(x, y + 1)) {
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
        pickable: true
    },
    water: {
        name: 'Water',
        description: 'Unrealistically flows and may or may not be wet',
        draw: function (x, y, width, height, opacity) {
            if (optimizedLiquids) {
                fill(75, 100, 255, opacity * 255);
                drawPixel(x, y, width, height);
            } else {
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        fill(100, 175, 255, opacity * 255);
                        drawPixel(x + i, y + j, 1, 1);
                        fill(75, 50, 255, round(noise((x + i) / 4, (y + j) / 4, animationTime / 10) * 127) * opacity + 30);
                        drawPixel(x + i, y + j, 1, 1);
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
        pickable: true
    },
    lava: {
        name: 'Lava',
        description: 'Try not to get burned, it also melts concrete and other things',
        draw: function (x, y, width, height, opacity) {
            if (optimizedLiquids) {
                fill(255, 125, 0, opacity * 255);
                drawPixel(x, y, width, height);
            } else {
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        fill(255, 0, 0, opacity * 255);
                        drawPixel(x + i, y + j, 1, 1);
                        fill(255, 255, 0, round(noise((x + i) / 6, (y + j) / 6, animationTime / 30) * 255) * opacity);
                        drawPixel(x + i, y + j, 1, 1);
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
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air') {
                    if (nextGrid[y][x] == null && nextGrid[y + 1][x] == null && random() < 0.5) {
                        nextGrid[y][x] = 'air';
                        nextGrid[y + 1][x] = 'lava';
                    }
                } else {
                    let validSlidingPositions = [];
                    let leftX = 0;
                    while (x + leftX > 0) {
                        if (grid[y][x + leftX - 1] == 'air' || grid[y][x + leftX - 1] == 'concrete') {
                            if (grid[y + 1][x + leftX - 1] == 'air') {
                                validSlidingPositions.push(leftX - 1);
                                break;
                            }
                        } else {
                            break;
                        }
                        leftX--;
                    }
                    let rightX = 0;
                    while (x + rightX < gridSize - 1) {
                        if (grid[y][x + rightX + 1] == 'air' || grid[y][x + rightX + 1] == 'concrete') {
                            if (grid[y + 1][x + rightX + 1] == 'air') {
                                validSlidingPositions.push(rightX + 1);
                                break;
                            }
                        } else {
                            break;
                        }
                        rightX++;
                    }
                    if (validSlidingPositions.length > 0) {
                        let slidePosition;
                        for (let i = 0; i < validSlidingPositions.length; i++) {
                            if (slidePosition == undefined) {
                                slidePosition = validSlidingPositions[i];
                            } else if (abs(validSlidingPositions[i]) < abs(slidePosition)) {
                                slidePosition = validSlidingPositions[i];
                            } else if (abs(validSlidingPositions[i]) == abs(slidePosition)) {
                                if (random() < 0.5) {
                                    slidePosition = validSlidingPositions[i];
                                }
                            }
                        }
                        if (nextGrid[y][x] == null && random() < 0.5) {
                            if (slidePosition == -1 && nextGrid[y + 1][x + slidePosition] == null) {
                                nextGrid[y][x] = 'air';
                                nextGrid[y + 1][x + slidePosition] = 'lava';
                            } else if (slidePosition == 1 && nextGrid[y + 1][x + slidePosition] == null) {
                                nextGrid[y][x] = 'air';
                                nextGrid[y + 1][x + slidePosition] = 'lava';
                            } else if (nextGrid[y][x + slidePosition / abs(slidePosition)] == null) {
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
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 3,
        pickable: true
    },
    concrete_powder: {
        name: 'Concrete Powder',
        description: 'Like sand, but hardens into concrete when in contact with water',
        draw: function (x, y, width, height, opacity) {
            fill(150, 150, 150, opacity * 255);
            drawPixel(x, y, width, height);
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
                if ((grid[y + 1][x] == 'air' || grid[y + 1][x] == 'water') && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                } else if (y < gridSize - 2) {
                    let slideLeft = x > 0 && (grid[y][x - 1] == 'air') && isPassableFluid(x - 1, y + 1) && isPassableFluid(x - 1, y + 2);
                    let slideRight = x < gridSize - 1 && (grid[y][x + 1] == 'air') && isPassableFluid(x + 1, y + 1) && isPassableFluid(x + 1, y + 2);
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
        pickable: true
    },
    concrete: {
        name: 'Concrete',
        description: 'Hard stuff that doesn\'t move easily',
        draw: function (x, y, width, height, opacity) {
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
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 75, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: 3,
        pickable: true
    },
    nuke: {
        name: 'Nuke',
        description: 'TBH, kinda weak',
        draw: function (x, y, width, height, opacity) {
            fill(100, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, 'nuke_diffuser');
            if (y < gridSize - 1 && grid[y + 1][x] == 'air' && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'nuke') {
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
        pickable: true
    },
    plant: {
        name: 'P.L.A.N.T.',
        description: '<span style="font-style: italic;">Persistent Loud Aesthetic Nail Tables.</span><br>No, it doesn\'t actually stand for anything. But it does consume concrete alarmingly fast',
        draw: function (x, y, width, height, opacity) {
            fill(125, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
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
        pickable: true
    },
    sponge: {
        name: 'S.P.O.N.G.E.',
        description: '<span style="font-style: italic;">Sample Providing Oceanic Nucleolic Green Egg</span><br>Don\'t ask',
        draw: function (x, y, width, height, opacity) {
            fill(225, 255, 75, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            updateTouchingPixel(x, y, 'water', function (actionX, actionY) {
                nextGrid[y][x] = 'air';
                nextGrid[actionY][actionX] = 'sponge';
            });
            let validSponge = false;
            if (y < gridSize - 1) {
                if ((grid[y + 1][x] == 'air' || (grid[y + 1][x] == 'lava' && random() < 0.25)) && canMoveTo(x, y + 1)) {
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
        pickable: true
    },
    pump: {
        name: 'Water Pump',
        description: 'Violates the Laws of Thermodynamics to create water',
        draw: function (x, y, width, height, opacity) {
            fill(25, 125, 75, opacity * 255);
            drawPixel(x, y, width, height);
            fill(75, 100, 255, opacity * 255);
            drawPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3);
            fill(25, 125, 75, opacity * 255);
            for (let i = 0; i < width - 1; i++) {
                drawPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3)
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
            ctx.fillRect(50/3, 50/3, 50/3, 50/3);
        },
        key: Infinity,
        updatePriority: 4,
        pickable: true
    },
    lava_generator: {
        name: 'Lava Heater',
        description: 'Violates the Laws of Thermodynamics to create lava',
        draw: function (x, y, width, height, opacity) {
            fill(25, 125, 75, opacity * 255);
            drawPixel(x, y, width, height);
            fill(255, 125, 0, opacity * 255);
            drawPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3);
            fill(25, 125, 75, opacity * 255);
            for (let i = 0; i < width - 1; i++) {
                drawPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3)
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
            ctx.fillRect(50/3, 50/3, 50/3, 50/3);
        },
        key: Infinity,
        updatePriority: 4,
        pickable: true
    },
    cloner_up: {
        name: 'Cloner (Up)',
        description: 'Copies stuff from below it to above it',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: true
    },
    cloner_down: {
        name: 'Cloner (Down)',
        description: 'Copies stuff from above it to below it',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: true
    },
    cloner_right: {
        name: 'Cloner (Right)',
        description: 'Copies stuff from its left to its right',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: true
    },
    cloner_left: {
        name: 'Cloner (Left)',
        description: 'Copies stuff from its right to its left',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: true
    },
    super_cloner_up: {
        name: 'Super Cloner (Up)',
        description: 'Copies stuff from below it to above it, removing whatever was previously there',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: false
    },
    super_cloner_down: {
        name: 'Super Cloner (Down)',
        description: 'Copies stuff from above it to below it, removing whatever was previously there',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: false
    },
    super_cloner_left: {
        name: 'Super Cloner (Left)',
        description: 'Copies stuff from its right to its left, removing whatever was previously there',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: false
    },
    super_cloner_right: {
        name: 'Super Cloner (Right)',
        description: 'Copies stuff from its left to its right, removing whatever was previously there',
        draw: function (x, y, width, height, opacity) {
            fill(100, 100, 100, opacity * 255);
            drawPixel(x, y, width, height);
            fill(0, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
            fill(255, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) {
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
        pickable: false
    },
    piston_up: {
        name: 'Piston (Up)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity) {
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            fill(75, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
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
                if (updateTouchingPixel(x, y, 'piston_rotator_left', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_left';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_right', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_right';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_down', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_down';
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 1,
        pickable: true
    },
    piston_down: {
        name: 'Piston (Down)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity) {
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            fill(75, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
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
                if (updateTouchingPixel(x, y, 'piston_rotator_left', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_left';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_right', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_right';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_up', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_up';
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        key: 'k',
        updatePriority: 1,
        pickable: true
    },
    piston_left: {
        name: 'Piston (Left)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity) {
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            fill(75, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
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
                if (updateTouchingPixel(x, y, 'piston_rotator_right', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_right';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_up', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_up';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_down', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_down';
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 1,
        pickable: true
    },
    piston_right: {
        name: 'Piston (Right)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity) {
            fill(75, 255, 255, opacity * 255);
            drawPixel(x, y, width, height);
            fill(75, 125, 255, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
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
                if (updateTouchingPixel(x, y, 'piston_rotator_left', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_left';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_up', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_up';
                } else if (updateTouchingPixel(x, y, 'piston_rotator_down', function (actionX, actionY) { })) {
                    nextGrid[y][x] = 'piston_down';
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: 1,
        pickable: true
    },
    piston_rotator_left: {
        name: 'Piston Rotator (Left)',
        description: 'Rotates stationary pistons in contact with it to face left',
        draw: function (x, y, width, height, opacity) {
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(225, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: true
    },
    piston_rotator_up: {
        name: 'Piston Rotator (Up)',
        description: 'Rotates stationary pistons in contact with it to face up',
        draw: function (x, y, width, height, opacity) {
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(225, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: true
    },
    piston_rotator_right: {
        name: 'Piston Rotator (Right)',
        description: 'Rotates stationary pistons in contact with it to face right',
        draw: function (x, y, width, height, opacity) {
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(225, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: true
    },
    piston_rotator_down: {
        name: 'Piston Rotator (Down)',
        description: 'Rotates stationary pistons in contact with it to face down',
        draw: function (x, y, width, height, opacity) {
            fill(255, 125, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(225, 255, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: true
    },
    slider_horizontal: {
        name: 'Horizontal Slider',
        description: 'Can only be pushed left and right',
        draw: function (x, y, width, height, opacity) {
            fill(255, 180, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(200, 100, 0, opacity * 255);
            for (let i = 0; i < height; i++) {
                drawPixel(x, y + i + 1 / 4, width, 1 / 2);
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
        pickable: true
    },
    slider_vertical: {
        name: 'Vertical Slider',
        description: 'Can only be pushed up and down',
        draw: function (x, y, width, height, opacity) {
            fill(250, 180, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(200, 100, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                drawPixel(x + i + 1 / 4, y, 1 / 2, height);
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
        pickable: true
    },
    collapsible: {
        name: 'Collapsible Box',
        description: 'A box that will disintegrate when squished',
        draw: function (x, y, width, height, opacity) {
            if (optimizedLiquids) {
                fill(255, 120, 210, opacity * 255);
                drawPixel(x, y, width, height);
            } else {
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
        pickable: true
    },
    nuke_diffuser: {
        name: 'Nuke Diffuser',
        description: 'Doesn\'t cause diffusion, but will defuse nukes touching it',
        draw: function (x, y, width, height, opacity) {
            fill(175, 50, 0, opacity * 255);
            drawPixel(x, y, width, height);
            fill(225, 125, 0, opacity * 255);
            for (let i = 0; i < width; i++) {
                drawPixel(x + i + 1 / 3, y, 1 / 3, height);
            }
            for (let i = 0; i < height; i++) {
                drawPixel(x, y + i + 1 / 3, width, 1 / 3);
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
        pickable: true
    },
    wall: {
        name: 'Wall',
        description: 'An immovable wall',
        draw: function (x, y, width, height, opacity) {
            fill(0, 0, 0, opacity * 255);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: true
    },
    laser_up: {
        name: "L.A.S.E.R. (Up)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Upwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity) {
            fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height);
            fill(...colorLerp(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 3 + i, y + j, 1 / 3, 1 / 2);
                }
            }
            fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < width; i++) {
                let endY = y;
                while (endY >= 0) {
                    endY--;
                    if (endY >= 0 && grid[endY][x + i] != 'air') break;
                }
                drawPixel(x + 1 / 3 + i, endY + 1, 1 / 3, y - endY - 1);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeY = y;
                while (removeY > 0) {
                    removeY--;
                    if (grid[removeY][x] != 'air') {
                        nextGrid[removeY][x] = 'air';
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
        pickable: true
    },
    laser_down: {
        name: "L.A.S.E.R. (Down)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Downwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity) {
            fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height);
            fill(...colorLerp(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 3 + i, y + 1 / 2 + j, 1 / 3, 1 / 2);
                }
            }
            fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < width; i++) {
                let endY = y;
                while (endY < gridSize) {
                    endY++;
                    if (endY < gridSize && grid[endY][x + i] != 'air') break;
                }
                drawPixel(x + 1 / 3 + i, y + 1, 1 / 3, endY - y - 1);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeY = y;
                while (removeY < gridSize - 1) {
                    removeY++;
                    if (grid[removeY][x] != 'air') {
                        nextGrid[removeY][x] = 'air';
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
        pickable: true
    },
    laser_left: {
        name: "L.A.S.E.R. (Left)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Leftwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity) {
            fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height);
            fill(...colorLerp(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + 1 / 3 + j, 1 / 2, 1 / 3);
                }
            }
            fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < height; i++) {
                let endX = x;
                while (endX >= 0) {
                    endX--;
                    if (grid[y + i][endX] != 'air') break;
                }
                drawPixel(endX + 1, y + 1 / 3 + i, x - endX - 1, 1 / 3);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeX = x;
                while (removeX > 0) {
                    removeX--;
                    if (grid[y][removeX] != 'air') {
                        nextGrid[y][removeX] = 'air';
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
        pickable: true
    },
    laser_right: {
        name: "L.A.S.E.R. (Right)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Rightwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity) {
            fill(90, 0, 120, opacity * 255);
            drawPixel(x, y, width, height);
            fill(...colorLerp(255, 0, 144, 60, 112, 255, 18), opacity * 255);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 2 + i, y + 1 / 3 + j, 1 / 2, 1 / 3);
                }
            }
            fill(71, 216, 159, opacity * 255);
            for (let i = 0; i < height; i++) {
                let endX = x;
                while (endX < gridSize) {
                    endX++;
                    if (grid[y + i][endX] != 'air') break;
                }
                drawPixel(x + 1, y + 1 / 3 + i, endX - x - 1, 1 / 3);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeX = x;
                while (removeX < gridSize - 1) {
                    removeX++;
                    if (grid[y][removeX] != 'air') {
                        nextGrid[y][removeX] = 'air';
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
        pickable: true
    },
    lag_spike_generator: {
        name: 'lag_spike_generator',
        description: 'Not that laggy',
        draw: function (x, y, width, height, opacity) {
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
        pickable: true
    },
    corruption: {
        name: '�',
        description: '<span style="color: red">�</span>',
        draw: function (x, y, width, height, opacity) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    for (let k = 0; k < random(1, 5); k++) {
                        let rotationAmount = floor(random(0, 360));
                        translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                        let translateX = random(-10 * xScale, 10 * xScale);
                        let translateY = random(-10 * yScale, 10 * yScale);
                        let skewX = random(-PI / 6, PI / 6);
                        let skewY = random(-PI / 6, PI / 6);
                        translate(translateX, translateY);
                        rotate(rotationAmount);
                        shearX(skewX);
                        shearY(skewY);
                        let borkXScale = random(0, 4);
                        let borkYScale = random(0, 2);
                        fill(0, 0, 0, opacity * 255);
                        drawPixel(0, 0, borkXScale, borkYScale);
                        fill(100, 255, 0, (random(155) + 100) * opacity);
                        drawPixel(0, 0, borkXScale, borkYScale);
                        shearY(-skewY);
                        shearX(-skewX);
                        rotate(-rotationAmount);
                        translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                    }
                    if (random(1, 5) < 1.2) {
                        for (let k = 0; k < random(1, 10); k++) {
                            let rotationAmount = floor(random(0, 360));
                            translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                            let translateX = random(-20 * xScale, 20 * xScale);
                            let translateY = random(-20 * yScale, 20 * yScale);
                            translate(translateX, translateY);
                            rotate(rotationAmount);
                            drawPixels(0, 0, 1, 1, 'missing', opacity);
                            rotate(-rotationAmount);
                            translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                        }
                        let rotationAmount = floor(random(0, 360));
                        translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                        let translateX = random(-gridSize * xScale, gridSize * xScale);
                        let translateY = random(-gridSize * yScale, gridSize * yScale);
                        let skewX = random(-PI / 6, PI / 6);
                        let skewY = random(-PI / 6, PI / 6);
                        translate(translateX, translateY);
                        rotate(rotationAmount);
                        shearX(skewX);
                        shearY(skewY);
                        fill(255, 0, 0, opacity * 255);
                        rect(0, 0, 90, 90);
                        fill(255, 255, 0, opacity * 255);
                        rect(10, 10, 70, 70);
                        fill(255, 0, 0, opacity * 255);
                        rect(40, 20, 10, 30);
                        rect(40, 60, 10, 10);
                        shearY(-skewY);
                        shearX(-skewX);
                        rotate(-rotationAmount);
                        translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                    }
                }
            }
            if (!optimizedLags) {
                for (let i = 0; i < gridSize; i++) {
                    stroke(color(255, 255, 255, 255));
                    noStroke();
                    cursor();
                    noCursor();
                    fill(color(255, 255, 255, 255));
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
        pickable: true
    },
    huge_nuke: {
        name: 'Huge Nuke',
        description: 'KABOOM!',
        draw: function (x, y, width, height, opacity) {
            fill(100, 60, 255, 255 * opacity);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, 'nuke_diffuser');
            if (y < gridSize - 1 && grid[y + 1][x] == 'air' && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'huge_nuke') {
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
        pickable: true
    },
    very_huge_nuke: {
        name: 'Very Huge Nuke',
        description: 'AAAAAAAAAAAAAAAAAAAAA',
        draw: function (x, y, width, height, opacity) {
            fill(255, 0, 70, 255 * opacity);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, 'nuke_diffuser');
            if (y < gridSize - 1 && grid[y + 1][x] == 'air' && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (grid[y + 1][x] == 'air' || grid[y + 1][x] == 'very_huge_nuke') {
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
        pickable: true
    },
    spin: {
        name: 'Spin',
        description: 'SPINNY CARRIER GO WEEEEEEEEEEEEEEEEEEEEEEEEE!!',
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
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: false
    },
    remove: {
        name: "Remove (brush only)",
        description: `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&rel=0&controls=0&disablekb=1" width=${window.innerWidth} height=${window.innerHeight} style="position: absolute; top: -2px; left: -2px; pointer-events: none;"></iframe><div style="position: absolute; top: 0px, left: 0px; width: 100vw; height: 100vh; z-index: 100;"></div>`,
        draw: function (x, y, width, height, opacity) {
            fill(255, 0, 0);
            drawPixel(x, y, width, height);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        key: Infinity,
        updatePriority: -1,
        pickable: false
    },
    missing: {
        name: 'Missing Pixel',
        description: 'Check your save code, it probably has pixels that don\'t exist in it',
        draw: function (x, y, width, height, opacity) {
            fill(0, 0, 0, opacity * 255);
            drawPixel(x, y, width, height);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fill(255, 0, 255, opacity * 255);
                    drawPixel(x + i, y + j, 1 / 2, 1 / 2);
                    drawPixel(x + 1 / 2 + i, y + 1 / 2 + j, 1 / 2, 1 / 2);
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
    // place pixels
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
        let x = floor(mouseX * gridSize / width);
        let y = floor(mouseY * gridSize / height);
        if (x >= 0 && x <= gridSize && y >= 0 && y <= gridSize) clickLine(x, y, floor(pmouseX * gridSize / width), floor(pmouseY * gridSize / height), mouseButton == RIGHT);
    }
    // draw pixels
    if ((gridPaused && !simulatePaused) || !gridPaused || animationTime % 20 == 0) {
        let r = parseInt(backgroundColor.substring(0, 2), 16);
        let g = parseInt(backgroundColor.substring(2, 4), 16);
        let b = parseInt(backgroundColor.substring(4, 6), 16);
        fill(r, g, b, 255 - fadeEffect);
        rect(0, 0, width, height);
        for (let i = 0; i < gridSize; i++) {
            let string = '';
            let number = 0;
            let j = 0;
            while (j < gridSize) {
                number++;
                if (grid[i][j] != string) {
                    if (string != '' && string != 'air' && number != 0) {
                        drawPixels(j - number, i, number, 1, string, 1);
                    }
                    string = grid[i][j];
                    number = 0;
                }
                j++;
            }
            number++;
            if (string != '') {
                drawPixels(j - number, i, number, 1, string, 1);
            }
        }
    }
    if (gridPaused && runTicks <= 0 && !simulatePaused) {
        frames.push(millis());
    }
    // draw brush
    if (!gridPaused || !simulatePaused) {
        stroke(color(0, 0, 0));
        let x1 = max(0, floor(mouseX * gridSize / width) - clickSize + 1);
        let x2 = min(gridSize - 1, floor(mouseX * gridSize / width) + clickSize - 1);
        let y1 = max(0, floor(mouseY * gridSize / height) - clickSize + 1);
        let y2 = min(gridSize - 1, floor(mouseY * gridSize / height) + clickSize - 1);
        drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, mouseIsPressed && mouseButton == RIGHT ? 'remove' : clickPixel, 0.5);
        noStroke();
    }

    // simulate pixels
    if (!gridPaused || runTicks > 0 || simulatePaused) {
        let max = simulatePaused ? 10 : 1;
        for (let i = 0; i < max; i++) {
            runTicks--;
            /*
            update priority:
            0: nukes, plants, sponges, and lasers
            1: pistons
            2: gravity pixels
            3: liquids and concrete
            4: pumps and cloners
            5: lag
            */
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
    xScale = 600 / gridSize;
    yScale = 600 / gridSize;
    resizeCanvas(600, 600);
    canvasScale = Math.min(window.innerWidth / 600, window.innerHeight / 600);
    document.querySelector('.p5Canvas').style.width = 600 * canvasScale - 20 + 'px';
    document.querySelector('.p5Canvas').style.height = 600 * canvasScale - 20 + 'px';
    if (window.innerWidth - 600 * canvasScale < 300) {
        document.getElementById('sidebar').style.top = Math.min(window.innerWidth, window.innerHeight) + 'px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - 20 + 'px');
        let pickerWidth = (Math.round((window.innerWidth - 20) / 62) - 1) * 62;
        document.getElementById('pixelPicker').style.width = pickerWidth + 'px';
        document.getElementById('pixelPickerDescription').style.width = pickerWidth - 14 + 'px';
    } else {
        document.getElementById('sidebar').style.top = '0px';
        document.body.style.setProperty('--max-sidebar-width', window.innerWidth - 600 * canvasScale - 20 + 'px');
        let pickerWidth = (Math.round((window.innerWidth - 600 * canvasScale - 20) / 62) - 1) * 62;
        document.getElementById('pixelPicker').style.width = pickerWidth + 'px';
        document.getElementById('pixelPickerDescription').style.width = pickerWidth - 14 + 'px';
    }
};