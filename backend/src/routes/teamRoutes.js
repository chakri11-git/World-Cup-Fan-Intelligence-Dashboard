const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Route mapping
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);

module.exports = router;
