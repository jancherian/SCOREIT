import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { getSport, getAllSports, DEFAULT_SPORT } from '../utils/sportConfig.js';
import scoreItLogo from '../assets/SCOREIT.png';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function formatDate(iso) {
  if (!iso) return 'Unknown date';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function History() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const { colors, fonts } = useTheme();

  const sports = useMemo(() => getAllSports(), []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(
          `${SERVER_URL}/api/matches?status=fulltime&limit=20`
        );
        setMatches(res.data || []);
      } catch (err) {
        console.error('Failed to fetch history', err);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const deleteMatch = async (matchId) => {
    if (!window.confirm('Delete this match from history?')) return;
    try {
      await axios.delete(`${SERVER_URL}/api/matches/${matchId}`);
      setMatches((prev) => prev.filter((m) => m._id !== matchId));
    } catch (err) {
      console.error('Failed to delete match', err);
    }
  };

  const filteredMatches = useMemo(() => {
    if (sportFilter === 'all') return matches;
    return matches.filter((m) => m.sport === sportFilter);
  }, [matches, sportFilter]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} px-6 py-8 ${colors.text} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-grid hero-vignette" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent/15 hero-orb" />
      <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-highlight/15 hero-orb" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl border border-border bg-surface/80 p-1 shadow-lg">
              <img src={scoreItLogo} alt="ScoreIt logo" className="h-full w-full rounded-lg object-cover" />
            </div>
            <div className="space-y-1">
              <h1 className={`text-3xl font-bold tracking-tight bg-gradient-to-r ${colors.accent1} bg-clip-text text-transparent`}>
                Match History
              </h1>
              <p className={`text-sm ${colors.textSecondary}`}>
                Completed matches and final scores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className={`flex items-center gap-2 rounded-xl border ${colors.cardBorder} ${colors.card} px-4 py-2.5 text-sm font-semibold backdrop-blur-sm`}>
              <svg className={`h-4 w-4 ${colors.textSecondary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0  4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className={`bg-transparent ${colors.textSecondary} focus:outline-none cursor-pointer`}
              >
                <option value="all" className="bg-surface">All Sports</option>
                {sports.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface">
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-xl border ${colors.cardBorder} ${colors.card} px-4 py-2.5 text-sm font-semibold ${colors.textSecondary} transition-all hover:scale-105`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </header>

        {loading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className={`h-12 w-12 animate-spin rounded-full border-4 ${colors.border} border-t-cyan-500`} />
              <span className={`text-sm ${colors.textSecondary}`}>Loading matches...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-50 px-6 py-4 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className={`mx-auto h-24 w-24 rounded-full ${colors.card} border ${colors.cardBorder} flex items-center justify-center text-4xl`}>
                📜
              </div>
              <div className="space-y-2">
                <p className={`text-xl font-semibold ${colors.text}`}>No matches yet</p>
                <p className={`text-sm ${colors.textSecondary}`}>Start a match from the Control Panel to see it here</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && filteredMatches.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMatches.map((match) => {
              const sportInfo = getSport(match.sport) || DEFAULT_SPORT;
              const teams = match.teams || [];
              const t1 = teams[0] || {};
              const t2 = teams[1] || {};
              const s1 = t1.score ?? 0;
              const s2 = t2.score ?? 0;

              let winner = null;
              if (s1 > s2) winner = 0;
              else if (s2 > s1) winner = 1;

              return (
                <article
                  key={match._id}
                  className={`group relative overflow-hidden rounded-2xl border-l-4 border-scoreit-500 ${colors.cardBorder} ${colors.card} p-6 smooth-transition hover-lift hover:bg-court-700 hover:shadow-glow-orange`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors.accent1} text-2xl`}>
                        {sportInfo.icon}
                      </div>
                      <span className={`text-sm font-bold uppercase tracking-wider ${colors.textSecondary}`}>
                        {sportInfo.label}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteMatch(match._id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mb-4 space-y-3">
                    {/* Team 1 */}
                    <div className="flex items-center gap-3">
                      {t1.logo ? (
                        <img
                          src={t1.logo}
                          alt={t1.name}
                          className={`h-10 w-10 rounded-xl border-2 ${colors.border} object-cover`}
                        />
                      ) : (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.card} border ${colors.border} text-sm font-bold`}>
                          {(t1.name || 'Team 1')
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${colors.text}`}>{t1.name || 'Team 1'}</p>
                        {winner === 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-glow-400">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Winner
                          </span>
                        )}
                      </div>
                      <div className={`${fonts.score} text-3xl font-bold text-score`}>{s1}</div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-3">
                      {t2.logo ? (
                        <img
                          src={t2.logo}
                          alt={t2.name}
                          className={`h-10 w-10 rounded-xl border-2 ${colors.border} object-cover`}
                        />
                      ) : (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.card} border ${colors.border} text-sm font-bold`}>
                          {(t2.name || 'Team 2')
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${colors.text}`}>{t2.name || 'Team 2'}</p>
                        {winner === 1 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-glow-400">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Winner
                          </span>
                        )}
                      </div>
                      <div className={`${fonts.score} text-3xl font-bold text-score`}>{s2}</div>
                    </div>
                  </div>

                  {winner === null && (
                    <div className={`mb-3 rounded-xl ${colors.card} border ${colors.border} px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wider ${colors.textSecondary}`}>
                      Draw
                    </div>
                  )}

                  <div className={`flex items-center gap-2 text-xs ${colors.textSecondary}`}>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(match.createdAt)}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
