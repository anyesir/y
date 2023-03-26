const { BrowserWindow, ipcMain, app, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const packageInfo = require('../package.json');
const fs = require('fs');

// 关闭自动下载更新
autoUpdater.autoDownload = false;
let mamul = false;

function sendStatusToWindow(text) {
  const windows = BrowserWindow.getAllWindows();

  windows.forEach(win => {
    win.webContents.send('update-message', text);
  });
}

const mamulCheckUpdate = () => {
  mamul = true;
  autoUpdater.checkForUpdatesAndNotify();
};

const checkVersionConfig = (window) => {
  const { net } = require('electron')
  // 获取时间戳
  const timeStamp = new Date().getTime()
  const request = net.request('https://downloads.meiqiausercontent.com/pc_version_config.txt?t=' + timeStamp);
  request.on('response', (response) => {
    if (response.statusCode == 200) {
      response.on('data', (chunk) => {
        const responseInfo = JSON.parse(chunk);
        let versionConfig = process.platform == 'darwin' ? responseInfo.mac : responseInfo.win;
        let isNewVersionFind = versionConfig.versionCode > packageInfo.versionCode;
        if (!isNewVersionFind) {
          return;
        }
        var isForceUpdate = false;
        if (packageInfo.versionCode < versionConfig.forceCodeBelow
          || versionConfig.forceCodes.includes(packageInfo.versionCode)) {
          isForceUpdate = true;
        }
        dialog.showMessageBox(window, {
          type: 'info',
          title: '发现新版本 ' + versionConfig.version,
          detail: versionConfig.description,
          defaultId: 0,
          buttons: isForceUpdate ? ['更新'] : ['更新', '忽略']
        }).then(result => {
          // 点击了「更新」
          if (result.response == 0) {
            const dowloadingDialogController = new AbortController(); // 控制 dialog 关闭
            window.webContents.session.on('will-download', (event, item, webContents) => {
              const filePath = app.getPath('downloads') + '/' + item.getFilename();
              var isInstallFileExist = fs.existsSync(filePath);
              // 删除旧文件
              if (isInstallFileExist) {
                fs.rmSync(filePath);
              }
              // 下载最新版本
              item.setSavePath(filePath);
              // 监听更新进度
              item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                  if (isForceUpdate) {
                    // 关闭 正在下载 的 dialog
                    dowloadingDialogController.abort();
                    checkVersionConfig(window);
                  }
                } else if (state === 'progressing') {
                  if (item.isPaused()) {
                    console.log('Download is paused')
                  } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                  }
                }
              })
              // 监听下载完成
              item.once('done', (event, state) => {
                // 关闭 正在下载 的 dialog
                dowloadingDialogController.abort();
                if (state === 'completed') {
                  // 下载完成，提示安装
                  dialog.showMessageBox(window, { type: 'info', title: '下载完成', detail: '是否立即安装？', buttons: isForceUpdate ? ['立即安装'] : ['立即安装', '取消'], defaultId: 0 })
                    .then(result => {
                      // 点击「立即安装」
                      if (result.response == 0) {
                        shell.openPath(filePath);
                        // 启动安装后，关闭客户端
                        app.exit(0);
                      }
                    });
                } else {
                  // 失败后，如果是强制更新，那么点击后继续显示 dialog
                  if (isForceUpdate) {
                    checkVersionConfig(window);
                  }
                }
              });
            })
            window.webContents.downloadURL(versionConfig.downloadURL);
            // 显示正在下载的 dialog
            showDownloadingDialog(window, isForceUpdate, dowloadingDialogController);
          }
        })
          .catch(e => {
            console.log('error', e);
          });
      })
    }
  })
  request.end();
}

function showDownloadingDialog(window, isForceUpdate, dowloadingDialogController) {
  dialog.showMessageBox(window, {
    signal: dowloadingDialogController.signal,
    type: 'info',
    title: '更新中',
    detail: '正在下载，请稍后...',
    buttons: [isForceUpdate ? '-' : '后台更新']
  }).then(result => {
    // 后台更新
    if (result.response == 0) {
      // 如果是强制更新，那么点击后继续显示 dialog
      if (isForceUpdate) {
        showDownloadingDialog(window, isForceUpdate, dowloadingDialogController);
      }
    }
  });
}

const handleUpdate = () => {
  // 应用通知检测更新
  ipcMain.on('checkupdate-app', () => {
    mamul = false;
    autoUpdater.checkForUpdatesAndNotify();
  });

  // 用户确认下载
  ipcMain.on('download-app', () => {
    autoUpdater.downloadUpdate();
  });

  // 用户确认更新
  ipcMain.on('update-app', () => {
    app.update = true;
    setTimeout(() => autoUpdater.quitAndInstall(), 1000);
  });

  autoUpdater.on('checking-for-update', info => {
    sendStatusToWindow({ type: 'checking', message: info });
  });

  autoUpdater.on('update-available', info => {
    sendStatusToWindow({ type: 'available', message: { ...info, mamul } });
  });

  autoUpdater.on('update-not-available', info => {
    if (mamul) {
      sendStatusToWindow({ type: 'notAvailable', message: { ...info, mamul } });
    }
  });

  autoUpdater.on('error', err => {
    sendStatusToWindow({ type: 'err', message: err });
  });

  autoUpdater.on('download-progress', progressObj => {
    const { bytesPerSecond, percent, transferred, total } = progressObj;
    sendStatusToWindow({
      type: 'download',
      message: {
        bytesPerSecond,
        percent,
        transferred,
        total
      }
    });
  });

  autoUpdater.on('update-downloaded', info => {
    sendStatusToWindow({
      type: 'downloaded',
      message: { ...info }
    });
  });
};

module.exports = {
  handleUpdate,
  mamulCheckUpdate,
  checkVersionConfig
};
