import { motion } from 'framer-motion';

function formatTime(minutes, seconds) {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Timer({
  minutes = 0,
  seconds = 0,
  status,
  onToggle,
  className = '',
  timeClassName = 'text-sm font-semibold',
}) {
  const isRunning = status === 'in_progress' || status === 'live';
  const isCritical = minutes === 0 && seconds < 10;

  const content = (
    <motion.span
      // Pulses in the final 10 seconds.
      animate={isCritical ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={isCritical ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
      className={`tabular-nums ${timeClassName} ${isCritical ? 'text-red-500' : 'text-score'}`}
    >
      {formatTime(minutes, seconds)}
    </motion.span>
  );

  if (onToggle) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 text-xs font-medium text-primary shadow-sm hover:border-border-strong ${className}`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isRunning ? 'bg-highlight animate-pulse' : 'bg-secondary'
          }`}
        />
        {content}
        <span className="uppercase tracking-wide text-[0.65rem] text-secondary">
          {isRunning ? 'Running' : 'Paused'}
        </span>
      </button>
    );
  }

  return (
    <motion.div className={className}>
      {content}
    </motion.div>
  );
}

export default Timer;
