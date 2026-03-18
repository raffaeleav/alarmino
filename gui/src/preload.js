const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
    onMqttMessage: (callback) => ipcRenderer.on('mqtt-message', (event, data) => callback(data)),
    onTimeout: (callback) => ipcRenderer.on('timeout', (event, data) => callback(data)),
    exit: () => ipcRenderer.send('exit')
});
