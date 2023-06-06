window.addEventListener('error', (e) => {
    modal('An error occured:', `<span style="color: red;">${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
});
// Do not question why a lot of this code is written in procedural practices
// RPS used to be a Khan Academy project so a lot of the code is written in procedural style
// changing that now is too time-consuming and so it will probably never happen all at once

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
    while (true) {
        let text = to.substring(0, i);
        if (addSpaces && i >= to.length) {
            for (let j = to.length; j < i; j++) {
                text += ' ';
            }
        }
        text += from.substring(i);
        i += block;
        if (i >= to.length + block && (!addSpaces || i >= from.length + block)) {
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
    while (true) {
        let text = to.substring(0, i - glitchLength);
        if (addSpaces && i >= to.length) {
            for (let j = to.length; j < i - glitchLength; j++) {
                text += ' ';
            }
        }
        for (let j = Math.max(0, i - glitchLength); j < Math.min(i, Math.max(from.length, to.length)); j++) {
            text += letters.charAt(~~(Math.random() * letters.length));
        }
        text += from.substring(i);
        if (a % advanceMod == 0) i += block;
        if (i >= to.length + block + glitchLength && (!addSpaces || i >= from.length + block + glitchLength)) {
            yield to;
            break;
        }
        yield text;
        a++;
    }
};