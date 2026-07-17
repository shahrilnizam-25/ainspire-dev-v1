import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, BarChart3, Route, TrendingUp, Mail } from 'lucide-react';

const FEATURES = [
  { icon: Brain, label: 'AI-Powered Classification', desc: 'Claude Sonnet reasons holistically over your responses' },
  { icon: Route, label: 'Personalised Learning Pathway', desc: 'Tailored recommendations matched to your unique profile' },
  { icon: BarChart3, label: 'Workforce Analytics', desc: 'HR-ready insights with human-in-the-loop governance' },
];

export default function LandingScreen({ onStart, onStats, onContact }: { onStart: () => void; onStats: () => void; onContact: () => void }) {
  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col items-center text-center">

      {/* TM Logo + Platform Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center mb-10"
      >
        <img
          src="/tm-logo-official.png"
          alt="Telekom Malaysia"
          className="h-16 md:h-20 w-auto object-contain mb-5"
        />

        {/* Platform label */}
        <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-3">
          TM AI Workforce Intelligent Platform
        </p>

        {/* AiNspire — glowing product name */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow halo */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-40 bg-gradient-to-r from-primary via-secondary to-primary scale-150" />
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative px-7 py-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
          >
            <span className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] via-[#a855f7] to-[#00d4ff]"
              style={{ filter: 'drop-shadow(0 0 18px rgba(0,212,255,0.7))' }}
            >
              AiNspire
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.18, ease: 'easeOut' }}
        className="mb-5"
      >
        {/* Main title — large */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight whitespace-nowrap mb-2">
          <span className="text-white">Discover Your </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.35)]">
            AI Persona
          </span>
        </h1>

        {/* Subtitle line — smaller, one line */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white/70 whitespace-nowrap">
          with Personalized Learning Pathway
        </h2>
      </motion.div>

      {/* Description — one horizontal line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-base md:text-lg text-muted-foreground whitespace-nowrap mb-10"
      >
        An AI-powered assessment to discover your unique role in{' '}
        <span className="text-foreground font-medium">Telekom Malaysia's AI future.</span>
      </motion.p>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 + i * 0.08 }}
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
      </motion.div>

      {/* Powered by badge — below feature cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.62 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary/70 text-xs font-semibold uppercase tracking-widest mb-10"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Powered by Claude AI · Agentic Reasoning
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="flex flex-col items-center gap-4"
      >
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-4 px-12 py-5 bg-primary text-primary-foreground font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,212,255,0.35)] hover:shadow-[0_0_60px_rgba(0,212,255,0.55)]"
        >
          <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
          <span className="relative">Begin Assessment</span>
          <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs text-muted-foreground/60 tracking-wide">
          5 questions + 1 open response · Takes ~3 minutes
        </p>

        {/* Secondary nav row */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <motion.button
            onClick={onStats}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            View Workforce Statistics
          </motion.button>

          <motion.button
            onClick={onContact}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="w-4 h-4 text-primary" />
            Contact Us
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
}
