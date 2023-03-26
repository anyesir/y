const { app, BrowserWindow, Menu } = require('electron');

const createWindow = require('./create-window');
const { newWindowCmd, goForwardCmd, goBackCmd } = require('../constant/keyboard');
const { checkVersionConfig } = require('./update');
const packageInfo = require('../package.json');
const { showShareConfirmDialog } = require('../utils/log');

const appMenu = () => {
  const appMenuTemplate = [
    {
      label: '视图',
      submenu: [
        {
          label: '新建窗口',
          accelerator: newWindowCmd,
          click() {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              createWindow();
            }
          }
        },
        { label: '刷新', role: 'reload' },
        {
          label: '回退',
          accelerator: goBackCmd,
          click() {
            const focusedWindow = BrowserWindow.getFocusedWindow();

            if (focusedWindow) focusedWindow.webContents.goBack();
          }
        },
        {
          label: '前进',
          accelerator: goForwardCmd,
          click() {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) focusedWindow.webContents.goForward();
          }
        },
        { label: '强制刷新', role: 'forcereload' },
        { type: 'separator' },
        { label: '重置缩放', role: 'resetzoom' },
        { label: '放大', role: 'zoomin' },
        { label: '缩小', role: 'zoomout' },
        { type: 'separator' },
        { label: '全屏', role: 'togglefullscreen' },
        { label: '开发者工具', role: 'toggleDevTools' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', role: 'undo' },
        { label: '重做', role: 'redo' },
        { label: '', type: 'separator' },
        { label: '剪切', role: 'cut' },
        { label: '复制', role: 'copy' },
        { label: '粘贴', role: 'paste' },
        { label: '删除', role: 'delete' },
        { label: '全选', role: 'selectall' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '检查更新',
          click() {
            checkVersionConfig();
          }
        },
        {
          label: '日志文件',
          click() {
            showShareConfirmDialog(BrowserWindow.getFocusedWindow());
          }
        },
        {
          label: `当前版本：${app.getVersion() + '(' + packageInfo.versionCode + ')'}`,
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    appMenuTemplate.unshift({
      label: app.getName(),
      submenu: [
        { label: '关于', role: 'about' },
        { type: 'separator' },
        { label: '隐藏', role: 'hide' },
        { label: '隐藏其他程序', role: 'hideothers' },
        { label: '显示', role: 'unhide' },
        { type: 'separator' },
        { label: '退出', role: 'quit' }
      ]
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenuTemplate));
};

module.exports = appMenu;
