import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, CheckCircle, Bot, AlertTriangle, Shield } from 'lucide-react';
import { personas } from '../data/personas';
import type { AIResult } from '../App';

// Simulated team data for the HR demo
const DEMO_TEAM = [
  { name: 'Ahmad Faiz', persona: 'builder' },
  { name: 'Nurul Ain', persona: 'explorer' },
  { name: 'Kevin Lim', persona: 'strategist' },
  { name: 'Priya Nair', persona: 'builder' },
  { name: 'Hafizuddin M.', persona: 'visionary' },
  { name: 'Siti Zulaikha', persona: 'explorer' },
  { name: 'Marcus Tan', persona: 'builder' },
  { name: 'Roshini D.', persona: 'strategist' },
  { name: 'Amirul Haq', persona: 'explorer' },
  { name: 'Elaine Wong', persona: 'visionary' },
  { name: 'Farouk Azmi', persona: 'strategist' },
  { name: 'Jasmine Loh', persona: 'explorer' },
];

const AI_INSIGHTS: Record<string, string> = {
  explorer:
    'Your team is Explorer-dominant — a curious, experimentation-ready workforce. The highest-leverage next action is a structured AI Sandbox Programme where employees can safely trial tools with curated challenges. This typically accelerates progression to Builder and Strategist roles within 6–9 months.',
  builder:
    'Builder-heavy teams are ready to develop internal AI solutions. The recommended investment is an AI Engineering Guild paired with internal LLM integration bootcamps. Consider establishing inner-source AI modules that Builders can share across business units.',
  strategist:
    'Strong strategic AI thinking is present across the team. Focus investment on AI ROI Frameworks, AI governance and ethics training, and cross-functional AI steering committees. Strategists are your best accelerators for executive buy-in.',
  visionary:
    'Your team has exceptional high-potential AI champions. Channel them into a Telekom Malaysia AI Council to drive top-down transformation. Visionaries paired with Builders create the most impactful AI initiatives — look for these natural partnerships within your data.',
};

export default function HRDashboard({
  currentUserPersona,
  aiResult,
  onBack,
}: {
  currentUserPersona: string;
  aiResult: AIResult | null;
  onBack: () => void;
}) {
  const [approved, setApproved] = useState(false);

  // Include the current user in the team
  const allMembers = [...DEMO_TEAM, { name: 'You (current)', persona: currentUserPersona }];

  // Persona distribution
  const counts = allMembers.reduce<Record<string, number>>((acc, m) => {
    acc[m.persona] = (acc[m.persona] ?? 0) + 1;
    return acc;
  }, {});
  const total = allMembers.length;

  // Dominant persona
  const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    'explorer') as string;
  const dominantP = personas[dominant];

  return (
    <div className="w-full max-w-5xl px-6 py-12 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={onBack}
          className="p-2 rounded-full border border-card-border hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">
            HR Manager Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-black">Team AI Persona Overview</h1>
        </div>
      </motion.div>

      {/* Human-in-the-loop notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-yellow-300 text-sm mb-1">
            Human Review Required — AI Recommendations are Advisory Only
          </div>
          <div className="text-muted-foreground text-sm">
            All AI-generated training recommendations below require explicit HR Manager approval
            before action is taken. Employees are never automatically routed — you decide.
          </div>
        </div>
      </motion.div>

      {/* Persona distribution */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-bold">Persona Distribution ({total} employees)</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(personas).map((p) => {
            const count = counts[p.id] ?? 0;
            const pct = Math.round((count / total) * 100);
            const PIcon = p.icon;
            const isDominant = p.id === dominant;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + Object.keys(personas).indexOf(p.id) * 0.08 }}
                className={`p-5 rounded-2xl bg-card border-2 flex flex-col items-center text-center transition-all
                  ${isDominant ? '' : 'opacity-70'}`}
                style={{
                  borderColor: isDominant ? p.color : `${p.color}20`,
                  boxShadow: isDominant ? `0 0 20px ${p.color}15` : undefined,
                }}
              >
                <PIcon className="w-8 h-8 mb-3" style={{ color: p.color }} />
                <div className="font-bold text-foreground mb-1 text-sm">{p.name}</div>
                <div className="text-3xl font-black mb-0.5" style={{ color: p.color }}>
                  {count}
                </div>
                <div className="text-xs text-muted-foreground mb-3">{pct}% of team</div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
                    style={{ backgroundColor: p.color }}
                  />
                </div>
                {isDominant && (
                  <div
                    className="mt-3 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                    style={{ borderColor: p.color, color: p.color }}
                  >
                    Dominant
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-8 p-6 rounded-2xl border border-primary/20 bg-primary/5"
      >
        <div className="flex items-center gap-2 mb-3 text-primary text-xs font-bold uppercase tracking-widest">
          <Bot className="w-4 h-4" />
          AI Workforce Insight
        </div>

        <p className="text-foreground leading-relaxed mb-4">
          <strong style={{ color: dominantP?.color }}>
            {dominantP?.name}s ({counts[dominant] ?? 0}/{total} ·{' '}
            {Math.round(((counts[dominant] ?? 0) / total) * 100)}%)
          </strong>{' '}
          are your dominant profile.{' '}
          {AI_INSIGHTS[dominant]}
        </p>

        {/* Latest user's recommendations */}
        {aiResult && aiResult.recommendations.length > 0 && (
          <div className="border-t border-primary/10 pt-4 mt-2">
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">
              Latest Assessment — Recommended Training (pending your approval)
            </div>
            <ul className="space-y-2">
              {aiResult.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5 font-bold">→</span>
                  <span>
                    <strong>{r.title}:</strong> {r.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Data governance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mb-8 p-4 rounded-xl border border-card-border bg-card/30 flex items-start gap-3"
      >
        <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <strong className="text-foreground">Data Governance:</strong> No PII is stored.
          Assessment results are anonymised and aggregated. This dashboard shows demo data only.
          Full audit trail maintained for all HR-approved actions.
        </div>
      </motion.div>

      {/* Human approval CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="flex flex-col items-center gap-4"
      >
        {!approved ? (
          <button
            onClick={() => setApproved(true)}
            className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg bg-orange-500 hover:bg-orange-400 text-white transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]"
          >
            <CheckCircle className="w-5 h-5" />
            Approve &amp; Route to Training Programme
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg border-2 border-green-500/60 text-green-400 bg-green-500/10"
          >
            <CheckCircle className="w-5 h-5" />
            Training Programme Activated — HR Approved
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          By approving, you confirm that you have reviewed the AI recommendations and authorise
          routing of flagged employees to the suggested training programme.
        </p>
      </motion.div>
    </div>
  );
}
