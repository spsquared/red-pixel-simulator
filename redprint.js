// Copyright (C) 2024 Sampleprovider(sp)

const redPrints = new Function(`try { return JSON.parse(window.localStorage.getItem('redprints') ?? '[]'); } catch { return JSON.parse(LZString.decompressFromBase64(window.localStorage.getItem('redprints'))); }`)();

// canvas
const rpCanvasRes = 500;
const rpCanvas = document.getElementById('rpCanvas');
const rpDCanvas = createCanvas();
const rpCtx = rpCanvas.getContext('2d');
const rpDCtx = rpDCanvas.getContext('2d');
function rpResetCanvases() {
    rpCanvas.width = rpCanvasRes;
    rpCanvas.height = rpCanvasRes;
    rpDCanvas.width = canvasResolution;
    rpDCanvas.height = canvasResolution;
    rpCtx.imageSmoothingEnabled = false;
    rpCtx.webkitImageSmoothingEnabled = false;
    rpCtx.mozImageSmoothingEnabled = false;
    rpDCtx.imageSmoothingEnabled = false;
    rpDCtx.webkitImageSmoothingEnabled = false;
    rpDCtx.mozImageSmoothingEnabled = false;
};
rpCanvas.addEventListener('mousedown', e => e.button == 1 && e.preventDefault());
rpCanvas.addEventListener('contextmenu', e => e.preventDefault());
rpCanvas.addEventListener('wheel', e => e.preventDefault());

// grid
let rpGridWidth = 0;
let rpGridHeight = 0;
let rpGridScale = rpCanvasRes / Math.max(rpGridWidth, rpGridHeight);
let rpCanvasSize = 0;
let rpCanvasScale = rpCanvasRes / rpCanvasSize;
const rpGrid = [];
const rpGridHistory = [];

// camera and brush
let rpMX = 0;
let rpMY = 0;
let rpMXGrid = 0;
let rpMYGrid = 0;
let rpPrevMX = 0;
let rpPrevMY = 0;
let rpPrevMXGrid = 0;
let rpPrevMYGrid = 0;
let rpMouseOver = false;
const rpCamera = {
    x: 0,
    y: 0,
    scale: 1,
    mUp: false,
    mDown: false,
    mLeft: false,
    mRight: false,
    lastX: 0,
    lastY: 0,
    lastScale: 1
};
const rpSelection = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    grid: [],
    show: false
};

