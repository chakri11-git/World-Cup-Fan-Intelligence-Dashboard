const mongoose = require('mongoose');

const StandingSchema = new mongoose.Schema({
  position: { type: Number, required: true },
  teamId: { type: String, required: true },
  teamName: { type: String, required: true },
  played: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 }
});

const GroupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  standings: [StandingSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);
