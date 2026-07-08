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
  
  if (name && (typeof name !== 'string' || name.trim().length === 0 || name.length > 100)) {
    return res.status(400).json({ success: false, message: 'Invalid display name format.' });
  }
  if (country && (typeof country !== 'string' || country.length > 100)) {
    return res.status(400).json({ success: false, message: 'Invalid country format.' });
  }
  if (favoritePlayer && (typeof favoritePlayer !== 'string' || favoritePlayer.length > 100)) {
    return res.status(400).json({ success: false, message: 'Invalid favorite player format.' });
  }
  if (reasonForSupport && (typeof reasonForSupport !== 'string' || reasonForSupport.length > 500)) {
    return res.status(400).json({ success: false, message: 'Invalid support statement format.' });
  }
  if (favoriteTeam && (typeof favoriteTeam !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(favoriteTeam))) {
    return res.status(400).json({ success: false, message: 'Invalid favorite team format.' });
  }

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
