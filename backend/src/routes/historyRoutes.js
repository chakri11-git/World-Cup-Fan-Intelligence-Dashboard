const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Route mapping
router.get('/', historyController.getHistoryData);

module.exports = router;
