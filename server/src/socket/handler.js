const Match = require('../models/Match');

let activeLiveMatch = null;

function normalizeStatus(status) {
  if (!status) return undefined;
  if (status === 'final' || status === 'completed') return 'fulltime';
  if (status === 'scheduled') return 'setup';
  return status;
}

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    // Send current state to newly connected client
    socket.emit('match:state', activeLiveMatch);

    // Start a new match
    socket.on('match:start', async (matchData) => {
      try {
        if (!matchData) {
          activeLiveMatch = null;
          io.emit('match:state', activeLiveMatch);
          return;
        }

        const normalizedTeams = Array.isArray(matchData.teams)
          ? matchData.teams.map((t) => ({
            name: t.name || '',
            logo: t.logo || '',
            score: t.score ?? 0,
            periodScores: Array.isArray(t.periodScores) ? t.periodScores : [],
            cricketData: t.cricketData || undefined,
          }))
          : [];

        const match = await Match.create({
          sport: matchData.sport,
          status: normalizeStatus(matchData.status) || 'live',
          currentPeriod: matchData.currentPeriod ?? 1,
          timer: matchData.timer || { minutes: 0, seconds: 0 },
          teams: normalizedTeams,
          isActive: true,
        });

        activeLiveMatch = match.toObject();
        io.emit('match:state', activeLiveMatch);
      } catch (err) {
        console.error('Failed to persist match start', err);
        activeLiveMatch = matchData || null;
        io.emit('match:state', activeLiveMatch);
      }
    });

    // Score update
    socket.on('match:scoreUpdate', async ({ teamIndex, newScore }) => {
      if (!activeLiveMatch || !Array.isArray(activeLiveMatch.teams)) return;
      if (teamIndex == null || teamIndex < 0 || teamIndex >= activeLiveMatch.teams.length)
        return;

      activeLiveMatch = {
        ...activeLiveMatch,
        teams: activeLiveMatch.teams.map((team, idx) =>
          idx === teamIndex ? { ...team, score: newScore } : team
        ),
      };

      io.emit('match:state', activeLiveMatch);

      if (activeLiveMatch._id) {
        try {
          await Match.findByIdAndUpdate(activeLiveMatch._id, {
            teams: activeLiveMatch.teams,
          });
        } catch (err) {
          console.error('Failed to persist score update', err);
        }
      }
    });

    // Status / period / timer change
    socket.on('match:statusChange', async ({ status, currentPeriod, timer }) => {
      if (!activeLiveMatch) return;

      const normalizedStatus = normalizeStatus(status) ?? activeLiveMatch.status;
      const isFulltime = normalizedStatus === 'fulltime';

      activeLiveMatch = {
        ...activeLiveMatch,
        status: normalizedStatus,
        currentPeriod: currentPeriod ?? activeLiveMatch.currentPeriod,
        timer: timer ?? activeLiveMatch.timer,
        isActive: isFulltime ? false : activeLiveMatch.isActive,
      };

      io.emit('match:state', activeLiveMatch);

      if (activeLiveMatch._id) {
        try {
          await Match.findByIdAndUpdate(activeLiveMatch._id, {
            status: activeLiveMatch.status,
            currentPeriod: activeLiveMatch.currentPeriod,
            timer: activeLiveMatch.timer,
            teams: activeLiveMatch.teams,
            isActive: activeLiveMatch.isActive,
          });
        } catch (err) {
          console.error('Failed to persist status change', err);
        }
      }
    });

    // Timer tick
    socket.on('match:timerTick', async ({ minutes, seconds }) => {
      if (!activeLiveMatch) return;

      activeLiveMatch = {
        ...activeLiveMatch,
        timer: {
          ...activeLiveMatch.timer, // Preserve existing timer properties (running, etc.)
          minutes: minutes ?? activeLiveMatch?.timer?.minutes ?? 0,
          seconds: seconds ?? activeLiveMatch?.timer?.seconds ?? 0,
        },
      };

      io.emit('match:state', activeLiveMatch);

      if (activeLiveMatch._id) {
        try {
          await Match.findByIdAndUpdate(activeLiveMatch._id, {
            timer: activeLiveMatch.timer,
          });
        } catch (err) {
          console.error('Failed to persist timer update', err);
        }
      }
    });

    // Cricket-specific updates
    socket.on('match:cricketUpdate', async ({ teamIndex, cricketData }) => {
      if (
        !activeLiveMatch ||
        activeLiveMatch.sport !== 'cricket' ||
        !Array.isArray(activeLiveMatch.teams)
      ) {
        return;
      }

      if (teamIndex == null || teamIndex < 0 || teamIndex >= activeLiveMatch.teams.length)
        return;

      activeLiveMatch = {
        ...activeLiveMatch,
        teams: activeLiveMatch.teams.map((team, idx) =>
          idx === teamIndex
            ? {
              ...team,
              cricketData: {
                ...(team.cricketData || {}),
                ...(cricketData || {}),
              },
            }
            : team
        ),
      };

      io.emit('match:state', activeLiveMatch);

      if (activeLiveMatch._id) {
        try {
          await Match.findByIdAndUpdate(activeLiveMatch._id, {
            teams: activeLiveMatch.teams,
          });
        } catch (err) {
          console.error('Failed to persist cricket update', err);
        }
      }
    });

    // Reset match
    socket.on('match:reset', async () => {
      if (activeLiveMatch?._id) {
        try {
          await Match.findByIdAndUpdate(activeLiveMatch._id, { isActive: false });
        } catch (err) {
          console.error('Failed to persist match reset', err);
        }
      }
      activeLiveMatch = null;
      io.emit('match:state', activeLiveMatch);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });
}

module.exports = registerSocketHandlers;
