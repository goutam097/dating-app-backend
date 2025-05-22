const winston = require('winston');
const { DailyRotateFile } = require('winston-daily-rotate-file');
const moment = require('moment');
const { createNamespace, getNamespace } = require('cls-hooked');
const namespace = getNamespace('app');

const getLoggerAndLogError = async (statusCode, body, errorMessage) => {
  try {
    const apiUrl = getNamespace('app').get('requestUrl');
    const logger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'error-file-of-%DATE%.log',
          frequency: '1m',
          datePattern: 'DD-MM-YYYY',
          maxSize: '10000000000k',
          maxFiles: '10000000d',
          dirname: 'errorlogs',
        }),
      ],
    });

    logger.error(
      `Status Code: ${statusCode} on ${moment().format('Do MMMM YYYY, h:mm:ss a')}, Request Object: ${JSON.stringify(
        body
      )}, API Url: ${apiUrl}, Error Message: ${errorMessage}`
    );
  } catch (error) {
    console.log('Error in getLoggerAndLogError: ', error);
  }
}

module.exports = getLoggerAndLogError;
