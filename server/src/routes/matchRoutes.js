const express = require('express');
const Match = require('../models/Match');

const router = express.Router();

// POST /api/matches — create a new match
router.post('/', async (req, res) => {
  try {
    const { sport, teams, status, currentPeriod, timer } = req.body;

    if (!sport) {
      return res.status(400).json({ message: 'Sport is required' });
    }
    if (!Array.isArray(teams) || teams.length !== 2) {
      return res
        .status(400)
        .json({ message: 'Match must have exactly 2 teams' });
    }

    const normalizedTeams = teams.map((t) => ({
      teamId: t.teamId || undefined,
      name: t.name,
      logo: t.logo || '',
      score: t.score ?? 0,
      periodScores: Array.isArray(t.periodScores) ? t.periodScores : [],
      cricketData: t.cricketData || undefined,
    }));

    const match = await Match.create({
      sport,
      status: status || 'setup',
      currentPeriod: currentPeriod || 0,
      timer: timer || { minutes: 0, seconds: 0 },
      teams: normalizedTeams,
      isActive: true,
    });

    res.status(201).json(match);
  } catch (err) {
    console.error('Error creating match', err);
    res
      .status(500)
      .json({ message: 'Failed to create match', error: err.message });
  }
});

// GET /api/matches — get past matches, with filters
router.get('/', async (req, res) => {
  try {
    const { sport, status, limit } = req.query;

    const filter = {};

    if (sport) {
      filter.sport = sport;
    }

    if (status) {
      filter.status = status;
    } else {
      // Default to past matches
      filter.status = 'fulltime';
    }

    let query = Match.find(filter).sort({ createdAt: -1 });

    const limitNum = parseInt(limit, 10);
    if (!Number.isNaN(limitNum) && limitNum > 0) {
      query = query.limit(limitNum);
    }

    const matches = await query.exec();

    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch matches', error: err.message });
  }
});

// GET /api/matches/current — get the currently active match
router.get('/current', async (req, res) => {
  try {
    // Try to find an active match first
    let match = await Match.findOne({ isActive: true }).sort({ updatedAt: -1 });

    // If no active match, get the most recent one (e.g. paused/finished)
    if (!match) {
      match = await Match.findOne().sort({ createdAt: -1 });
    }

    if (!match) {
      return res.status(404).json({ message: 'No matches found' });
    }

    res.json(match);
  } catch (err) {
    console.error('Error fetching current match', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch current match', error: err.message });
  }
});

// GET /api/matches/:id — get one match
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (err) {
    console.error('Error fetching match', err);
    res
      .status(500)
      .json({ message: 'Failed to fetch match', error: err.message });
  }
});

// PUT /api/matches/:id — update match
router.put('/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (err) {
    console.error('Error updating match', err);
    res
      .status(500)
      .json({ message: 'Failed to update match', error: err.message });
  }
});

// DELETE /api/matches — delete all matches (optionally filtered by status)
router.delete('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    await Match.deleteMany(filter);
    res.json({ message: 'Matches cleared' });
  } catch (err) {
    console.error('Error clearing matches', err);
    res
      .status(500)
      .json({ message: 'Failed to clear matches', error: err.message });
  }
});

// DELETE /api/matches/:id — delete match
router.delete('/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json({ message: 'Match deleted' });
  } catch (err) {
    console.error('Error deleting match', err);
    res
      .status(500)
      .json({ message: 'Failed to delete match', error: err.message });
  }
});

// POST /api/matches/:id/end — mark match as fulltime and persist final scores
router.post('/:id/end', async (req, res) => {
  try {
    const { teams, timer, currentPeriod } = req.body || {};

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (Array.isArray(teams) && teams.length === 2) {
      match.teams = teams.map((t, idx) => ({
        teamId: t.teamId || match.teams[idx]?.teamId,
        name: t.name ?? match.teams[idx]?.name,
        logo: t.logo ?? match.teams[idx]?.logo,
        score: t.score ?? match.teams[idx]?.score ?? 0,
        periodScores:
          Array.isArray(t.periodScores) && t.periodScores.length
            ? t.periodScores
            : match.teams[idx]?.periodScores || [],
        cricketData: t.cricketData || match.teams[idx]?.cricketData,
      }));
    }

    if (timer) {
      match.timer = {
        minutes: timer.minutes ?? match.timer?.minutes ?? 0,
        seconds: timer.seconds ?? match.timer?.seconds ?? 0,
      };
    }

    if (typeof currentPeriod === 'number') {
      match.currentPeriod = currentPeriod;
    }

    match.status = 'fulltime';
    match.isActive = false;

    await match.save();

    res.json(match);
  } catch (err) {
    console.error('Error ending match', err);
    res
      .status(500)
      .json({ message: 'Failed to end match', error: err.message });
  }
});

module.exports = router;


