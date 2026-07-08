const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Route mapping
router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatchById);

module.exports = router;
