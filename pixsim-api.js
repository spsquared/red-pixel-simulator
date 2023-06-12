const apiURI = 'https://api.pixelsimulator.repl.co';
// const apiURI = 'http://localhost:5000';
const socket = io(apiURI, {
    path: '/pixsim-api/socket/',
    autoConnect: false,
    reconnection: false
});

// network metrics
let pingSend = 0;
let ping = -1;
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
    if (prevPing == -1) prevPing = ping;
    jitter = Math.abs(ping - prevPing) * 0.5 + jitter * 0.5;
    pingReceived = true;
    if (ping > 300 || jitter > 200) {
        highPingWarning.style.display = 'block';
        highPingWarningPing.innerHTML = `Ping: ${Math.round(ping)}ms<br>Jitter: ${Math.round(jitter)}ms`;
    } else {
        highPingWarning.style.display = '';
    }
});

// reusable wrapper interface (ignore the stuff above)
class PixSimAPI {
    static #undef = this.init();
    static #connected = false;
    static #RSA = {
        key: null,
        encode: async (text) => {
            if (this.#RSA.key !== null) return await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, this.#RSA.key, new TextEncoder().encode(text));
            else return text;
        }
    };
    static #username = Math.random().toString();
    static #userCache = new Map();
    static #gameCode;
    static #inGame = false;
    static #gameRunning = false;
    static #isHost = false;
    static #gameMode = 0;
    static #teamSize = 1;
    static #team = 0;
    static #gameModes = [
        {
            name: 'Pixelite Crash',
            id: 'pixelcrash',
            description: 'Build vaults of Color and battle to destroy the other Pixelite crystal!<br>Teams must collect colors to create pixels in a battle-royale competition to break through and destroy their opponent.'
        },
        {
            name: 'Platformer Godmode',
            id: 'platformer',
            description: '<b>Requires a Pixel Simulator Platformer player</b><br>Play god and prevent the Platformer Pixel from reaching the goal!'
        }
    ];
    static #spectating = false;
    static #gridWidth = 0;
    static #gridHeight = 0;
    static #inputQueue = [];

    static init() {
        this.onUpdateTeamList = () => { };
        this.onGameModeChange = () => { };
        this.onGameStart = () => { };
        this.onGameKicked = () => { };
        this.onGameClosed = () => { };
        this.onNewGridSize = () => { };
        this.onGameTick = () => { };
        this.onGameInput = () => { };
        this.onDisconnect = () => { };
        socket.on('team', (team) => this.#team = team);
        setInterval(() => {
            if (this.#connected && this.#inGame && this.#gameRunning && this.#inputQueue.length > 0) {
                socket.emit('inputBatch', this.#inputQueue);
                this.#inputQueue.length = 0;
            }
        }, 50);
    }

    static async connect() {
        this.#connected = true;
        await new Promise((resolve, reject) => {
            function sendHTTPRequest() {
                const req = new XMLHttpRequest();
                req.open('GET', apiURI + '/status');
                req.onload = (res) => {
                    if (req.status != 200) {
                        req.onerror();
                        return;
                    }
                    let response = {};
                    try {
                        response = JSON.parse(req.response);
                    } catch (err) {
                        reject(new Error(`Wakeup call failed - Invalid JSON response: ${req.response}`))
                        return;
                    }
                    if ((response.active == false && response.starting == false) || response.crashed == true) reject(new Error(`Wakeup call failed - PixSim API server not active. Try again later or contact Teh Developers.`));
                    if (!socket.connected) {
                        if (response.active == true) socket.connect();
                        else setTimeout(sendHTTPRequest, 3000);
                    }
                };
                req.onerror = (err) => {
                    reject(new Error(`Wakeup call failed - HTTP: ${req.status} ${req.statusText}`));
                };
                req.send();
            };
            sendHTTPRequest();
            socket.once('connect', () => {
                socket.once('requestClientInfo', async (key) => {
                    if (window.crypto.subtle !== undefined) {
                        this.#RSA.key = await window.crypto.subtle.importKey('jwk', key, { name: "RSA-OAEP", hash: "SHA-256" }, false, ['encrypt']);
                    }
                    socket.emit('clientInfo', {
                        client: 'rps',
                        username: this.#username,
                        password: await this.#RSA.encode('')
                    });
                    socket.once('clientInfoRecieved', resolve);
                });
            });
            socket.once('error', reject);
        });
    }
    static async disconnect() {
        this.#connected = false;
        socket.disconnect();
        this.#inGame = false;
        this.#gameRunning = false;
    }
    static async getPublicGames(type) {
        return await new Promise((resolve, reject) => {
            if (!this.#connected || !socket.connected) reject(new Error('PixSim API not connected'));
            socket.emit('getPublicRooms', { type: type, spectating: this.#spectating });
            socket.once('publicRooms', resolve);
        });
    }
    static async createGame() {
        if (this.#inGame) return;
        return await new Promise((resolve, reject) => {
            if (!this.#connected || !socket.connected) reject(new Error('PixSim API not connected'));
            socket.once('gameCode', (code) => {
                this.#gameCode = code;
                this.#inGame = true;
                this.#isHost = true;
                this.#gameMode = 0;
                resolve(code);
            });
            socket.emit('createGame');
        });
    }
    static async joinGame(code) {
        if (this.#inGame) return 1;
        return await new Promise((resolve, reject) => {
            if (!this.#connected || !socket.connected) reject(new Error('PixSim API not connected'));
            socket.once('joinSuccess', (team) => {
                this.#isHost = false;
                this.#inGame = true;
                this.#team = team;
                socket.off('forcedSpectator');
                resolve(0);
            });
            socket.once('forcedSpectator', () => {
                // put a banner (not a modal)
            });
            socket.once('joinFail', (reason) => {
                socket.off('joinSuccess');
                socket.off('forcedSpectator');
                resolve(reason + 1);
            });
            socket.emit('joinGame', { code: code, spectating: this.#spectating });
        });
    }
    static async leaveGame() {
        if (!this.#inGame) return;
        if (this.#isHost && !this.#gameRunning) socket.emit('cancelCreateGame');
        else socket.emit('leaveGame');
        this.#inGame = false;
        this.#gameRunning = false;
    }
    static async kickPlayer(username) {
        if (!this.#isHost || !this.#inGame || this.#gameRunning) return;
        socket.emit('kickPlayer', username);
    }
    static async movePlayer(username, team, username2) {
        if (!this.#isHost || !this.#inGame || this.#gameRunning) return;
        socket.emit('movePlayer', { username: username, team: team, username2: username2 });
    }
    static async startGame() {
        if (this.#inGame && !this.#gameRunning) socket.emit('startGame');
    }

    static set onUpdateTeamList(cb) {
        if (typeof cb != 'function') return;
        socket.off('updateTeamLists');
        socket.on('updateTeamLists', (teams) => {
            this.#teamSize = teams.teamSize;
            cb(teams);
        });
    }
    static set onGameModeChange(cb) {
        if (typeof cb != 'function') return;
        socket.off('gameType');
        socket.on('gameType', (mode) => {
            let i = this.#gameModes.findIndex((gm) => gm.id == mode);
            if (i == -1) return;
            this.#gameMode = i;
            cb(i);
        });
    }
    static set onGameStart(cb) {
        if (typeof cb != 'function') return;
        socket.off('gameStart');
        socket.on('gameStart', async () => {
            this.#gameRunning = true;
            await cb();
            socket.emit('ready');
        });
    }
    static set onGameKicked(cb) {
        if (typeof cb != 'function') return;
        socket.off('gameKicked');
        socket.on('gameKicked', () => {
            cb();
            this.#inGame = false;
            this.#gameRunning = false;
        });
    }
    static set onGameClosed(cb) {
        if (typeof cb != 'function') return;
        socket.off('gameEnd');
        socket.on('gameEnd', () => {
            cb();
            this.#inGame = false;
            this.#gameRunning = false;
        });
    }

    static set gridSize({ width, height } = {}) {
        if (typeof width != 'number' || typeof height != 'number') return;
        this.#gridWidth = width;
        this.#gridHeight = height;
        if (this.#inGame) socket.emit('gridSize', { width: this.#gridWidth, height: this.#gridHeight });
    }
    static set onNewGridSize(cb) {
        if (typeof cb != 'function') return;
        socket.off('gridSize');
        socket.on('gridSize', (size) => {
            this.#gridWidth = size.width;
            this.#gridHeight = size.height;
            if (!this.#inGame || !this.#gameRunning) return;
            cb(this.#gridWidth, this.#gridHeight);
        });
    }
    static sendTick(grid, teamGrid, booleanGrids, { tick, pixelAmounts, pixeliteCounts }) {
        if (!this.#inGame || !this.#gameRunning || !(grid instanceof Array) || grid.length == 0 || grid[0].length == 0 || !(teamGrid instanceof Array) || teamGrid.length == 0 || teamGrid[0].length == 0 || !(booleanGrids instanceof Array) || typeof tick != 'number' || !(grid instanceof Array)) return;
        // simple compression algorithm that compresses well with large horizontal spans of the same pixel
        // not as good as png compression but png is very complex
        // compress main grid into 16-bit chunks of 8-bit id and 8-bit length
        let compressedGrid = [];
        let curr = grid[0][0];
        let len = 0;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] != curr || len == 255) {
                    compressedGrid.push(curr, len);
                    curr = grid[i][j];
                    len = 0;
                }
                len++;
            }
        }
        compressedGrid.push(curr, len);
        // compress team grid into 8-bit chunks of 2-bit id and 6-bit length
        let compressedTeamGrid = [];
        curr = teamGrid[0][0];
        len = 0;
        for (let i = 0; i < teamGrid.length; i++) {
            for (let j = 0; j < teamGrid[i].length; j++) {
                if (teamGrid[i][j] != curr || len == 63) {
                    compressedTeamGrid.push(curr << 6 | len);
                    curr = teamGrid[i][j];
                    len = 0;
                }
                len++;
            }
        }
        compressedTeamGrid.push(curr << 6 | len);
        // compress boolean grid into 8-bit chunks of length and alternating states starting with false
        let compressedBooleanGrids = [];
        for (let boolGrid of booleanGrids) {
            if (boolGrid.length == 0 || boolGrid[0].length == 0) continue;
            let compressedBoolGrid = [];
            let curr = false;
            let len = 0;
            for (let i = 0; i < boolGrid.length; i++) {
                for (let j = 0; j < boolGrid[i].length; j++) {
                    if (boolGrid[i][j] != curr) {
                        compressedBoolGrid.push(len);
                        curr = boolGrid[i][j];
                        len = 0;
                    } else if (len == 255) {
                        compressedBoolGrid.push(len);
                        compressedBoolGrid.push(0);
                        len = 0;
                    }
                    len++;
                }
            }
            compressedBoolGrid.push(len);
            compressedBooleanGrids.push(new Uint8ClampedArray(compressedBoolGrid));
        }
        socket.emit('tick', {
            grid: new Uint8ClampedArray(compressedGrid),
            teamGrid: new Uint8ClampedArray(compressedTeamGrid),
            booleanGrids: compressedBooleanGrids,
            data: {
                tick: tick,
                teamPixelAmounts: pixelAmounts,
                pixelitePixelCount: pixeliteCounts
            },
            origin: 'rps'
        });
    }
    static set onGameTick(cb) {
        if (typeof cb != 'function') return;
        socket.off('tick');
        socket.on('tick', (tick) => {
            if (!this.#inGame || !this.#gameRunning) return;
            cb(new Uint8ClampedArray(tick.grid), new Uint8ClampedArray(tick.teamGrid), tick.booleanGrids.map(g => new Uint8ClampedArray(g)), tick.data);
        });
    }
    static sendInput(type, data) {
        if (typeof type != 'number' || typeof data != 'object' || data == null) return;
        switch (type) {
            case 0:
                if (typeof data.x1 != 'number' || typeof data.y1 != 'number' || typeof data.x2 != 'number' || typeof data.y2 != 'number' || typeof data.pixel != 'number') return;
                this.#inputQueue.push({ type: type, data: [data.x1, data.y1, data.x2, data.y2, data.size, data.pixel] });
                break;
            case 1:
                if (!(data.grid instanceof Array) || data.grid.length == 0 || data.grid[0].length == 0) return;
                let compressedGrid = [];
                let curr = data.grid[0][0];
                let len = 0;
                for (let i = 0; i < data.grid.length; i++) {
                    for (let j = 0; j < data.grid[i].length; j++) {
                        if (data.grid[i][j] != curr || len == 255) {
                            compressedGrid.push(curr, len);
                            curr = data.grid[i][j];
                            len = 0;
                        }
                        len++;
                    }
                }
                compressedGrid.push(curr, len);
                this.#inputQueue.push({ type: type, data: [data[0].length, ...compressedGrid] })
                break;
        }
    }
    static set onGameInput(cb) {
        if (typeof cb != 'function') return;
        socket.off('input');
        let handleInput = (input) => {
            if (!this.#inGame || !this.#gameRunning) return;
            switch (input.type) {
                case 0:
                    cb(input.type, { x1: input.data[0], y1: input.data[1], x2: input.data[2], y2: input.data[3], size: input.data[4], pixel: input.data[5] }, input.team);
                    break;
                case 1:
                    cb(input.type, { width: input.data[0], grid: input.data.slice(1) }, input.team);
                    break;
            }
        };
        socket.on('input', handleInput);
        socket.on('inputBatch', (inputs) => {
            for (let input of inputs) handleInput(input);
        });
    }

    static set teamSize(size) {
        if (typeof size == 'number') socket.emit('teamSize', parseInt(size));
    }
    static set gameMode(mode) {
        if (typeof mode == 'number' && mode >= 0 && mode < this.#gameModes.length) {
            this.#gameMode = mode;
            socket.emit('gameType', this.#gameModes[this.#gameMode].id);
        }
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
    static get team() {
        return this.#team;
    }
    static get gameMode() {
        return this.#gameMode;
    }
    static get gameModeCount() {
        return this.#gameModes.length;
    }
    static get gameModeData() {
        return this.#gameModes[this.#gameMode] ?? this.#gameModes[0];
    }
    static get gameRunning() {
        return this.#gameRunning;
    }
    static get spectating() {
        return this.#spectating;
    }

    static set onDisconnect(cb) {
        if (typeof cb != 'function') return;
        socket.off('disconnect');
        socket.off('timeout');
        socket.off('error');
        let handle = () => {
            if (!this.#connected) return;
            cb();
            this.#connected = false;
            this.#inGame = false;
            this.#gameRunning = false;
        };
        socket.on('disconnect', handle);
        socket.on('timeout', handle);
        socket.on('error', handle);
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