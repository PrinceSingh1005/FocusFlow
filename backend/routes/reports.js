const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TimeLog = require('../models/TimeLog');

// @route   GET api/reports/daily
router.get('/daily', auth, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const logs = await TimeLog.find({
            userId: req.user.id,
            date: {
                $gte: today,
                $lt: endOfDay
            }
        }).sort({ timeSpent: -1 });

        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;