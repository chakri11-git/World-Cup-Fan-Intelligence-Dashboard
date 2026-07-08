const mongoose = require('mongoose');

const FanChatSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  matchId: { type: String, required: true }, // Associated match hub
  prediction: {
    homeScorePrediction: { type: Number },
    awayScorePrediction: { type: Number }
  },
  aiAnalyzed: { type: Boolean, default: false },
  sentiment: { type: String, enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'], default: 'NEUTRAL' }
}, {
  timestamps: true
});

module.exports = mongoose.model('FanChat', FanChatSchema);
