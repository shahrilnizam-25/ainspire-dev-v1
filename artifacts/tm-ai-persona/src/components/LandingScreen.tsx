import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, BarChart3, Route, TrendingUp, Mail,
         GraduationCap, Target, Shield, Users, Lock, LineChart } from 'lucide-react';
import { translations, type Lang } from '../i18n';

/* ─── Floating badge definitions ─────────────────────────────────────────── */
const FLOAT_BADGES = [
  { icon: Brain,        label: 'AI Insights',     side: 'left',  top: '18%', delay: 0.6 },
  { icon: Users,        label: 'Employee-Centric', side: 'left',  top: '46%', delay: 0.8 },
  { icon: GraduationCap,label: 'Learning Paths',  side: 'right', top: '18%', delay: 0.7 },
  { icon: Target,       label: 'Goal Tracking',   side: 'right', top: '48%', delay: 0.9 },
  { icon: LineChart,    label: 'Analytics',        side: 'right', top: '72%', delay: 1.0 },
];

/* ─── Trust badge definitions ─────────────────────────────────────────────── */
const TRUST_BADGES = [
  { icon: Shield,    label: 'AI-Driven' },
  { icon: Users,     label: 'Employee-Centric' },
  { icon: Lock,      label: 'Secure & Trusted' },
  { icon: LineChart, label: 'Future-Ready' },
];

export default function LandingScreen({
  lang,
  onStart,
  onStats,
  onContact,
}: {
  lang: Lang;
  onStart: () => void;
  onStats: () => void;
  onContact: () => void;
}) {
  const t = translations[lang];

  const FEATURES = [
    { icon: Brain,     label: t.feature1Label, desc: t.feature1Desc },
    { icon: Route,     label: t.feature2Label, desc: t.feature2Desc },
    { icon: BarChart3, label: t.feature3Label, desc: t.feature3Desc },
  ];

  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col items-center text-center relative">

      {/* ══════════════════════════════════════════════
          HEADER — TM AiNspire + platform title
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mb-3 flex items-center gap-3"
      >
        {/* TM logo — original brand colours */}
        <img
          src="/tm-logo-official.png"
          alt="Telekom Malaysia"
          className="w-auto object-contain"
          style={{ height: 'clamp(2.4rem, 4.5vw, 3.2rem)' }}
        />

        {/* AiNspire glassy pill */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,180,255,0.18) 0%, rgba(139,92,246,0.12) 60%, transparent 100%)' }}
          />
          <div
            className="relative flex items-center select-none px-5 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(0,20,40,0.75) 0%, rgba(10,5,30,0.82) 100%)',
              border: '1.5px solid rgba(0,212,255,0.38)',
              boxShadow: '0 0 24px rgba(0,212,255,0.14), 0 0 40px rgba(139,92,246,0.10), inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              className="font-black tracking-tight leading-none"
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                background: 'linear-gradient(135deg, #a5f3fc 0%, #22d3ee 40%, #00b4d8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ai
            </span>
            <span
              className="font-black tracking-tight leading-none"
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(167,139,250,0.60))',
              }}
            >
              Nspire
            </span>
          </div>
        </div>
      </motion.div>

      {/* Platform title — plain text */}
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="mb-6 text-sm font-semibold uppercase tracking-widest text-white/45"
      >
        {t.platformLabel}
      </motion.p>

      {/* ══════════════════════════════════════════════
          HEADLINE
      ══════════════════════════════════════════════ */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.18 }}
        className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-[1.05]"
      >
        <span className="text-white">{t.headline1} </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
          {t.headlineAccent}
        </span>
        <br />
        <span className="text-white/80 text-4xl md:text-5xl font-bold">{t.headline2}</span>
      </motion.h1>

      {/* Description — single line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="text-base md:text-lg text-muted-foreground mb-8 whitespace-nowrap"
      >
        {t.description}{' '}
        <span className="text-foreground font-semibold">{t.descriptionBold}</span>
      </motion.p>

      {/* ══════════════════════════════════════════════
          CINEMATIC HERO IMAGE + FLOATING BADGES
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="relative w-full mb-10 rounded-2xl overflow-hidden"
        style={{ aspectRatio: '21/9' }}
      >
        {/* Hero image */}
        <img
          src="/hero-cinematic.jpg"
          alt="AI future portal"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />

        {/* Top + bottom fade vignette to blend with page bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(3,7,18,0.55) 0%, transparent 20%, transparent 75%, rgba(3,7,18,0.80) 100%)',
          }}
        />
        {/* Side fades */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(3,7,18,0.55) 0%, transparent 18%, transparent 82%, rgba(3,7,18,0.55) 100%)',
          }}
        />

        {/* ── Floating AI badges ── */}
        {FLOAT_BADGES.map((b) => {
          const Icon = b.icon;
          const isLeft = b.side === 'left';
          return (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: b.delay }}
              className="absolute flex items-center gap-2 px-3 py-2 rounded-xl select-none"
              style={{
                top: b.top,
                ...(isLeft ? { left: '3%' } : { right: '3%' }),
                background: 'rgba(3,10,28,0.72)',
                border: '1px solid rgba(0,212,255,0.28)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.40), 0 0 12px rgba(0,212,255,0.10)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="p-1.5 rounded-lg"
                style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)' }}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-white/85 whitespace-nowrap">{b.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ══════════════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      >
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-card-border bg-card/40 backdrop-blur-sm text-left"
            >
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground mb-1">{f.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ══════════════════════════════════════════════
          CTA BUTTONS
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-col items-center gap-4 w-full mb-10"
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
            boxShadow: '0 0 40px rgba(0,212,255,0.35)',
            color: '#000e1a',
          }}
        >
          <Sparkles className="w-5 h-5" />
          {t.beginBtn}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <p className="text-xs text-muted-foreground font-mono">{t.beginSub}</p>

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <motion.button
            onClick={onStats}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-sm transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            {t.statsBtn}
          </motion.button>

          <motion.button
            onClick={onContact}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white font-semibold text-sm transition-all"
          >
            <Mail className="w-4 h-4" />
            {t.contactBtn}
          </motion.button>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════
          TRUST BADGES ROW
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="w-full flex flex-wrap justify-center gap-6 pt-6 border-t border-white/8"
      >
        {TRUST_BADGES.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.07 }}
              className="flex items-center gap-2 text-white/50 text-xs font-semibold"
            >
              <Icon className="w-4 h-4 text-primary/60" />
              {b.label}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Powered by */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-8 text-xs text-muted-foreground/50 font-mono"
      >
        {t.poweredBy}
      </motion.div>
    </div>
  );
}
