const mongoose = require('mongoose');

const TimeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  timeSpent: { type: Number, required: true }, // in seconds
  date: { type: Date, required: true }
});

// Index for efficient querying of reports
TimeLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('TimeLog', TimeLogSchema);