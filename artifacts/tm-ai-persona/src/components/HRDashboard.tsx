import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, CheckCircle, Bot, AlertTriangle, Shield,
  Download, TrendingUp, Bell, Filter
} from 'lucide-react';
import { personas } from '../data/personas';
import type { AIResult } from '../App';

const DEMO_TEAM = [
  { name: 'Ahmad Faiz',     role: 'Network Engineer',        grade: 'H', persona: 'builder',    score: 84, trend: '+12', status: 'complete' },
  { name: 'Nurul Ain',      role: 'Digital Strategy',        grade: 'G', persona: 'visionary',  score: 91, trend: '+8',  status: 'complete' },
  { name: 'Kevin Lim',      role: 'IT Operations',           grade: 'F', persona: 'explorer',   score: 67, trend: '+5',  status: 'complete' },
  { name: 'Priya Nair',     role: 'Cloud Infrastructure',    grade: 'G', persona: 'builder',    score: 82, trend: '+9',  status: 'complete' },
  { name: 'Hafizuddin M.',  role: 'Product Innovation',      grade: 'H', persona: 'visionary',  score: 88, trend: '+6',  status: 'complete' },
  { name: 'Siti Zulaikha',  role: 'Customer Experience',     grade: 'F', persona: 'explorer',   score: 71, trend: '+4',  status: 'complete' },
  { name: 'Marcus Tan',     role: 'Data Analytics',          grade: 'G', persona: 'builder',    score: 79, trend: '+11', status: 'complete' },
  { name: 'Roshini D.',     role: 'AI Governance',           grade: 'H', persona: 'strategist', score: 85, trend: '+15', status: 'complete' },
  { name: 'Amirul Haq',     role: 'Security Operations',     grade: 'F', persona: 'explorer',   score: null, trend: null, status: 'pending' },
  { name: 'Elaine Wong',    role: 'Corporate Strategy',      grade: 'I', persona: 'visionary',  score: null, trend: null, status: 'pending' },
  { name: 'Farouk Azmi',    role: 'Finance Business Partner',grade: 'G', persona: 'strategist', score: 76, trend: '+7',  status: 'complete' },
  { name: 'Jasmine Loh',    role: 'HR Learning & Dev',       grade: 'H', persona: 'strategist', score: 80, trend: '+10', status: 'complete' },
];

const AI_INSIGHTS: Record<string, string> = {
  explorer:   'Explorer-dominant teams are curious, experimentation-ready workforces. The highest-leverage next action is a structured AI Sandbox Programme where employees can safely trial tools with curated challenges. This typically accelerates progression to Builder and Strategist roles within 6–9 months.',
  builder:    'Builder-heavy teams are ready to develop internal AI solutions. The recommended investment is an AI Engineering Guild paired with internal LLM integration bootcamps. Consider establishing inner-source AI modules that Builders can share across business units.',
  strategist: 'Strong strategic AI thinking is present across the team. Focus investment on AI ROI Frameworks, AI governance and ethics training, and cross-functional AI steering committees. Strategists are your best accelerators for executive buy-in.',
  visionary:  'Your team has exceptional high-potential AI champions. Channel them into a Telekom Malaysia AI Council to drive top-down transformation. Visionaries paired with Builders create the most impactful AI initiatives — look for these natural partnerships within your data.',
};

type FilterPersona = 'all' | 'explorer' | 'builder' | 'strategist' | 'visionary';

