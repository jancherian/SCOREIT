function TeamCard({ team, score, isHome }) {
  if (!team) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/70 p-4">
      <div className="flex items-center gap-3">
        {team.logoUrl && (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="h-12 w-12 rounded-xl border border-border object-cover"
          />
        )}
        <div>
          <div className="text-xs uppercase tracking-wide text-secondary">
            {isHome ? 'Home' : 'Away'}
          </div>
          <div className="text-lg font-semibold text-primary">
            {team.name}
          </div>
        </div>
      </div>
      <div className="text-4xl font-bold tracking-tight text-score">
        {score}
      </div>
    </div>
  );
}

export default TeamCard;
