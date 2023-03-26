const { app, BrowserWindow, globalShortcut } = require('electron');

const { refreshCommand, newWindowCmd, goForwardCmd, goBackCmd } = require('../constant/keyboard');
const createWindow = require('./create-window');

const registerKeyboard = () => {
  app.on('browser-window-focus', () => {
    globalShortcut.register(refreshCommand, () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow && focusedWindow.isVisible()) {
        // eslint-disable-next-line no-unused-expressions
        focusedWindow.webContents ? focusedWindow.webContents.reload() : focusedWindow.reload();
      }
    });
    globalShortcut.register(newWindowCmd, () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow && focusedWindow.isVisible()) {
        createWindow();
      }
    });
    globalShortcut.register(goForwardCmd, () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow && focusedWindow.isVisible() && focusedWindow.webContents) {
        focusedWindow.webContents.goForward();
      }
    });
    globalShortcut.register(goBackCmd, () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow && focusedWindow.isVisible() && focusedWindow.webContents) {
        focusedWindow.webContents.goBack();
      }
    });
  });

  app.on('browser-window-blur', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    // 当没有任何窗口激活时 注销快捷键监听
    if (!focusedWindow) globalShortcut.unregisterAll();
  });
};

module.exports = registerKeyboard;
