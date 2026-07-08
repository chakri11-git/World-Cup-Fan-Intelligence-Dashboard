const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route mapping
router.get('/prediction/:matchId', aiController.getMatchPrediction);
router.get('/trends', aiController.getAITrends);
router.post('/generate', aiController.generateGroundedInsights);

module.exports = router;
