import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, CheckCircle, Bot, AlertTriangle, Shield,
  Download, TrendingUp, Bell, Filter, Target, Star, Zap,
  ChevronRight, Loader2, FileText, AlertCircle, Award,
} from 'lucide-react';
import { personas } from '../data/personas';
import type { AIResult } from '../App';
import type { Lang } from '../i18n';
import { translations } from '../i18n';

// ── Team Data ────────────────────────────────────────────────────────
const DEMO_TEAM = [
  { name: 'Ahmad Faiz',    role: 'Network Engineer',         grade: 'H', persona: 'builder',    score: 84, trend: '+12', status: 'complete' },
  { name: 'Nurul Ain',     role: 'Digital Strategy',         grade: 'G', persona: 'visionary',  score: 91, trend: '+8',  status: 'complete' },
  { name: 'Kevin Lim',     role: 'IT Operations',            grade: 'F', persona: 'explorer',   score: 67, trend: '+5',  status: 'complete' },
  { name: 'Priya Nair',    role: 'Cloud Infrastructure',     grade: 'G', persona: 'builder',    score: 82, trend: '+9',  status: 'complete' },
  { name: 'Hafizuddin M.', role: 'Product Innovation',       grade: 'H', persona: 'visionary',  score: 88, trend: '+6',  status: 'complete' },
  { name: 'Siti Zulaikha', role: 'Customer Experience',      grade: 'F', persona: 'explorer',   score: 71, trend: '+4',  status: 'complete' },
  { name: 'Marcus Tan',    role: 'Data Analytics',           grade: 'G', persona: 'builder',    score: 79, trend: '+11', status: 'complete' },
  { name: 'Roshini D.',    role: 'AI Governance',            grade: 'H', persona: 'strategist', score: 85, trend: '+15', status: 'complete' },
  { name: 'Amirul Haq',    role: 'Security Operations',      grade: 'F', persona: 'explorer',   score: null, trend: null, status: 'pending' },
  { name: 'Elaine Wong',   role: 'Corporate Strategy',       grade: 'I', persona: 'visionary',  score: null, trend: null, status: 'pending' },
  { name: 'Farouk Azmi',   role: 'Finance Business Partner', grade: 'G', persona: 'strategist', score: 76, trend: '+7',  status: 'complete' },
  { name: 'Jasmine Loh',   role: 'HR Learning & Dev',        grade: 'H', persona: 'strategist', score: 80, trend: '+10', status: 'complete' },
];

const AI_INSIGHTS: Record<string, string> = {
  explorer:   'Explorer-dominant teams are curiosity-driven and ready to experiment. The highest-leverage next action is a structured AI Sandbox Programme where employees safely trial tools with curated challenges — typically accelerating progression to Builder/Strategist roles within 6–9 months.',
  builder:    'Builder-heavy teams are ready to develop internal AI solutions. Invest in an AI Engineering Guild paired with internal LLM bootcamps. Establish inner-source AI modules that Builders can share across business units.',
  strategist: 'Strong strategic AI thinking is present. Focus on AI ROI Frameworks, governance training, and cross-functional steering committees. Strategists are your best accelerators for executive buy-in.',
  visionary:  'Exceptional high-potential AI champions are present. Channel them into a TM AI Council to drive top-down transformation. Visionaries paired with Builders create the most impactful AI initiatives.',
};

// ── Pipeline stages for Succession ──────────────────────────────────
const PIPELINE_STAGES = ['Identified', 'Nominated', 'In Programme', 'Graduated'];

// ── Helpers ──────────────────────────────────────────────────────────
type FilterPersona = 'all' | 'explorer' | 'builder' | 'strategist' | 'visionary';
type Tab = 'overview' | 'skillsgap' | 'succession' | 'actionplan';

function exportCSV(rows: typeof DEMO_TEAM, extra: { name: string; persona: string; score: number | null }) {
  const all = [...rows, { name: extra.name, role: 'Current Assessment', grade: '—', persona: extra.persona, score: extra.score, trend: null, status: 'complete' }];
  const csv = ['Name,Role,Grade,Persona,Score,Trend,Status', ...all.map(r => `${r.name},${r.role},${r.grade},${r.persona},${r.score ?? ''},${r.trend ?? ''},${r.status}`)].join('\n');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'ainspire-team-report.csv' });
  a.click();
}

