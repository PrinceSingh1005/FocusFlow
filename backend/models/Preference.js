const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  blockedSites: [{ type: String }],
  // focusHours could be added here later
});

module.exports = mongoose.model('Preference', PreferenceSchema);