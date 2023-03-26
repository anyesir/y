const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');

const { updateAppConfig, getAppConfig } = require('./app-config');
const createWindow = require('./create-window');

let trayTime;
const TIMER = 2000;

const getMenuItme = () => {
  const appConfig = getAppConfig();
  const contextMenuItems = [
    {
      label: '显示应用'
    },
    {
      label: '关闭应用'
    },
    {
      label: '气泡提示',
      type: 'checkbox',
      checked: appConfig.showNotification,
      click(menuItem) {
        const appConfig = getAppConfig();
        updateAppConfig('showNotification', !appConfig.showNotification);
      }
    },
    {
      label: '提醒设置',
      submenu: [
        {
          label: '激活窗口',
          type: 'radio',
          checked: appConfig.onNewMessage === 'focus',
          click() {
            updateAppConfig('onNewMessage', 'focus');
          }
        },
        {
          label: '图标闪烁',
          type: 'radio',
          checked: appConfig.onNewMessage === 'flash',
          click() {
            updateAppConfig('onNewMessage', 'flash');
          }
        }
      ]
    },
    {
      label: '退出程序',
      click() {
        app.exit(0);
      }
    }
  ];
  return contextMenuItems;
};

const appTray = () => {
  if (!app.tray) {
    const tray = new Tray(path.resolve(__dirname, '../assets/tray.png'));
    const contextMenuItems = getMenuItme();
    const contextMenu = Menu.buildFromTemplate(contextMenuItems);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      const browserWindow = BrowserWindow.getAllWindows();
      if (browserWindow.length > 0) {
        browserWindow.forEach(win => win.show());
      }
    });

    app.tray = tray;
  }
};

const updateTarySub = () => {
  const { tray } = app;
  const contextMenuItems = getMenuItme();
  if (tray && contextMenuItems) {
    const browserWindow = BrowserWindow.getAllWindows();
    if (browserWindow.length > 0) {
      const browserMenu = [];
      const closeMenu = [];
      browserWindow.forEach(win => {
        browserMenu.push({
          label: `${win.isVisible() ? '[已激活]' : '[未激活]'} ${win.title}`,
          click() {
            win.show();
          }
        });
        closeMenu.push({
          label: `${win.title}`,
          click() {
            app.enableClose = true;
            win.close();
          }
        });
      });
      contextMenuItems[0].submenu = browserMenu;
      contextMenuItems[1].submenu = closeMenu;
    } else {
      contextMenuItems[0].submenu = [];
      contextMenuItems[1].submenu = [];
    }

    const menus = Menu.buildFromTemplate(contextMenuItems);
    tray.setContextMenu(menus);
  }
};

const taryFlash = () => {};

appTray.updateTarySub = updateTarySub;

module.exports = appTray;
