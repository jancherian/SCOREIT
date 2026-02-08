import { useTheme } from '../context/ThemeContext.jsx';

function ControlPreview({ match }) {
  const { colors } = useTheme();

  if (!match) {
    return (
      <div className={`rounded-2xl border ${colors.cardBorder} ${colors.card} p-4 text-center ${colors.textSecondary}`}>
        No active match yet
      </div>
    );
  }

  const teams = match.teams || [];
  const team1 = teams[0] || {};
  const team2 = teams[1] || {};
  const status = match.status || 'pending';
  const timer = match.timer || { minutes: 0, seconds: 0 };

  const statusLabel = status === 'live' ? '● LIVE' : status.toUpperCase();

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colors.cardBorder} ${colors.card} p-4`}>
      <div className="absolute -top-12 -right-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
      <div className="absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-highlight/10 blur-2xl" />

      <div className="relative flex items-center justify-between mb-3">
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${status === 'live' ? 'bg-highlight/20 text-highlight shadow-glow-orange glow-pulse' : 'bg-surface-2 text-secondary'}`}>
          {statusLabel}
        </span>
        <div className="text-xs font-semibold text-secondary">
          {String(timer.minutes || 0).padStart(2, '0')}:{String(timer.seconds || 0).padStart(2, '0')}
        </div>
      </div>

      <div className="relative grid gap-2">
        {[team1, team2].map((team, idx) => (
          <div key={idx} className={`flex items-center justify-between rounded-xl border ${colors.cardBorder} ${colors.card} px-3 py-2`}>
            <div className="flex items-center gap-2">
              {team.logo ? (
                <img src={team.logo} alt={team.name || 'Team'} className="h-7 w-7 rounded-md object-cover shadow-sm" />
              ) : (
                <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${idx === 0 ? colors.accent1 : colors.accent2} text-[10px] font-bold text-white shadow-sm`}>
                  {(team.name || `T${idx + 1}`).substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className={`text-sm font-semibold ${colors.text}`}>{team.name || `Team ${idx + 1}`}</span>
            </div>
            <span className="text-xl font-semibold text-score rounded-full bg-gradient-to-r from-accent/20 via-highlight/10 to-accent/20 px-2 py-0.5">
              {team.score ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ControlPreview;
