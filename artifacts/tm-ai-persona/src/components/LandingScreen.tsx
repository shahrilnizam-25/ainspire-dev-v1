import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, BarChart3, Route, TrendingUp, Mail,
         Shield, Users, Lock, LineChart } from 'lucide-react';
import { translations, type Lang } from '../i18n';

/* ─── Trust badges ─────────────────────────────────────────────────────────── */
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
    /* Page wrapper — same base colour the hero fades into, zero seam */
    <div
      className="w-full max-w-5xl flex flex-col items-center text-center relative"
      style={{ background: '#030712' }}
    >

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
          Hero image fills the entire block as a background.
          Gradient overlay:
            • top-to-~35%  : dark → semi-dark  (keeps text legible)
            • ~35%–65%     : transparent        (illustration breathes)
            • ~65%–100%    : transparent → #030712  (fades into page)
          Side fades are very subtle — just enough to soften edges.
          NO floating badges — minimalist, clean.
      ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '660px', background: '#030712' }}
      >
        {/* Hero image */}
        <img
          src="/hero-v4.jpg"
          alt="AI future portal — KL skyline"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />

        {/* Primary overlay — top dark, mid clear, bottom fades to page colour */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom,' +
              '  rgba(3,7,18,0.92)  0%,' +
              '  rgba(3,7,18,0.75) 16%,' +
              '  rgba(3,7,18,0.35) 32%,' +
              '  rgba(3,7,18,0.06) 48%,' +
              '  transparent        58%,' +
              '  transparent        68%,' +
              '  rgba(3,7,18,0.72) 82%,' +
              '  rgba(3,7,18,1)   100%)',
          }}
        />

        {/* Side fades — very light, only to soften hard crop edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right,' +
              '  rgba(3,7,18,0.40) 0%,' +
              '  transparent 14%,' +
              '  transparent 86%,' +
              '  rgba(3,7,18,0.40) 100%)',
          }}
        />

        {/* ── Text block ── */}
        <div className="relative z-10 w-full flex flex-col items-center text-center px-6 pt-8">

          {/* Platform pill */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.0 }}
            className="mb-4"
          >
            <div
              className="inline-flex items-center px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                background: 'rgba(8,16,40,0.72)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 16px rgba(0,212,255,0.08)',
              }}
            >
              {t.platformLabel}
            </div>
          </motion.div>

          {/* TM logo + AiNspire pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-3 flex items-center gap-3"
          >
            <img
              src="/tm-logo-official.png"
              alt="Telekom Malaysia"
              className="w-auto object-contain"
              style={{ height: 'clamp(2.4rem, 4.5vw, 3.2rem)' }}
            />
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: 'radial-gradient(ellipse at center, rgba(0,180,255,0.18) 0%, rgba(139,92,246,0.12) 60%, transparent 100%)' }}
              />
              <div
                className="relative flex items-center select-none px-5 py-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,20,40,0.70) 0%, rgba(10,5,30,0.78) 100%)',
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
                >Ai</span>
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
                >Nspire</span>
              </div>
            </div>
          </motion.div>

          {/* ── Tagline — sits between the logo pill and the headline ──
               Small, soft, spaced — gives context before the bold headline lands */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="text-xs uppercase tracking-[0.18em] font-semibold mb-4"
            style={{ color: 'rgba(0,212,255,0.70)' }}
          >
            {t.description}{' '}
            <span style={{ color: 'rgba(0,212,255,0.90)', fontWeight: 700 }}>{t.descriptionBold}</span>
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-2 leading-[1.05]"
          >
            <span className="text-white">{t.headline1} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
              {t.headlineAccent}
            </span>
            <br />
            <span className="text-white/80 text-4xl md:text-5xl font-bold">{t.headline2}</span>
          </motion.h1>

        </div>
        {/* (no floating badges — clean minimalist hero) */}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURE COLUMNS
          Float on top of the hero's bottom fade with:
            • negative margin-top  → slight upward overlap
            • no top border        → no visible seam
            • upward box-shadow    → soft glow depth
            • background matches the hero's fade-to colour exactly
      ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.50 }}
        className="w-full overflow-hidden relative z-10"
        style={{
          marginTop: '-52px',
          background: 'rgba(3,7,18,0.82)',
          border: 'none',
          backdropFilter: 'blur(18px)',
          /* upward glow instead of a hard border-top */
          boxShadow:
            '0 -12px 40px rgba(0,212,255,0.10),' +
            '0  -4px 16px rgba(139,92,246,0.08),' +
            '0   8px 40px rgba(0,0,0,0.55)',
          borderRadius: '2px',
        }}
      >
        {/* Subtle cyan top-edge highlight — replaces the hard border */}
        <div
          className="w-full"
          style={{
            height: '1px',
            background:
              'linear-gradient(to right,' +
              '  transparent 0%,' +
              '  rgba(0,212,255,0.35) 30%,' +
              '  rgba(139,92,246,0.35) 70%,' +
              '  transparent 100%)',
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-start gap-4 p-5 text-left"
              >
                <div
                  className="flex-shrink-0 p-2.5 rounded-xl mt-0.5"
                  style={{
                    background: 'rgba(0,212,255,0.09)',
                    border: '1px solid rgba(0,212,255,0.20)',
                    boxShadow: '0 0 12px rgba(0,212,255,0.08)',
                  }}
                >
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white mb-1">{f.label}</div>
                  <div className="text-xs text-white/45 leading-relaxed">{f.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════
          CTA BUTTONS
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.72 }}
        className="flex flex-col items-center gap-4 w-full mb-10 mt-8 px-6"
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
        transition={{ duration: 0.6, delay: 0.88 }}
        className="w-full flex flex-wrap justify-center gap-8 pt-6 pb-10 border-t border-white/8 px-6"
      >
        {TRUST_BADGES.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.92 + i * 0.07 }}
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
        className="mb-8 text-xs text-muted-foreground/50 font-mono"
      >
        {t.poweredBy}
      </motion.div>
    </div>
  );
}
