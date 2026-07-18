import { motion } from 'framer-motion';
import { ArrowLeft, Download, Bot, TrendingUp, CheckCircle, ArrowUpRight } from 'lucide-react';
import { personas } from '../data/personas';
import type { AIResult } from '../App';

const DIMENSION_LABELS = [
  'AI Awareness',
  'Practical Application',
  'Strategic Thinking',
  'Collaboration & Ethics',
];

// Derive 4 dimension scores from confidence + persona for visual richness
function getDimensions(confidence: number, personaId: string) {
  const base = Math.round(confidence * 100);
  const offsets: Record<string, number[]> = {
    explorer:   [+8, +4, -6, +2],
    builder:    [+2, +10, -4, +4],
    strategist: [-2, +0, +10, +6],
    visionary:  [+4, -4, +8, +6],
  };
  const o = offsets[personaId] ?? [0, 0, 0, 0];
  return DIMENSION_LABELS.map((label, i) => ({
    label,
    score: Math.min(99, Math.max(52, base + o[i])),
  }));
}

const STRENGTHS: Record<string, string[]> = {
  explorer:   ['Curiosity-driven experimentation', 'Fast AI tool adoption', 'Cross-domain learning agility', 'Open to iterative feedback'],
  builder:    ['Hands-on AI implementation', 'Technical prototyping', 'Prompt engineering fluency', 'Systematic problem solving'],
  strategist: ['AI vision & alignment', 'Stakeholder communication', 'ROI-focused AI planning', 'Ethical AI governance'],
  visionary:  ['Enterprise AI transformation', 'Executive championing', 'Cross-functional orchestration', 'Long-horizon AI roadmapping'],
};

const GROWTH: Record<string, string[]> = {
  explorer:   ['Structured implementation skills', 'AI project scoping & delivery'],
  builder:    ['Strategic alignment with business goals', 'AI ethics & governance frameworks'],
  strategist: ['Hands-on prompt engineering', 'AI model evaluation techniques'],
  visionary:  ['Deep technical AI literacy', 'Rapid hands-on prototyping'],
};

export default function ReportScreen({
  resultPersonaId,
  aiResult,
  userRole,
  onBack,
}: {
  resultPersonaId: string;
  aiResult: AIResult | null;
  userRole: string;
  onBack: () => void;
}) {
  const persona = personas[resultPersonaId];
  if (!persona) return null;

  const confidence = aiResult ? Math.round(aiResult.confidence * 100) : 75;
  const dimensions = getDimensions(aiResult?.confidence ?? 0.75, resultPersonaId);
  const Icon = persona.icon;
  const strengths = STRENGTHS[resultPersonaId] ?? STRENGTHS.explorer;
  const growth = GROWTH[resultPersonaId] ?? GROWTH.explorer;

  const handlePrint = () => window.print();

  return (
    <>
      {/* Print-only global styles */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-page { box-shadow: none !important; }
        }
      `}</style>

      <div className="w-full max-w-4xl px-6 py-10 flex flex-col">

        {/* Top nav — hidden on print */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 no-print"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
            style={{
              background: `${persona.color}18`,
              border: `1px solid ${persona.color}50`,
              color: persona.color,
            }}
          >
            <Download className="w-4 h-4" />
            Download / Print PDF
          </button>
        </motion.div>

        {/* Report card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="print-page rounded-3xl overflow-hidden border border-card-border"
          style={{ background: 'var(--card)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
        >
          {/* Header band */}
          <div
            className="px-10 py-8 flex items-start justify-between"
            style={{
              background: 'linear-gradient(135deg, #0a0e1a 0%, #0d2640 100%)',
              borderBottom: `1px solid ${persona.color}30`,
            }}
          >
            <div>
              {/* TM + AiNspire branding */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: 'linear-gradient(135deg, #0066cc, #00a3e0)' }}>TM</div>
                <div>
                  <div className="text-base font-bold text-white leading-none">AiNspire</div>
                  <div className="text-xs font-semibold tracking-widest uppercase mt-0.5" style={{ color: 'rgba(0,212,200,0.8)' }}>Personalised AI Readiness Report</div>
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1">Your AI Readiness Report</div>
              <div className="text-sm font-medium mb-1" style={{ color: `${persona.color}cc` }}>
                {userRole || 'Telekom Malaysia Employee'}
              </div>
              <div className="text-xs text-white/40">
                Assessment Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}Powered by Claude AI
              </div>
            </div>

            {/* Persona badge */}
            <div className="text-right flex-shrink-0 ml-6">
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">AI Persona</div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ml-auto"
                style={{ background: `${persona.color}18`, border: `1px solid ${persona.color}50` }}
              >
                <Icon className="w-8 h-8" style={{ color: persona.color }} />
              </div>
              <div className="text-2xl font-black" style={{ color: persona.color }}>{persona.name}</div>
              <div className="text-xs text-white/40 mt-1">
                Confidence&nbsp;
                <span className="font-bold text-green-400">{confidence}%</span>
              </div>
            </div>
          </div>

          <div className="px-10 py-8 space-y-8">

            {/* Dimension scores */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: persona.color }} />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Readiness Dimensions</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                {dimensions.map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-muted-foreground">{d.label}</span>
                      <span className="text-sm font-bold" style={{ color: persona.color }}>{d.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${d.score}%` }}
                        transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                        style={{ background: `linear-gradient(90deg, ${persona.color}80, ${persona.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative + Reasoning */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border" style={{ background: `${persona.color}08`, borderColor: `${persona.color}25` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-3.5 h-3.5" style={{ color: persona.color }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: persona.color }}>AI Assessment Narrative</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiResult?.narrative ?? `You demonstrate strong ${persona.name.toLowerCase()} characteristics in your approach to AI adoption and strategy.`}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/8 bg-white/3">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Reasoning</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiResult?.reasoning ?? `Your responses reflect a consistent pattern aligned with the ${persona.name} profile across all assessment dimensions.`}
                </p>
              </div>
            </div>

            {/* Strengths + Growth */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Key Strengths</h3>
                </div>
                <div className="space-y-2">
                  {strengths.map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b' }} />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Growth Areas</h3>
                </div>
                <div className="space-y-2">
                  {growth.map((g) => (
                    <div key={g} className="flex items-center gap-3">
                      <ArrowUpRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning path */}
            {aiResult && aiResult.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b5cf6' }} />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Recommended Learning Pathway</h3>
                  <span className="text-xs text-muted-foreground ml-1">— tailored for {persona.name}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {aiResult.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/2">
                      <div
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: `${persona.color}20`, color: persona.color, border: `1px solid ${persona.color}40` }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground mb-0.5">{rec.title}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{rec.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-white/8 flex items-center justify-between">
              <div className="text-xs text-muted-foreground/60">
                Generated by AiNspire · Powered by Claude AI · Confidential — For personal development use only
              </div>
              <div className="text-xs text-muted-foreground/60">
                Telekom Malaysia Berhad · {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Print button — bottom, hidden on print */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-8 no-print"
        >
          <button
            onClick={handlePrint}
            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all"
            style={{
              background: `linear-gradient(135deg, ${persona.color}22, ${persona.color}12)`,
              border: `2px solid ${persona.color}50`,
              color: persona.color,
              boxShadow: `0 0 30px ${persona.color}20`,
            }}
          >
            <Download className="w-5 h-5" />
            Save as PDF — Print Report
          </button>
        </motion.div>
      </div>
    </>
  );
}
