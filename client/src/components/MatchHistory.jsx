import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getSport } from '../utils/sportConfig.js';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function MatchHistory({ limit = 5 }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors, fonts, ui } = useTheme();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/api/matches?status=fulltime&limit=${limit}`);
        setMatches(res.data || []);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [limit]);

  if (loading) {
    return <div className={`text-sm ${colors.textMuted || 'text-secondary'} text-center py-4`}>Loading history...</div>;
  }

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear the match history?')) return;
    try {
      await axios.delete(`${SERVER_URL}/api/matches?status=fulltime`);
      setMatches([]);
    } catch (err) {
      console.error('Failed to clear history', err);
    }
  };

  const deleteMatch = async (matchId) => {
    if (!window.confirm('Delete this match from history?')) return;
    try {
      await axios.delete(`${SERVER_URL}/api/matches/${matchId}`);
      setMatches((prev) => prev.filter((m) => m._id !== matchId));
    } catch (err) {
      console.error('Failed to delete match', err);
    }
  };

  if (matches.length === 0) {
    return (
      <div className={`text-sm ${colors.textMuted || 'text-secondary'} text-center py-6 border border-dashed rounded-lg ${colors.cardBorder || 'border-border'} flex flex-col items-center gap-3`}>
        <motion.div
          animate={{ rotate: 360, y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-2xl"
        >
          🏀
        </motion.div>
        <div className="text-gray-500">No matches yet. Start your first game!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-2">
        <motion.button
          onClick={clearHistory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-400 hover:underline"
        >
          Clear History
        </motion.button>
      </div>
      {matches.map((match) => {
        const sport = getSport(match.sport);
        const t1 = match.teams[0];
        const t2 = match.teams[1];

        // Determine winner for simple highlighting
        const t1Win = t1.score > t2.score;
        const t2Win = t2.score > t1.score;

        return (
          <div
            key={match._id}
            className={`p-3 rounded-lg border ${colors.cardBorder || 'border-border'} ${colors.card || 'bg-surface'} hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.textMuted || 'text-secondary'}`}>
                {sport.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono ${colors.textMuted || 'text-secondary'}`}>
                  {new Date(match.createdAt).toLocaleDateString()}
                </span>
                <motion.button
                  onClick={() => deleteMatch(match._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-400 hover:underline"
                >
                  Delete
                </motion.button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-right flex items-center justify-end gap-2">
                <span className={`text-xs font-bold truncate ${t1Win ? (colors.text || 'text-score') : (colors.textMuted || 'text-secondary')}`}>
                  {t1.name}
                </span>
              </div>

              <div className={`px-2 py-1 rounded font-mono font-bold text-xs bg-surface-2 text-score`}>
                {t1.score} - {t2.score}
              </div>

              <div className="flex-1 text-left flex items-center justify-start gap-2">
                <span className={`text-xs font-bold truncate ${t2Win ? (colors.text || 'text-score') : (colors.textMuted || 'text-secondary')}`}>
                  {t2.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MatchHistory;