function exportCSV(rows: typeof DEMO_TEAM, currentEntry: { name: string; persona: string; score: number | null }) {
  const all = [...rows, { name: 'You (current)', role: 'Current User', grade: '—', ...currentEntry, trend: null, status: currentEntry.score ? 'complete' : 'pending' }];
  const header = 'Name,Role,Grade,Persona,Score,Trend,Status';
  const lines = all.map(r => `${r.name},${r.role},${r.grade},${r.persona},${r.score ?? ''},${r.trend ?? ''},${r.status}`);
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ainspire-team-report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

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
  const [filterPersona, setFilterPersona] = useState<FilterPersona>('all');
  const [reminderSent, setReminderSent] = useState(false);

  const currentScore = aiResult ? Math.round(aiResult.confidence * 100) : null;

  const allMembers = [
    ...DEMO_TEAM,
    {
      name: 'You (current)',
      role: 'Current Assessment',
      grade: '—',
      persona: currentUserPersona,
      score: currentScore,
      trend: null,
      status: 'complete' as const,
    },
  ];

  const completed = allMembers.filter(m => m.status === 'complete');
  const pending   = allMembers.filter(m => m.status === 'pending');
  const scores    = completed.filter(m => m.score !== null).map(m => m.score as number);
  const avgScore  = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;

  const counts = allMembers.reduce<Record<string, number>>((acc, m) => {
    if (m.status === 'complete') acc[m.persona] = (acc[m.persona] ?? 0) + 1;
    return acc;
  }, {});
  const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'explorer') as string;
  const dominantP = personas[dominant];

  const filtered = filterPersona === 'all'
    ? allMembers
    : allMembers.filter(m => m.persona === filterPersona);

  const personaColor = (p: string) => personas[p]?.color ?? '#888';

  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full border border-card-border hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">HR Manager Dashboard</div>
            <h1 className="text-3xl font-black">Team AI Readiness</h1>
          </div>
        </div>
        <button
          onClick={() => exportCSV(DEMO_TEAM, { name: 'You (current)', persona: currentUserPersona, score: currentScore })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-card-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </motion.div>

      {/* Human-in-the-loop notice */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-yellow-300 text-sm mb-1">Human Review Required — AI Recommendations are Advisory Only</div>
          <div className="text-muted-foreground text-sm">All AI-generated training recommendations require explicit HR Manager approval before action is taken. Employees are never automatically routed — you decide.</div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Completion Rate', value: `${Math.round((completed.length / allMembers.length) * 100)}%`, sub: `${completed.length} of ${allMembers.length} members`, color: '#00d4c8' },
          { label: 'Avg Readiness Score', value: avgScore, sub: 'Across completed assessments', color: '#8b5cf6' },
          { label: 'Dominant Persona', value: dominantP?.name ?? '—', sub: `${counts[dominant] ?? 0} of ${completed.length} members`, color: dominantP?.color ?? '#888' },
          { label: 'Pending Members', value: pending.length, sub: 'Assessment not yet done', color: '#f59e0b' },
        ].map((k) => (
          <div key={k.label} className="p-5 rounded-2xl bg-card border border-card-border flex flex-col">
            <div className="text-xs text-muted-foreground mb-3 font-medium">{k.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Persona distribution mini-cards */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-bold">Persona Distribution</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Object.values(personas).map((p) => {
            const count = counts[p.id] ?? 0;
            const pct = completed.length ? Math.round((count / completed.length) * 100) : 0;
            const PIcon = p.icon;
            const isDominant = p.id === dominant;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + Object.keys(personas).indexOf(p.id) * 0.07 }}
                className="p-4 rounded-2xl bg-card border-2 flex flex-col items-center text-center transition-all cursor-pointer"
                style={{ borderColor: isDominant ? p.color : `${p.color}20`, opacity: isDominant ? 1 : 0.65, boxShadow: isDominant ? `0 0 20px ${p.color}15` : undefined }}
                onClick={() => setFilterPersona(filterPersona === p.id ? 'all' : p.id as FilterPersona)}
              >
                <PIcon className="w-6 h-6 mb-2" style={{ color: p.color }} />
                <div className="text-xs font-bold text-foreground mb-0.5">{p.name}</div>
                <div className="text-2xl font-black" style={{ color: p.color }}>{count}</div>
                <div className="text-xs text-muted-foreground mb-2">{pct}%</div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }} style={{ backgroundColor: p.color }} />
                </div>
                {isDominant && <div className="mt-2 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ borderColor: p.color, color: p.color }}>Dominant</div>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Individual team table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
        {/* Table header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-base font-bold">Individual Results</h2>
            {filterPersona !== 'all' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border ml-1"
                style={{ borderColor: personaColor(filterPersona), color: personaColor(filterPersona), background: `${personaColor(filterPersona)}10` }}>
                {personas[filterPersona]?.name} only
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex items-center gap-1.5">
              {(['all', 'explorer', 'builder', 'strategist', 'visionary'] as FilterPersona[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterPersona(f)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all border"
                  style={
                    filterPersona === f
                      ? { background: f === 'all' ? 'rgba(255,255,255,0.15)' : `${personaColor(f)}20`, borderColor: f === 'all' ? 'rgba(255,255,255,0.4)' : personaColor(f), color: f === 'all' ? '#fff' : personaColor(f) }
                      : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }
                  }
                >
                  {f === 'all' ? 'All' : personas[f]?.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-card-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-black/20">
                {['Employee', 'Role', 'Grade', 'Persona', 'Score', 'Trend', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((m, i) => {
                  const pColor = personaColor(m.persona);
                  const isYou = m.name === 'You (current)';
                  return (
                    <motion.tr
                      key={m.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-t border-card-border/50 hover:bg-white/2 transition-colors"
                      style={isYou ? { background: 'rgba(0,212,200,0.04)' } : undefined}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: m.status === 'complete' ? `${pColor}18` : 'rgba(255,255,255,0.06)', color: m.status === 'complete' ? pColor : 'rgba(255,255,255,0.3)' }}>
                            {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-semibold text-foreground">
                            {m.name}
                            {isYou && <span className="ml-1.5 text-xs font-bold text-primary/80">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{m.role}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/8 text-muted-foreground">
                          {m.grade !== '—' ? `Grade ${m.grade}` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{ borderColor: `${pColor}40`, color: pColor, background: `${pColor}12` }}>
                          {personas[m.persona]?.name ?? m.persona}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {m.score !== null
                          ? <span className="text-base font-black" style={{ color: m.score >= 85 ? '#22c55e' : m.score >= 70 ? '#00d4c8' : '#f59e0b' }}>{m.score}</span>
                          : <span className="text-muted-foreground/40 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {m.trend
                          ? <span className="text-xs font-bold text-green-400">{m.trend} pts</span>
                          : <span className="text-muted-foreground/40 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {m.status === 'complete'
                          ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400">✓ Done</span>
                          : <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/12 text-amber-400">⏳ Pending</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Table footer */}
          <div className="px-4 py-3 border-t border-card-border/50 flex items-center justify-between bg-black/10">
            <span className="text-xs text-muted-foreground">
              Showing {filtered.length} of {allMembers.length} members
            </span>
            {pending.length > 0 && (
              <button
                onClick={() => setReminderSent(true)}
                disabled={reminderSent}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all"
                style={
                  reminderSent
                    ? { borderColor: '#22c55e40', color: '#22c55e', background: '#22c55e12' }
                    : { borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b', background: 'rgba(245,158,11,0.08)' }
                }
              >
                <Bell className="w-3.5 h-3.5" />
                {reminderSent ? `✓ Reminders sent to ${pending.length} members` : `Send reminder to ${pending.length} pending`}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI Workforce Insight */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 p-6 rounded-2xl border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2 mb-3 text-primary text-xs font-bold uppercase tracking-widest">
          <Bot className="w-4 h-4" />
          AI Workforce Insight
        </div>
        <p className="text-foreground leading-relaxed mb-4">
          <strong style={{ color: dominantP?.color }}>{dominantP?.name}s ({counts[dominant] ?? 0}/{completed.length} · {Math.round(((counts[dominant] ?? 0) / completed.length) * 100)}%)</strong>{' '}
          are your dominant profile. {AI_INSIGHTS[dominant]}
        </p>
        {aiResult && aiResult.recommendations.length > 0 && (
          <div className="border-t border-primary/10 pt-4 mt-2">
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">Latest Assessment — Recommended Training (pending your approval)</div>
            <ul className="space-y-2">
              {aiResult.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5 font-bold">→</span>
                  <span><strong>{r.title}:</strong> {r.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Data governance */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8 p-4 rounded-xl border border-card-border bg-card/30 flex items-start gap-3">
        <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <strong className="text-foreground">Data Governance:</strong> No PII is stored. Assessment results are anonymised and aggregated. This dashboard shows demo data only. Full audit trail maintained for all HR-approved actions.
        </div>
      </motion.div>

      {/* Approval CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-col items-center gap-4">
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
          By approving, you confirm that you have reviewed the AI recommendations and authorise routing of flagged employees to the suggested training programme.
        </p>
      </motion.div>
    </div>
  );
}
