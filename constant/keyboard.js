const refreshCommand = process.platform === 'darwin' ? 'Cmd+R' : 'F5';
const newWindowCmd = process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N';
const goForwardCmd = process.platform === 'darwin' ? 'Cmd+F' : 'Ctrl+F';
const goBackCmd = process.platform === 'darwin' ? 'Cmd+B' : 'Ctrl+B';

module.exports = {
  refreshCommand,
  newWindowCmd,
  goForwardCmd,
  goBackCmd
};
