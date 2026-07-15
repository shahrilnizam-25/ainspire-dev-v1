import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full max-w-4xl px-6 py-12 flex flex-col items-center text-center mt-[-5vh]">
      {/* TM Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center mb-16"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFB700] to-[#FF8A00] flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 border border-white/10">
          <span className="text-3xl font-black text-white tracking-tighter">TM</span>
        </div>
        <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase">Telekom Malaysia</h2>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="space-y-8 mb-16"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
          Discover Your <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_25px_rgba(0,212,255,0.4)]">
            AI Persona
          </span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A 5-question self-assessment to find your role in Malaysia's AI future. 
          Uncover how you shape the digital workforce of tomorrow.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-4 px-10 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 glow-cyan"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative">Begin Assessment</span>
          <ArrowRight className="relative w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
