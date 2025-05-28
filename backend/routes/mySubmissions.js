const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// GET submissions for a specific user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch submissions where userId matches
    const submissions = await Submission.find({ userId }).populate('problemId');

    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
