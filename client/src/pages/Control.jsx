import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Settings,
  ChevronRight,
  Minus,
  Plus,
  Users,
  History as HistoryIcon
} from 'lucide-react';

import scoreItLogo from '../assets/SCOREIT.png';
import Scoreboard from '../components/Scoreboard.jsx';
import ControlPreview from '../components/ControlPreview.jsx';
import MatchHistory from '../components/MatchHistory.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { DEFAULT_SPORT, getSport, getAllSports } from '../utils/sportConfig.js';
import { useMatchContext } from '../context/SocketContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { cn } from '../lib/utils';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function createEmptyTeam() {
  return {
    name: '',
    logo: '',
  };
}

function Control() {
  const { setCurrentSport, colors } = useTheme();
  const {
    match,
    startMatch,
    updateScore,
    changeStatus,
    tickTimer,
    resetMatch,
    connected,
  } = useMatchContext();

  const [selectedSportId, setSelectedSportId] = useState(DEFAULT_SPORT.id);
  const [teamInputs, setTeamInputs] = useState([createEmptyTeam(), createEmptyTeam()]);
  const [timerInput, setTimerInput] = useState({ minutes: 0, seconds: 0 });
  const [showSetup, setShowSetup] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [celebrationEnabled, setCelebrationEnabled] = useState(true);
  const [scorePulse, setScorePulse] = useState([false, false]);
  const [logoUploads, setLogoUploads] = useState([
    { loading: false, error: '' },
    { loading: false, error: '' },
  ]);

  const sports = useMemo(() => getAllSports(), []);
  // eslint-disable-next-line no-unused-vars
  const selectedSport = useMemo(() => getSport(selectedSportId), [selectedSportId]);

  useEffect(() => {
    if (selectedSportId) {
      setCurrentSport(selectedSportId);
    }
  }, [selectedSportId, match?.sport, setCurrentSport]);

  // Sync state with match data
  useEffect(() => {
    if (match) {
      if (match.sport) setSelectedSportId(match.sport);
      if (match.teams && match.teams.length >= 2) {
        setTeamInputs([
          { name: match.teams[0].name, logo: match.teams[0].logo || '' },
          { name: match.teams[1].name, logo: match.teams[1].logo || '' },
        ]);
      }
      if (match.timer) {
        setTimerInput({
          minutes: match.timer.minutes || 0,
          seconds: match.timer.seconds || 0
        });
      }
    }
  }, [match]);

  const handleStartMatch = async () => {
    try {
      await startMatch(teamInputs, selectedSportId);
      setShowSetup(false);
      toast.success('🏀 Match started');
    } catch (err) {
      toast.error('Failed to start match.');
    }
  };

  const handleLogoUpload = async (index, file) => {
    if (!file) return;
    setLogoUploads((prev) =>
      prev.map((item, i) => (i === index ? { ...item, loading: true, error: '' } : item))
    );
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await axios.post(`${SERVER_URL}/api/upload/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data?.url ? `${SERVER_URL}${res.data.url}` : '';
      if (uploadedUrl) {
        setTeamInputs((prev) =>
          prev.map((team, i) => (i === index ? { ...team, logo: uploadedUrl } : team))
        );
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Upload failed. Please try again.';
      setLogoUploads((prev) =>
        prev.map((item, i) => (i === index ? { ...item, error: message } : item))
      );
      toast.error(message);
    } finally {
      setLogoUploads((prev) =>
        prev.map((item, i) => (i === index ? { ...item, loading: false } : item))
      );
    }
  };

  const timerRef = useRef(null);

  useEffect(() => {
    if (match?.timer?.running) {
      timerRef.current = setInterval(() => {
        const currentMatch = match;
        if (!currentMatch?.timer) return;

        const { minutes, seconds } = currentMatch.timer;
        let newSeconds = seconds + 1;
        let newMinutes = minutes;

        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }

        tickTimer(newMinutes, newSeconds);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [match?.timer?.running, match, tickTimer]);

  const isFinal = match?.status === 'final' || match?.status === 'completed';

  useEffect(() => {
    if (!celebrationEnabled) return;
    if (!isFinal) return;
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 35,
      zIndex: 1000,
      origin: { x: 0.5, y: 0.2 },
    });
  }, [isFinal, celebrationEnabled]);

  const handleUpdateTimer = () => {
    if (!match) return;
    const newTimer = {
      minutes: Number(timerInput.minutes),
      seconds: Number(timerInput.seconds),
      running: match.timer?.running || false
    };
    changeStatus(undefined, undefined, newTimer);
  };

  const triggerScorePulse = (index) => {
    if (!animationsEnabled) return;
    setScorePulse((prev) => prev.map((v, i) => (i === index ? true : v)));
    setTimeout(() => {
      setScorePulse((prev) => prev.map((v, i) => (i === index ? false : v)));
    }, 350);
  };

  const handleScoreUpdate = (teamIndex, nextScore) => {
    if (!connected) {
      toast.error('Action failed. System offline.');
      return;
    }
    if (isFinal) {
      toast.error('Match already finished.');
      return;
    }
    updateScore(teamIndex, nextScore);
    triggerScorePulse(teamIndex);
  };

  const handleFinishMatch = () => {
    if (!match) return;
    changeStatus('final', undefined, { ...match.timer, running: false });
    setShowFinishConfirm(false);
  };

  const winnerLabel = (() => {
    if (!isFinal) return null;
    const left = match?.teams?.[0]?.score ?? 0;
    const right = match?.teams?.[1]?.score ?? 0;
    if (left === right) return 'DRAW';
    return left > right
      ? (match?.teams?.[0]?.name || 'HOME')
      : (match?.teams?.[1]?.name || 'AWAY');
  })();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={`min-h-screen font-outfit bg-gradient-to-br ${colors.bg} ${colors.text} transition-colors duration-300 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-grid hero-vignette" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent/15 hero-orb" />
      <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-highlight/15 hero-orb" />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-border shadow-black/10 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Go to home"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border shadow-sm overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img src={scoreItLogo} alt="ScoreIt logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none text-primary brand-title group-hover:text-primary/90">
                SCOREIT
              </h1>
              <span className="text-[10px] font-semibold text-secondary tracking-widest uppercase">Control Panel</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-semibold text-secondary">
              <span className={cn("text-xs", connected ? 'text-accent' : 'text-red-500')}>
                {connected ? '●' : '●'}
              </span>
              {connected ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
            </div>

            <Link to="/display" target="_blank">
              <Button variant="secondary" size="sm" className="hidden md:flex gap-2">
                <Monitor className="w-4 h-4" /> Display
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 pb-20">
        <AnimatePresence mode="wait">
          {(!match || showSetup) ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card glass className="p-8 md:p-10 relative overflow-hidden">

                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-primary">
                  <Settings className="w-8 h-8 text-accent" />
                  {match ? 'Match Settings' : 'New Match'}
                </h2>
                <p className="text-secondary mb-8">Configure match details and teams.</p>

                {/* Sport Selector */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-secondary mb-4 uppercase tracking-wider">Select Sport</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sports.map(sport => (
                      <motion.button
                        key={sport.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSportId(sport.id)}
                        className={cn(
                          "relative p-4 rounded-xl text-left border transition-all duration-200",
                          (match?.sport || selectedSportId) === sport.id
                            ? "border-accent bg-accent/10 ring-1 ring-accent/60"
                            : "border-border bg-surface hover:border-border-strong"
                        )}
                      >
                        <span className={cn(
                          "block text-sm font-bold mb-1",
                          (match?.sport || selectedSportId) === sport.id ? "text-accent" : "text-primary"
                        )}>
                          {sport.label}
                        </span>
                        <span className="text-xs text-secondary">{sport.periods} Periods</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Team Inputs */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {[0, 1].map((index) => (
                    <div key={index} className="space-y-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                        <Users className="w-4 h-4" />
                        {index === 0 ? 'Home Team' : 'Away Team'}
                      </label>
                      <input
                        type="text"
                        placeholder={index === 0 ? "e.g. Lakers" : "e.g. Bulls"}
                        value={teamInputs[index].name}
                        onChange={(e) => {
                          const newInputs = [...teamInputs];
                          newInputs[index].name = e.target.value;
                          setTeamInputs(newInputs);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-primary text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all placeholder:text-secondary"
                      />
                      <input
                        type="url"
                        placeholder="Team logo URL (optional)"
                        value={teamInputs[index].logo}
                        onChange={(e) => {
                          const newInputs = [...teamInputs];
                          newInputs[index].logo = e.target.value;
                          setTeamInputs(newInputs);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all placeholder:text-secondary"
                      />
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(index, e.target.files?.[0])}
                          className="block w-full text-sm text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-surface"
                        />
                        <div className="flex items-center gap-3 text-xs text-secondary">
                          <span>{logoUploads[index].loading ? 'Uploading logo...' : 'Upload a PNG/JPG/WebP/GIF (max 5MB)'}</span>
                          {teamInputs[index].logo && (
                            <button
                              type="button"
                              onClick={() => {
                                setTeamInputs((prev) =>
                                  prev.map((team, i) => (i === index ? { ...team, logo: '' } : team))
                                );
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {logoUploads[index].error && (
                          <div className="text-xs text-red-400">{logoUploads[index].error}</div>
                        )}
                        {teamInputs[index].logo && (
                          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface/70 p-2">
                            <img
                              src={teamInputs[index].logo}
                              alt="Team logo preview"
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <span className="text-xs text-secondary">Logo ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleStartMatch}
                    size="xl"
                    className="flex-1 text-lg"
                  >
                    {match ? 'Update Match' : 'Start Match'} <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>

                  {match && (
                    <Button
                      onClick={() => setShowSetup(false)}
                      variant="ghost"
                      size="xl"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]"
            >
              <div className="space-y-5">
                {/* Top Bar: Timer & Status */}
                <motion.div variants={itemVariants}>
                  <Card className="p-4" glass>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

                      {/* Timer Controls */}
                      <div className="flex items-center gap-5 w-full lg:w-auto justify-center lg:justify-start">
                        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/70 px-4 py-2">
                          <div className="relative">
                            <input
                              className="w-14 bg-transparent text-center font-['Sora'] font-semibold text-3xl outline-none text-score placeholder:text-secondary"
                              value={timerInput.minutes.toString().padStart(2, '0')}
                              onChange={(e) => setTimerInput({ ...timerInput, minutes: e.target.value })}
                              placeholder="00"
                              onBlur={handleUpdateTimer}
                            />
                          </div>
                          <span className="text-3xl font-['Sora'] text-secondary -mt-2">:</span>
                          <div className="relative">
                            <input
                              className="w-14 bg-transparent text-center font-['Sora'] font-semibold text-3xl outline-none text-score placeholder:text-secondary"
                              value={timerInput.seconds.toString().padStart(2, '0')}
                              onChange={(e) => setTimerInput({ ...timerInput, seconds: e.target.value })}
                              placeholder="00"
                              onBlur={handleUpdateTimer}
                            />
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            const newTimer = { ...match.timer, running: !match.timer?.running };
                            changeStatus(undefined, undefined, newTimer);
                          }}
                          variant={match.timer?.running ? "outline" : "malachite"}
                          size="icon"
                          className={cn(
                            "rounded-full w-14 h-14 shadow-sm",
                            match.timer?.running ? "text-primary" : "text-slate-950"
                          )}
                          disabled={isFinal}
                        >
                          {match.timer?.running ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </Button>
                      </div>

                      {/* Period Status */}
                    <div className="flex items-center gap-1 rounded-full border border-border bg-surface/60 backdrop-blur-sm px-1 py-1">
                        {['scheduled', 'live', 'halftime', 'final'].map((s) => {
                          const isActive = match.status === s;
                          const labels = { scheduled: 'Sched', live: 'Live', halftime: 'Half', final: 'Completed' };
                          return (
                            <motion.button
                              key={s}
                              onClick={() => changeStatus(s)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={cn(
                                "px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all",
                                isActive
                                  ? "bg-surface text-accent shadow-sm"
                                  : "text-secondary hover:text-primary"
                              )}
                            >
                              {labels[s] || s}
                            </motion.button>
                          );
                        })}
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => setShowSetup(true)}>
                        <Settings className="w-4 h-4 mr-2" /> Edit Info
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                {/* Micro Stats */}
                <motion.div variants={itemVariants}>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">Sport</div>
                      <div className="text-sm font-semibold text-primary">{match?.sport ? match.sport.toUpperCase() : 'SETUP'}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">Status</div>
                      <div className="text-sm font-semibold text-primary">{match?.status || 'scheduled'}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">Timer</div>
                      <div className="text-sm font-semibold text-primary">{String(match?.timer?.minutes ?? 0).padStart(2, '0')}:{String(match?.timer?.seconds ?? 0).padStart(2, '0')}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Score Section Header */}
                <motion.div variants={itemVariants}>
                  <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">Score Control</div>
                        <div className="text-sm font-semibold text-primary">Update points instantly</div>
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary">Actions</div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Score Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[0, 1].map((teamIndex) => (
                    <motion.div key={teamIndex} variants={itemVariants}>
                      <Card
                        glass
                        className={cn(
                          "relative overflow-hidden transition-all duration-300 border-t-4 shadow-lg hover:shadow-xl transition-shadow",
                          teamIndex === 0 ? "border-t-accent" : "border-t-highlight"
                        )}
                      >
                        <div className={cn(
                          "absolute inset-x-0 top-0 h-1",
                          teamIndex === 0 ? "bg-gradient-to-r from-accent/70 to-highlight/20" : "bg-gradient-to-r from-highlight/70 to-accent/20"
                        )} />
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold truncate w-full opacity-90 text-primary">
                              {match.teams?.[teamIndex]?.name || `Team ${teamIndex + 1}`}
                            </h3>
                            <div className="text-xs uppercase tracking-[0.2em] text-secondary">Score</div>
                          </div>
                        <div className={cn(
                          "text-4xl font-semibold text-secondary/30 pointer-events-none select-none transition-transform",
                          scorePulse[teamIndex] && "score-flash"
                        )}>
                          {match.teams?.[teamIndex]?.score || 0}
                        </div>
                      </div>

                        <div className="grid gap-3">
                          <Button
                            variant={teamIndex === 0 ? "primary" : "malachite"}
                            className={cn(
                              "h-16 text-3xl font-black shadow-sm",
                              teamIndex === 0 ? "bg-accent hover:opacity-90" : "bg-highlight text-slate-950 hover:opacity-90"
                            )}
                            onClick={() => handleScoreUpdate(teamIndex, (match.teams?.[teamIndex]?.score || 0) + 1)}
                            disabled={isFinal}
                          >
                            <Plus className="w-7 h-7 mr-2 opacity-50" /> 1
                          </Button>

                          <div className="grid grid-cols-3 gap-2">
                            {(match.sport === 'basketball' || match.sport === 'cricket') ? (
                              <>
                              <Button
                                variant="secondary"
                                className="h-10 text-sm font-semibold"
                                onClick={() => handleScoreUpdate(teamIndex, (match.teams?.[teamIndex]?.score || 0) + 2)}
                                disabled={isFinal}
                              >
                                +2
                              </Button>
                              <Button
                                variant="secondary"
                                className="h-10 text-sm font-semibold"
                                onClick={() => handleScoreUpdate(teamIndex, (match.teams?.[teamIndex]?.score || 0) + 3)}
                                disabled={isFinal}
                              >
                                +3
                              </Button>
                            </>
                          ) : <div className="col-span-2"></div>}

                          <Button
                            variant="ghost"
                            className={cn("h-10 text-red-500 hover:text-red-600 hover:bg-red-500/10", !(match.sport === 'basketball' || match.sport === 'cricket') && "col-span-3")}
                            onClick={() => handleScoreUpdate(teamIndex, (match.teams?.[teamIndex]?.score || 0) - 1)}
                            disabled={isFinal}
                          >
                            <Minus className="w-5 h-5" />
                          </Button>
                        </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

              </div>

              {/* Right Drawer */}
              <div className="space-y-4 xl:sticky xl:top-20 h-fit">
                <Card glass className="p-5 divide-y divide-gray-200/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-secondary font-semibold text-xs uppercase tracking-wider">
                      <Trophy className="w-4 h-4" /> Live Preview
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-secondary">Projector View</span>
                  </div>
                  <div className="pt-3 rounded-2xl border border-border bg-surface/60 p-3">
                    <ControlPreview match={match} />
                  </div>
                </Card>

                <Card glass className="divide-y divide-gray-200/20">
                  <div className="flex items-center justify-between mb-3 text-secondary font-semibold text-xs uppercase tracking-wider">
                    <span>Quick Actions</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-secondary">Shortcuts</span>
                  </div>
                  <div className="pt-3 grid gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-between bg-surface/60 backdrop-blur-sm"
                      onClick={() => {
                        const url = `${window.location.origin}/display`;
                        navigator.clipboard.writeText(url);
                      }}
                    >
                      Copy Display Link <Monitor className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-between bg-surface/40 backdrop-blur-sm" onClick={() => setShowSetup(true)}>
                      Edit Match <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-between bg-surface/30 backdrop-blur-sm" onClick={() => setShowFinishConfirm(true)}>
                      Finish Match <Trophy className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                {isFinal && (
                  <Card glass className="divide-y divide-gray-200/20">
                    <div className="flex items-center justify-between mb-3 text-secondary font-semibold text-xs uppercase tracking-wider">
                      <span>Match Finished</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-secondary">Final</span>
                    </div>
                    <div className="pt-3 rounded-xl border border-border bg-surface/70 px-3 py-3 text-sm font-semibold text-primary">
                      Winner: <span className="text-accent">{winnerLabel}</span>
                    </div>
                  </Card>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Below Scores: Preferences + History */}
      {match && !showSetup && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <Card glass className="divide-y divide-gray-200/20">
              <div className="flex items-center justify-between mb-3 text-secondary font-semibold text-xs uppercase tracking-wider">
                <span>Preferences</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-secondary">UX</span>
              </div>
              <div className="pt-3 grid gap-2">
                <motion.button
                  type="button"
                  onClick={() => setAnimationsEnabled((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface/70 px-3 py-2 text-xs font-semibold text-secondary hover:text-primary"
                >
                  Score Animations
                  <span className={cn("text-[10px] uppercase tracking-[0.2em]", animationsEnabled ? "text-accent" : "text-secondary")}>
                    {animationsEnabled ? 'ON' : 'OFF'}
                  </span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setCelebrationEnabled((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface/70 px-3 py-2 text-xs font-semibold text-secondary hover:text-primary"
                >
                  Celebrations
                  <span className={cn("text-[10px] uppercase tracking-[0.2em]", celebrationEnabled ? "text-accent" : "text-secondary")}>
                    {celebrationEnabled ? 'ON' : 'OFF'}
                  </span>
                </motion.button>
              </div>
            </Card>

            <Card glass className="divide-y divide-gray-200/20">
              <div className="flex items-center gap-2 mb-3 text-secondary font-semibold text-xs uppercase tracking-wider">
                <HistoryIcon className="w-4 h-4" /> Match History
              </div>
              <div className="pt-3">
                <MatchHistory limit={3} />
              </div>
              <div className="mt-3">
                <Button variant="outline" className="w-full text-red-500 border-red-500/40 hover:border-red-400 hover:bg-red-500/10" onClick={resetMatch}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset Match
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-primary mb-2">Finish Match?</h3>
            <p className="text-sm text-secondary mb-6">
              This will mark the match as final and lock score updates.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowFinishConfirm(false)}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" onClick={handleFinishMatch}>
                Confirm Finish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Control;
