const winston = require('winston');

// Define log level based on environment
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
];

const logger = winston.createLogger({
  level,
  format,
  transports,
});

module.exports = logger;
