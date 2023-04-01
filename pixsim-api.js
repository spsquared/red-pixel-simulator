const apiURI = 'https://pixsim-api.spsquared.repl.co';
// const apiURI = 'http://localhost:503';
const socket = io(apiURI, {
    path: '/pixsim-api',
    autoConnect: false,
    reconnection: false
});
let apiconnected = false;
async function handlePixSimAPIDisconnect() {
    if (apiconnected) {
        apiconnected = false;
        await modal('PixSim API', '<span style="color: red;">PixSim API was disconnected.</span>', false);
        // kick out of game
        pixsimMenuClose.onclick();
    }
};
socket.on('disconnect', handlePixSimAPIDisconnect);
socket.on('disconnected', handlePixSimAPIDisconnect);
socket.on('timeout', handlePixSimAPIDisconnect);
socket.on('error', handlePixSimAPIDisconnect);

// network metrics
let pingSend = 0;
let ping = 0;
let pingReceived = true;
let jitter = 0;
const highPingWarning = document.getElementById('highPing');
const highPingWarningPing = document.getElementById('highPingDisplay');
setInterval(() => {
    if (pingReceived && socket.connected) {
        pingSend = performance.now();
        socket.emit('ping');
        pingReceived = false;
    } else if (!socket.connected) {
        highPingWarning.style.display = '';
    }
}, 1000);
socket.on('pong', () => {
    let prevPing = ping;
    ping = performance.now() - pingSend;
    jitter = Math.abs(ping - prevPing) * 0.5 + jitter * 0.5;
    pingReceived = true;
    if (ping > 500 || jitter > 200) {
        highPingWarning.style.display = 'block';
        highPingWarningPing.innerHTML = `Ping: ${Math.round(ping)}ms<br>Jitter: ${Math.round(jitter)}ms`;
    } else {
        highPingWarning.style.display = '';
    }
});

// connection
function APIconnect() {
    apiconnected = true;
    return new Promise((resolve, reject) => {
        const wakeup = new XMLHttpRequest();
        wakeup.open('GET', apiURI);
        wakeup.onerror = (e) => {
            reject(new Error(`wakeup call failed: ${wakeup.status} ${wakeup.statusText}`));
        };
        wakeup.send();
        socket.connect();
        socket.once('connect', () => {
            socket.once('requestClientInfo', async (key) => {
                if (window.crypto.subtle !== undefined) {
                    RSA.key = await window.crypto.subtle.importKey('jwk', key, {name: "RSA-OAEP", hash: "SHA-256"}, false, ['encrypt']);
                }
                socket.emit('clientInfo', {
                    gameType: 'rps',
                    username: 'Unknown',
                    password: RSA.encode('')
                });
                socket.once('clientInfoRecieved', resolve);
            });
        });
        socket.once('error', reject);
    });
};
function APIdisconnect() {
    apiconnected = false;
    socket.disconnect();
};

// encryption
const RSA = {
    key: null,
    encode: async (text) => {
        if (RSA.key !== null) return await window.crypto.subtle.encrypt({name: 'RSA-OAEP'}, RSA.key, new TextEncoder().encode(text));
        else return text;
    }
};

function APIcreateGame() {
    return new Promise((resolve, reject) => {
        if (!apiconnected || !socket.connected) reject(new Error('PixSim API not connected'));
        socket.emit('createGame');
        socket.once('gameCode', (code) => {
            resolve(new GameHost(socket, code));
        });
    });
};
function APIgetPublicGames(type) {
    return new Promise((resolve, reject) => {
        if (!apiconnected || !socket.connected) reject(new Error('PixSim API not connected'));
        socket.emit('getPublicRooms', type);
        socket.once('publicRooms', resolve);
    });
};
class GameHost {
    #socket;
    #code;
    #state = 0;
    constructor(socket, code) {
        this.#socket = socket;
        this.#code = code;
    }

    code() {
        return this.#code;
    }

    end() {
        switch (this.#state) {
            case 0:
                this.#socket.emit('cancelCreateGame');
                break;
        }
    }
}
class GameClient {
    #socket;
}