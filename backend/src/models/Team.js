const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fifaRank: { type: Number },
  group: { type: String, required: true },
  coach: { type: String },
  starPlayer: { type: String },
  stats: {
    played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', TeamSchema);
