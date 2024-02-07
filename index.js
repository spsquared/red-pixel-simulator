// Copyright (C) 2024 Sampleprovider(sp)

window.addEventListener('error', (e) => {
    modal('An error occured:', `<span style="color: red;">${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
});

// variables used elsewhere
acceptInputs = true;
inMenuScreen = true;

// modal
const modalContainer = document.getElementById('modalContainer');
const modalBody = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalYes = document.getElementById('modalYes');
const modalNo = document.getElementById('modalNo');
const modalOk = document.getElementById('modalOk');
function modal(title, subtitle, confirmation = false) {
    if (!acceptInputs) return new Promise((resolve, reject) => reject('Modal already open'));
    acceptInputs = false;
    modalTitle.innerHTML = title;
    modalContent.innerHTML = subtitle;
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

// text transitions (with the only generator functions for a while)
function flipTextTransition(from, to, update, speed, block = 1) {
    let gen = flipTextTransitionGenerator(from, to, block);
    let animate = setInterval(() => {
        let next = gen.next();
        if (next.done) clearInterval(animate);
        else update(next.value);
    }, 1000 / speed);
    return function stop() { clearInterval(animate) };
};
function* flipTextTransitionGenerator(from, to, block) {
    let i = 0;
    let addSpaces = to.length < from.length;
    let fromTags = from.match(/<(.*?)>/g) ?? [];
    let toTags = to.match(/<(.*?)>/g) ?? [];
    let cleanFrom = from;
    let cleanTo = to;
    fromTags.forEach((tag) => cleanFrom = cleanFrom.replace(tag, '§'));
    toTags.forEach((tag) => cleanTo = cleanTo.replace(tag, '§'));
    while (true) {
        let text = cleanTo.substring(0, i);
        if (addSpaces && i >= cleanTo.length) {
            for (let j = cleanTo.length; j < i; j++) {
                text += ' ';
            }
        }
        for (let j = 0; text.includes('§'); j++) {
            text = text.replace('§', toTags[j]);
        }
        text += cleanFrom.substring(i);
        let k = text.lastIndexOf('§'); // most useless optimization ever
        for (let j = fromTags.length - 1; k >= 0; j--) {
            text = text.substring(0, k) + fromTags[j] + text.substring(k + 1);
            k = text.lastIndexOf('§');
        }
        i += block;
        if (i >= cleanTo.length + block && (!addSpaces || i >= cleanFrom.length + block)) {
            yield to;
            break;
        }
        yield text;
    }
};
function glitchTextTransition(from, to, update, speed, block = 1, glitchLength = 5, advanceMod = 1) {
    let gen = glitchTextTransitionGenerator(from, to, block, glitchLength, advanceMod);
    let animate = setInterval(() => {
        let next = gen.next();
        if (next.done) clearInterval(animate);
        else update(next.value);
    }, 1000 / speed);
    return function stop() { clearInterval(animate) };
};
function* glitchTextTransitionGenerator(from, to, block, glitchLength, advanceMod) {
    let i = 0;
    let addSpaces = to.length < from.length;
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+`~[]\\{}|;\':",./?';
    let a = 0;
    let fromTags = from.match(/<(.*?)>/g) ?? [];
    let toTags = to.match(/<(.*?)>/g) ?? [];
    let cleanFrom = from;
    let cleanTo = to;
    fromTags.forEach((tag) => cleanFrom = cleanFrom.replace(tag, '§'));
    toTags.forEach((tag) => cleanTo = cleanTo.replace(tag, '§'));
    while (true) {
        let text = cleanTo.substring(0, i - glitchLength);
        if (addSpaces && i >= cleanTo.length) {
            for (let j = cleanTo.length; j < i - glitchLength; j++) {
                text += ' ';
            }
        }
        for (let j = 0; text.includes('§'); j++) {
            text = text.replace('§', toTags[j]);
        }
        for (let j = Math.max(0, i - glitchLength); j < Math.min(i, Math.max(cleanFrom.length, cleanTo.length)); j++) {
            text += letters.charAt(~~(Math.random() * letters.length));
        }
        text += cleanFrom.substring(i);
        let k = text.lastIndexOf('§'); // most useless optimization ever
        for (let j = fromTags.length - 1; k >= 0; j--) {
            text = text.substring(0, k) + fromTags[j] + text.substring(k + 1);
            k = text.lastIndexOf('§');
        }
        if (a % advanceMod == 0) i += block;
        if (i >= cleanTo.length + block + glitchLength && (!addSpaces || i >= cleanFrom.length + block + glitchLength)) {
            yield to;
            break;
        }
        yield text;
        a++;
    }
};

if (Math.random() < 0.001) {
    const coverCanvas = document.createElement('canvas');
    const cctx = coverCanvas.getContext('2d');
    coverCanvas.width = 500;
    coverCanvas.height = 500;
    cctx.fillStyle = '#FF0000';
    cctx.fillRect(0, 0, 500, 500);
    cctx.textBaseline = 'top';
    cctx.textAlign = 'left';
    cctx.font = '80px Lucida Console';
    cctx.fillStyle = '#FFFFFF';
    cctx.fillText('SP', 340, 30);
    cctx.font = 'bold 60px Lucida Console';
    cctx.fillText('2', 440, 24);
    cctx.font = '150px Lucida Console';
    cctx.fillStyle = '#FFFFFF7F';
    cctx.fillText('Red', 26, 186);
    cctx.fillText('Pixel', 26, 336);
    cctx.shadowBlur = 10;
    cctx.shadowColor = '#FFFFFFC0';
    cctx.fillStyle = '#FFFFFF';
    cctx.fillText('Red', 30, 180);
    cctx.fillText('Pixel', 30, 330);
    // coverCanvas.style.position = 'absolute';
    // coverCanvas.style.top = '0px';
    // coverCanvas.style.left = '0px';
    // coverCanvas.style.zIndex = 10000;
    // document.body.appendChild(coverCanvas);
    document.getElementById('t_redpixel').style.backgroundImage = 'url(' + coverCanvas.toDataURL('image/png') + ')';
    document.getElementById('t_redpixel').style.backgroundSize = 'contain';
}