import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Line, Area, AreaChart, LineChart,
} from 'recharts';
import {
  ArrowLeft, Users, Brain, TrendingUp, Award, Zap, BookOpen, BarChart3,
  Target, X, Info, GraduationCap, Clock, FlameKindling, Layers,
} from 'lucide-react';

// ── Colour palette ────────────────────────────────────────────────
const PERSONA_COLORS: Record<string, string> = {
  explorer:   '#00d4ff',
  builder:    '#a855f7',
  strategist: '#f59e0b',
  visionary:  '#10b981',
};

// ── Workforce data ────────────────────────────────────────────────
const DIVISIONS = [
  { name: 'GNT',       full: 'Group Network Technology',               employees: 2100, completed: 389, explorer: 30, builder: 45, strategist: 18, visionary: 7,  index: 68, confidence: 72 },
  { name: 'GCX',       full: 'Group Customer Experience',              employees: 1850, completed: 312, explorer: 38, builder: 22, strategist: 28, visionary: 12, index: 61, confidence: 69 },
  { name: 'GITD',      full: 'Group IT & Digital',                     employees: 1200, completed: 287, explorer: 18, builder: 52, strategist: 20, visionary: 10, index: 78, confidence: 81 },
  { name: 'TM One',    full: 'Group TM One',                           employees: 890,  completed: 168, explorer: 28, builder: 35, strategist: 28, visionary: 9,  index: 65, confidence: 71 },
  { name: 'GF',        full: 'Group Finance',                          employees: 650,  completed: 98,  explorer: 42, builder: 18, strategist: 32, visionary: 8,  index: 57, confidence: 65 },
  { name: 'GHCM',      full: 'Group Human Capital Management',         employees: 520,  completed: 87,  explorer: 45, builder: 15, strategist: 28, visionary: 12, index: 55, confidence: 63 },
  { name: 'TM Global', full: 'Group TM Global',                        employees: 420,  completed: 89,  explorer: 25, builder: 30, strategist: 30, visionary: 15, index: 67, confidence: 73 },
  { name: 'GIS',       full: 'Group Information Security',             employees: 380,  completed: 76,  explorer: 20, builder: 48, strategist: 22, visionary: 10, index: 72, confidence: 76 },
  { name: 'GP',        full: 'Group Procurement',                      employees: 290,  completed: 45,  explorer: 48, builder: 12, strategist: 32, visionary: 8,  index: 52, confidence: 61 },
  { name: 'GS',        full: 'Group Strategy',                         employees: 180,  completed: 52,  explorer: 22, builder: 18, strategist: 38, visionary: 22, index: 70, confidence: 78 },
];

const TOTAL_EMPLOYEES = DIVISIONS.reduce((s, d) => s + d.employees, 0);
const TOTAL_COMPLETED = DIVISIONS.reduce((s, d) => s + d.completed, 0);
const TARGET = 8480;
const AVG_CONFIDENCE = 74;

const MONTHLY_TREND = [
  { month: 'Feb', assessments: 285, cumulative: 285 },
  { month: 'Mar', assessments: 412, cumulative: 697 },
  { month: 'Apr', assessments: 538, cumulative: 1235 },
  { month: 'May', assessments: 621, cumulative: 1856 },
  { month: 'Jun', assessments: 789, cumulative: 2645 },
  { month: 'Jul', assessments: 958, cumulative: 3603 },
];

// ── Learning Pathway data ─────────────────────────────────────────
const COURSE_PERFORMANCE = [
  { name: 'AI Fundamentals for Business',  enrolled: 1247, completed: 891, dropoffPct: 13, avgDays: 7,  color: '#00d4ff' },
  { name: 'Prompt Engineering Essentials', enrolled: 876,  completed: 654, dropoffPct: 9,  avgDays: 5,  color: '#a855f7' },
  { name: 'Python for Data Science',       enrolled: 589,  completed: 342, dropoffPct: 24, avgDays: 18, color: '#f59e0b' },
  { name: 'AI Strategy & Leadership',      enrolled: 423,  completed: 298, dropoffPct: 11, avgDays: 12, color: '#10b981' },
  { name: 'Machine Learning Basics',       enrolled: 445,  completed: 267, dropoffPct: 31, avgDays: 22, color: '#f43f5e' },
  { name: 'Cybersecurity & AI',            enrolled: 312,  completed: 201, dropoffPct: 18, avgDays: 9,  color: '#6366f1' },
];

const COMPLETION_TREND = [
  { month: 'Feb', rate: 54, target: 60 },
  { month: 'Mar', rate: 59, target: 62 },
  { month: 'Apr', rate: 63, target: 65 },
  { month: 'May', rate: 68, target: 67 },
  { month: 'Jun', rate: 72, target: 70 },
  { month: 'Jul', rate: 76, target: 73 },
];

