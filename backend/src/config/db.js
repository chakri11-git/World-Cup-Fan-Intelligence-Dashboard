const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Disable query buffering globally to prevent Express endpoints from hanging 
// for 10 seconds when MongoDB is disconnected. Ensures instant fallback response.
mongoose.set('bufferCommands', false);

/**
 * Connect to MongoDB database instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/worldcup_dashboard', {
      serverSelectionTimeoutMS: 2000 // Fast fail-over timeout of 2 seconds for server discovery
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
    // Throw error so that the server entry point can decide on local fallback strategies
    throw error;
  }
};

module.exports = connectDB;
