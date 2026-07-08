const express = require('express');
const cors = require('cors');

// Import routes
const matchRoutes = require('./src/routes/matchRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const fanRoutes = require('./src/routes/fanRoutes');
const aiInsightsRoutes = require('./src/routes/aiInsightsRoutes');
const supportRoutes = require('./src/routes/supportRoutes');

const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Routes mounting
app.use('/api/matches', matchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/fan-profile', fanRoutes);
app.use('/api/ai-insights', aiInsightsRoutes);
app.use('/api/support', supportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
