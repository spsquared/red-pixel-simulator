const redPrints = JSON.parse(window.localStorage.getItem('redprints') ?? '[]');

let rpGridWidth = 0;
let rpGridHeight = 0;

const rpCanvasRes = 600;
const rpCanvas = document.getElementById('rpCanvas');
const rpDCanvas = createCanvas2();
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
rpCanvas.addEventListener('contextmenu', e => e.preventDefault());

let rpGridScale = rpCanvasRes / Math.max(rpGridWidth, rpGridHeight);
let rpCanvasSize = 0;
let rpCanvasScale = rpCanvasRes / rpCanvasSize;
const rpGrid = [];
const rpGridHistory = [];

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

// very temp
window.addEventListener('load', () => {
    createRPGrid(10, 20);
    for (let i = 0; i < pixNum.RED; i++) {
        if (i != pixNum.SPIN) rpGrid[Math.floor(i / rpGridWidth)][i % rpGridWidth] = i;
    }
});

// draw
function rpDraw() {
    if (inMenuScreen) return;

    // reset
    rpCtx.clearRect(0, 0, rpCanvasRes, rpCanvasRes);
    rpDCtx.clearRect(0, 0, canvasResolution, canvasResolution);
    rpCtx.resetTransform();
    rpCtx.globalAlpha = 1;

    // draw grid onto transfer canvas and cheat while doing it
    let scale = rpCamera.scale * rpGridScale;
    let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
    let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
    for (let i = 0; i < rpGridHeight; i++) {
        let curr = pixNum.AIR;
        let amount = 0;
        for (let j = 0; j < rpGridWidth; j++) {
            amount++;
            if (rpGrid[i][j] != curr) {
                if (curr != pixNum.AIR) drawPixels(j - amount, i, amount, 1, curr, 1, rpDCtx, true);
                curr = rpGrid[i][j];
                amount = 0;
            }
        }
        if (curr != pixNum.AIR) drawPixels(rpGridWidth - amount - 1, i, amount + 1, 1, curr, 1, rpDCtx, true);
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
// will implement copy + paste in future
const rpUnplaceablePixels = ['fire', 'placementUnRestriction', 'placementRestriction', 'monster', 'target', 'remove'];
function rpUpdateMouseControls() {
    if (rpUnplaceablePixels.indexOf(brush.pixel) == -1 && mouseIsPressed && rpMXGrid >= 0 && rpMXGrid < rpGridWidth && rpMYGrid >= 0 && rpMYGrid < rpGridHeight) {
        if (mouseButton == CENTER) brush.pixel = numPixels[rpGrid[rpMYGrid][rpMXGrid]].id;
        else if ((mouseButton == RIGHT || removing)) rpGrid[rpMYGrid][rpMXGrid] = pixNum.AIR;
        else rpGrid[rpMYGrid][rpMXGrid] = pixels[brush.pixel].numId;
    }
};
function rpDrawBrush() {
    let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
    let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
    rpDCtx.clearRect(0, 0, canvasResolution, canvasResolution);
    drawPixels(rpMXGrid, rpMYGrid, 1, 1, ((mouseIsPressed && mouseButton == RIGHT) || removing) ? pixNum.REMOVE : pixels[brush.pixel].numId, 0.5, rpDCtx, true);
    rpCtx.drawImage(rpDCanvas, offsetX, offsetY);
    rpCtx.fillStyle = 'rgb(255, 255, 255)';
    rpCtx.strokeStyle = 'rgb(255, 255, 255)';
    rpCtx.globalCompositeOperation = 'difference';
    rpCtx.fillRect(rpMX - 5, rpMY - 5, 10, 10);
    rpCtx.beginPath();
    rpCtx.strokeRect(rpMXGrid * rpGridScale + offsetX, rpMYGrid * rpGridScale + offsetY, rpGridScale, rpGridScale);
    rpCtx.stroke();
    rpCtx.globalCompositeOperation = 'source-over';
};

function startRPDrawLoop() {
    let loop = setInterval(() => {
        window.requestAnimationFrame(() => {
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
            forceRedraw = true;
            gridScale = rpGridScale;
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
            }
        });
    }, 1000 / 40);
    startRPDrawLoop = undefined;
};

window.addEventListener('DOMContentLoaded', (e) => {
    document.addEventListener('mousemove', (e) => {
        const rect = rpCanvas.getBoundingClientRect();
        rpMX = Math.round((e.pageX - rect.left) * rpCanvasScale);
        rpMY = Math.round((e.pageY - rect.top - window.scrollY) * rpCanvasScale);
        let scale = Math.max(rpGridWidth, rpGridHeight) / rpCanvasSize / rpCamera.scale / rpCanvasScale;
        let offsetX = rpCanvasRes / 2 - rpGridScale * rpGridWidth / 2;
        let offsetY = rpCanvasRes / 2 - rpGridScale * rpGridHeight / 2;
        rpMXGrid = Math.floor((rpMX + rpCamera.x - offsetX) * scale);
        rpMYGrid = Math.floor((rpMY + rpCamera.y - offsetY) * scale);
        rpMouseOver = rpMX >= 0 && rpMX < rpCanvasRes && rpMY >= 0 && rpMY < rpCanvasRes;
    });
});
window.addEventListener('load', refreshRedPrintList);

// inputs
const rpGWInput = document.getElementById('rpGW');
const rpGHInput = document.getElementById('rpGH');
const rpNameInput = document.getElementById('rpName');
const rpDescriptionInput = document.getElementById('rpDescription');
const rpListContainer = document.getElementById('rpListContainer');
rpGWInput.onkeydown = (e) => {
    if (e.key == 'Enter') {
        resizeRPGrid(parseInt(rpGWInput.value), rpGridHeight);
        clickSound();
    }
};
rpGHInput.onkeydown = (e) => {
    if (e.key == 'Enter') {
        resizeRPGrid(rpGridWidth, parseInt(rpGHInput.value));
        clickSound();
    }
};
document.getElementById('saveRedprint').onclick = (e) => {
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
document.getElementById('openRedprint').onclick = (e) => {
    if (rpGridWidth == 0 || rpGridHeight == 0 || rpGrid.length == 0) return;
    selection.grid = [];
    for (let i = 0; i < rpGridHeight; i++) {
        selection.grid[i] = Array.from(rpGrid[i]);
    }
    localStorage.setItem('clipboard', JSON.stringify(selection.grid));
    brush.isSelection = true;
};
document.getElementById('rpSave').onclick = (e) => {
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
    redPrints.unshift(redprint);
    refreshRedPrintList();
};
function refreshRedPrintList() {
    window.localStorage.setItem('redprints', JSON.stringify(redPrints));
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
            clickSound();
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
            clickSound();
            let tempCode = generateRPCode();
            loadRPCode(redprint.code);
            selection.grid = [];
            for (let i = 0; i < rpGridHeight; i++) {
                selection.grid[i] = Array.from(rpGrid[i]);
            }
            localStorage.setItem('clipboard', JSON.stringify(selection.grid));
            brush.isSelection = true;
            loadRPCode(tempCode);
        };
        buttonContainer.appendChild(exportButton);
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('rplDelete');
        deleteButton.onclick = (e) => {
            clickSound();
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
    const encoded = `data:text/redprint;base64,${window.btoa(`${rpNameInput.value.replace('|', '/')}|${rpDescriptionInput.value.replace('|', '/')}|${generateRPCode()}`)}`;
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
window.addEventListener('load', (e) => {
    rpCanvasSize = rpCanvas.getBoundingClientRect().width;
    rpCanvasScale = rpCanvasRes / rpCanvasSize;
});