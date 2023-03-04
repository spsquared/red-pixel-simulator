const socket = io('https://PixSim-API.radioactivestuf.repl.co', {
    path: '/pixsim-api',
    autoConnect: false,
    reconnection: false
});
let apiconnected = false;
function handlePixSimAPIDisconnect() {
    if (apiconnected) {
        modal('PixSim API', '<span style="color: red;">PixSim API was disconnected.</span>', false);
        // kick out of game
        apiconnected = false;
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
    }
}, 1000);
socket.on('pong', () => {
    let prevPing = ping;
    ping = performance.now() - pingSend;
    jitter = Math.abs(ping - prevPing) * 0.5 + jitter * 0.5;
    pingReceived = true;
    if (ping > 500 || jitter > 200) {
        highPingWarning.style.display = 'block';
        highPingWarningPing.innerHTML =`Ping: ${Math.round(ping)}ms<br>Jitter: ${Math.round(jitter)}ms`;
    } else {
        highPingWarning.style.display = '';
    }
});

// connection
async function connectAPI() {
    apiconnected = true;
    await new Promise((resolve, reject) => {
        const wakeup = new XMLHttpRequest();
        wakeup.open('GET', 'https://PixSim-API.radioactivestuf.repl.co');
        wakeup.onerror = (e) => {
            reject(new Error(`wakeup call failed: ${wakeup.status}`));
        };
        wakeup.send();
        socket.connect();
        socket.once('connect', resolve);
        socket.once('error', reject);
    })
};
async function disconnectAPI() {
    apiconnected = false;
    socket.disconnect();
};