const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  time: { type: Number, required: true },
  type: { type: String, enum: ['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION'], required: true },
  player: { type: String, required: true },
  team: { type: String, enum: ['home', 'away'], required: true }
});

const ScoreSchema = new mongoose.Schema({
  home: { type: Number, default: 0 },
  away: { type: Number, default: 0 }
});

const MatchSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  status: { type: String, enum: ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED'], default: 'SCHEDULED' },
  minute: { type: Number, default: 0 },
  score: { type: ScoreSchema, default: () => ({ home: 0, away: 0 }) },
  venue: { type: String },
  date: { type: Date, required: true },
  events: [EventSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', MatchSchema);
