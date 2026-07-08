const footballApiService = require('../services/api/footballApiService');
const Match = require('../models/Match');
const logger = require('../utils/logger');

/**
 * Controller to fetch all active/upcoming matches
 */
exports.getMatches = async (req, res, next) => {
  try {
    logger.info('Fetching matches listing');
    let matches;

    // In a real application, check database first, fallback/refresh via service if necessary
    try {
      matches = await Match.find({});
      if (!matches || matches.length === 0) {
        logger.debug('No matches found in DB. Fetching from football service layer...');
        matches = await footballApiService.getAllMatches();
        
        // Seed database with mock data for local environments
        await Match.insertMany(matches);
      }
    } catch (dbError) {
      logger.warn(`Database querying failed, loading directly from service: ${dbError.message}`);
      matches = await footballApiService.getAllMatches();
    }

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch detailed live analysis/telemetry for a single match
 */
exports.getMatchById = async (req, res, next) => {
  const { id } = req.params;
  try {
    logger.info(`Fetching detailed stats for match ID: ${id}`);
    let match;

    try {
      match = await Match.findOne({ matchId: id });
    } catch (dbErr) {
      logger.warn(`Could not find in DB, fetching from service: ${dbErr.message}`);
    }

    if (!match) {
      match = await footballApiService.getMatchDetails(id);
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};
