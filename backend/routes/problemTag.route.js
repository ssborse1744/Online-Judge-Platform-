// routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const Problem = require('../model/Problem');

// Endpoint to get unique tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Problem.distinct('tag');
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to get unique difficulties
router.get('/difficulties', async (req, res) => {
  try {
    const difficulties = await Problem.distinct('difficulty');
    res.json(difficulties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
