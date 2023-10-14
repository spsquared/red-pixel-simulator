// run in separate thread to avoid lag from scripts

class PXASMReferenceError extends ReferenceError {
    constructor(message = undefined) {
        super(message);
        this.name = 'PXASMReferenceError';
        postMessage([1, this]);
    }
}
class PXASMBoundsError extends ReferenceError {
    constructor(message = undefined) {
        super(message);
        this.name = 'PXASMBoundsError';
        postMessage([1, this]);
    }
}

// reserved variables? ticks?
const variables = new Map();
const functions = new Map();

function setVariable(n, v) {
    variables.set(n, v);
};
function getVariable(n) {
    if (!variables.has(n)) throw new PXASMReferenceError(`'${n}' is not defined`);
    return variables.get(n);
};
function defArray(n, l, v = 0) {
    variables.set(n, new Array(l).fill(v));
};
function setArray(n, i, v) {
    let arr = variables.get(n);
    if (!Array.isArray(arr)) throw new PXASMReferenceError(`'${n}' is not an array`);
    if (i < 0 || i > arr.length) throw new PXASMBoundsError(`Index ${i} out of bounds for array length ${arr.length}`);
    arr[i] = v;
};
function getArray(n, i) {
    let arr = variables.get(n);
    if (!Array.isArray(arr)) throw new PXASMReferenceError(`'${n}' is not an array`);
    if (i === 'L') return arr.length;
    if (i < 0 || i >= arr.length) throw new PXASMBoundsError(`Index ${i} out of bounds for array length ${arr.length}`);
    return arr[i];
};
async function forEach(v, n, cb) {
    if (!Array.isArray(n)) throw new PXASMReferenceError(`'${n}' is not an array`);
    for (let a of n) {
        setVariable(v, a);
        await cb();
    }
};
function defFunction(fn, ...params) {
    functions.set(fn, [params[params.length - 1], params.slice(0, -1)]);
};
async function callFunction(fn, ...params) {
    if (!functions.has(fn)) throw new PXASMReferenceError(`'${fn}' is not a function`);
    const fndata = functions.get(fn);
    for (let i in fndata[1]) {
        setVariable(fndata[1][i], params[i]);
    }
    await fndata[0]();
};
async function wait(t) {
    await new Promise((r) => setTimeout(r, t));
};
function print(...s) {
    console.log(...s);
};
async function setPixel(x, y, id) {
    return await sendCommand('setPixel', x, y, id);
};
async function getPixel(x, y) {
    return await sendCommand('getPixel', x, y);
};
async function setAmount(id, t, n) {
    return await sendCommand('setAmount', id, t, n);
};
async function getAmount(id, t) {
    return await sendCommand('getAmount', id, t);
};
function moveCamera(x, y, s, t) {
    sendCommand('moveCamera', x, y, s, t);
};
function shakeCamera(x, y, t) {
    sendCommand('shakeCamera', x, y, t);
};
function triggerWin(t) {
    sendCommand('triggerWin', t);
};
function playSound(id, x, y, v) {
    sendCommand('playSound', id, x, y, v);
};
function startSim() {
    sendCommand('startSim');
};
function stopSim() {
    sendCommand('stopSim');
};
async function awaitTick() {
    postMessage(['awaitTick', []]);
    await new Promise((resolve, reject) => {
        addEventListener('message', function res(e) {
            if (e.data[0] === 2) {
                this.removeEventListener('message', res);
                resolve();
            }
        });
    });
};

onmessage = async (e) => {
    if (e.data[0] === 1) {
        await new Function(`return async()=>{${e.data[1]}}`)()();
        postMessage([0]);
    }
};
async function waitForResponse() {
    return await new Promise((resolve, reject) => {
        addEventListener('message', function res(e) {
            if (e.data[0] === 0) {
                this.removeEventListener('message', res);
                resolve(e.data[1]);
            }
        });
    });
};
async function sendCommand(cmd, ...params) {
    postMessage([cmd, params]);
    return await waitForResponse();
};