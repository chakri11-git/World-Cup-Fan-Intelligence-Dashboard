require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
// Env reload trigger

const PORT = process.env.PORT || 5000;

// Create HTTP server wrapper around Express app
const server = http.createServer(app);

// Initialize Socket.io with cross-origin policies matching CORS middleware
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      const originClean = origin ? origin.replace(/\/$/, '') : '';
      if (!origin || 
          originClean.endsWith('.vercel.app') || 
          originClean.includes('localhost') || 
          originClean.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Expose Socket.io instance on express application context so controllers can emit events
app.set('io', io);

// Handle WebSockets connection events
io.on('connection', (socket) => {
  logger.info(`[Socket.io] Realtime client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`[Socket.io] Realtime client disconnected: ${socket.id}`);
  });
});

// Initialize Database connection
connectDB().then(() => {
  // Start Express & WebSocket Server listening after DB mounts
  server.listen(PORT, () => {
    logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} (WebSockets Active)`);
  });
}).catch(err => {
  logger.error(`Failed to initialize database: ${err.message}`);
  // In a local/mock-only setup or testing context, allow server to boot without database
  if (process.env.NODE_ENV !== 'production') {
    logger.warn('Booting server in database fallback simulation mode.');
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} (Database Offline/Mock Mode - WebSockets Active)`);
    });
  } else {
    process.exit(1);
  }
});
