const initialProfile = require('../mock/fanProfileMock.json');
const logger = require('../utils/logger');

// Local in-memory session persistence mock
let sessionProfile = {
  ...initialProfile,
  country: 'United States',
  favoritePlayer: 'Lionel Messi',
  reasonForSupport: 'I love their playstyle and tactical flow.'
};

/**
 * Controller to fetch fan profile details
 */
exports.getProfile = async (req, res, next) => {
  try {
    logger.info('Fetching user fan profile parameters');
    res.status(200).json({
      success: true,
      data: sessionProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update fan profile configurations
 */
exports.updateProfile = async (req, res, next) => {
  const { name, favoriteTeam, themePreference, country, favoritePlayer, reasonForSupport } = req.body;
  try {
    logger.info('Updating user fan profile parameters');
    
    if (name) sessionProfile.name = name;
    if (favoriteTeam) sessionProfile.favoriteTeam = favoriteTeam;
    if (themePreference) sessionProfile.themePreference = themePreference;
    if (country) sessionProfile.country = country;
    if (favoritePlayer) sessionProfile.favoritePlayer = favoritePlayer;
    if (reasonForSupport) sessionProfile.reasonForSupport = reasonForSupport;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: sessionProfile
    });
  } catch (error) {
    next(error);
  }
};
