import { motion } from 'framer-motion';

function StatusBadge({ status = 'pending' }) {
  const normalized = status?.toLowerCase();
  const isLive = normalized === 'live';
  const label = normalized === 'halftime'
    ? 'HALF TIME'
    : normalized === 'fulltime' || normalized === 'final' || normalized === 'completed'
      ? 'FULL TIME'
      : normalized === 'scheduled' || normalized === 'pending'
        ? 'NOT STARTED'
        : normalized?.toUpperCase() || 'STATUS';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase ${
        isLive
          ? 'bg-red-500 text-white shadow-glow-orange'
          : 'bg-court-700 text-gray-200'
      }`}
    >
      {isLive && <span className="animate-pulse">●</span>}
      {label}
    </motion.div>
  );
}

export default StatusBadge;
