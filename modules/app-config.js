const { app } = require('electron');
const fs = require('fs');

let appConfig;
const configPath = `${app.getPath('userData')}/config.json`;
const defaultConfig = {
  openAtLogin: false,
  closeToTray: false,
  showNotification: true,
  onNewMessage: 'flash', // focus | flash,
  windowSize: [1280, 800],
  isAlpha: false,
  nodeEvent: false
};

const getAppConfig = () => {
  // 先检查 App 目录是否存在
  if (!fs.existsSync(app.getPath('userData'))) {
    fs.mkdirSync(app.getPath('userData'));
  }

  if (appConfig) {
    return { ...defaultConfig, ...appConfig };
  }

  try {
    const localConfig = JSON.parse(fs.readFileSync(configPath));
    if (localConfig) {
      appConfig = { ...defaultConfig, ...localConfig };
      return appConfig;
    }
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig), 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig), 'utf8');
    }
    return defaultConfig;
  }
  return defaultConfig;
};

const updateAppConfig = (key, value) => {
  if (!appConfig) {
    return false;
  }
  appConfig[key] = value;
  fs.writeFileSync(configPath, JSON.stringify(appConfig), 'utf8');
  return appConfig;
};

module.exports = {
  getAppConfig,
  updateAppConfig
};
