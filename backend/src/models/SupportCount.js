const mongoose = require('mongoose');

const SupportCountSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  teamName: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('SupportCount', SupportCountSchema);
