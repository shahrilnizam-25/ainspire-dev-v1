import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { OpenQuestion } from '../data/questions';

const MIN_CHARS = 20;

export default function OpenQuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  onSubmit,
}: {
  question: OpenQuestion;
  currentIndex: number;
  totalQuestions: number;
  onSubmit: (role: string, freeText: string) => void;
}) {
  const [role, setRole] = useState('');
  const [text, setText] = useState('');

  const trimmedRole = role.trim();
  const trimmedText = text.trim();
  const canSubmit = trimmedRole.length > 0 && trimmedText.length >= MIN_CHARS;

  return (
    <div className="w-full max-w-3xl px-6 py-8 flex flex-col items-center">
      {/* Progress */}
      <div className="w-full mb-12 space-y-4">
        <div className="flex justify-between text-sm font-medium text-muted-foreground font-mono">
          <span>0{currentIndex + 1}</span>
          <span>0{totalQuestions}</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary glow-cyan"
            initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* AI badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
      >
        ✦ AI-Analysed Open Response
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-center"
      >
        Question 6
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-base mb-10 text-center max-w-xl"
      >
        Your answers here carry real weight — the AI agent reads them holistically
        alongside your multiple-choice responses before classifying your persona.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full space-y-8"
      >
        {/* Part A — Role */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/30">
              Part A
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Required
            </span>
          </div>
          <label className="block text-lg font-semibold mb-3 leading-snug">
            What is your current role in Telekom Malaysia?
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Network Engineer, Product Manager, Data Analyst…"
            className="w-full bg-card border-2 border-card-border rounded-xl px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
          />
          {trimmedRole.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Please enter your current role to continue.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-card-border/50" />

        {/* Part B — AI Journey */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 rounded-md bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest border border-secondary/30">
              Part B
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Required · {MIN_CHARS} characters minimum
            </span>
          </div>
          <label className="block text-lg font-semibold mb-3 leading-snug">
            {question.text}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={question.placeholder}
            rows={6}
            className="w-full bg-card border-2 border-card-border rounded-xl p-5 text-base text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60 transition-colors leading-relaxed"
          />
          <div className="mt-2">
            <span
              className={`text-sm font-mono transition-colors ${
                trimmedText.length < MIN_CHARS ? 'text-muted-foreground' : 'text-primary'
              }`}
            >
              {trimmedText.length} / {MIN_CHARS} characters minimum
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <motion.button
            onClick={() => canSubmit && onSubmit(trimmedRole, trimmedText)}
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            className={`flex items-center gap-3 px-8 py-3 rounded-full font-semibold transition-all text-base
              ${
                canSubmit
                  ? 'bg-primary text-background shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }`}
          >
            <Send className="w-4 h-4" />
            Analyse with AI
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
