import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, BarChart3, Route, TrendingUp, Mail } from 'lucide-react';
import { translations, type Lang } from '../i18n';

export default function LandingScreen({
  onStart,
  onStats,
  onContact,
}: {
  onStart: () => void;
  onStats: () => void;
  onContact: () => void;
}) {
  const [lang, setLang] = useState<Lang>('EN');
  const t = translations[lang];

  const LANGS: Lang[] = ['EN', 'BM', 'CN'];

  const FEATURES = [
    { icon: Brain,    label: t.feature1Label, desc: t.feature1Desc },
    { icon: Route,    label: t.feature2Label, desc: t.feature2Desc },
    { icon: BarChart3,label: t.feature3Label, desc: t.feature3Desc },
  ];

  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col items-center text-center relative">

      {/* ── Language switcher — top right ── */}
      <div className="absolute top-0 right-6 flex items-center gap-1 p-1 rounded-full border border-card-border/60 bg-card/40 backdrop-blur-sm">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`relative px-3 py-1 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
              lang === l
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === l && (
              <motion.div
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{l}</span>
          </button>
        ))}
      </div>

      {/* ── TM Logo + Platform Branding ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center mb-10 mt-10"
      >
        <img
          src="/tm-logo-official.png"
          alt="Telekom Malaysia"
          className="h-16 md:h-20 w-auto object-contain mb-5"
        />

        {/* Platform label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`platform-${lang}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-3"
          >
            {t.platformLabel}
          </motion.p>
        </AnimatePresence>

        {/* AiNspire — glowing product name */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-40 bg-gradient-to-r from-primary via-secondary to-primary scale-150" />
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative px-7 py-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
          >
            <span
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] via-[#a855f7] to-[#00d4ff]"
              style={{ filter: 'drop-shadow(0 0 18px rgba(0,212,255,0.7))' }}
            >
              AiNspire
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Hero Headline ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`headline-${lang}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-2">
            <span className="text-white">{t.headline1} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.35)]">
              {t.headlineAccent}
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white/70">
            {t.headline2}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* ── Description ── */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`desc-${lang}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-base md:text-lg text-muted-foreground mb-10"
        >
          {t.description}{' '}
          <span className="text-foreground font-medium">{t.descriptionBold}</span>
        </motion.p>
      </AnimatePresence>

      {/* ── Feature cards ── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={`${lang}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="flex flex-col items-center gap-3 px-5 py-5 rounded-2xl bg-card/40 border border-card-border/60 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{f.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.62 }}
        className="flex flex-col items-center gap-4"
      >
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-primary text-primary-foreground font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,212,255,0.35)] hover:shadow-[0_0_60px_rgba(0,212,255,0.55)]"
        >
          <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
          <AnimatePresence mode="wait">
            <motion.span
              key={`btn-${lang}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {t.beginBtn}
            </motion.span>
          </AnimatePresence>
          <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${lang}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground/60 tracking-wide"
          >
            {t.beginSub}
          </motion.p>
        </AnimatePresence>

        {/* Secondary nav row */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <motion.button
            onClick={onStats}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <AnimatePresence mode="wait">
              <motion.span key={`stats-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {t.statsBtn}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            onClick={onContact}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="w-4 h-4 text-primary" />
            <AnimatePresence mode="wait">
              <motion.span key={`contact-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {t.contactBtn}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Powered by badge — bottom center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary/70 text-xs font-semibold uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <AnimatePresence mode="wait">
            <motion.span key={`powered-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {t.poweredBy}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>

    </div>
  );
}
