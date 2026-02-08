import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Gauge, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ModeToggle from '../components/ModeToggle';
import scoreItLogo from '../assets/SCOREIT.png';
import { useEffect, useState } from 'react';

function Home() {
  const { colors, fonts, ui } = useTheme();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-grid hero-vignette" />
      <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-accent/20 hero-orb" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-highlight/20 hero-orb" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-5 py-4 lg:py-5">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Hero Copy */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
                <img src={scoreItLogo} alt="ScoreIt logo" className="h-full w-full object-cover" />
              </div>
              <h1 className={`text-4xl font-semibold tracking-tight md:text-5xl ${fonts.score} brand-title text-score`}>
                SCOREIT
              </h1>
            </div>

            <p className={`text-base md:text-lg ${colors.textSecondary}`}>
              A polished, real-time scoreboard with an operator-first control panel and a display that looks premium on any screen.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-secondary">
                <Sparkles className="h-4 w-4 text-accent" /> Minimal by design
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-secondary">
                <Gauge className="h-4 w-4 text-accent" /> Real-time updates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-secondary">
                <ShieldCheck className="h-4 w-4 text-accent" /> Built for reliability
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/control"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:brightness-105"
              >
                Open Control <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/display"
                className={`inline-flex items-center gap-2 rounded-lg border ${colors.cardBorder} ${colors.card} px-4 py-2 text-xs font-semibold ${colors.textSecondary} transition-all hover:scale-[1.02]`}
              >
                Open Display <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/history"
                className={`inline-flex items-center gap-2 rounded-lg border ${colors.cardBorder} ${colors.card} px-4 py-2 text-xs font-semibold ${colors.textSecondary} transition-all hover:scale-[1.02]`}
              >
                Match History
              </Link>
              <div className="inline-flex items-center">
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Showcase Cards */}
          <div className="grid gap-4">
            <Link to="/display" className="block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`group relative overflow-hidden ${ui.rounded} ${colors.card} ${colors.cardBorder} p-4 hover-lift shadow-[0_0_18px_rgba(255,176,0,0.18)] hover:shadow-[0_0_28px_rgba(255,176,0,0.28)]`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${colors.text}`}>Display View</h2>
                    <p className={`${colors.textSecondary}`}>Projector-ready scoreboard</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-secondary">Live</span>
                </div>
                <div className="rounded-2xl border border-border bg-surface/70 p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-highlight/10 opacity-70" />
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-secondary">
                      <span>Scoreboard</span>
                      <span className="text-accent">Live</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div className="rounded-xl border border-border bg-surface p-3 text-center">
                        <div className="text-[10px] text-secondary">HOME</div>
                        <div className="text-2xl font-semibold text-score">3</div>
                      </div>
                      <div className="text-center text-secondary text-xl">-</div>
                      <div className="rounded-xl border border-border bg-surface p-3 text-center">
                        <div className="text-[10px] text-secondary">AWAY</div>
                        <div className="text-2xl font-semibold text-score">2</div>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full w-2/3 bg-accent/70" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link to="/control" className="block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className={`group relative overflow-hidden ${ui.rounded} ${colors.card} ${colors.cardBorder} p-4 hover-lift shadow-[0_0_18px_rgba(255,106,0,0.18)] hover:shadow-[0_0_28px_rgba(255,106,0,0.28)]`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${colors.text}`}>Control Panel</h2>
                    <p className={`${colors.textSecondary}`}>Fast operator workflow</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-secondary">Manage</span>
                </div>
                <div className="rounded-2xl border border-border bg-surface/70 p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-highlight/10 via-transparent to-accent/10 opacity-70" />
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-secondary">
                      <span>Control</span>
                      <span className="text-secondary">Manage</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border bg-surface p-3">
                        <div className="text-[10px] text-secondary">Timer</div>
                        <div className="text-lg font-semibold text-score">12:14</div>
                      </div>
                      <div className="rounded-xl border border-border bg-surface p-3">
                        <div className="text-[10px] text-secondary">Status</div>
                        <div className="text-xs font-semibold text-accent">LIVE</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 rounded-lg bg-accent/80" />
                      <div className="h-8 rounded-lg bg-surface-2" />
                      <div className="h-8 rounded-lg bg-surface-2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`rounded-2xl border ${colors.cardBorder} ${colors.card} p-5`}>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary">Latency</div>
            <div className={`text-2xl font-semibold ${colors.text}`}>Instant sync</div>
            <p className={`text-sm ${colors.textSecondary}`}>Scores update across devices in real time.</p>
          </div>
          <div className={`rounded-2xl border ${colors.cardBorder} ${colors.card} p-5`}>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary">Display</div>
            <div className={`text-2xl font-semibold ${colors.text}`}>Clean contrast</div>
            <p className={`text-sm ${colors.textSecondary}`}>Readable from a distance in bright halls.</p>
          </div>
          <div className={`rounded-2xl border ${colors.cardBorder} ${colors.card} p-5`}>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary">Control</div>
            <div className={`text-2xl font-semibold ${colors.text}`}>Operator-first</div>
            <p className={`text-sm ${colors.textSecondary}`}>Large actions with clear visual feedback.</p>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          showSticky ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className={`flex items-center gap-2 rounded-2xl border ${colors.cardBorder} ${colors.card} px-3 py-2 shadow-sm backdrop-blur`}>
          <Link
            to="/control"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-slate-950 shadow-sm"
          >
            Control <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/display"
            className={`inline-flex items-center gap-2 rounded-lg border ${colors.cardBorder} ${colors.card} px-3 py-2 text-xs font-semibold ${colors.textSecondary}`}
          >
            Display <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/history"
            className={`inline-flex items-center gap-2 rounded-lg border ${colors.cardBorder} ${colors.card} px-3 py-2 text-xs font-semibold ${colors.textSecondary}`}
          >
            History
          </Link>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Home;