// ── Sub-components ───────────────────────────────────────────────────

function TabButton({ id, label, icon: Icon, active, onClick }: { id: Tab; label: string; icon: any; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={active
        ? { background: 'rgba(0,212,200,0.12)', border: '1px solid rgba(0,212,200,0.4)', color: '#00d4c8' }
        : { background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────
function OverviewTab({ allMembers, completed, pending, avgScore, dominant, dominantP, counts, aiResult, approved, setApproved, reminderSent, setReminderSent, filterPersona, setFilterPersona }:
  { allMembers: typeof DEMO_TEAM; completed: typeof DEMO_TEAM; pending: typeof DEMO_TEAM; avgScore: number; dominant: string; dominantP: any; counts: Record<string,number>; aiResult: AIResult | null; approved: boolean; setApproved: (v:boolean)=>void; reminderSent: boolean; setReminderSent: (v:boolean)=>void; filterPersona: FilterPersona; setFilterPersona: (v:FilterPersona)=>void }) {

  const personaColor = (p: string) => personas[p]?.color ?? '#888';
  const filtered = filterPersona === 'all' ? allMembers : allMembers.filter(m => m.persona === filterPersona);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: `${Math.round((completed.length / allMembers.length) * 100)}%`, sub: `${completed.length} of ${allMembers.length} members`, color: '#00d4c8' },
          { label: 'Avg Readiness Score', value: avgScore, sub: 'Across completed assessments', color: '#8b5cf6' },
          { label: 'Dominant Persona', value: dominantP?.name ?? '—', sub: `${counts[dominant] ?? 0} of ${completed.length} members`, color: dominantP?.color ?? '#888' },
          { label: 'Pending Members', value: pending.length, sub: 'Assessment not yet done', color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl bg-card border border-card-border">
            <div className="text-xs text-muted-foreground mb-3 font-medium">{k.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Persona distribution mini-cards — clickable filter */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-bold">Persona Distribution</h2>
          <span className="text-xs text-muted-foreground">— click to filter table</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Object.values(personas).map((p, idx) => {
            const count = counts[p.id] ?? 0;
            const pct = completed.length ? Math.round((count / completed.length) * 100) : 0;
            const PIcon = p.icon;
            const isDominant = p.id === dominant;
            const isActive = filterPersona === p.id;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.07 }}
                className="p-4 rounded-2xl bg-card border-2 flex flex-col items-center text-center cursor-pointer transition-all"
                style={{ borderColor: isActive ? p.color : isDominant ? `${p.color}50` : `${p.color}15`, opacity: filterPersona !== 'all' && !isActive ? 0.5 : 1, boxShadow: isActive ? `0 0 20px ${p.color}20` : undefined }}
                onClick={() => setFilterPersona(isActive ? 'all' : p.id as FilterPersona)}>
                <PIcon className="w-6 h-6 mb-2" style={{ color: p.color }} />
                <div className="text-xs font-bold text-foreground mb-0.5">{p.name}</div>
                <div className="text-2xl font-black" style={{ color: p.color }}>{count}</div>
                <div className="text-xs text-muted-foreground mb-2">{pct}%</div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.5, duration: 0.8 }} style={{ backgroundColor: p.color }} />
                </div>
                {isDominant && <div className="mt-2 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ borderColor: p.color, color: p.color }}>Dominant</div>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Individual team table */}
      <div>
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
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {(['all', 'explorer', 'builder', 'strategist', 'visionary'] as FilterPersona[]).map(f => (
              <button key={f} onClick={() => setFilterPersona(f)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all border"
                style={filterPersona === f
                  ? { background: f === 'all' ? 'rgba(255,255,255,0.15)' : `${personaColor(f)}20`, borderColor: f === 'all' ? 'rgba(255,255,255,0.4)' : personaColor(f), color: f === 'all' ? '#fff' : personaColor(f) }
                  : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                {f === 'all' ? 'All' : personas[f]?.name}
              </button>
            ))}
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
                    <motion.tr key={m.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-t border-card-border/50 hover:bg-white/2 transition-colors"
                      style={isYou ? { background: 'rgba(0,212,200,0.04)' } : undefined}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: m.status === 'complete' ? `${pColor}18` : 'rgba(255,255,255,0.06)', color: m.status === 'complete' ? pColor : 'rgba(255,255,255,0.3)' }}>
                            {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-semibold text-foreground">{m.name}{isYou && <span className="ml-1.5 text-xs font-bold text-primary/80">(you)</span>}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{m.role}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded bg-white/8 text-muted-foreground">{m.grade !== '—' ? `Grade ${m.grade}` : '—'}</span></td>
                      <td className="px-4 py-3"><span className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: `${pColor}40`, color: pColor, background: `${pColor}12` }}>{personas[m.persona]?.name ?? m.persona}</span></td>
                      <td className="px-4 py-3">{m.score !== null ? <span className="text-base font-black" style={{ color: m.score >= 85 ? '#22c55e' : m.score >= 70 ? '#00d4c8' : '#f59e0b' }}>{m.score}</span> : <span className="text-muted-foreground/40">—</span>}</td>
                      <td className="px-4 py-3">{m.trend ? <span className="text-xs font-bold text-green-400">{m.trend} pts</span> : <span className="text-muted-foreground/40 text-sm">—</span>}</td>
                      <td className="px-4 py-3">{m.status === 'complete' ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400">✓ Done</span> : <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/12 text-amber-400">⏳ Pending</span>}</td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-card-border/50 flex items-center justify-between bg-black/10">
            <span className="text-xs text-muted-foreground">Showing {filtered.length} of {allMembers.length} members</span>
            {pending.length > 0 && (
              <button onClick={() => setReminderSent(true)} disabled={reminderSent}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all"
                style={reminderSent ? { borderColor: '#22c55e40', color: '#22c55e', background: '#22c55e12' } : { borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b', background: 'rgba(245,158,11,0.08)' }}>
                <Bell className="w-3.5 h-3.5" />
                {reminderSent ? `✓ Reminders sent to ${pending.length} members` : `Send reminder to ${pending.length} pending`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2 mb-3 text-primary text-xs font-bold uppercase tracking-widest"><Bot className="w-4 h-4" />AI Workforce Insight</div>
        <p className="text-foreground leading-relaxed mb-4">
          <strong style={{ color: dominantP?.color }}>{dominantP?.name}s ({counts[dominant] ?? 0}/{completed.length} · {Math.round(((counts[dominant] ?? 0) / completed.length) * 100)}%)</strong>{' '}
          are your dominant profile. {AI_INSIGHTS[dominant]}
        </p>
        {aiResult?.recommendations?.length > 0 && (
          <div className="border-t border-primary/10 pt-4">
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
      </div>

      {/* Governance + Approval */}
      <div className="p-4 rounded-xl border border-card-border bg-card/30 flex items-start gap-3">
        <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground"><strong className="text-foreground">Data Governance:</strong> No PII is stored. Assessment results are anonymised and aggregated. This dashboard shows demo data only. Full audit trail maintained for all HR-approved actions.</div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {!approved ? (
          <button onClick={() => setApproved(true)} className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg bg-orange-500 hover:bg-orange-400 text-white transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <CheckCircle className="w-5 h-5" />Approve &amp; Route to Training Programme
          </button>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg border-2 border-green-500/60 text-green-400 bg-green-500/10">
            <CheckCircle className="w-5 h-5" />Training Programme Activated — HR Approved
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground text-center max-w-sm">By approving, you confirm that you have reviewed the AI recommendations and authorise routing of flagged employees to the suggested training programme.</p>
      </div>
    </div>
  );
}

// ── Skills Gap Tab ───────────────────────────────────────────────────
function SkillsGapTab({ counts, completed }: { counts: Record<string, number>; completed: typeof DEMO_TEAM }) {
  const total = completed.length;
  const personaList = ['explorer', 'builder', 'strategist', 'visionary'];
  const [targets, setTargets] = useState<Record<string, number>>({ explorer: 20, builder: 40, strategist: 25, visionary: 15 });

  const totalTarget = Object.values(targets).reduce((s, v) => s + v, 0);
  const isValid = totalTarget === 100;

  const gaps = personaList.map(p => {
    const current = total ? Math.round(((counts[p] ?? 0) / total) * 100) : 0;
    const target = targets[p];
    const gap = target - current;
    const headcountGap = Math.round((Math.abs(gap) / 100) * total);
    return { persona: p, current, target, gap, headcountGap };
  });

  const overallReadiness = Math.round((((counts.builder ?? 0) + (counts.strategist ?? 0) + (counts.visionary ?? 0)) / total) * 100);
  const targetReadiness = targets.builder + targets.strategist + targets.visionary;

  return (
    <div className="space-y-8">
      {/* Header insight */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Current AI-Ready', value: `${overallReadiness}%`, sub: 'Builder + Strategist + Visionary', color: '#00d4c8' },
          { label: 'Target AI-Ready', value: `${targetReadiness}%`, sub: 'After upskilling programme', color: '#8b5cf6' },
          { label: 'Uplift Required', value: `+${Math.max(0, targetReadiness - overallReadiness)}%`, sub: `≈ ${Math.max(0, Math.round(((targetReadiness - overallReadiness) / 100) * total))} employees`, color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl bg-card border border-card-border">
            <div className="text-xs text-muted-foreground mb-3">{k.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Target sliders */}
        <div className="p-6 rounded-2xl bg-card border border-card-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold">Set Target Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Drag sliders to define your ideal persona mix</p>
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full border ${isValid ? 'border-green-500/40 text-green-400 bg-green-500/10' : 'border-amber-500/40 text-amber-400 bg-amber-500/10'}`}>
              {totalTarget}% {isValid ? '✓ Valid' : '— must equal 100%'}
            </div>
          </div>
          <div className="space-y-6">
            {personaList.map(p => {
              const persona = personas[p];
              const PIcon = persona.icon;
              return (
                <div key={p}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PIcon className="w-4 h-4" style={{ color: persona.color }} />
                      <span className="text-sm font-semibold" style={{ color: persona.color }}>{persona.name}</span>
                    </div>
                    <span className="text-sm font-black" style={{ color: persona.color }}>{targets[p]}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={targets[p]}
                    onChange={e => setTargets(prev => ({ ...prev, [p]: Number(e.target.value) }))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: persona.color }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Gap analysis visual */}
        <div className="p-6 rounded-2xl bg-card border border-card-border">
          <h3 className="text-base font-bold mb-1">Current vs Target Gap</h3>
          <p className="text-xs text-muted-foreground mb-6">Bar pairs show where your team is vs where it needs to be</p>
          <div className="space-y-6">
            {gaps.map(g => {
              const persona = personas[g.persona];
              const PIcon = persona.icon;
              const isShortfall = g.gap > 0;
              const isExcess = g.gap < 0;
              return (
                <div key={g.persona}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PIcon className="w-4 h-4" style={{ color: persona.color }} />
                      <span className="text-sm font-semibold text-foreground">{persona.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isShortfall && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/12 text-red-400 border border-red-500/25">Need +{g.headcountGap} more</span>}
                      {isExcess && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/12 text-amber-400 border border-amber-500/25">{g.headcountGap} to upskill</span>}
                      {g.gap === 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/12 text-green-400 border border-green-500/25">✓ On target</span>}
                    </div>
                  </div>
                  {/* Current bar */}
                  <div className="mb-1.5">
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Current</span><span className="font-bold" style={{ color: persona.color }}>{g.current}%</span></div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: persona.color }} initial={{ width: 0 }} animate={{ width: `${g.current}%` }} transition={{ duration: 0.7 }} />
                    </div>
                  </div>
                  {/* Target bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Target</span><span className="font-bold text-muted-foreground">{g.target}%</span></div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full opacity-40" style={{ background: persona.color, border: `1px dashed ${persona.color}` }} initial={{ width: 0 }} animate={{ width: `${g.target}%` }} transition={{ duration: 0.7, delay: 0.1 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gap summary table */}
      <div className="p-6 rounded-2xl bg-card border border-card-border">
        <h3 className="text-base font-bold mb-4">Gap Summary — Action Required</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              {['Persona', 'Current', 'Target', 'Gap', 'Headcount Impact', 'Priority Action'].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gaps.map(g => {
              const persona = personas[g.persona];
              const PIcon = persona.icon;
              const actions: Record<string, string> = {
                explorer: 'AI Sandbox Programme, tool exposure workshops',
                builder: 'LLM Engineering bootcamp, hands-on build sprints',
                strategist: 'AI ROI Frameworks, steering committee participation',
                visionary: 'Executive AI mentoring, TM AI Council nomination',
              };
              return (
                <tr key={g.persona} className="border-t border-card-border/40">
                  <td className="py-3">
                    <div className="flex items-center gap-2"><PIcon className="w-4 h-4" style={{ color: persona.color }} /><span className="font-semibold" style={{ color: persona.color }}>{persona.name}</span></div>
                  </td>
                  <td className="py-3 font-bold" style={{ color: persona.color }}>{g.current}%</td>
                  <td className="py-3 text-muted-foreground">{g.target}%</td>
                  <td className="py-3">
                    <span className={`font-black text-base ${g.gap > 0 ? 'text-red-400' : g.gap < 0 ? 'text-amber-400' : 'text-green-400'}`}>
                      {g.gap > 0 ? `+${g.gap}%` : g.gap < 0 ? `${g.gap}%` : '✓'}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    {g.gap !== 0 ? <span className="text-muted-foreground">{g.headcountGap} employees</span> : <span className="text-green-400 text-xs">On target</span>}
                  </td>
                  <td className="py-3 text-xs text-muted-foreground max-w-xs">{actions[g.persona]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Succession Tab ───────────────────────────────────────────────────
function SuccessionTab({ allMembers }: { allMembers: typeof DEMO_TEAM }) {
  const candidates = allMembers.filter(m => m.score !== null && m.score >= 80 && (m.persona === 'visionary' || m.persona === 'strategist'));
  const [pipeline, setPipeline] = useState<Record<string, string>>(() =>
    Object.fromEntries(candidates.map((c, i) => [c.name, i < 2 ? 'Nominated' : i === 2 ? 'In Programme' : 'Identified']))
  );

  const AI_ROLES: Record<string, string> = {
    visionary: 'AI Council Member / GCTO AI Champion',
    strategist: 'AI Programme Lead / AI Transformation Manager',
  };

  const stageColors: Record<string, string> = {
    'Identified': '#94a3b8',
    'Nominated': '#f59e0b',
    'In Programme': '#00d4c8',
    'Graduated': '#22c55e',
  };

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-card-border">
          <div className="text-xs text-muted-foreground mb-3">High-Potential Candidates</div>
          <div className="text-3xl font-black text-primary mb-1">{candidates.length}</div>
          <div className="text-xs text-muted-foreground">Score ≥ 80 · Visionary or Strategist</div>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-card-border">
          <div className="text-xs text-muted-foreground mb-3">In Active Programme</div>
          <div className="text-3xl font-black text-green-400 mb-1">{Object.values(pipeline).filter(s => s === 'In Programme' || s === 'Graduated').length}</div>
          <div className="text-xs text-muted-foreground">Enrolled in AI Leadership Track</div>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-card-border">
          <div className="text-xs text-muted-foreground mb-3">Avg Readiness Score</div>
          <div className="text-3xl font-black text-purple-400 mb-1">{Math.round(candidates.reduce((s, c) => s + (c.score ?? 0), 0) / candidates.length)}</div>
          <div className="text-xs text-muted-foreground">Across all candidates</div>
        </div>
      </div>

      {/* Pipeline board */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-bold">AI Leadership Pipeline</h3>
          <span className="text-xs text-muted-foreground">— drag status to advance candidates</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {PIPELINE_STAGES.map(stage => {
            const stageCandidates = candidates.filter(c => pipeline[c.name] === stage);
            return (
              <div key={stage} className="rounded-2xl border border-card-border bg-card/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: stageColors[stage] }} />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stage}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: stageColors[stage] }}>{stageCandidates.length}</span>
                </div>
                <div className="p-3 space-y-3 min-h-32">
                  {stageCandidates.map(c => {
                    const pColor = personas[c.persona]?.color ?? '#888';
                    const PIcon = personas[c.persona]?.icon;
                    const stageIdx = PIPELINE_STAGES.indexOf(stage);
                    return (
                      <div key={c.name} className="p-3 rounded-xl border border-card-border bg-card">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-xs font-bold text-foreground">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.role}</div>
                          </div>
                          {PIcon && <PIcon className="w-4 h-4 flex-shrink-0" style={{ color: pColor }} />}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ borderColor: `${pColor}40`, color: pColor, background: `${pColor}12` }}>{personas[c.persona]?.name}</span>
                          <span className="text-sm font-black" style={{ color: c.score! >= 88 ? '#22c55e' : '#00d4c8' }}>{c.score}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3 leading-snug">{AI_ROLES[c.persona]}</div>
                        <div className="flex gap-1.5">
                          {stageIdx > 0 && (
                            <button onClick={() => setPipeline(p => ({ ...p, [c.name]: PIPELINE_STAGES[stageIdx - 1] }))}
                              className="flex-1 py-1 rounded-lg text-xs font-semibold border border-card-border text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                          )}
                          {stageIdx < PIPELINE_STAGES.length - 1 && (
                            <button onClick={() => setPipeline(p => ({ ...p, [c.name]: PIPELINE_STAGES[stageIdx + 1] }))}
                              className="flex-1 py-1 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: `${stageColors[PIPELINE_STAGES[stageIdx + 1]]}15`, border: `1px solid ${stageColors[PIPELINE_STAGES[stageIdx + 1]]}30`, color: stageColors[PIPELINE_STAGES[stageIdx + 1]] }}>
                              Advance →
                            </button>
                          )}
                          {stageIdx === PIPELINE_STAGES.length - 1 && (
                            <div className="flex-1 py-1 text-center text-xs font-bold text-green-400">🎓 Graduated</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {stageCandidates.length === 0 && (
                    <div className="text-xs text-muted-foreground/40 text-center py-4">No candidates at this stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate details table */}
      <div className="p-6 rounded-2xl bg-card border border-card-border">
        <h3 className="text-base font-bold mb-4">Candidate Profiles</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              {['Name', 'Persona', 'Score', 'Grade', 'Suggested Role', 'Pipeline Stage'].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => {
              const pColor = personas[c.persona]?.color ?? '#888';
              return (
                <tr key={c.name} className="border-t border-card-border/40">
                  <td className="py-3 font-semibold text-foreground">{c.name}</td>
                  <td className="py-3"><span className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: `${pColor}40`, color: pColor, background: `${pColor}12` }}>{personas[c.persona]?.name}</span></td>
                  <td className="py-3 text-base font-black" style={{ color: c.score! >= 88 ? '#22c55e' : '#00d4c8' }}>{c.score}</td>
                  <td className="py-3 text-muted-foreground">Grade {c.grade}</td>
                  <td className="py-3 text-xs text-muted-foreground">{AI_ROLES[c.persona]}</td>
                  <td className="py-3">
                    <select value={pipeline[c.name] ?? 'Identified'}
                      onChange={e => setPipeline(p => ({ ...p, [c.name]: e.target.value }))}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border bg-card outline-none cursor-pointer"
                      style={{ borderColor: `${stageColors[pipeline[c.name] ?? 'Identified']}40`, color: stageColors[pipeline[c.name] ?? 'Identified'] }}>
                      {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Action Plan Tab ──────────────────────────────────────────────────
function ActionPlanTab({ counts, completed, dominant }: { counts: Record<string, number>; completed: typeof DEMO_TEAM; dominant: string }) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targets] = useState({ explorer: 20, builder: 40, strategist: 25, visionary: 15 });

  const total = completed.length;
  const distribution = Object.fromEntries(
    ['explorer','builder','strategist','visionary'].map(p => [p, total ? Math.round(((counts[p] ?? 0) / total) * 100) : 0])
  );
  const skillsGap = ['explorer','builder','strategist','visionary'].map(p => ({
    persona: p, current: distribution[p], target: targets[p], gap: targets[p] - distribution[p]
  }));

  const effortColor: Record<string, string> = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444' };
  const phaseColors = ['#00d4c8', '#8b5cf6', '#f59e0b'];

  const generatePlan = async () => {
    setLoading(true); setError(null); setPlan(null);
    try {
      const res = await fetch('/api/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distribution, teamSize: total, divisionName: 'IT Strategy & Orchestration', skillsGap, dominantPersona: dominant }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPlan(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w || !plan) return;
    w.document.write(`<html><head><title>90-Day Action Plan</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1e293b;max-width:800px;margin:0 auto}h1{color:#0a0e1a;font-size:28px;margin-bottom:8px}h2{color:#0066cc;font-size:18px;margin-top:32px}h3{font-size:14px;color:#475569;margin:16px 0 8px}ul{padding-left:20px;line-height:1.8}p{line-height:1.7;color:#475569}.tag{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;margin-left:8px}.low{background:#dcfce7;color:#16a34a}.medium{background:#fef9c3;color:#ca8a04}.high{background:#fee2e2;color:#dc2626}</style></head><body>`);
    w.document.write(`<h1>${plan.planTitle}</h1><p>${plan.executiveSummary}</p>`);
    plan.phases?.forEach((ph: any) => {
      w.document.write(`<h2>Phase ${ph.phase}: ${ph.title} — ${ph.days}</h2><p><em>${ph.objective}</em></p><ul>`);
      ph.actions?.forEach((a: any) => w.document.write(`<li><strong>${a.action}</strong> <span class="tag ${a.effort?.toLowerCase()}">${a.effort}</span> — Owner: ${a.owner}</li>`));
      w.document.write(`</ul><p><strong>Success Metric:</strong> ${ph.successMetric}</p>`);
    });
    w.document.write(`<h2>Expected Outcome</h2><p>${plan.expectedOutcome}</p><h2>Key Risks</h2><ul>${plan.keyRisks?.map((r: string) => `<li>${r}</li>`).join('')}</ul></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div className="space-y-8">
      {/* Intro + generate */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary text-xs font-bold uppercase tracking-widest"><Bot className="w-4 h-4" />Claude AI · 90-Day Team Action Plan</div>
            <h3 className="text-lg font-bold text-foreground mb-2">Generate a personalised upskilling plan for your team</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">Claude analyses your team's current persona distribution, skills gap targets, and dominant profile to generate a structured 3-phase action plan with specific, concrete steps for each persona group.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['explorer','builder','strategist','visionary'].map(p => (
                <span key={p} className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={{ borderColor: `${personas[p]?.color}40`, color: personas[p]?.color, background: `${personas[p]?.color}12` }}>
                  {distribution[p]}% {personas[p]?.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <button onClick={generatePlan} disabled={loading}
              className="flex items-center gap-3 px-7 py-3.5 rounded-2xl font-bold text-base transition-all"
              style={{ background: loading ? 'rgba(0,212,200,0.08)' : 'linear-gradient(135deg, rgba(0,212,200,0.2), rgba(0,212,200,0.1))', border: '1px solid rgba(0,212,200,0.4)', color: '#00d4c8', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating…</> : <><Zap className="w-5 h-5" />Generate Plan</>}
            </button>
            {plan && (
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-card-border text-muted-foreground hover:text-foreground hover:border-card-border/80 transition-all">
                <FileText className="w-4 h-4" />Print / Save PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div><div className="font-semibold text-red-300 text-sm mb-1">Generation Failed</div><div className="text-muted-foreground text-xs">{error}</div></div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="p-6 rounded-2xl bg-card border border-card-border animate-pulse">
              <div className="h-4 bg-white/8 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-5/6" />
                <div className="h-3 bg-white/5 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan output */}
      {plan && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Plan header */}
          <div className="p-6 rounded-2xl bg-card border border-card-border">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-black text-foreground">{plan.planTitle}</h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 flex-shrink-0 ml-4">90-Day Plan</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{plan.executiveSummary}</p>
          </div>

          {/* Phases */}
          {plan.phases?.map((phase: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
              className="p-6 rounded-2xl bg-card border border-card-border overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: phaseColors[i] }} />
              <div className="pl-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: phaseColors[i] }}>Phase {phase.phase} · {phase.days}</div>
                    <h3 className="text-lg font-bold text-foreground">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{phase.objective}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {phase.actions?.map((action: any, j: number) => (
                    <div key={j} className="flex items-start gap-3 p-3.5 rounded-xl border border-card-border/60 bg-white/2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                        style={{ background: `${phaseColors[i]}20`, color: phaseColors[i], border: `1px solid ${phaseColors[i]}30` }}>{j + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground mb-1">{action.action}</div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-muted-foreground">Owner: <strong className="text-foreground/70">{action.owner}</strong></span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full border"
                            style={{ color: effortColor[action.effort] ?? '#94a3b8', borderColor: `${effortColor[action.effort] ?? '#94a3b8'}30`, background: `${effortColor[action.effort] ?? '#94a3b8'}10` }}>
                            {action.effort} effort
                          </span>
                          {action.personas?.map((p: string) => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${personas[p]?.color}12`, color: personas[p]?.color }}>{personas[p]?.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/3 border border-white/6">
                  <Target className="w-4 h-4 flex-shrink-0" style={{ color: phaseColors[i] }} />
                  <div className="text-xs"><span className="font-bold text-foreground">Success Metric: </span><span className="text-muted-foreground">{phase.successMetric}</span></div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Outcome + Risks */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-card-border">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-green-400" /><h3 className="text-sm font-bold text-foreground">Expected Outcome After 90 Days</h3></div>
              <p className="text-sm text-muted-foreground leading-relaxed">{plan.expectedOutcome}</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-card-border">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-amber-400" /><h3 className="text-sm font-bold text-foreground">Key Risks to Monitor</h3></div>
              <ul className="space-y-2">
                {plan.keyRisks?.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {!plan && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Ready to Generate</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Click "Generate Plan" above and Claude will create a structured 90-day upskilling plan tailored to your team's current persona distribution and skills gap.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function HRDashboard({ lang = 'EN', currentUserPersona, aiResult, onBack }: {
  lang?: Lang; currentUserPersona: string; aiResult: AIResult | null; onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [approved, setApproved] = useState(false);
  const [filterPersona, setFilterPersona] = useState<FilterPersona>('all');
  const [reminderSent, setReminderSent] = useState(false);

  const currentScore = aiResult ? Math.round(aiResult.confidence * 100) : null;
  const allMembers = [...DEMO_TEAM, { name: 'You (current)', role: 'Current Assessment', grade: '—', persona: currentUserPersona, score: currentScore, trend: null, status: 'complete' as const }];
  const completed = allMembers.filter(m => m.status === 'complete');
  const pending = allMembers.filter(m => m.status === 'pending');
  const scores = completed.filter(m => m.score !== null).map(m => m.score as number);
  const avgScore = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  const counts = allMembers.reduce<Record<string, number>>((acc, m) => { if (m.status === 'complete') acc[m.persona] = (acc[m.persona] ?? 0) + 1; return acc; }, {});
  const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'explorer') as string;
  const dominantP = personas[dominant];

  const ht = translations[lang];
  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview',    label: ht.hrTab1, icon: Users },
    { id: 'skillsgap',   label: ht.hrTab2, icon: Target },
    { id: 'succession',  label: ht.hrTab3, icon: Star },
    { id: 'actionplan',  label: ht.hrTab4, icon: Zap },
  ];

  return (
    <div className="w-full max-w-6xl px-6 py-10 flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full border border-card-border hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">{ht.hrTitle}</div>
            <h1 className="text-3xl font-black">{ht.hrSubtitle}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportCSV(DEMO_TEAM, { name: 'You (current)', persona: currentUserPersona, score: currentScore })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-card-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-semibold text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" />{ht.hrExportCSV}
          </button>
        </div>
      </motion.div>

      {/* Human-in-the-loop notice */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-yellow-300 text-sm mb-1">{ht.hrGovernance}</div>
          <div className="text-muted-foreground text-sm">{ht.hrGovernanceDesc}</div>
        </div>
      </motion.div>

      {/* Tab nav */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 mb-8 flex-wrap">
        {TABS.map(t => <TabButton key={t.id} {...t} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />)}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {activeTab === 'overview' && (
            <OverviewTab allMembers={allMembers} completed={completed} pending={pending} avgScore={avgScore} dominant={dominant} dominantP={dominantP} counts={counts} aiResult={aiResult} approved={approved} setApproved={setApproved} reminderSent={reminderSent} setReminderSent={setReminderSent} filterPersona={filterPersona} setFilterPersona={setFilterPersona} />
          )}
          {activeTab === 'skillsgap' && <SkillsGapTab counts={counts} completed={completed} />}
          {activeTab === 'succession' && <SuccessionTab allMembers={allMembers} />}
          {activeTab === 'actionplan' && <ActionPlanTab counts={counts} completed={completed} dominant={dominant} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
