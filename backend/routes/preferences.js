const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Preference = require('../models/Preference');

// @route   GET api/preferences
router.get('/', auth, async (req, res) => {
    try {
        const preferences = await Preference.findOne({ userId: req.user.id });
        if (!preferences) {
            return res.status(404).json({ msg: 'Preferences not found' });
        }
        res.json(preferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/preferences
router.put('/', auth, async (req, res) => {
    const { blockedSites } = req.body;
    try {
        let preferences = await Preference.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { blockedSites } },
            { new: true, upsert: true }
        );
        res.json(preferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;