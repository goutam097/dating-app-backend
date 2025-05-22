const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const https = require('https');
const fs = require("fs");
let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  const port = Number(config.port) || 3000;
  const hostname = config.hostname || 'localhost';
  const ssl = config.ssl;
  let httpsOptions = app;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(keyPath, 'utf8'),
      cert: fs.readFileSync(certPath, 'utf8'),
    };
    httpsOptions = https.createServer(httpsOptions, app);
  }
  server = httpsOptions.listen(port, hostname, () => {
    const address = 'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    logger.info(`Listening to port ${address}`);
  });

});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});