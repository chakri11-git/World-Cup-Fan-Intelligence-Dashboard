const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication Middleware to verify JWT tokens
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized access attempt: No authorization header found');
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_worldcup_key_change_me_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication token validation error: ${error.message}`);
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

module.exports = authMiddleware;