function createRPGrid(w, h) {
    if (w < 1 || h < 1) return;
    rpGridWidth = w;
    rpGridHeight = h;
    rpGWInput.value = rpGridWidth;
    rpGHInput.value = rpGridHeight;
    rpGridScale = rpCanvasRes / Math.max(rpGridWidth, rpGridHeight);
    rpSelection.show = false;
    rpGrid.length = 0;
    for (let i = 0; i < rpGridHeight; i++) {
        rpGrid[i] = [];
        for (let j = 0; j < rpGridWidth; j++) {
            rpGrid[i][j] = pixNum.AIR;
        }
    }
};
function resizeRPGrid(w, h) {
    if (w < 1 || h < 1) return;
    rpGridWidth = w;
    rpGridHeight = h;
    rpGridScale = rpCanvasRes / Math.max(rpGridWidth, rpGridHeight);
    rpSelection.show = false;
    rpGrid.length = rpGridHeight;
    for (let i = 0; i < rpGridHeight; i++) {
        if (rpGrid[i] == undefined) {
            rpGrid[i] = [];
            for (let j = 0; j < rpGridWidth; j++) {
                rpGrid[i][j] = pixNum.AIR;
            }
        } else {
            for (let j = rpGrid[i].length; j < rpGridWidth; j++) {
                rpGrid[i][j] = pixNum.AIR;
            }
            rpGrid[i].length = rpGridWidth;
        }
    }
};
function loadRPCode(rpCode) {
    let sections = rpCode.split(';');
    if (isNaN(parseInt(sections[0])) || isNaN(parseInt(sections[1]))) return;
    createRPGrid(parseInt(sections[0]), parseInt(sections[1]));
    let x = 0;
    let y = 0;
    let i = 0;
    function addPixels(pixel, amount) {
        let pixelTypeNum = pixNum[pixel.toUpperCase()];
        while (amount > 0) {
            rpGrid[y][x++] = pixelTypeNum;
            if (x == rpGridWidth) {
                y++;
                x = 0;
                if (y == rpGridHeight) return true;
            }
            amount--;
        }
        return false;
    };
    let code = sections[2];
    load: while (i < code.length) {
        let nextDash = code.indexOf('-', i);
        let nextColon = code.indexOf(':', i);
        if (nextDash == -1) nextDash = Infinity;
        if (nextColon == -1) nextColon = Infinity;
        let minNext = Math.min(nextDash, nextColon);
        if (minNext == Infinity) break load;
        if (minNext == nextDash) {
            let pixel = code.substring(i, nextDash);
            let amount = parseInt(code.substring(nextDash + 1, nextColon));
            if (addPixels(pixel, amount)) break load;
            i = nextColon + 1;
        } else if (nextColon >= 0) {
            let pixel = code.substring(i, nextColon);
            if (addPixels(pixel, 1)) break load;
            i = nextColon + 1;
        } else {
            break load;
        }
    }

};
function generateRPCode() {
    let rpCode = `${rpGridWidth};${rpGridHeight};`;
    let pixel = null;
    let amount = 0;
    for (let i = 0; i < rpGridHeight; i++) {
        for (let j = 0; j < rpGridWidth; j++) {
            amount++;
            if (rpGrid[i][j] != pixel) {
                if (pixel != null && amount != 0) {
                    if (amount == 1) {
                        rpCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}:`;
                    } else {
                        rpCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}-${amount}:`;
                    }
                }
                pixel = rpGrid[i][j];
                amount = 0;
            }
        }
    }
    amount++;
    if (pixel != null) {
        if (amount == 1) {
            rpCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}:`;
        } else {
            rpCode += `${(numPixels[pixel] ?? numPixels[pixNum.MISSING]).id}-${amount}:`;
        }
    }
    return rpCode;
};

// draw
function rpDraw() {
    if (inMenuScreen || inWinScreen) return;

    // reset
    rpCtx.clearRect(0, 0, rpCanvasRes, rpCanvasRes);
    rpDCtx.clearRect(0, 0, canvasResolution, canvasResolution);
    rpCtx.resetTransform();
    rpCtx.globalAlpha = 1;

    // draw grid onto transfer canvas and cheat while doing it
    for (let i in numPixels) {
        numPixels[i].rectangles.length = 0;
    }
    let scale = rpCamera.scale * rpGridScale;
    let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
    let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
    for (let i = 0; i < rpGridHeight; i++) {
        let curr = pixNum.AIR;
        let amount = 0;
        for (let j = 0; j < rpGridWidth; j++) {
            amount++;
            if (rpGrid[i][j] != curr) {
                if (curr != pixNum.AIR) numPixels[curr].rectangles.push([j - amount, i, amount, 1, true]);
                curr = rpGrid[i][j];
                amount = 0;
            }
        }
        if (curr != pixNum.AIR) numPixels[curr].rectangles.push([rpGridWidth - amount - 1, i, amount + 1, 1, true]);
    }
    for (let i in numPixels) {
        if (numPixels[i].rectangles.length > 0) drawPixels(i, numPixels[i].rectangles, rpDCtx, true);
    }

    // copy transfer canvas
    rpCtx.drawImage(rpDCanvas, offsetX, offsetY);

    // grid
    rpCtx.strokeStyle = 'rgb(0, 0, 0)';
    rpCtx.lineWidth = 1;
    rpCtx.beginPath();
    for (let i = 0; i <= rpGridHeight; i++) {
        rpCtx.moveTo(offsetX, offsetY + i * scale);
        rpCtx.lineTo(offsetX + rpGridWidth * scale, offsetY + i * scale);
    }
    for (let i = 0; i <= rpGridWidth; i++) {
        rpCtx.moveTo(offsetX + i * scale, offsetY);
        rpCtx.lineTo(offsetX + i * scale, offsetY + rpGridHeight * scale);
    }
    rpCtx.stroke();

    // brush
    rpUpdateMouseControls();
    rpDrawBrush();
};
// copy + paste & history
const rpUnplaceablePixels = ['fire', 'placementRestriction', 'monster', 'target', 'remove', 'teamNone', 'teamAlpna', 'teamBeta'];
let lastMouseButton = brush.mouseButton;
function rpUpdateMouseControls() {
    if (rpUnplaceablePixels.indexOf(brush.pixel) == -1 && acceptInputs && rpMX >= 0 && rpMX < rpCanvasRes && rpMY >= 0 && rpMY < rpCanvasRes) {
        if (((brush.mouseButton != -1 && holdingAlt) || brush.lineMode) && !(brush.isSelection && selection.grid[0] != undefined)) {
            if (!brush.lineMode) {
                brush.lineMode = true;
                brush.lineStartX = rpMXGrid;
                brush.lineStartY = rpMYGrid;
                brush.startsInRPE = true;
            }
            if (brush.mouseButton == -1) {
                brush.lineMode = false;
                let clickPixelNum = pixels[brush.pixel].numId;
                brushActionLine(brush.lineStartX, brush.lineStartY, rpMXGrid, rpMYGrid, brush.size, (rect) => {
                    for (let i = rect.ymin; i <= rect.ymax; i++) {
                        for (let j = rect.xmin; j <= rect.xmax; j++) {
                            rpGrid[i][j] = clickPixelNum;
                        }
                    }
                });
            }
        } else if (brush.mouseButton == 1 && numPixels[rpGrid[rpMYGrid][rpMXGrid]].pickable && pixelSelectors[numPixels[rpGrid[rpMYGrid][rpMXGrid]].id].box.style.display != 'none') {
            pixelSelectors[numPixels[rpGrid[rpMYGrid][rpMXGrid]].id].box.onclick();
        } else if (brush.mouseButton != -1) {
            brush.lineMode = false;
            if ((lastMouseButton == 2 || removing)) {
                let xmin = Math.max(0, rpMXGrid - brush.size + 1);
                let xmax = Math.min(rpGridWidth - 1, rpMXGrid + brush.size - 1);
                let ymin = Math.max(0, rpMYGrid - brush.size + 1);
                let ymax = Math.min(rpGridHeight - 1, rpMYGrid + brush.size - 1);
                for (let y = ymin; y <= ymax; y++) {
                    for (let x = xmin; x <= xmax; x++) {
                        rpGrid[y][x] = pixNum.AIR;
                    }
                }
            } else {
                let xmin = Math.max(0, rpMXGrid - brush.size + 1);
                let xmax = Math.min(rpGridWidth - 1, rpMXGrid + brush.size - 1);
                let ymin = Math.max(0, rpMYGrid - brush.size + 1);
                let ymax = Math.min(rpGridHeight - 1, rpMYGrid + brush.size - 1);
                for (let y = ymin; y <= ymax; y++) {
                    for (let x = xmin; x <= xmax; x++) {
                        rpGrid[y][x] = pixels[brush.pixel].numId;
                    }
                }
            }
        }
    } else if (brush.mouseButton == -1 && brush.lineMode && !(brush.isSelection && selection.grid[0] != undefined) && brush.startsInRPE) {
        brush.lineMode = false;
        let clickPixelNum = pixels[brush.pixel].numId;
        brushActionLine(brush.lineStartX, brush.lineStartY, rpMXGrid, rpMYGrid, brush.size, (rect) => {
            for (let i = rect.ymin; i <= rect.ymax; i++) {
                for (let j = rect.xmin; j <= rect.xmax; j++) {
                    rpGrid[i][j] = clickPixelNum;
                }
            }
        });
    }
    lastMouseButton = brush.mouseButton;
};
function rpDrawBrush() {
    if (brush.lineMode && brush.startsInRPE) {
        const clickPixelNum = (brush.mouseButton == 2 || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId;
        let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
        let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
        rpDCtx.clearRect(0, 0, canvasResolution, canvasResolution);
        brushActionLine(brush.lineStartX, brush.lineStartY, rpMXGrid, rpMYGrid, brush.size, (rect) => {
            drawPixels(clickPixelNum, [[rect.xmin, rect.ymin, rect.xmax - rect.xmin + 1, rect.ymax - rect.ymin + 1, true]], rpDCtx, true);
        });
        rpCtx.globalAlpha = 0.5;
        rpCtx.drawImage(rpDCanvas, 0, 0, rpGridWidth * gridScale, rpGridHeight * gridScale, offsetX, offsetY, rpGridWidth * rpGridScale, rpGridHeight * rpGridScale);
        rpCtx.globalAlpha = 1;
        rpCtx.strokeStyle = 'rgb(255, 255, 255)';
        rpCtx.globalCompositeOperation = 'difference';
        rpCtx.fillRect(rpMX - 5, rpMY - 5, 10, 10);
        rpCtx.beginPath();
        rpCtx.strokeRect((rpMXGrid - brush.size + 1) * rpGridScale + offsetX, (rpMYGrid - brush.size + 1) * rpGridScale + offsetY, (brush.size * 2 - 1) * rpGridScale, (brush.size * 2 - 1) * rpGridScale);
        rpCtx.stroke();
        rpCtx.globalCompositeOperation = 'source-over';
    } else {
        let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
        let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
        rpDCtx.clearRect(0, 0, canvasResolution, canvasResolution);
        drawPixels((brush.mouseButton == 2 || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId, [[rpMXGrid - brush.size + 1, rpMYGrid - brush.size + 1, brush.size * 2 - 1, brush.size * 2 - 1, true]], rpDCtx, true);
        rpCtx.globalAlpha = 0.5;
        rpCtx.drawImage(rpDCanvas, 0, 0, rpGridWidth * gridScale, rpGridHeight * gridScale, offsetX, offsetY, rpGridWidth * rpGridScale, rpGridHeight * rpGridScale);
        rpCtx.globalAlpha = 1;
        rpCtx.fillStyle = 'rgb(255, 255, 255)';
        rpCtx.strokeStyle = 'rgb(255, 255, 255)';
        rpCtx.globalCompositeOperation = 'difference';
        rpCtx.fillRect(rpMX - 5, rpMY - 5, 10, 10);
        rpCtx.beginPath();
        rpCtx.strokeRect((rpMXGrid - brush.size + 1) * rpGridScale + offsetX, (rpMYGrid - brush.size + 1) * rpGridScale + offsetY, (brush.size * 2 - 1) * rpGridScale, (brush.size * 2 - 1) * rpGridScale);
        rpCtx.stroke();
        rpCtx.globalCompositeOperation = 'source-over';
    }
};

function startRPDrawLoop() {
    let loop = setInterval(() => {
        window.requestAnimationFrame(() => {
            const rect = rpCanvas.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) return;
            let cameraTemp = {
                x: camera.x,
                y: camera.y,
                scale: camera.scale
            };
            camera.x = rpCamera.x;
            camera.y = rpCamera.y;
            camera.scale = rpCamera.scale;
            let forceRedraw2 = forceRedraw;
            let gridScale2 = gridScale;
            let drawScale2 = drawScale;
            let screenScale2 = screenScale;
            forceRedraw = true;
            gridScale = rpGridScale;
            drawScale = rpGridScale * rpCamera.scale;
            screenScale = (rpGridWidth < rpGridHeight ? rpGridWidth : rpGridHeight) / rpCanvasSize / rpCamera.scale / rpCanvasScale;
            try {
                rpDraw();
            } catch (err) {
                clearInterval(loop);
                throw err;
            } finally {
                camera.x = cameraTemp.x;
                camera.y = cameraTemp.y;
                camera.scale = cameraTemp.scale;
                forceRedraw = forceRedraw2;
                gridScale = gridScale2;
                drawScale = drawScale2;
                screenScale = screenScale2;
            }
        });
    }, 1000 / 40);
    startRPDrawLoop = undefined;
};
window.addEventListener('load', (e) => {
    createRPGrid(10, 10);
    startRPDrawLoop();
    refreshRedPrintList();
});

// inputs
const rpGWInput = document.getElementById('rpGW');
const rpGHInput = document.getElementById('rpGH');
const rpNameInput = document.getElementById('rpName');
const rpDescriptionInput = document.getElementById('rpDescription');
const rpListContainer = document.getElementById('rpListContainer');
window.addEventListener('DOMContentLoaded', (e) => {
    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input') || e.target.matches('textarea') || !acceptInputs || inWinScreen || inMenuScreen) return;
        const key = e.key.toLowerCase();
        if (key == 'z' && e.ctrlKey) {
            // undo!!!!!!!!!!!
        }
    });
    function mouseMove(e) {
        const rect = rpCanvas.getBoundingClientRect();
        rpMX = Math.round((e.pageX - rect.left) * rpCanvasScale);
        rpMY = Math.round((e.pageY - rect.top - window.scrollY) * rpCanvasScale);
        let scale = Math.max(rpGridWidth, rpGridHeight) / rpCanvasSize / rpCamera.scale / rpCanvasScale;
        let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
        let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
        rpMXGrid = Math.floor((rpMX + rpCamera.x - offsetX) * scale);
        rpMYGrid = Math.floor((rpMY + rpCamera.y - offsetY) * scale);
        rpMouseOver = rpMX >= 0 && rpMX < rpCanvasRes && rpMY >= 0 && rpMY < rpCanvasRes;
    };
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('wheel', mouseMove);
});
rpGWInput.onkeydown = (e) => {
    if (e.key == 'Enter') {
        resizeRPGrid(parseInt(rpGWInput.value), rpGridHeight);
        sounds.click();
    }
};
rpGHInput.onkeydown = (e) => {
    if (e.key == 'Enter') {
        resizeRPGrid(rpGridWidth, parseInt(rpGHInput.value));
        sounds.click();
    }
};
rpGWInput.onblur = (e) => {
    resizeRPGrid(parseInt(rpGWInput.value), rpGridHeight);
    sounds.click();
};
rpGHInput.onblur = (e) => {
    resizeRPGrid(rpGridWidth, parseInt(rpGHInput.value));
    sounds.click();
}
document.getElementById('importRedprint').onclick = (e) => {
    if (selection.grid.length == 0) return;
    modal('Copy to RedPrint Editor?', 'Any unsaved work will be lost!', true).then((success) => {
        if (success) {
            createRPGrid(selection.grid[0].length, selection.grid.length);
            for (let i = 0; i < selection.grid.length; i++) {
                rpGrid[i] = Array.from(selection.grid[i]);
            }
        }
    });
};
document.getElementById('exportRedprint').onclick = (e) => {
    if (rpGridWidth == 0 || rpGridHeight == 0 || rpGrid.length == 0) return;
    selection.grid = [];
    for (let i = 0; i < rpGridHeight; i++) {
        selection.grid[i] = Array.from(rpGrid[i]);
    }
    window.localStorage.setItem('clipboard', LZString.compressToBase64(JSON.stringify(selection.grid)));
    brush.isSelection = true;
};
document.getElementById('rpSave').onclick = (e) => {
    if (redPrints.length >= 100) {
        modal('<span style="color: red">Too Many RedPrints!</span>', 'You have reached the maximum amount of RedPrints that can be stored safely. Please delete some RedPrints.<br>This will be resolved when we (eventually) implement an account system and RedPrints will be stored globally.');
        return;
    }
    if (rpNameInput.value.length == 0) return;
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = 200;
    thumbCanvas.height = 200;
    const thumbCtx = thumbCanvas.getContext('2d');
    thumbCtx.fillStyle = 'rgb(255, 255, 255)';
    thumbCtx.fillRect(0, 0, 200, 200);
    thumbCtx.drawImage(rpCanvas, 0, 0, 200, 200);
    const redprint = {
        name: rpNameInput.value,
        description: rpDescriptionInput.value,
        code: generateRPCode(),
        thumbnail: thumbCanvas.toDataURL('image/png')
    };
    for (let i in redPrints) {
        if (redPrints[i].name == rpNameInput.value) {
            modal('Overwrite existing RedPrint?', 'Two or more RedPrints have the same name. Saving will overwrite the previous RedPrint!', true).then((success) => {
                if (success) {
                    redPrints[i] = redprint;
                    refreshRedPrintList();
                }
            });
            return;
        }
    }
    redPrints.unshift(redprint);
    refreshRedPrintList();
};
function refreshRedPrintList() {
    window.localStorage.setItem('redprints', LZString.compressToBase64(JSON.stringify(redPrints)));
    rpListContainer.innerHTML = '';
    for (const redprint of redPrints) {
        const block = document.createElement('div');
        block.classList.add('rplBlock');
        const thumbnail = document.createElement('img');
        thumbnail.classList.add('rplThumb');
        thumbnail.src = redprint.thumbnail;
        block.appendChild(thumbnail);
        const name = document.createElement('div');
        name.classList.add('rplName');
        name.innerText = redprint.name;
        block.appendChild(name);
        const description = document.createElement('div');
        description.classList.add('rplDescription');
        description.innerText = redprint.description;
        block.appendChild(description);
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('rplButtonRow');
        const openButton = document.createElement('button');
        openButton.classList.add('rplOpen');
        openButton.onclick = (e) => {
            sounds.click();
            modal('Copy to RedPrint Editor?', 'Any unsaved work will be lost!', true).then((success) => {
                if (success) {
                    rpNameInput.value = redprint.name;
                    rpDescriptionInput.value = redprint.description;
                    loadRPCode(redprint.code);
                }
            });
        };
        buttonContainer.appendChild(openButton);
        const exportButton = document.createElement('button');
        exportButton.classList.add('rplExport');
        exportButton.onclick = (e) => {
            sounds.click();
            let tempCode = generateRPCode();
            loadRPCode(redprint.code);
            selection.grid = [];
            for (let i = 0; i < rpGridHeight; i++) {
                selection.grid[i] = Array.from(rpGrid[i]);
            }
            window.localStorage.setItem('clipboard', LZString.compressToBase64(JSON.stringify(selection.grid)));
            brush.isSelection = true;
            loadRPCode(tempCode);
        };
        buttonContainer.appendChild(exportButton);
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('rplDelete');
        deleteButton.onclick = (e) => {
            sounds.click();
            modal('Delete RedPrint?', 'This cannot be undone!', true).then((success) => {
                if (success) {
                    redPrints.splice(redPrints.indexOf(redprint), 1);
                    refreshRedPrintList();
                }
            });
        };
        buttonContainer.appendChild(deleteButton);
        block.appendChild(buttonContainer);
        rpListContainer.appendChild(block);
    }
};
document.getElementById('rpDownload').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    const encoded = `data:text/redprint;base64,${window.btoa(`${rpNameInput.value.replaceAll('|', '/')}|${rpDescriptionInput.value.replaceAll('|', '/')}|${generateRPCode()}`)}`;
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `redprint_${Math.ceil(Math.random() * 1000)}.redprint`;
    a.click();
};
document.getElementById('rpUpload').onclick = (e) => {
    if (inMenuScreen || inWinScreen || !acceptInputs || !sandboxMode) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.redprint';
    input.click();
    input.oninput = (e) => {
        let files = input.files;
        if (files.length == 0) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            modal('Import RedPrint?', 'Any unsaved work will be lost!', true).then((success) => {
                if (success) {
                    let split = e.target.result.split('|');
                    rpNameInput.value = split[0];
                    rpDescriptionInput.value = split[1];
                    loadRPCode(split[2]);
                }
            });
        };
        reader.readAsText(files[0]);
    };
};

// resizing
window.addEventListener('resize', (e) => {
    rpCanvasSize = rpCanvas.getBoundingClientRect().width;
    rpCanvasScale = rpCanvasRes / rpCanvasSize;
});
window.addEventListener('load', async (e) => {
    rpCanvasSize = rpCanvas.getBoundingClientRect().width;
    rpCanvasScale = rpCanvasRes / rpCanvasSize;
});