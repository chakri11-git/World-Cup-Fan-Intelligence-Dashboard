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

const rateLimit = require('express-rate-limit');

const app = express();

// Configure strict CORS allowed origins to resolve credentials + wildcard conflict
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://world-cup-fan-intelligence-dashboar-seven.vercel.app'] 
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiter middleware to prevent spamming and Gemini API quota exhaustion
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

// Apply rate limiting to all API endpoints
app.use('/api', limiter);

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
