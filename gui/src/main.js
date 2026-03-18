const fs = require('fs'); 
const path = require('path');
const mqtt = require('mqtt');
const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow, timeout;
const TIMEOUT_DURATION = 15000;

const resetTimeout = () => {
    if(timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        console.log('[error] no messages received in the last 15 seconds');

        mainWindow.webContents.send('timeout');
    }, TIMEOUT_DURATION);
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        }
    });

    mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();

    const options = {
        host: '172.20.10.2',
        port: 8883,
        protocol: 'mqtts', 
        ca: fs.readFileSync(path.join(__dirname, 'certificates', 'rootCA.pem')),
        username: 'gui',
        password: 'alarmino', 
        rejectUnauthorized: false
    };

    mqttClient = mqtt.connect(options);

    mqttClient.on('connect', () => {
        console.log('[log] connected to the mqtt broker');

        mqttClient.subscribe('gas/state', (err) => {
            if (!err) {
                console.log('[log] topic subscription complete');
            }

            resetTimeout();
        });
    });

    mqttClient.on('message', (topic, message) => {
        mainWindow.webContents.send('mqtt-message', { topic, message: message.toString() });

        resetTimeout();
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('exit', () => {
    app.quit();
});