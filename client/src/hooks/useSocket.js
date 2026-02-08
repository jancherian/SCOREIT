import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://127.0.0.1:5000';

// Singleton socket instance
export const socket = io(SERVER_URL, {
  withCredentials: true,
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
});

export function useSocket() {
  const [match, setMatch] = useState(null);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    function handleMatchState(nextState) {
      setMatch(nextState);
    }

    function handleConnect() {
      setConnected(true);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    socket.on('match:state', handleMatchState);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('match:state', handleMatchState);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const startMatch = (teams, sportId) => {
    // Create properly formatted match data
    const matchData = {
      sport: sportId,
      status: 'live',
      currentPeriod: 1,
      teams: teams.map((team, idx) => ({
        name: team.name || `Team ${idx + 1}`,
        logo: team.logo || '',
        score: 0,
        cricketData: sportId === 'cricket' ? {
          wickets: 0,
          overs: 0,
          balls: 0,
        } : undefined
      })),
      timer: {
        minutes: 0,
        seconds: 0,
        running: false
      },
      createdAt: new Date().toISOString()
    };

    socket.emit('match:start', matchData);
  };

  const updateScore = (teamIndex, newScore) => {
    socket.emit('match:scoreUpdate', { teamIndex, newScore });
  };

  const changeStatus = (status, currentPeriod, timer) => {
    socket.emit('match:statusChange', { status, currentPeriod, timer });
  };

  const tickTimer = (minutes, seconds) => {
    socket.emit('match:timerTick', { minutes, seconds });
  };

  const updateCricket = (teamIndex, cricketData) => {
    socket.emit('match:cricketUpdate', { teamIndex, cricketData });
  };

  const resetMatch = () => {
    socket.emit('match:reset');
  };

  return {
    match,
    connected,
    startMatch,
    updateScore,
    changeStatus,
    tickTimer,
    updateCricket,
    resetMatch,
    socket,
  };
}
