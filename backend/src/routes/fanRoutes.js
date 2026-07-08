const express = require('express');
const router = express.Router();
const fanController = require('../controllers/fanController');

// Route mapping
router.get('/', fanController.getProfile);
router.put('/', fanController.updateProfile);
router.get('/recommendations', fanController.getRecommendations);

module.exports = router;