const LEARNING_HOURS_BY_DIVISION = DIVISIONS.map((d, i) => ({
  name: d.name,
  full: d.full,
  hours: Math.round(d.completed * ([4.7,3.9,6.2,5.1,3.4,3.1,5.0,5.8,2.9,6.4][i] ?? 4.5)),
  target: Math.round(d.employees * 0.8),
  avg: [4.7,3.9,6.2,5.1,3.4,3.1,5.0,5.8,2.9,6.4][i] ?? 4.5,
}));

const CERTIFICATIONS_BY_DIVISION = DIVISIONS.map((d, i) => ({
  name: d.name,
  full: d.full,
  earned: Math.round(d.completed * ([0.23,0.18,0.35,0.27,0.14,0.12,0.25,0.31,0.10,0.38][i] ?? 0.2)),
  target: Math.round(d.completed * 0.4),
}));

// Skill coverage: 0=none, 1=started, 2=developing, 3=proficient
const SKILLS = ['Prompting', 'Data Analysis', 'AI Strategy', 'ML Basics', 'Security & AI', 'Automation', 'AI Ethics'];
const SKILL_HEATMAP = DIVISIONS.map(d => ({
  division: d.name,
  scores: [
    Math.min(3, Math.round(d.builder  / 25)),
    Math.min(3, Math.round(d.builder  / 30)),
    Math.min(3, Math.round(d.strategist / 25)),
    Math.min(3, Math.round(d.builder  / 35)),
    Math.min(3, Math.round((d.strategist + d.visionary) / 35)),
    Math.min(3, Math.round(d.builder  / 28)),
    Math.min(3, Math.round((d.strategist + d.visionary) / 28)),
  ],
}));

const PERSONA_ALIGNMENT_DATA = [
  { persona: 'explorer',   name: 'Explorer',   color: '#00d4ff', recommended: ['AI Fundamentals', 'Prompt Engineering'],                onTrack: 72, total: 1102 },
  { persona: 'builder',    name: 'Builder',    color: '#a855f7', recommended: ['Python for Data Science', 'Machine Learning Basics'],    onTrack: 81, total: 1098 },
  { persona: 'strategist', name: 'Strategist', color: '#f59e0b', recommended: ['AI Strategy & Leadership', 'AI Fundamentals'],            onTrack: 68, total: 741  },
  { persona: 'visionary',  name: 'Visionary',  color: '#10b981', recommended: ['AI Strategy & Leadership', 'Cybersecurity & AI'],         onTrack: 76, total: 280  },
];

// ── Helpers ───────────────────────────────────────────────────────
function computePersonaTotals(divs: typeof DIVISIONS) {
  const t = { explorer: 0, builder: 0, strategist: 0, visionary: 0 };
  divs.forEach(d => {
    t.explorer   += Math.round(d.completed * d.explorer   / 100);
    t.builder    += Math.round(d.completed * d.builder    / 100);
    t.strategist += Math.round(d.completed * d.strategist / 100);
    t.visionary  += Math.round(d.completed * d.visionary  / 100);
  });
  return [
    { name: 'Explorer',   value: t.explorer,   color: PERSONA_COLORS.explorer },
    { name: 'Builder',    value: t.builder,    color: PERSONA_COLORS.builder },
    { name: 'Strategist', value: t.strategist, color: PERSONA_COLORS.strategist },
    { name: 'Visionary',  value: t.visionary,  color: PERSONA_COLORS.visionary },
  ];
}
const ALL_PERSONA_TOTALS = computePersonaTotals(DIVISIONS);

function useCounter(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setValue(0);
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    ref.current = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); if (ref.current) clearInterval(ref.current); }
      else setValue(start);
    }, 16);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target, duration]);
  return value;
}

