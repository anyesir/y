const { ipcRenderer, contextBridge } = require('electron');

const init = async () => {
  contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
      ...ipcRenderer,
      on: ipcRenderer.on,
      once: ipcRenderer.once,
      invoke: ipcRenderer.invoke
    },
    MAC: await ipcRenderer.invoke('getMAC'),
    config: await ipcRenderer.invoke('getConfig'),
    windowId: await ipcRenderer.invoke('getCurrentWindowId'),
    versionCode: await ipcRenderer.invoke('getVersionCode')
  });

  contextBridge.exposeInMainWorld('isElectron', true);
}

init();