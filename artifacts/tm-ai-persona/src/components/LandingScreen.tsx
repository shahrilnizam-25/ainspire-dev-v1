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

      {/* ── Platform badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest"
      >
        {t.platformLabel}
      </motion.div>

      {/* ── TM logo  +  AiNspire pill — same row, reads "TM AiNspire" ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 flex items-center gap-5"
      >
        {/* TM logo — original brand colours, large */}
        <img
          src="/tm-logo-official.png"
          alt="Telekom Malaysia"
          className="w-auto object-contain"
          style={{ height: 'clamp(3.5rem, 7vw, 5.5rem)' }}
        />

        {/* AiNspire glassy pill */}
        <div className="relative">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,180,255,0.18) 0%, rgba(139,92,246,0.12) 60%, transparent 100%)' }}
          />
          {/* Pill */}
          <div
            className="relative flex items-center select-none px-10 py-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(0,20,40,0.72) 0%, rgba(10,5,30,0.80) 100%)',
              border: '1.5px solid rgba(0,212,255,0.35)',
              boxShadow: '0 0 32px rgba(0,212,255,0.14), 0 0 60px rgba(139,92,246,0.10), inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* "Ai" — cyan gradient */}
            <span
              className="font-black tracking-tight leading-none"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                background: 'linear-gradient(135deg, #a5f3fc 0%, #22d3ee 40%, #00b4d8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ai
            </span>
            {/* "Nspire" — purple with glow */}
            <span
              className="font-black tracking-tight leading-none"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 14px rgba(167,139,250,0.65))',
              }}
            >
              Nspire
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Hero headline ── */}
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

      {/* ── Description — single horizontal line ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.28 }}
        className="text-base md:text-lg text-muted-foreground mb-10 whitespace-nowrap"
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
