const express = require('express');
const Team = require('../models/Team');

const router = express.Router();

// POST /api/teams — create a new team
router.post('/', async (req, res) => {
  try {
    const { name, college, logo } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await Team.create({
      name,
      college: college || undefined,
      logo: logo || undefined,
    });

    res.status(201).json(team);
  } catch (err) {
    console.error('Error creating team', err);
    res
      .status(500)
      .json({ message: 'Failed to create team', error: err.message });
  }
});

// GET /api/teams — get all teams, optional ?college=X
router.get('/', async (req, res) => {
  try {
    const { college } = req.query;

    const filter = {};
    if (college) {
      filter.college = college;
    }

    const teams = await Team.find(filter).sort({ name: 1 });
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch teams', error: err.message });
  }
});

// GET /api/teams/:id — get one team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    console.error('Error fetching team', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch team', error: err.message });
  }
});

// PUT /api/teams/:id — update team
router.put('/:id', async (req, res) => {
  try {
    const { name, college, logo } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (college !== undefined) update.college = college;
    if (logo !== undefined) update.logo = logo;

    const team = await Team.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (err) {
    console.error('Error updating team', err);
    res
      .status(500)
      .json({ message: 'Failed to update team', error: err.message });
  }
});

// DELETE /api/teams/:id — delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted' });
  } catch (err) {
    console.error('Error deleting team', err);
    res
      .status(500)
      .json({ message: 'Failed to delete team', error: err.message });
  }
});

module.exports = router;


