function statusLabel(status) {
  switch (status) {
    case 'in_progress':
      return 'Live';
    case 'final':
      return 'Final';
    default:
      return 'Scheduled';
  }
}

function MatchStatus({ status }) {
  const label = statusLabel(status);
  const isLive = status === 'in_progress';
  const isFinal = status === 'final';

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1">
      <span
        className={`h-2 w-2 rounded-full ${
          isLive ? 'bg-highlight animate-pulse' : isFinal ? 'bg-accent' : 'bg-secondary'
        }`}
      />
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
        {label}
      </span>
    </div>
  );
}

export default MatchStatus;