// ── InfoTooltip ───────────────────────────────────────────────────
function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-flex items-center" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors" />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl border border-card-border bg-[#0d1b2a] text-xs text-muted-foreground leading-relaxed shadow-xl z-50 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-card-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── KpiCard ───────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color, tooltip }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string | number; sub: string; color: string; tooltip: string;
}) {
  return (
    <motion.div layout key={String(value)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="flex flex-col gap-3 p-5 rounded-2xl bg-card/50 border border-card-border/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex-1">{label}</span>
        <InfoTooltip text={tooltip} />
      </div>
      <p className="text-4xl font-black text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

// ── Section header ────────────────────────────────────────────────
function SectionHeader({ icon: Icon, color, badge, title, description }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string; badge: string; title: string; description: string;
}) {
  return (
    <div className="w-full rounded-2xl px-7 py-6 mb-8 flex items-center gap-5"
      style={{ background: `linear-gradient(135deg, ${color}0f 0%, ${color}06 100%)`, border: `1.5px solid ${color}35`, boxShadow: `0 0 40px ${color}0a` }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1.5px solid ${color}40` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black uppercase tracking-[0.18em] mb-1.5" style={{ color }}>{badge}</div>
        <h2 className="text-3xl font-black text-foreground leading-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ── Panel wrapper with title + tooltip ───────────────────────────
function Panel({ icon: Icon, iconColor, title, tooltip, subtitle, delay = 0, children }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string; title: string; tooltip: string; subtitle?: string; delay?: number; children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="p-6 rounded-2xl bg-card/40 border border-card-border/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}12`, border: `1px solid ${iconColor}22` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold truncate">{title}</h3>
            <InfoTooltip text={tooltip} />
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function StatisticsScreen({ onBack }: { onBack: () => void }) {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const activeDivision     = selectedDivision ? DIVISIONS.find(d => d.name === selectedDivision) ?? null : null;
  const activeCompleted    = activeDivision ? activeDivision.completed : TOTAL_COMPLETED;
  const activeEmployees    = activeDivision ? activeDivision.employees : TOTAL_EMPLOYEES;
  const activeConfidence   = activeDivision ? activeDivision.confidence : AVG_CONFIDENCE;
  const activeAiReady      = activeDivision
    ? Math.round(activeDivision.completed * (activeDivision.builder + activeDivision.strategist + activeDivision.visionary) / 100)
    : 2891;
  const activeDivisionsLabel = activeDivision ? '1 / 10' : '10 / 10';
  const activePersonaTotals  = activeDivision ? computePersonaTotals([activeDivision]) : ALL_PERSONA_TOTALS;

  const ratio         = activeDivision ? activeDivision.completed / TOTAL_COMPLETED : 1;
  const activeTrend   = MONTHLY_TREND.map(m => ({ ...m, assessments: Math.max(1, Math.round(m.assessments * ratio)), cumulative: Math.max(1, Math.round(m.cumulative * ratio)) }));

  const handleBarClick = (data: any) => {
    const name = data?.activePayload?.[0]?.payload?.name ?? data?.name;
    if (!name) return;
    setSelectedDivision(prev => prev === name ? null : name);
  };

  const counterCompleted = useCounter(activeCompleted);
  const progress         = Math.round((activeCompleted / TARGET) * 100);

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const div = DIVISIONS.find(d => d.name === label);
    return (
      <div className="bg-card border border-card-border rounded-xl p-3 text-xs shadow-xl">
        <p className="font-bold text-foreground mb-1">{div?.full ?? label}</p>
        <p className="text-primary">{payload[0].value} assessments completed</p>
        <p className="text-muted-foreground">{div?.employees.toLocaleString()} total employees</p>
        <p className="text-muted-foreground">{div ? Math.round((div.completed / div.employees) * 100) : 0}% participation</p>
        <p className="text-primary/60 mt-1 font-medium">Click to filter all charts ↓</p>
      </div>
    );
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const total = activePersonaTotals.reduce((s, p) => s + p.value, 0);
    return (
      <div className="bg-card border border-card-border rounded-xl p-3 text-xs shadow-xl">
        <p className="font-bold mb-1" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
        <p className="text-foreground">{payload[0].value} employees</p>
        <p className="text-muted-foreground">{Math.round((payload[0].value / total) * 100)}% of total</p>
      </div>
    );
  };

  // Skill heatmap colour
  const skillColor = (score: number) => {
    if (score === 0) return 'rgba(255,255,255,0.04)';
    if (score === 1) return 'rgba(0,212,255,0.18)';
    if (score === 2) return 'rgba(0,212,255,0.45)';
    return 'rgba(0,212,255,0.85)';
  };
  const skillLabel = (score: number) => ['—', 'Started', 'Developing', 'Proficient'][score];

  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-8 max-w-7xl mx-auto">

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center mb-14">
        <div className="mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest">
          ✦ Live Workforce Intelligence · AiNspire
        </div>

        <div className="w-full max-w-lg mb-10 px-8 py-6 rounded-3xl bg-card/60 border border-primary/20 backdrop-blur-md shadow-[0_0_60px_rgba(0,212,255,0.08)]">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {activeDivision ? `${activeDivision.full} · Assessments Completed` : 'Total Assessments Completed · Live Count'}
          </p>
          <p className="text-7xl font-black text-primary mb-2" style={{ filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.5))' }}>
            {counterCompleted.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {activeDivision ? `of ${activeDivision.employees.toLocaleString()} employees in this division` : `of ${TARGET.toLocaleString()} workforce target`}
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-primary font-semibold">{Math.round((activeCompleted / activeEmployees) * 100)}% participation</span>
            <span>+{Math.round(958 * ratio)} this month</span>
            <span>Target: Dec 2025</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          The official TM{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary">AI readiness</span>{' '}signal.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Real-time organisational dashboard tracking Telekom Malaysia's progress toward a fully AI-ready workforce — across all divisions, personas, and learning pathways.
        </p>
      </motion.div>

      {/* ── Active filter banner ── */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div key="filter-banner" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="mb-6 flex items-center justify-between px-5 py-3 rounded-xl border border-primary/40 bg-primary/8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Filtering by: {activeDivision?.full ?? selectedDivision}</span>
              <span className="text-xs text-muted-foreground">· All charts updated below</span>
            </div>
            <button onClick={() => setSelectedDivision(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-full hover:bg-card/60">
              <X className="w-3.5 h-3.5" /> Clear filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: WORKFORCE ANALYTICS STATISTICS
      ══════════════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
        <SectionHeader
          icon={BarChart3}
          color="#00d4ff"
          badge="Section 1 · Workforce Analytics Statistics"
          title="Workforce Analytics"
          description="Organisation-wide participation, persona distribution, readiness indices, and division-level benchmarking across Telekom Malaysia."
        />
      </motion.div>

      {/* ── KPI Cards ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <KpiCard icon={Users}     label="Total Assessments"    value={activeCompleted.toLocaleString()} sub={`of ${activeEmployees.toLocaleString()} ${activeDivision ? 'division' : 'TM'} employees`} color="#00d4ff" tooltip="The number of TM employees who have completed the full AiNspire AI persona assessment." />
        <KpiCard icon={Brain}     label="AI-Ready Employees"   value={activeAiReady.toLocaleString()}   sub="Builder + Strategist + Visionary personas"  color="#a855f7" tooltip="Employees classified as Builder, Strategist, or Visionary — the three personas associated with active, applied AI capability." />
        <KpiCard icon={Award}     label="Avg Confidence Score" value={`${activeConfidence}%`}           sub="Across all completed assessments"             color="#10b981" tooltip="Claude's average confidence in its persona classification across all completed assessments (0–100%). Higher scores indicate stronger, more consistent signal." />
        <KpiCard icon={BarChart3} label="Divisions Active"     value={activeDivisionsLabel}             sub="TM divisions on the platform"                 color="#f59e0b" tooltip="Number of TM business divisions where at least one employee has completed an assessment on the AiNspire platform." />
      </motion.div>

      {/* ── Monthly Assessment Trend (moved above division bar) ── */}
      <Panel icon={TrendingUp} iconColor="#00d4ff" title="Monthly Assessment Trend" delay={0.25}
        tooltip="Month-by-month count of new assessments completed (dashed purple line) and the cumulative running total (solid cyan area). Tracks the pace and acceleration of workforce participation."
        subtitle={activeDivision ? `${activeDivision.name} — estimated monthly cadence` : 'Cumulative growth across TM workforce — 2025'}>
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={activeTrend} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: '#e2e8f0', fontWeight: 700 }} formatter={(v: number) => [v.toLocaleString(), 'Assessments']} />
            <Area type="monotone" dataKey="cumulative" stroke="#00d4ff" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ fill: '#00d4ff', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Cumulative" />
            <Line type="monotone" dataKey="assessments" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Monthly" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-primary inline-block" />Cumulative total</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 border-t-2 border-dashed border-[#a855f7] inline-block" />Monthly new</span>
        </div>
      </Panel>

      {/* ── Participation by Division ── */}
      <Panel icon={BarChart3} iconColor="#00d4ff" title="Participation by Division" delay={0.3}
        tooltip="Number of employees who have completed the AiNspire assessment in each division. Click any bar to filter all downstream charts to that division. Bar height reflects raw assessment count, not participation rate."
        subtitle="Click a bar to filter all charts by that division" className="mt-6">
        <div className="mb-6">
          {selectedDivision && (
            <button onClick={() => setSelectedDivision(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={DIVISIONS} margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barCategoryGap="30%" onClick={handleBarClick} style={{ cursor: 'pointer' }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,212,255,0.06)' }} />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
              {DIVISIONS.map((d) => {
                const isSelected = selectedDivision === d.name;
                const hasFilter  = selectedDivision !== null;
                return (
                  <Cell key={d.name} fill={`url(#${isSelected ? 'barGrad-selected' : 'barGrad-default'})`} opacity={hasFilter && !isSelected ? 0.3 : 1}
                    stroke={isSelected ? '#00d4ff' : 'none'} strokeWidth={isSelected ? 1.5 : 0}
                    style={{ transition: 'opacity 0.25s', filter: isSelected ? 'drop-shadow(0 0 6px rgba(0,212,255,0.6))' : 'none' }} />
                );
              })}
            </Bar>
            <defs>
              <linearGradient id="barGrad-default"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} /><stop offset="100%" stopColor="#0088bb" stopOpacity={0.6} /></linearGradient>
              <linearGradient id="barGrad-selected" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ffff" stopOpacity={1} /><stop offset="100%" stopColor="#00b4d8" stopOpacity={0.85} /></linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* ── Persona Distribution + AI Readiness Index ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Panel icon={Brain} iconColor="#a855f7" title="AI Persona Distribution" delay={0.35}
          tooltip="Breakdown of all assessed employees into the four AI personas. Explorer: curiosity-driven; Builder: hands-on creator; Strategist: governance and ROI-focused; Visionary: transformation leader."
          subtitle={activeDivision ? `${activeDivision.name} — classified employees` : 'All classified TM employees'}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={activePersonaTotals} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {activePersonaTotals.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 min-w-[160px]">
              {activePersonaTotals.map(p => {
                const total = activePersonaTotals.reduce((s, x) => s + x.value, 0);
                const pct = Math.round((p.value / total) * 100);
                return (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1"><span className="font-semibold">{p.name}</span><span className="text-muted-foreground">{pct}%</span></div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: p.color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground pt-1">{activeCompleted.toLocaleString()} total classified</p>
            </div>
          </div>
        </Panel>

        <Panel icon={Target} iconColor="#10b981" title="AI Readiness Index" delay={0.4}
          tooltip="Composite score per division (0–100) combining participation rate, average confidence score, and the proportion of AI-ready personas (Builder + Strategist + Visionary). Higher is more AI-ready."
          subtitle="Composite score per division (0–100)">
          <div className="space-y-3">
            {[...DIVISIONS].sort((a, b) => b.index - a.index).map((d, i) => {
              const color = d.index >= 70 ? '#10b981' : d.index >= 60 ? '#00d4ff' : '#f59e0b';
              const isSelected = selectedDivision === d.name;
              const dimmed     = selectedDivision !== null && !isSelected;
              return (
                <div key={d.name} className="flex items-center gap-3" style={{ opacity: dimmed ? 0.35 : 1, transition: 'opacity 0.25s' }}>
                  <span className={`text-xs font-bold w-16 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>{d.name}</span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: isSelected ? `0 0 8px ${color}66` : 'none' }}
                      initial={{ width: 0 }} animate={{ width: `${d.index}%` }} transition={{ duration: 0.9, delay: 0.3 + i * 0.04 }}>
                      <span className="text-[10px] font-black text-white">{d.index}</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-card-border/40 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" />≥70 High</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00d4ff]" />60–69 Mid</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" />&lt;60 Developing</span>
          </div>
        </Panel>
      </div>

      {/* ── Persona Mix by Division ── */}
      <Panel icon={Zap} iconColor="#f59e0b" title="Persona Mix by Division" delay={0.45}
        tooltip="Stacked percentage breakdown of the four AI persona types within each division. Reveals each division's AI culture — a Builder-heavy division is suited to build internal tools; Explorer-heavy divisions need structured activation programmes."
        subtitle={activeDivision ? `${activeDivision.name} — persona breakdown` : 'Stacked percentage per division'} className="mt-6">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={activeDivision ? [activeDivision] : DIVISIONS} margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barCategoryGap={activeDivision ? '65%' : '30%'}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={35} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 4 }} formatter={(v: number, n: string) => [`${v}%`, n.charAt(0).toUpperCase() + n.slice(1)]} />
            <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
            <Bar dataKey="explorer"   stackId="a" fill={PERSONA_COLORS.explorer}   radius={[0,0,0,0]} />
            <Bar dataKey="builder"    stackId="a" fill={PERSONA_COLORS.builder}    radius={[0,0,0,0]} />
            <Bar dataKey="strategist" stackId="a" fill={PERSONA_COLORS.strategist} radius={[0,0,0,0]} />
            <Bar dataKey="visionary"  stackId="a" fill={PERSONA_COLORS.visionary}  radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* ── Cohort Benchmarking ── */}
      <Panel icon={Target} iconColor="#ec4899" title="Cohort Benchmarking" delay={0.5}
        tooltip="Each division's AI Readiness Index (0–100) compared against two reference lines: the TM organisation-wide average (amber, 67) and the wider Telco industry benchmark (pink, 71). Gaps shown in green (above) or red (below)."
        subtitle="Division AI Readiness vs TM Average (67) vs Telco Industry Benchmark (71)" className="mt-6 mb-10">
        <div className="flex items-center gap-6 mb-6 text-xs">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4ff]" />Division Score</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" />TM Org Average (67)</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ec4899]" />Telco Industry Benchmark (71)</span>
        </div>
        <div className="space-y-4">
          {[...DIVISIONS].sort((a, b) => b.index - a.index).map(d => {
            const isFiltered = selectedDivision !== null && selectedDivision !== d.name;
            const vsAvg = d.index - 67; const vsInd = d.index - 71;
            return (
              <div key={d.name} className="transition-all" style={{ opacity: isFiltered ? 0.25 : 1 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-16 flex-shrink-0">{d.name}</span>
                    <span className="text-xs text-muted-foreground/60 hidden md:block">{d.full}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span style={{ color: vsAvg >= 0 ? '#22c55e' : '#ef4444' }}>{vsAvg >= 0 ? '+' : ''}{vsAvg} vs TM avg</span>
                    <span style={{ color: vsInd >= 0 ? '#22c55e' : '#ef4444' }}>{vsInd >= 0 ? '+' : ''}{vsInd} vs industry</span>
                    <span className="font-black text-foreground w-6 text-right">{d.index}</span>
                  </div>
                </div>
                <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                  <motion.div className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-2"
                    style={{ background: 'linear-gradient(90deg, #00d4ff44, #00d4ff)', zIndex: 3 }}
                    initial={{ width: 0 }} animate={{ width: `${d.index}%` }} transition={{ duration: 0.9 }}>
                    <span className="text-[10px] font-black text-white">{d.index}</span>
                  </motion.div>
                  <div className="absolute inset-y-1 w-0.5 rounded-full bg-[#f59e0b] z-10" style={{ left: '67%' }} />
                  <div className="absolute inset-y-1 w-0.5 rounded-full bg-[#ec4899] z-10" style={{ left: '71%' }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-card-border/40">
          {[
            { label: 'Above Industry Benchmark', value: DIVISIONS.filter(d => d.index >= 71).length, color: '#22c55e', sub: 'divisions above Telco industry average' },
            { label: 'At TM Average',             value: DIVISIONS.filter(d => d.index >= 65 && d.index < 71).length, color: '#f59e0b', sub: 'divisions within ±2 pts of TM average' },
            { label: 'Below Average',             value: DIVISIONS.filter(d => d.index < 65).length, color: '#ef4444', sub: 'divisions requiring targeted intervention' },
          ].map(c => (
            <div key={c.label} className="p-4 rounded-xl border border-card-border/60 bg-card/30 text-center">
              <div className="text-3xl font-black mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-xs font-bold text-foreground mb-1">{c.label}</div>
              <div className="text-xs text-muted-foreground">{c.sub}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: LEARNING PATHWAY STATISTICS
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-gradient-to-r from-transparent via-card-border/60 to-transparent" /></div>
        <div className="relative flex justify-center"><span className="px-4 bg-background text-xs font-bold uppercase tracking-widest text-muted-foreground/40">· · ·</span></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-8">
        <SectionHeader
          icon={BookOpen}
          color="#a855f7"
          badge="Section 2 · Learning Pathway Statistics"
          title="Learning Pathway Statistics"
          description="From organisation-wide learning activity down to persona-level course alignment — tracking how TM employees develop AI skills on the platform."
        />
      </motion.div>

      {/* ── Org level: Learning Hours + Certifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <Panel icon={Clock} iconColor="#6366f1" title="Learning Hours Logged" delay={0.6}
          tooltip="Total AI learning hours recorded per division and average hours per assessed employee. The amber target line represents 80% of division headcount completing at least 5 learning hours."
          subtitle="Total hours by division · avg per employee shown on bar">
          <div className="space-y-3">
            {[...LEARNING_HOURS_BY_DIVISION].sort((a, b) => b.hours - a.hours).map((d, i) => {
              const maxHours = Math.max(...LEARNING_HOURS_BY_DIVISION.map(x => x.hours));
              const pct = Math.round((d.hours / maxHours) * 100);
              const atTarget = d.hours >= d.target;
              return (
                <div key={d.name} className="flex items-center gap-3" style={{ opacity: selectedDivision && selectedDivision !== d.name ? 0.3 : 1, transition: 'opacity 0.25s' }}>
                  <span className="text-xs font-bold text-muted-foreground w-16 flex-shrink-0">{d.name}</span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                    <motion.div className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-2"
                      style={{ background: atTarget ? 'linear-gradient(90deg, #6366f188, #6366f1)' : 'linear-gradient(90deg, #f59e0b66, #f59e0b)' }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.5 + i * 0.04 }}>
                      <span className="text-[10px] font-black text-white">{d.hours.toLocaleString()}</span>
                    </motion.div>
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right flex-shrink-0">{d.avg}h avg</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-5 text-xs text-muted-foreground mt-4 pt-3 border-t border-card-border/40">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6366f1]" />On / above target</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" />Below target</span>
          </div>
        </Panel>

        <Panel icon={GraduationCap} iconColor="#10b981" title="Certifications & Badges Earned" delay={0.62}
          tooltip="Count of employees per division who have earned an AI certification or digital badge on the AiNspire platform. Target bar shows 40% of assessed employees earning at least one certification."
          subtitle="Employees who earned at least one AI badge · target = 40% of assessed">
          <div className="space-y-4">
            {[...CERTIFICATIONS_BY_DIVISION].sort((a, b) => b.earned - a.earned).map((d, i) => {
              const earnedPct  = Math.round((d.earned / d.target) * 100);
              const onTrack    = d.earned >= d.target * 0.7;
              return (
                <div key={d.name} style={{ opacity: selectedDivision && selectedDivision !== d.name ? 0.3 : 1, transition: 'opacity 0.25s' }}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-muted-foreground">{d.name}</span>
                    <span style={{ color: onTrack ? '#10b981' : '#f59e0b' }}>{d.earned} / {d.target} target</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: onTrack ? '#10b981' : '#f59e0b' }}
                      initial={{ width: 0 }} animate={{ width: `${Math.min(earnedPct, 100)}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.04 }} />
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground mt-0.5">{earnedPct}% of target</div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* ── Monthly Completion Rate Trend ── */}
      <Panel icon={TrendingUp} iconColor="#f43f5e" title="Monthly Completion Rate Trend" delay={0.64}
        tooltip="Percentage of enrolled employees who completed at least one AI course during each month. The dashed amber line is the monthly completion rate target. Upward trend indicates improving learner engagement."
        subtitle="% of enrolled employees completing a course each month · target shown in amber" className="mb-6">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={COMPLETION_TREND} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={v => `${v}%`} domain={[45, 85]} />
            <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: '#e2e8f0', fontWeight: 700 }} formatter={(v: number, n: string) => [`${v}%`, n === 'rate' ? 'Completion Rate' : 'Target']} />
            <Line type="monotone" dataKey="rate"   stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} name="rate" />
            <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="target" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-5 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#f43f5e] inline-block" />Actual completion rate</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 border-t-2 border-dashed border-[#f59e0b] inline-block" />Monthly target</span>
        </div>
      </Panel>

      {/* ── Course Performance (existing + drop-off + avg days, combined) ── */}
      <Panel icon={BookOpen} iconColor="#00d4ff" title="Course Performance" delay={0.66}
        tooltip="Combined view of all AI learning courses: enrolment count, completion count, completion rate, drop-off rate (enrolled but did not finish), and average days from enrolment to completion. Sorted by enrolment size."
        subtitle="Enrolment, completion rate, drop-off, and time-to-complete per course — all combined" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                {[
                  { label: 'Course',              tip: 'AI learning course recommended on the AiNspire platform.' },
                  { label: 'Enrolled',            tip: 'Number of TM employees who started this course.' },
                  { label: 'Completed',           tip: 'Number of employees who finished the course and received a completion badge.' },
                  { label: 'Completion Rate',     tip: 'Percentage of enrolled employees who successfully completed the course (Completed ÷ Enrolled).' },
                  { label: 'Drop-off Rate',       tip: 'Percentage of enrolled employees who started but did not finish the course. High drop-off may indicate content difficulty or relevance issues.' },
                  { label: 'Avg Days to Finish',  tip: 'Average number of calendar days between an employee enrolling and completing the course. Shorter is generally better for engagement.' },
                ].map(h => (
                  <th key={h.label} className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground/60 pr-4 last:pr-0">
                    <div className="flex items-center gap-1.5">{h.label}<InfoTooltip text={h.tip} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COURSE_PERFORMANCE.map((c, i) => {
                const completionPct = Math.round((c.completed / c.enrolled) * 100);
                const dropColor = c.dropoffPct > 25 ? '#ef4444' : c.dropoffPct > 15 ? '#f59e0b' : '#22c55e';
                const compColor = completionPct >= 70 ? '#22c55e' : completionPct >= 55 ? '#00d4ff' : '#f59e0b';
                return (
                  <tr key={c.name} className="border-t border-card-border/40 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                        <span className="text-sm font-semibold text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground font-medium">{c.enrolled.toLocaleString()}</td>
                    <td className="py-3 pr-4 font-bold text-foreground">{c.completed.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden flex-shrink-0">
                          <motion.div className="h-full rounded-full" style={{ background: compColor }} initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: compColor }}>{completionPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ color: dropColor, borderColor: `${dropColor}30`, background: `${dropColor}10` }}>{c.dropoffPct}%</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">{c.avgDays}d</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-4 pt-3 border-t border-card-border/40">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Drop-off &lt;15% — healthy engagement</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />15–25% — review content pacing</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />&gt;25% — intervention recommended</span>
        </div>
      </Panel>

      {/* ── Skill Coverage Heatmap ── */}
      <Panel icon={Layers} iconColor="#6366f1" title="Skill Coverage Heatmap" delay={0.68}
        tooltip="Matrix showing how well each AI skill area is covered per division, derived from course completion data. Coverage levels: — none, Started, Developing, Proficient. Darker cells indicate stronger skill coverage."
        subtitle="AI skill areas vs divisions · derived from course completion · hover a cell for detail" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground/50 pr-4 w-20">Division</th>
                {SKILLS.map(s => (
                  <th key={s} className="pb-3 text-center font-bold text-muted-foreground/70 px-1">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] uppercase tracking-wider leading-snug" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 72 }}>{s}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SKILL_HEATMAP.map((row, i) => (
                <tr key={row.division} className="border-t border-card-border/30">
                  <td className="py-2 pr-4 text-xs font-bold text-muted-foreground" style={{ opacity: selectedDivision && selectedDivision !== row.division ? 0.25 : 1 }}>{row.division}</td>
                  {row.scores.map((score, j) => (
                    <td key={j} className="py-2 px-1" style={{ opacity: selectedDivision && selectedDivision !== row.division ? 0.25 : 1 }}>
                      <div className="group relative w-9 h-9 rounded-lg flex items-center justify-center mx-auto cursor-default transition-transform hover:scale-110"
                        style={{ background: skillColor(score), border: `1px solid ${score > 0 ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.04)'}` }}>
                        <span className="text-[10px] font-black text-white/80">{score > 0 ? score : ''}</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-28 p-2 rounded-lg bg-[#0d1b2a] border border-card-border text-center z-50 pointer-events-none">
                          <div className="font-bold text-foreground text-[10px]">{row.division} · {SKILLS[j]}</div>
                          <div className="text-[10px]" style={{ color: score === 3 ? '#22c55e' : score === 2 ? '#00d4ff' : score === 1 ? '#f59e0b' : '#94a3b8' }}>{skillLabel(score)}</div>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-5 mt-5 pt-3 border-t border-card-border/40 text-xs text-muted-foreground">
          {[0,1,2,3].map(s => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded flex-shrink-0" style={{ background: skillColor(s), border: '1px solid rgba(0,212,255,0.2)' }} />{skillLabel(s)}
            </span>
          ))}
        </div>
      </Panel>

      {/* ── Persona-to-Course Alignment (persona level — last) ── */}
      <Panel icon={Brain} iconColor="#a855f7" title="Persona-to-Course Alignment" delay={0.7}
        tooltip="Shows whether employees in each persona group are following their persona's recommended learning path. High alignment means employees are studying the courses most relevant to their AI working style. Off-track employees may benefit from guided re-enrolment."
        subtitle="Are employees following their persona's recommended learning path? · percentage on-track" className="mb-10">
        <div className="space-y-6">
          {PERSONA_ALIGNMENT_DATA.map(p => {
            const offTrack = 100 - p.onTrack;
            const offCount = Math.round((offTrack / 100) * p.total);
            const onCount  = p.total - offCount;
            return (
              <div key={p.persona}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold" style={{ color: p.color }}>{p.name}</span>
                      <span className="text-xs text-muted-foreground">· {p.total.toLocaleString()} employees</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Recommended: <span className="text-foreground font-medium">{p.recommended.join(' · ')}</span></div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-2xl font-black" style={{ color: p.onTrack >= 75 ? '#22c55e' : p.onTrack >= 60 ? p.color : '#f59e0b' }}>{p.onTrack}%</div>
                    <div className="text-xs text-muted-foreground">on-track</div>
                  </div>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: p.color }} initial={{ width: 0 }} animate={{ width: `${p.onTrack}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                  <motion.div className="absolute inset-y-0 rounded-full bg-amber-500/50" initial={{ width: 0, left: `${p.onTrack}%` }} animate={{ width: `${offTrack}%`, left: `${p.onTrack}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                  <span style={{ color: p.color }}>{onCount.toLocaleString()} on recommended path</span>
                  <span className="text-amber-400">{offCount.toLocaleString()} off-track — may need guidance</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 text-xs text-muted-foreground mt-5 pt-4 border-t border-card-border/40">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />≥75% aligned — excellent</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />60–74% — some re-enrolment needed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />&lt;60% — guided intervention required</span>
        </div>
      </Panel>

      {/* ── Footer ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-xs text-muted-foreground/50 pb-6">
        Data is simulated for demonstration purposes · AiNspire Workforce Intelligence Platform · Telekom Malaysia Berhad
      </motion.div>

      <motion.button onClick={onBack} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Main Page
      </motion.button>

    </div>
  );
}
