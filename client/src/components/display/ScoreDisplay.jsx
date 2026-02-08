import { motion } from 'framer-motion';

function ScoreDisplay({ score, className = '' }) {
  return (
    <motion.span
      key={score}
      // Re-animates when score prop changes.
      initial={{
        scale: 1.3,
        textShadow: '0 0 40px rgba(249,115,22,0.8)',
      }}
      animate={{
        scale: 1,
        textShadow: '0 0 40px rgba(255,255,255,0.3)',
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {score}
    </motion.span>
  );
}

export default ScoreDisplay;
