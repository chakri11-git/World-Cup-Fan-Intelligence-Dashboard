const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Route mapping
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);

module.exports = router;
