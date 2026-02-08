import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useMatchContext } from '../context/SocketContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { getSport } from '../utils/sportConfig.js';
import { SportBackground } from '../components/SportBackground.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ScoreDisplay from '../components/display/ScoreDisplay.jsx';
import MatchTimer from '../components/display/MatchTimer.jsx';
import StatusBadge from '../components/display/StatusBadge.jsx';
import PeriodIndicator from '../components/display/PeriodIndicator.jsx';
import TeamSection from '../components/display/TeamSection.jsx';
import LogoImage from '../components/display/LogoImage.jsx';
import scoreItLogo from '../assets/SCOREIT.png';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function Display() {
  const { match: contextMatch, connected } = useMatchContext();
  const { colors, setCurrentSport, currentSport } = useTheme();
  const [match, setMatch] = useState(null);

  const [leftFlash, setLeftFlash] = useState(false);
  const [rightFlash, setRightFlash] = useState(false);
  const prevScores = useRef({ left: 0, right: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (contextMatch) {
      setMatch(contextMatch);
      return;
    }

    setMatch(null);
    fetch(`${SERVER_URL}/api/matches/current`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setMatch(data);
      })
      .catch(console.error);
  }, [contextMatch]);

  useEffect(() => {
    if (!match) {
      prevScores.current = { left: 0, right: 0 };
      setLeftFlash(false);
      setRightFlash(false);
    }
  }, [match]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== 'currentSport') return;
      if (event.newValue) {
        setCurrentSport(event.newValue);
      }
      fetch(`${SERVER_URL}/api/matches/current`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setMatch(data);
        })
        .catch(console.error);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!match) return;
    const currentLeft = match.teams?.[0]?.score || 0;
    const currentRight = match.teams?.[1]?.score || 0;

    if (currentLeft > prevScores.current.left) {
      setLeftFlash(true);
      setTimeout(() => setLeftFlash(false), 500);
    }
    if (currentRight > prevScores.current.right) {
      setRightFlash(true);
      setTimeout(() => setRightFlash(false), 500);
    }

    prevScores.current = { left: currentLeft, right: currentRight };
  }, [match?.teams?.[0]?.score, match?.teams?.[1]?.score]);

  const leftScore = match?.teams?.[0]?.score ?? 0;
  const rightScore = match?.teams?.[1]?.score ?? 0;
  const status = match?.status || 'pending';
  const timer = match?.timer || { minutes: 0, seconds: 0 };
  const sport = currentSport || match?.sport || 'football';

  useEffect(() => {
    if (!currentSport && match?.sport) {
      setCurrentSport(match.sport);
    }
  }, [currentSport, match?.sport, setCurrentSport]);

  const normalizedStatus = status === 'final'
    ? 'fulltime'
    : status === 'completed'
      ? 'fulltime'
    : status === 'scheduled'
      ? 'pending'
      : status;

  const leftLead = leftScore > rightScore;
  const rightLead = rightScore > leftScore;
  
  const getWinnerLabel = () => {
    if (normalizedStatus !== 'fulltime') return null;
    if (leftScore === rightScore) return 'DRAW';
    return leftScore > rightScore
      ? (match?.teams?.[0]?.name || 'HOME')
      : (match?.teams?.[1]?.name || 'AWAY');
  };

  const winnerLabel = getWinnerLabel();
  const winnerIndex = normalizedStatus === 'fulltime'
    ? (leftScore === rightScore ? null : (leftScore > rightScore ? 0 : 1))
    : null;
  const winnerTeam = winnerIndex !== null ? match?.teams?.[winnerIndex] : null;

  useEffect(() => {
    if (!winnerTeam) return;
    const defaults = {
      startVelocity: 35,
      spread: 360,
      ticks: 80,
      zIndex: 1000,
    };

    const burst = () => confetti({
      particleCount: 160,
      spread: 120,
      startVelocity: 45,
      zIndex: 1000,
      origin: { x: 0.5, y: 0.3 },
    });

    burst();
    const interval = setInterval(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: Math.random(), y: Math.random() * 0.2 + 0.1 },
      });
    }, 350);

    return () => clearInterval(interval);
  }, [winnerTeam]);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${colors.text} relative overflow-hidden transition-colors duration-500 bg-court-900 bg-gradient-radial from-court-800/50 via-court-900 to-black`}
    >
      <SportBackground sport={sport} />
      <div className="absolute inset-0 bg-gradient-to-b from-court-900/70 via-court-900/90 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(249,115,22,0.22),transparent_40%),radial-gradient(circle_at_85%_5%,rgba(251,191,36,0.2),transparent_45%)]" />
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />

      {!match ? (
        <LoadingState message={connected ? "Waiting for next match..." : "Connecting to ScoreIt..."} />
      ) : winnerTeam ? (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className={`
                winner-wrap relative w-full max-w-5xl p-12
                rounded-2xl border ${colors.cardBorder}
                ${colors.card}
                backdrop-blur-sm
                transition-all duration-300
                winner-card
            `}>
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <div className={`winner-title text-lg md:text-xl font-black ${colors.textSecondary}`}>
              WINNER
            </div>
            {winnerTeam?.logo ? (
              <LogoImage
                src={winnerTeam.logo}
                alt="Winner logo"
                className="h-32 w-32 rounded-2xl"
              />
            ) : (
              <div className={`h-32 w-32 flex items-center justify-center text-5xl font-black rounded-2xl bg-gradient-to-br ${colors.accent1} text-white shadow-lg`}>
                {winnerTeam?.name?.charAt(0) || 'W'}
              </div>
            )}
            <div className="text-5xl font-semibold text-primary">
              {winnerTeam?.name || winnerLabel}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className={`px-6 py-2 rounded-full ${colors.statusLive} text-sm font-bold uppercase tracking-[0.2em]`}>
                Champions
              </div>
              <div className="px-4 py-2 rounded-full bg-surface-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Final
              </div>
            </div>

            <div className="w-full max-w-3xl mt-2 rounded-2xl border border-border bg-surface/70 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-secondary mb-4">Final Score</div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                <div className="flex items-center gap-4 justify-start">
                  {match?.teams?.[0]?.logo ? (
                    <LogoImage src={match.teams[0].logo} alt="Home" className="h-12 w-12 rounded-lg" />
                  ) : (
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.accent1} text-white flex items-center justify-center text-xl font-bold`}>
                      {match?.teams?.[0]?.name?.charAt(0) || 'H'}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-xs uppercase tracking-[0.2em] text-secondary">Home</div>
                    <div className="text-lg font-semibold text-primary">{match?.teams?.[0]?.name || 'HOME'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-5xl font-semibold text-primary">{leftScore}</div>
                  <div className="text-2xl font-bold text-secondary/50">-</div>
                  <div className="text-5xl font-semibold text-primary">{rightScore}</div>
                </div>

                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-secondary">Away</div>
                    <div className="text-lg font-semibold text-primary">{match?.teams?.[1]?.name || 'AWAY'}</div>
                  </div>
                  {match?.teams?.[1]?.logo ? (
                    <LogoImage src={match.teams[1].logo} alt="Away" className="h-12 w-12 rounded-lg" />
                  ) : (
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.accent2} text-white flex items-center justify-center text-xl font-bold`}>
                      {match?.teams?.[1]?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-8">
          {/* Classic Stadium Header */}
          <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-court-700 bg-court-800/60 px-6 py-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <LogoImage src={scoreItLogo} alt="ScoreIt logo" className="h-10 w-10 rounded-lg border border-border bg-surface" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-glow-400">
                  {getSport(sport).label}
                </div>
                <div className="text-lg font-semibold text-scoreit-500 brand-title drop-shadow-glow-yellow">SCOREIT LIVE</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Status</div>
              <div className="mt-2">
                <StatusBadge status={normalizedStatus} />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <MatchTimer minutes={timer.minutes} seconds={timer.seconds} />
            </div>
          </div>
          <div className="mb-6 text-center">
            <PeriodIndicator
              currentPeriod={match?.currentPeriod || 1}
              status={normalizedStatus}
              totalPeriods={getSport(sport).periods}
            />
          </div>

          {/* Stadium Scoreboard */}
          <div className="relative w-full rounded-2xl border border-court-700 bg-court-800/60 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-scoreit-500 to-glow-400 to-transparent shimmer" />
            <div className="grid grid-cols-[1.3fr_0.7fr_1.3fr] items-center gap-6 px-8 py-10">
              <TeamSection
                side="home"
                team={match.teams?.[0]}
                isLeading={leftLead}
                flash={leftFlash}
                fallbackGradient="from-scoreit-500 to-glow-400"
              />

              <div className="flex items-center justify-center gap-8">
                <ScoreDisplay
                  score={leftScore}
                  className={`text-[10rem] font-black text-white drop-shadow-glow-sm`}
                />
                <div className="text-7xl font-bold text-gray-400/40">-</div>
                <ScoreDisplay
                  score={rightScore}
                  className={`text-[10rem] font-black text-white drop-shadow-glow-sm`}
                />
              </div>

              <TeamSection
                side="away"
                team={match.teams?.[1]}
                isLeading={rightLead}
                flash={rightFlash}
                fallbackGradient="from-glow-400 to-scoreit-500"
              />
            </div>

            {winnerLabel && (
              <div className="px-8 pb-6">
                <div className="inline-flex rounded-full bg-[#11151b] px-6 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#9aa3ad]">
                  WINNER: {winnerLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Display;
