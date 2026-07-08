import api from './api';

/**
 * Trigger Gemini AI Prediction for a specific fixture
 * @param {string} matchId - Match code
 * @returns {Promise<Object>} Tactical predictions
 */
export const getMatchPrediction = async (matchId) => {
  return api.get(`/ai/prediction/${matchId}`);
};

/**
 * Submits community chats and triggers backend real-time sentiment analysis
 * @param {Object} chatPayload - chat details
 * @returns {Promise<Object>} Created chat entry
 */
export const submitFanChat = async (chatPayload) => {
  return api.post('/ai/chat', chatPayload);
};
