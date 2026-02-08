import { motion } from 'framer-motion';

function MatchTimer({ minutes = 0, seconds = 0 }) {
  const isCritical = minutes === 0 && seconds < 10;
  const timeLabel = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={isCritical ? { duration: 0.8, repeat: Infinity } : { duration: 0.2 }}
      className={`font-['Sora'] text-6xl font-semibold tracking-tight ${
        isCritical
          ? 'text-scoreit-400 bg-scoreit-500/20 border-2 border-scoreit-500 shadow-glow-orange rounded-xl px-4 py-1 drop-shadow-glow'
          : 'text-gray-100'
      }`}
    >
      {timeLabel}
    </motion.div>
  );
}

export default MatchTimer;
