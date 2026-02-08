import { useState } from 'react';
import { motion } from 'framer-motion';

function TeamLogo({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-24 w-24 rounded-xl bg-black/20 p-3">
      {!loaded && <div className="absolute inset-0 rounded-xl bg-gray-200/20 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-contain transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

function TeamSection({
  team,
  side = 'home',
  isLeading = false,
  flash = false,
  fallbackGradient = 'from-[#ff8f1f] to-[#ff6a00]',
}) {
  return (
    <motion.div
      animate={flash ? { backgroundColor: 'rgba(249,115,22,0.12)' } : { backgroundColor: 'rgba(15,23,42,0.45)' }}
      transition={{ duration: 0.6 }}
      className={`relative flex items-center gap-6 rounded-2xl border border-court-700 bg-court-800/50 px-6 py-6 transition-all ${
        isLeading ? 'border-scoreit-500 shadow-glow-orange' : ''
      } hover:border-scoreit-500 hover:shadow-glow-orange`}
    >
      {side === 'home' ? (
        <>
          {team?.logo ? (
            <TeamLogo src={team.logo} alt="Home logo" />
          ) : (
            <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${fallbackGradient} text-white flex items-center justify-center text-3xl font-bold shadow-lg`}>
              {team?.name?.charAt(0) || 'H'}
            </div>
          )}
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-glow-400">Home</div>
            <div className="text-4xl font-bold text-white truncate max-w-[14ch]">
              {team?.name || 'HOME'}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-right flex-1">
            <div className="text-sm uppercase tracking-[0.2em] text-glow-400">Away</div>
            <div className="text-4xl font-bold text-white truncate max-w-[14ch] ml-auto">
              {team?.name || 'AWAY'}
            </div>
          </div>
          {team?.logo ? (
            <TeamLogo src={team.logo} alt="Away logo" />
          ) : (
            <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${fallbackGradient} text-white flex items-center justify-center text-3xl font-bold shadow-lg`}>
              {team?.name?.charAt(0) || 'A'}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default TeamSection;
