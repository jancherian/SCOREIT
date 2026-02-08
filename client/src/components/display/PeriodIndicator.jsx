function PeriodIndicator({ currentPeriod = 1, status = 'live', totalPeriods = 2 }) {
  const normalized = status?.toLowerCase();
  if (normalized === 'pending' || normalized === 'scheduled') {
    return <div className="text-2xl text-gray-500 uppercase tracking-widest">Not Started</div>;
  }
  if (normalized === 'halftime') {
    return <div className="text-2xl text-gray-400 uppercase tracking-widest">Half Time</div>;
  }
  if (normalized === 'fulltime' || normalized === 'final' || normalized === 'completed') {
    return <div className="text-2xl text-gray-400 uppercase tracking-widest">Full Time</div>;
  }

  const label = totalPeriods >= 4
    ? `${currentPeriod}Q`
    : totalPeriods === 2
      ? `${currentPeriod === 1 ? '1st' : '2nd'} Half`
      : `Period ${currentPeriod}`;

  return <div className="text-2xl text-gray-400 uppercase tracking-widest">{label}</div>;
}

export default PeriodIndicator;
