import { SPORTS } from '../utils/sportConfig.js';

function SportSelector({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1">
      <span className="text-xs font-medium uppercase tracking-wide text-secondary">
        Sport
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-primary"
      >
        {Object.values(SPORTS).map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SportSelector;
