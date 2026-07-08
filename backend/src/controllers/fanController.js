const initialProfile = require('../mock/fanProfileMock.json');
const logger = require('../utils/logger');
const geminiService = require('../services/ai/geminiService');

/**
 * Per-user profile store keyed by client-generated UUID.
 * The frontend sends a UUID via the `x-fan-session-id` header (stored in localStorage).
 * This avoids a shared-singleton race condition without requiring full auth.
 * Max 500 entries to prevent unbounded memory growth.
 */
const MAX_SESSIONS = 500;
const profileStore = new Map();

const DEFAULT_PROFILE = {
  ...initialProfile,
  country: 'United States',
  favoritePlayer: 'Lionel Messi',
  reasonForSupport: 'I love their playstyle and tactical flow.'
};

/**
 * Returns the per-session profile for the given sessionId, creating one if absent.
 */
function getSessionProfile(sessionId) {
  if (!profileStore.has(sessionId)) {
    if (profileStore.size >= MAX_SESSIONS) {
      // Evict the oldest entry when the store is full
      const oldestKey = profileStore.keys().next().value;
      profileStore.delete(oldestKey);
    }
    profileStore.set(sessionId, { ...DEFAULT_PROFILE });
  }
  return profileStore.get(sessionId);
}

/**
 * Controller to fetch fan profile details
 */
exports.getProfile = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-fan-session-id'] || 'default';
    logger.info(`Fetching fan profile for session: ${sessionId}`);
    res.status(200).json({
      success: true,
      data: getSessionProfile(sessionId)
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
    const sessionId = req.headers['x-fan-session-id'] || 'default';
    logger.info(`Updating fan profile for session: ${sessionId}`);
    const profile = getSessionProfile(sessionId);
    
    if (name) profile.name = name;
    if (favoriteTeam) profile.favoriteTeam = favoriteTeam;
    if (themePreference) profile.themePreference = themePreference;
    if (country) profile.country = country;
    if (favoritePlayer) profile.favoritePlayer = favoritePlayer;
    if (reasonForSupport) profile.reasonForSupport = reasonForSupport;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate AI recommendations based on fan profile
 */
exports.getRecommendations = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-fan-session-id'] || 'default';
    logger.info(`Generating AI recommendations for session: ${sessionId}`);
    const profile = getSessionProfile(sessionId);
    const recommendations = await geminiService.generateFanRecommendations(profile);
    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error(`Error in getRecommendations controller: ${error.message}`);
    next(error);
  }
};
