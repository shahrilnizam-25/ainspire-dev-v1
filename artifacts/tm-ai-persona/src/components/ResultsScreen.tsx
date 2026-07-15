import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { personas } from '../data/personas';

export default function ResultsScreen({ 
  resultPersonaId,
  onRetake 
}: { 
  resultPersonaId: string,
  onRetake: () => void 
}) {
  const result = personas[resultPersonaId];
  
  if (!result) return null;

  const Icon = result.icon;

  return (
    <div className="w-full max-w-5xl px-6 py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center mb-16 w-full max-w-3xl"
      >
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-bold mb-8"
        >
          Your AI Persona
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="w-40 h-40 rounded-3xl flex items-center justify-center mb-10 relative"
          style={{ 
            backgroundColor: `${result.color}15`,
            boxShadow: `0 0 60px ${result.color}30`,
            border: `1px solid ${result.color}40`
          }}
        >
          <Icon className="w-20 h-20" style={{ color: result.color }} />
          <div className="absolute inset-0 rounded-3xl blur-2xl mix-blend-screen opacity-60" style={{ backgroundColor: result.color }} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl"
          style={{ color: result.color, textShadow: `0 0 30px ${result.color}50` }}
        >
          {result.name}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-3xl font-medium italic text-white/90 mb-8"
        >
          "{result.tagline}"
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {result.description}
        </motion.p>
      </motion.div>

      {/* All Personas Reference */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16"
      >
        {Object.values(personas).map((p) => {
          const PIcon = p.icon;
          const isResult = p.id === resultPersonaId;
          
          return (
            <div 
              key={p.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center relative overflow-hidden
                ${isResult ? 'bg-card border-card-border shadow-2xl scale-100 md:scale-[1.05] z-10' : 'bg-card/20 border-transparent opacity-50 hover:opacity-80'}
              `}
              style={isResult ? { borderColor: p.color, boxShadow: `0 0 30px ${p.color}15` } : {}}
            >
              {isResult && (
                 <div className="absolute inset-0 opacity-10 blur-xl" style={{ backgroundColor: p.color }} />
              )}
              <PIcon className="w-10 h-10 mb-4" style={{ color: p.color }} />
              <div className="font-bold text-base mb-1 text-foreground">{p.name}</div>
              {isResult && <div className="mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-background border" style={{ borderColor: p.color, color: p.color }}>You</div>}
            </div>
          );
        })}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        onClick={onRetake}
        className="group flex items-center gap-3 px-8 py-4 rounded-full border-2 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground font-semibold"
      >
        <RefreshCw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
        <span>Retake Assessment</span>
      </motion.button>
    </div>
  );
}
