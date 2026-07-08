const footballApiService = require('../services/api/footballApiService');
const logger = require('../utils/logger');

/**
 * Controller to fetch all group configurations and standings
 */
exports.getAllGroups = async (req, res, next) => {
  try {
    logger.info('Fetching list of all groups and standings');
    const groups = await footballApiService.getStandings();
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    logger.error(`Error in getAllGroups controller: ${error.message}`);
    next(error);
  }
};

/**
 * Controller to fetch group details by ID
 */
exports.getGroupById = async (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ success: false, message: 'Invalid group identifier format.' });
  }
  try {
    logger.info(`Fetching details for group ID: ${id}`);
    const groups = await footballApiService.getStandings();
    const group = groups.find(g => g.groupId.toLowerCase() === id.toLowerCase());

    if (!group) {
      return res.status(404).json({
        success: false,
        message: `Group with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    logger.error(`Error in getGroupById controller: ${error.message}`);
    next(error);
  }
};
