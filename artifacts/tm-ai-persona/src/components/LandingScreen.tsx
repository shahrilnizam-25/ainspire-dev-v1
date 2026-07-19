import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, BarChart3, Route, TrendingUp, Mail } from 'lucide-react';
import { translations, type Lang } from '../i18n';

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
    { icon: Brain,    label: t.feature1Label, desc: t.feature1Desc },
    { icon: Route,    label: t.feature2Label, desc: t.feature2Desc },
    { icon: BarChart3,label: t.feature3Label, desc: t.feature3Desc },
  ];

  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col items-center text-center relative">

      {/* ── TM Logo  |  AiNspire wordmark ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center gap-6"
      >
        {/* TM logo — original brand colours, no filter */}
        <img
          src="/tm-logo-official.png"
          alt="Telekom Malaysia"
          className="h-14 w-auto object-contain"
        />

        {/* Divider */}
        <div className="h-10 w-px bg-white/20 rounded-full" />

        {/* AiNspire glassy pill wordmark */}
        <div
          className="relative flex items-center select-none px-5 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1.5px solid rgba(100,200,255,0.28)',
            boxShadow:
              '0 0 18px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {/* "Ai" — cyan */}
          <span
            className="text-3xl font-black tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #67e8f9 0%, #00d4ff 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ai
          </span>
          {/* "Nspire" — purple with glow */}
          <span
            className="text-3xl font-black tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.55))',
            }}
          >
            Nspire
          </span>
        </div>
      </motion.div>

      {/* ── Platform badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest"
      >
        {t.platformLabel}
      </motion.div>

      {/* ── Hero headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
      >
        <span className="text-white">{t.headline1} </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
          {t.headlineAccent}
        </span>
        <br />
        <span className="text-white/80 text-4xl md:text-5xl font-bold">{t.headline2}</span>
      </motion.h1>

      {/* ── Description ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
      >
        {t.description}{' '}
        <span className="text-foreground font-semibold">{t.descriptionBold}</span>
      </motion.p>

      {/* ── Feature cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
      >
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
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

      {/* ── CTA buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        {/* Begin Assessment — primary */}
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

        {/* Secondary row */}
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

      {/* ── Powered by badge ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-xs text-muted-foreground/50 font-mono"
      >
        {t.poweredBy}
      </motion.div>
    </div>
  );
}
