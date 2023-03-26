const { BrowserWindow, app, shell } = require('electron');
const url = require('url');
const path = require('path');

const { updateAppConfig, getAppConfig } = require('./app-config');
const contextMenu = require('./context-menu');
const updateTitle = require('../utils/update-title');
const appTray = require('./app-tray');

const APP_URL = 'https://app.meiqia.com';

const handleWindowEvents = window => {
  window.webContents.on('page-title-updated', (e, title) => {
    updateTitle(window, title);
    appTray.updateTarySub();
  });

  window.webContents.on('new-window', (e, val) => {
    e.preventDefault();
    const { protocol } = url.parse(val);
    if (protocol === 'http:' || protocol === 'https:') {
      // 为了安全考虑，所有链接都通过外部浏览器打开
      shell.openExternal(val);
    }
  });

  window.on('resize', () => {
    const size = window.getSize();
    updateAppConfig('windowSize', size); // 记住调整后的窗口大小
  });

  window.on('close', e => {
    if (!app.enableClose && !app.update) {
      e.preventDefault();
      window.hide();
      appTray.updateTarySub();
    }
  });

  window.on('closed', () => {
    app.enableClose = false;
    appTray.updateTarySub();
  });

  window.on('show', () => {
    appTray.updateTarySub();
  });

  window.on('hide', () => {
    appTray.updateTarySub();
  });
};

/**
 * 多开新窗口
 */
const createWindow = () => {
  // 创建浏览器窗口
  let window;
  const appConfig = getAppConfig();
  // 第一个窗口用默认的 session
  if (BrowserWindow.getAllWindows().length === 0) {
    window = new BrowserWindow({
      width: appConfig.windowSize[0],
      height: appConfig.windowSize[1],
      minWidth: 480,
      minHeight: 240,
      maximizable: true,
      minimizable: true,
      fullscreenable: true,
      autoHideMenuBar: true,
      resizable: true,
      scrollBounce: true,
      webPreferences: {
        nodeIntegration: appConfig.nodeEvent,
        preload: path.join(__dirname, 'preload.js') // 不要用相对路径
      }
    });
  } else {
    // todo 这里的 partition 可以与多开账号绑定，这样就不用重新登录
    window = new BrowserWindow({
      width: appConfig.windowSize[0],
      height: appConfig.windowSize[1],
      minWidth: 480,
      minHeight: 240,
      maximizable: true,
      minimizable: true,
      fullscreenable: true,
      autoHideMenuBar: true,
      resizable: true,
      scrollBounce: true,
      webPreferences: {
        nodeIntegration: appConfig.nodeEvent,
        preload: path.join(__dirname, 'preload.js'), // 不要用相对路径
        partition: `persist:${new Date().getMilliseconds()}`
      }
    });
  }

  // 给工作台使用，更新 title 的时候会用到
  app.windowId = window.id;
  window.webContents.loadURL(APP_URL, {
    httpReferrer: APP_URL
  });
  // 添加页面内右键菜单
  contextMenu(window);
  // 处理各种窗口事件回调
  handleWindowEvents(window);
  // 保存到全局，给工作台读取
  app.config = getAppConfig();
  // 更新tray
  appTray.updateTarySub();

  return window;
};

module.exports = createWindow;
