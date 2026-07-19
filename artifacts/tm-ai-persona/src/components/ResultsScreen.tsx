import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronRight, Bot, BarChart2, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { personas } from '../data/personas';
import type { AIResult } from '../App';
import type { Lang } from '../i18n';
import { translations } from '../i18n';

export default function ResultsScreen({
  lang,
  resultPersonaId,
  aiResult,
  aiError,
  isReClassifying,
  onRetake,
  onHRView,
  onReport,
}: {
  lang: Lang;
  resultPersonaId: string;
  aiResult: AIResult | null;
  aiError: string | null;
  isReClassifying: boolean;
  onRetake: () => void;
  onHRView: () => void;
  onReport: () => void;
}) {
  const result = personas[resultPersonaId];
  if (!result) return null;

  const t = translations[lang];
  const Icon = result.icon;
  const confidence = aiResult ? Math.round(aiResult.confidence * 100) : null;

  return (
    <div className="w-full max-w-5xl px-6 py-12 flex flex-col items-center">

      {/* Re-classifying indicator */}
      <AnimatePresence>
        {isReClassifying && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-4"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {t.reClassifyingLabel ?? 'Updating content…'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classification badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest flex items-center gap-2
          ${aiResult
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
          }`}
      >
        {aiResult ? (
          <>
            <Bot className="w-3.5 h-3.5" />
            {t.resultsAiClassified} · {confidence}% {t.resultsConfidence}
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5" />
            {t.resultsRuleBased} {aiError ? t.resultsAiUnavail : ''}
          </>
        )}
      </motion.div>

      {/* Persona hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center mb-10 w-full max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-bold mb-8"
        >
          {t.resultsYourPersona}
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          className="w-40 h-40 rounded-3xl flex items-center justify-center mb-10 relative"
          style={{
            backgroundColor: `${result.color}15`,
            boxShadow: `0 0 60px ${result.color}30`,
            border: `1px solid ${result.color}40`,
          }}
        >
          <Icon className="w-20 h-20" style={{ color: result.color }} />
          <div
            className="absolute inset-0 rounded-3xl blur-2xl mix-blend-screen opacity-60"
            style={{ backgroundColor: result.color }}
          />
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

        {/* AI narrative or static description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {aiResult?.narrative ?? result.description}
        </motion.p>
      </motion.div>

      {/* AI Reasoning panel */}
      {aiResult && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-3xl mb-10 p-6 rounded-2xl border border-primary/20 bg-primary/5"
        >
          <div className="flex items-center gap-2 mb-3 text-primary text-xs font-bold uppercase tracking-widest">
            <Bot className="w-4 h-4" />
            {t.resultsAiReasoning}
          </div>
          <p className="text-muted-foreground leading-relaxed">{aiResult.reasoning}</p>
        </motion.div>
      )}

      {/* Personalised learning path */}
      {aiResult && aiResult.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-3xl mb-12"
        >
          <h3 className="text-lg font-bold mb-4 text-foreground">{t.resultsLearningPath}</h3>
          <div className="space-y-3">
            {aiResult.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-card-border"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-background"
                  style={{ backgroundColor: result.color }}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">{rec.title}</div>
                  <div className="text-muted-foreground text-sm">{rec.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All personas reference grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.85 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {Object.values(personas).map((p) => {
          const PIcon = p.icon;
          const isResult = p.id === resultPersonaId;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center relative overflow-hidden
                ${isResult
                  ? 'bg-card border-card-border shadow-2xl scale-100 md:scale-[1.05] z-10'
                  : 'bg-card/20 border-transparent opacity-50 hover:opacity-80'
                }`}
              style={isResult ? { borderColor: p.color, boxShadow: `0 0 30px ${p.color}15` } : {}}
            >
              {isResult && (
                <div
                  className="absolute inset-0 opacity-10 blur-xl"
                  style={{ backgroundColor: p.color }}
                />
              )}
              <PIcon className="w-10 h-10 mb-4" style={{ color: p.color }} />
              <div className="font-bold text-base mb-1 text-foreground">{p.name}</div>
              {isResult && (
                <div
                  className="mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-background border"
                  style={{ borderColor: p.color, color: p.color }}
                >
                  {t.resultsYouBadge}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <button
          onClick={onRetake}
          className="group flex items-center gap-3 px-8 py-4 rounded-full border-2 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground font-semibold"
        >
          <RefreshCw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
          {t.resultsRetake}
        </button>
        <button
          onClick={onReport}
          className="group flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all font-semibold"
          style={{
            borderColor: `${result.color}50`,
            color: result.color,
            background: `${result.color}0d`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${result.color}1a`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${result.color}0d`; }}
        >
          <FileText className="w-5 h-5" />
          {t.resultsDownloadReport}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={onHRView}
          className="group flex items-center gap-3 px-8 py-4 rounded-full border-2 border-orange-500/40 hover:border-orange-400/70 hover:bg-orange-500/10 transition-all text-orange-400 hover:text-orange-300 font-semibold"
        >
          <BarChart2 className="w-5 h-5" />
          {t.resultsHRView}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
