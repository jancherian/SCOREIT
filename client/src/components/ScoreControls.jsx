import { SPORTS } from '../utils/sportConfig.js';

function ScoreControls({
  match,
  selectedSportId,
  onSportChange,
  onScoreChange,
  onStatusChange,
}) {
  if (!match) {
    return null;
  }

  const sport = SPORTS[selectedSportId] ?? SPORTS.basketball;

  return (
    <div className="w-full max-w-5xl space-y-4 rounded-2xl border border-border bg-surface/70 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-primary">
          Sport
          <select
            value={selectedSportId}
            onChange={(e) => onSportChange(e.target.value)}
            className="ml-2 rounded-md border border-border bg-surface px-2 py-1 text-sm text-primary"
          >
            {Object.values(SPORTS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto flex gap-2 text-xs text-secondary">
          <span>Periods: {sport.periods}</span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-secondary">
            Home score
          </div>
          <div className="flex flex-wrap gap-2">
            {sport.scoringOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onScoreChange('home', opt.value)}
                className="rounded-lg bg-highlight px-3 py-1 text-sm font-semibold text-black shadow-sm hover:opacity-90"
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={() => onScoreChange('home', -1)}
              className="rounded-lg border border-border px-3 py-1 text-sm font-medium text-primary hover:bg-surface-2"
            >
              -1
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-secondary">
            Away score
          </div>
          <div className="flex flex-wrap gap-2">
            {sport.scoringOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onScoreChange('away', opt.value)}
                className="rounded-lg bg-highlight px-3 py-1 text-sm font-semibold text-black shadow-sm hover:opacity-90"
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={() => onScoreChange('away', -1)}
              className="rounded-lg border border-border px-3 py-1 text-sm font-medium text-primary hover:bg-surface-2"
            >
              -1
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onStatusChange('scheduled')}
          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-primary hover:bg-surface-2"
        >
          Scheduled
        </button>
        <button
          onClick={() => onStatusChange('in_progress')}
          className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-black hover:opacity-90"
        >
          Start
        </button>
        <button
          onClick={() => onStatusChange('final')}
          className="rounded-full border border-red-500/60 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/40"
        >
          Final
        </button>
      </div>
    </div>
  );
}

export default ScoreControls;
