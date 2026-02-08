import { useTheme } from '../context/ThemeContext.jsx';

function Scoreboard({ match, onTimerToggle, size = 'default' }) {
  const { colors, fonts, ui } = useTheme();
  const isCompact = size === 'compact';

  if (!match) {
    return (
      <div className={`rounded-2xl border ${colors.cardBorder} ${colors.card} p-8 text-center ${colors.textSecondary}`}>
        No active match yet
      </div>
    );
  }

  const teams = match.teams || [];
  const team1 = teams[0] || {};
  const team2 = teams[1] || {};
  const status = match.status || 'pending';
  const timer = match.timer || { minutes: 0, seconds: 0, running: false };

  // Use theme colors for status
  const statusColors = {
    live: 'border-highlight/40 bg-highlight/5',
    halftime: 'border-accent/40 bg-accent/5',
    fulltime: 'border-accent/40 bg-accent/5',
    pending: 'border-border/60 bg-surface/40',
  };

  return (
    <div className={`w-full ${ui.rounded} border ${statusColors[status] || statusColors.pending} ${colors.card} ${isCompact ? 'p-4' : 'p-6'} ${ui.shadow}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-full ${isCompact ? 'px-3 py-1 text-[10px]' : 'px-4 py-1.5 text-xs'} font-bold uppercase ${status === 'live' ? 'bg-highlight/20 text-highlight' :
          status === 'halftime' ? 'bg-accent/20 text-accent' :
            status === 'fulltime' ? 'bg-accent/20 text-accent' :
              'bg-surface-2 text-secondary'
          }`}>
          {status === 'live' ? '● LIVE' : status.toUpperCase()}
        </div>

        {status === 'live' && (
          <div className={`font-mono ${isCompact ? 'text-sm' : 'text-lg'} font-bold text-score`}>
            {String(timer.minutes || 0).padStart(2, '0')}:{String(timer.seconds || 0).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Teams & Scores */}
      <div className={`grid gap-3 ${isCompact ? '' : 'md:grid-cols-2'}`}>
        {/* Team 1 */}
        <div className={`flex items-center justify-between rounded-xl ${colors.card} border ${colors.cardBorder} ${isCompact ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center gap-3">
            {team1.logo ? (
              <img src={team1.logo} alt={team1.name} className={`${isCompact ? 'h-8 w-8' : 'h-10 w-10'} rounded-lg object-cover`} />
            ) : (
              <div className={`flex ${isCompact ? 'h-8 w-8' : 'h-10 w-10'} items-center justify-center rounded-lg bg-gradient-to-br ${colors.accent1} ${isCompact ? 'text-[10px]' : 'text-sm'} font-bold text-white`}>
                {(team1.name || 'T1').substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className={`font-semibold ${colors.text} ${isCompact ? 'text-sm' : ''}`}>{team1.name || 'Team 1'}</span>
          </div>
          <span className={`${fonts.score} ${isCompact ? 'text-2xl' : 'text-3xl'} font-bold text-score`}>{team1.score ?? 0}</span>
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between rounded-xl ${colors.card} border ${colors.cardBorder} ${isCompact ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center gap-3">
            {team2.logo ? (
              <img src={team2.logo} alt={team2.name} className={`${isCompact ? 'h-8 w-8' : 'h-10 w-10'} rounded-lg object-cover`} />
            ) : (
              <div className={`flex ${isCompact ? 'h-8 w-8' : 'h-10 w-10'} items-center justify-center rounded-lg bg-gradient-to-br ${colors.accent2} ${isCompact ? 'text-[10px]' : 'text-sm'} font-bold text-white`}>
                {(team2.name || 'T2').substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className={`font-semibold ${colors.text} ${isCompact ? 'text-sm' : ''}`}>{team2.name || 'Team 2'}</span>
          </div>
          <span className={`${fonts.score} ${isCompact ? 'text-2xl' : 'text-3xl'} font-bold text-score`}>{team2.score ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;
