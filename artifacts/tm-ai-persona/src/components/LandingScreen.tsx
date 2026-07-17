import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, BarChart3, Route } from 'lucide-react';

const FEATURES = [
  { icon: Brain, label: 'AI-Powered Classification', desc: 'Claude Sonnet reasons holistically over your responses' },
  { icon: Route, label: 'Personalised Learning Pathway', desc: 'Tailored recommendations matched to your unique profile' },
  { icon: BarChart3, label: 'Workforce Analytics', desc: 'HR-ready insights with human-in-the-loop governance' },
];

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col items-center text-center">

      {/* TM Official Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center mb-14"
      >
        <img
          src="/tm-logo-official.png"
          alt="Telekom Malaysia"
          className="h-16 md:h-20 w-auto object-contain mb-5"
        />
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
            Talent Development Initiative
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </motion.div>

      {/* Hero Text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        className="mb-6"
      >
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-semibold uppercase tracking-widest mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Claude AI · Agentic Reasoning
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-0">
          <span className="text-white">Discover Your</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.35)]">
            AI Persona
          </span>
          <br />
          <span className="text-white text-4xl md:text-5xl lg:text-[3.5rem] font-semibold">
            with Personalized
          </span>
          <br />
          <span className="text-white text-4xl md:text-5xl lg:text-[3.5rem] font-semibold">
            Learning Pathway
          </span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
      >
        An AI-powered assessment to discover your unique role in{' '}
        <span className="text-foreground font-medium">Telekom Malaysia's AI future.</span>
      </motion.p>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
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

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
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
      </motion.div>

    </div>
  );
}
