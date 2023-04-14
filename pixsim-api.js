const apiURI = 'https://api.pixelsimulator.repl.co';
// const apiURI = 'http://localhost:503';
const socket = io(apiURI, {
    path: '/pixsim-api',
    autoConnect: false,
    reconnection: false
});
let apiconnected = false;
async function handlePixSimAPIDisconnect() {
    if (apiconnected) {
        PixSimAPI.disconnect();
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
    window.requestIdleCallback(() => {
        if (pingReceived && socket.connected) {
            pingSend = performance.now();
            socket.emit('ping');
            pingReceived = false;
        } else if (!socket.connected) {
            highPingWarning.style.display = '';
        }
    }, { timeout: 500 });
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

class PixSimAPI {
    static #username = Math.random().toString();
    static #userCache = new Map();
    static #gameCode;
    static #inGame = false;
    static #gameRunning = false;
    static #isHost = false;
    static #gameMode = 0;
    static #teamSize = 1;
    static #gameModes = [
        {
            name: 'Pixelite Crash',
            id: 'pixelcrash',
            description: 'Build vaults of Color and battle to destroy the other Pixelite crystal!'
        }
    ]
    static #spectating = false;

    static async connect() {
        apiconnected = true;
        await new Promise((resolve, reject) => {
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
                        RSA.key = await window.crypto.subtle.importKey('jwk', key, { name: "RSA-OAEP", hash: "SHA-256" }, false, ['encrypt']);
                    }
                    socket.emit('clientInfo', {
                        gameType: 'rps',
                        username: this.#username,
                        password: await RSA.encode('')
                    });
                    socket.once('clientInfoRecieved', resolve);
                });
            });
            socket.once('error', reject);
        });
    }
    static async disconnect() {
        apiconnected = false;
        socket.disconnect();
        this.#inGame = false;
        this.#gameRunning = false;
    }
    static async getPublicGames(type) {
        return await new Promise((resolve, reject) => {
            if (!apiconnected || !socket.connected) reject(new Error('PixSim API not connected'));
            socket.emit('getPublicRooms', { type: type, spectating: this.#spectating });
            socket.once('publicRooms', resolve);
        });
    }
    static async createGame() {
        return await new Promise((resolve, reject) => {
            if (!apiconnected || !socket.connected) reject(new Error('PixSim API not connected'));
            socket.once('gameCode', (code) => {
                this.#gameCode = code;
                this.#inGame = true;
                this.#isHost = true;
                resolve(code);
            });
            socket.emit('createGame');
        });
    }
    static async joinGame(code) {
        return await new Promise((resolve, reject) => {
            if (!apiconnected || !socket.connected) reject(new Error('PixSim API not connected'));
            socket.once('joinSuccess', (team) => {
                this.#isHost = false;
                this.#inGame = true;
                socket.off('forcedSpectator');
                resolve(0);
            });
            socket.once('forcedSpectator', () => {
                // put a banner (not a modal)
            });
            socket.once('joinFail', (reason) => {
                socket.off('joinSuccess');
                socket.off('forcedSpectator');
                // modal
                resolve(reason + 1);
            });
            socket.emit('joinGame', { code: code, spectating: this.#spectating });
        });
    }
    static async leaveGame() {
        if (this.#isHost && !this.#gameRunning) socket.emit('cancelCreateGame');
        else socket.emit('leaveGame');
        this.#inGame = false;
        this.#gameRunning = false;
    }
    static async kickPlayer(username) {
        if (!this.#isHost || !this.#inGame || this.#gameRunning) return;
        socket.emit('kickPlayer', username);
    }
    static async movePlayer(username, team) {
        if (!this.#isHost || !this.#inGame || this.#gameRunning) return;
        socket.emit('movePlayer', { username: username, team: team });
    }
    static async startGame() {
        // buh
    }

    static set onUpdateTeamList(cb) {
        if (typeof cb != 'function') return;
        socket.off('updateTeamLists');
        socket.on('updateTeamLists', (teams) => {
            this.#teamSize = teams.teamSize;
            cb(teams);
        });
    }
    static set onGameKicked(cb) {
        if (typeof cb != 'function') return;
        socket.off('gameKicked');
        socket.on('gameKicked', () => {
            this.#inGame = false;
            this.#gameRunning = false;
            cb();
        });
    }
    static set onGameClose(cb) {
        if (typeof cb != 'function') return;
        socket.off('gameEnd');
        socket.on('gameEnd', () => {
            this.#inGame = false;
            this.#gameRunning = false;
            cb();
        });
    }

    static set allowSpectators(state) {
        socket.emit('allowSpectators', state);
    }
    static set isPublic(state) {
        socket.emit('isPublic', state);
    }
    static set spectating(state) {
        if (typeof state == 'boolean') this.#spectating = state;
    }

    static get username() {
        return this.#username;
    }
    static get gameCode() {
        return this.#gameCode;
    }
    static get isHost() {
        return this.#isHost;
    }
    static get inGame() {
        return this.#inGame;
    }
    static get teamSize() {
        return this.#teamSize;
    }
    static get gameRunning() {
        return this.#gameRunning;
    }
    static get gameMode() {
        return this.#gameMode;
    }
    static get spectating() {
        return this.#spectating;
    }

    static getUserData(username) {
        if (this.#userCache.has(username)) return this.#userCache.get(username);
        else {
            const userData = {
                igname: 'Unknown',
                img: '',
                rank: 0,
                elo: 0
            };
            this.#userCache.set(username, userData);
            return userData;
        }
    }
};

// encryption
const RSA = {
    key: null,
    encode: async (text) => {
        if (RSA.key !== null) return await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, RSA.key, new TextEncoder().encode(text));
        else return text;
    }
};