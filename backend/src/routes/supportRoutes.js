const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// Route mapping
router.get('/', supportController.getSupportAnalytics);
router.post('/vote', supportController.castSupportVote);

module.exports = router;
