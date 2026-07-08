const geminiService = require('../services/ai/geminiService');
const footballApiService = require('../services/api/footballApiService');
const FanChat = require('../models/FanChat');
const aiInsightsMock = require('../mock/aiInsightsMock.json');
const teamsMock = require('../mock/teamsMock.json');
const historyMock = require('../mock/historyMock.json');
const fanProfileMock = require('../mock/fanProfileMock.json');
const logger = require('../utils/logger');

/**
 * Controller to trigger AI Match prediction and tactical analysis
 */
exports.getMatchPrediction = async (req, res, next) => {
  const { matchId } = req.params;
  if (!matchId || !/^[a-zA-Z0-9_-]+$/.test(matchId)) {
    return res.status(400).json({ success: false, message: 'Invalid matchId format.' });
  }
  try {
    logger.info(`Requested AI prediction for match: ${matchId}`);
    
    // Retrieve match details
    const match = await footballApiService.getMatchDetails(matchId);
    
    // Process prediction with Gemini
    const insights = await geminiService.generateMatchAnalysis(match);

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle fan messages and run real-time sentiment analysis
 */
exports.postFanChat = async (req, res, next) => {
  const { username, message, matchId, homeScorePrediction, awayScorePrediction } = req.body;
  try {
    if (!username || !message || !matchId) {
      return res.status(400).json({ success: false, message: 'username, message, and matchId are required.' });
    }

    if (typeof username !== 'string' || username.trim().length === 0 || username.length > 100) {
      return res.status(400).json({ success: false, message: 'Invalid username format.' });
    }
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 500) {
      return res.status(400).json({ success: false, message: 'Invalid message format.' });
    }
    if (typeof matchId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(matchId)) {
      return res.status(400).json({ success: false, message: 'Invalid matchId format.' });
    }

    logger.info(`Received community fan chat from ${username} on match ${matchId}`);

    // Analyze message sentiment using AI (Gemini)
    const sentiment = await geminiService.analyzeFanSentiment(message);

    const hasPrediction = homeScorePrediction !== undefined && homeScorePrediction !== null && homeScorePrediction !== '';
    
    // Save chat item
    const chatLog = new FanChat({
      username,
      message,
      matchId,
      prediction: hasPrediction ? {
        homeScorePrediction: parseInt(homeScorePrediction),
        awayScorePrediction: parseInt(awayScorePrediction)
      } : undefined,
      sentiment,
      aiAnalyzed: true
    });

    try {
      await chatLog.save();
    } catch (dbError) {
      logger.warn(`Could not save fan chat to database: ${dbError.message}. Proceeding with simulated transient return.`);
    }

    // Broadcast created chat item to all connected WebSocket clients in real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('new_message', chatLog);
    }

    res.status(201).json({
      success: true,
      data: chatLog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch tournament tactical trends from AI insights
 */
exports.getAITrends = async (req, res, next) => {
  try {
    logger.info('Fetching overall tournament tactical trends');
    res.status(200).json({
      success: true,
      data: aiInsightsMock
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate strictly grounded AI insights for a specific team
 */
exports.generateGroundedInsights = async (req, res, next) => {
  const { teamId } = req.body;
  try {
    if (!teamId) {
      return res.status(400).json({ success: false, message: 'teamId is required.' });
    }

    logger.info(`Requested grounded AI insights for team: ${teamId}`);

    // Retrieve local JSON inputs
    const teams = await footballApiService.getTeams();
    const team = teams.find(t => t.teamId.toLowerCase() === teamId.toLowerCase());
    if (!team) {
      return res.status(404).json({ success: false, message: `Team with ID ${teamId} not found.` });
    }

    // Process grounded summary using Gemini
    const insights = await geminiService.generateGroundedInsights(team, fanProfileMock, historyMock);

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};
