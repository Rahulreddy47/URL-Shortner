const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'access.log');

module.exports = function customLogger(req, res, next) {
  const log = {
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };

  fs.appendFile(logPath, JSON.stringify(log) + "\n", err => {
    if (err) console.error('Logging failed:', err);
  });

  next();
};
