const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route mapping
router.get('/prediction/:matchId', aiController.getMatchPrediction);
router.post('/chat', aiController.postFanChat);

module.exports = router;
