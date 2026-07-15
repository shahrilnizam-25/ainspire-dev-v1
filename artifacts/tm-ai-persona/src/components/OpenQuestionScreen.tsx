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
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const trimmed = text.trim();
  const canSubmit = trimmed.length >= MIN_CHARS;

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
        className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-center"
      >
        {question.text}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-base mb-6 text-center max-w-xl"
      >
        Your answer here carries real weight — the AI agent reads it holistically
        alongside your multiple-choice responses before classifying your persona.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={question.placeholder}
          rows={6}
          className="w-full bg-card border-2 border-card-border rounded-xl p-5 text-lg text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/60 transition-colors leading-relaxed"
        />

        <div className="flex items-center justify-between mt-3">
          <span
            className={`text-sm font-mono transition-colors ${
              trimmed.length < MIN_CHARS ? 'text-muted-foreground' : 'text-primary'
            }`}
          >
            {trimmed.length} / {MIN_CHARS} characters minimum
          </span>

          <motion.button
            onClick={() => canSubmit && onSubmit(trimmed)}
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
