const footballApiService = require('../services/api/footballApiService');
const logger = require('../utils/logger');

/**
 * Controller to fetch all World Cup teams
 */
exports.getAllTeams = async (req, res, next) => {
  try {
    logger.info('Fetching list of all teams');
    const teams = await footballApiService.getTeams();
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    logger.error(`Error in getAllTeams controller: ${error.message}`);
    next(error);
  }
};

/**
 * Controller to fetch team by teamId
 */
exports.getTeamById = async (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ success: false, message: 'Invalid team identifier format.' });
  }
  try {
    logger.info(`Fetching team details for ID: ${id}`);
    const teams = await footballApiService.getTeams();
    const team = teams.find(t => t.teamId.toLowerCase() === id.toLowerCase());
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Team with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    logger.error(`Error in getTeamById controller: ${error.message}`);
    next(error);
  }
};
