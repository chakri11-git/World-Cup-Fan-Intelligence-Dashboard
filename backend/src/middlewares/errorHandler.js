const logger = require('../utils/logger');

/**
 * Express centralized global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}\nStack Trace: ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
