const https = require('https');
const fs = require('fs');

const downloadFile = (url, dest, cb) => {
  const writeStream = fs.createWriteStream(dest);
  https
    .get(url, response => {
      response.pipe(writeStream);
      writeStream.on('close', () => { 
        if (cb) cb();
      });
    })
    .on('error', err => {
      fs.unlink(dest);
      if (cb) cb(err);
    });
};

module.exports = downloadFile;
