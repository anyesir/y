const electron = require('electron');
const { app, dialog } = electron;
const fs = require('fs');
const path = require('path');

const LOG_FILE_DIR = 'meiqia_log';
const LOG_FILE_NAME = 'meiqia';

const wLog = (content) => {
    const logFilePath = getLogFilePath(LOG_FILE_NAME);
    // append content
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const dateTime = `${date} ${time}`;
    // add date time and new line
    fs.appendFileSync(logFilePath, `${dateTime} ${content} \n`);
};

const showShareConfirmDialog = (window) => {
    // show dialog
    dialog.showMessageBox(window, {
        type: 'info',
        title: '日志文件',
        detail: '找到 meiqia_log 文件夹，并将文件夹发送给相关人员',
        buttons: ['打开', '取消'],
        defaultId: 0
    }).then(result => {
        if (result.response === 0) {
            // hilight the file
            electron.shell.showItemInFolder(getLogFileDir());
        }
    });
}

function getLogFilePath(fileName) {
    const logFileDir = getLogFileDir();
    // today's log file, name to be: meiqia_log/meiqia_20180808.log
    return path.join(logFileDir, `${fileName}_${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.log`);
}

function getLogFileDir() {
    const logFileDir = path.join(app.getPath('userData'), LOG_FILE_DIR);
    if (!fs.existsSync(logFileDir)) {
        fs.mkdirSync(logFileDir);
    }
    return logFileDir;
}

module.exports = {
    wLog,
    showShareConfirmDialog
};
