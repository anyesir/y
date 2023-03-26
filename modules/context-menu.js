const { app, clipboard, Menu, Notification, dialog } = require('electron');

const downloadFile = require('../utils/download-file');
const { goBackCmd } = require('../constant/keyboard');

const contextMenu = window => {
  // 页面内右键菜单
  window.webContents.on('context-menu', (event, params) => {
    const menuTmpl = [
      { label: '刷新', role: 'reload' },
      { label: '全选', role: 'selectall' },
      {
        label: '后退',
        click() {
          window.webContents.goBack();
        }
      }
    ];
    if (params.editFlags.canCopy) menuTmpl.push({ label: '复制', role: 'copy' });
    if (params.editFlags.canCut) menuTmpl.push({ label: '剪切', role: 'cut' });
    if (params.editFlags.canPaste) menuTmpl.push({ label: '粘贴', role: 'paste' });
    if (params.editFlags.canDelete) menuTmpl.push({ label: '删除', role: 'delete' });

    if (params.linkURL) {
      menuTmpl.push({
        label: '复制链接地址',
        click() {
          clipboard.writeText(params.linkURL);
        }
      });
    }
    if (['image'].indexOf(params.mediaType) > -1) {
      menuTmpl.push({
        label: '复制图片',
        click() {
          window.webContents.copyImageAt(params.x, params.y);
        }
      });
      menuTmpl.push({
        label: '保存',
        click() {
          const pathParts = params.srcURL.split('?')[0].split('/');
          const defaultPath = `${app.getPath('downloads')}/${pathParts[pathParts.length - 1]}`;
          const options = { defaultPath };
          dialog.showSaveDialog(window, options).then(data => {
            const {canceled = true, filePath = ''} = data

            if(canceled) return
            downloadFile(params.srcURL, filePath, err => {
              let notif;
              if (err) {
                notif = new Notification({
                  title: '文件下载失败',
                  body: err.message
                });
              } else {
                notif = new Notification({
                  title: '文件下载成功',
                  body: `保存路径: ${filePath}`
                });
              }
              return notif;
            });
          }).catch(err => {
            console.log(err)
          })
        }
      });
    }
    const menu = Menu.buildFromTemplate(menuTmpl);
    const { x, y } = params;
    menu.popup({ window, x, y });
  });
};

module.exports = contextMenu;
