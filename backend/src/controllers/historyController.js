const historyMock = require('../mock/historyMock.json');
const logger = require('../utils/logger');

/**
 * Controller to fetch tournament history data
 */
exports.getHistoryData = async (req, res, next) => {
  try {
    logger.info('Fetching historic World Cup tournament parameters');
    res.status(200).json({
      success: true,
      data: historyMock
    });
  } catch (error) {
    next(error);
  }
};
