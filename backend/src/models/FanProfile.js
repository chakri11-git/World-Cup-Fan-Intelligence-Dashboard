const mongoose = require('mongoose');

const FanProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, default: '' },
  favoriteTeam: { type: String }, // e.g. "arg"
  favoritePlayer: { type: String, default: '' },
  reasonForSupport: { type: String, default: '' },
  predictionsMade: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  badges: [{ type: String }],
  themePreference: { type: String, enum: ['light', 'dark'], default: 'dark' }
}, {
  timestamps: true
});

module.exports = mongoose.model('FanProfile', FanProfileSchema);
