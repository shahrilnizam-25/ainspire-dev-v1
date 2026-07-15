import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Brain, Lightbulb, Sparkles, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    id: 'observe',
    icon: Eye,
    label: 'OBSERVE',
    detail: 'Reading all 6 responses including your open-ended answer…',
    color: '#00d4ff',
  },
  {
    id: 'reason',
    icon: Brain,
    label: 'REASON',
    detail: 'Detecting patterns, resolving mixed signals, weighing free-text…',
    color: '#a855f7',
  },
  {
    id: 'decide',
    icon: Lightbulb,
    label: 'DECIDE',
    detail: 'Classifying your AI persona and scoring confidence…',
    color: '#f59e0b',
  },
  {
    id: 'produce',
    icon: Sparkles,
    label: 'PRODUCE',
    detail: 'Crafting your personalised narrative and learning path…',
    color: '#10b981',
  },
];

const STEP_DURATION = 1900; // ms per step

export default function AIThinkingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(i);
          if (i > 0) {
            setCompletedSteps((prev) => {
              const next = new Set(prev);
              next.add(i - 1);
              return next;
            });
          }
        }, i * STEP_DURATION),
      );
    });

    // Mark last step complete after its duration
    timers.push(
      setTimeout(() => {
        setCompletedSteps((prev) => {
          const next = new Set(prev);
          next.add(STEPS.length - 1);
          return next;
        });
      }, STEPS.length * STEP_DURATION),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-2xl px-6 py-16 flex flex-col items-center text-center">
      {/* Header badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
      >
        ✦ Claude Sonnet · Agentic Reasoning
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        Analysing Your Responses
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-14 text-lg max-w-md"
      >
        Our AI agent is reasoning through your complete assessment to discover
        your unique AI persona.
      </motion.p>

      {/* Step pipeline */}
      <div className="w-full grid grid-cols-4 gap-3 mb-14">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === i && !completedSteps.has(i);
          const isDone = completedSteps.has(i);

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.35, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-500 overflow-hidden
                ${
                  isActive
                    ? 'scale-105 bg-card'
                    : isDone
                      ? 'bg-card/50 border-card-border'
                      : 'bg-card/10 border-card-border/20'
                }`}
              style={
                isActive
                  ? {
                      borderColor: step.color,
                      boxShadow: `0 0 24px ${step.color}30`,
                    }
                  : isDone
                    ? { borderColor: `${step.color}50` }
                    : {}
              }
            >
              {/* Pulsing bg when active */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{ opacity: [0.06, 0.15, 0.06] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  style={{ backgroundColor: step.color }}
                />
              )}

              {/* Done check */}
              {isDone && (
                <CheckCircle
                  className="absolute top-2 right-2 w-3.5 h-3.5"
                  style={{ color: step.color }}
                />
              )}

              <Icon
                className="w-7 h-7 mb-2 relative z-10"
                style={{ color: isActive || isDone ? step.color : 'currentColor' }}
              />

              <div
                className="text-xs font-bold uppercase tracking-widest mb-2 relative z-10"
                style={{ color: isActive ? step.color : undefined }}
              >
                {step.label}
              </div>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.p
                    key="detail"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-muted-foreground text-center leading-relaxed relative z-10"
                  >
                    {step.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bouncing dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.22 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
