const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TimeLog = require('../models/TimeLog');

// @route   POST api/time-logs/sync
router.post('/sync', auth, async (req, res) => {
  const { logs } = req.body; // Expecting an array of logs
  if (!logs || !Array.isArray(logs)) {
    return res.status(400).json({ msg: 'Invalid log format' });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const log of logs) {
        const { domain, timeSpent } = log;
        
        // Find if a log for this domain and date already exists
        let existingLog = await TimeLog.findOne({ userId: req.user.id, domain, date: today });

        if (existingLog) {
            existingLog.timeSpent += timeSpent;
            await existingLog.save();
        } else {
            const newLog = new TimeLog({
                userId: req.user.id,
                domain,
                timeSpent,
                date: today
            });
            await newLog.save();
        }
    }
    res.status(200).json({ msg: 'Logs synchronized successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;