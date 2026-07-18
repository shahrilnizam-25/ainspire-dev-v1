import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Line, Area, AreaChart,
} from 'recharts';
import { ArrowLeft, Users, Brain, TrendingUp, Award, Zap, BookOpen, BarChart3, Target, X } from 'lucide-react';

// ── Colour palette ────────────────────────────────────────────────
const PERSONA_COLORS: Record<string, string> = {
  explorer:   '#00d4ff',
  builder:    '#a855f7',
  strategist: '#f59e0b',
  visionary:  '#10b981',
};

// ── Simulated data ────────────────────────────────────────────────
const DIVISIONS = [
  { name: 'GNT',      full: 'Group Network Technology',              employees: 2100, completed: 389, explorer: 30, builder: 45, strategist: 18, visionary: 7,  index: 68, confidence: 72 },
  { name: 'GCX',      full: 'Group Customer Experience',             employees: 1850, completed: 312, explorer: 38, builder: 22, strategist: 28, visionary: 12, index: 61, confidence: 69 },
  { name: 'GITD',     full: 'Group Information Technology & Digital', employees: 1200, completed: 287, explorer: 18, builder: 52, strategist: 20, visionary: 10, index: 78, confidence: 81 },
  { name: 'TM One',   full: 'Group TM One',                          employees: 890,  completed: 168, explorer: 28, builder: 35, strategist: 28, visionary: 9,  index: 65, confidence: 71 },
  { name: 'GF',       full: 'Group Finance',                         employees: 650,  completed: 98,  explorer: 42, builder: 18, strategist: 32, visionary: 8,  index: 57, confidence: 65 },
  { name: 'GHCM',     full: 'Group Human Capital Management',        employees: 520,  completed: 87,  explorer: 45, builder: 15, strategist: 28, visionary: 12, index: 55, confidence: 63 },
  { name: 'TM Global',full: 'Group TM Global',                       employees: 420,  completed: 89,  explorer: 25, builder: 30, strategist: 30, visionary: 15, index: 67, confidence: 73 },
  { name: 'GIS',      full: 'Group Information Security',            employees: 380,  completed: 76,  explorer: 20, builder: 48, strategist: 22, visionary: 10, index: 72, confidence: 76 },
  { name: 'GP',       full: 'Group Procurement',                     employees: 290,  completed: 45,  explorer: 48, builder: 12, strategist: 32, visionary: 8,  index: 52, confidence: 61 },
  { name: 'GS',       full: 'Group Strategy',                        employees: 180,  completed: 52,  explorer: 22, builder: 18, strategist: 38, visionary: 22, index: 70, confidence: 78 },
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

const COURSES = [
  { name: 'AI Fundamentals for Business',   enrolled: 1247, completed: 891, color: '#00d4ff' },
  { name: 'Prompt Engineering Essentials',  enrolled: 876,  completed: 654, color: '#a855f7' },
  { name: 'Python for Data Science',        enrolled: 589,  completed: 342, color: '#f59e0b' },
  { name: 'AI Strategy & Leadership',       enrolled: 423,  completed: 298, color: '#10b981' },
  { name: 'Machine Learning Basics',        enrolled: 445,  completed: 267, color: '#f43f5e' },
  { name: 'Cybersecurity & AI',             enrolled: 312,  completed: 201, color: '#6366f1' },
];

// ── Helper: compute persona totals from an array of divisions ─────
function computePersonaTotals(divs: typeof DIVISIONS) {
  const totals = { explorer: 0, builder: 0, strategist: 0, visionary: 0 };
  divs.forEach(d => {
    totals.explorer   += Math.round(d.completed * d.explorer   / 100);
    totals.builder    += Math.round(d.completed * d.builder    / 100);
    totals.strategist += Math.round(d.completed * d.strategist / 100);
    totals.visionary  += Math.round(d.completed * d.visionary  / 100);
  });
  return [
    { name: 'Explorer',   value: totals.explorer,   color: PERSONA_COLORS.explorer },
    { name: 'Builder',    value: totals.builder,    color: PERSONA_COLORS.builder },
    { name: 'Strategist', value: totals.strategist, color: PERSONA_COLORS.strategist },
    { name: 'Visionary',  value: totals.visionary,  color: PERSONA_COLORS.visionary },
  ];
}

const ALL_PERSONA_TOTALS = computePersonaTotals(DIVISIONS);

// ── Animated counter hook ─────────────────────────────────────────
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

// ── KPI card ─────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string | number; sub: string; color: string;
}) {
  return (
    <motion.div
      layout
      key={String(value)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-3 p-5 rounded-2xl bg-card/50 border border-card-border/60 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <p className="text-4xl font-black text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function StatisticsScreen({ onBack }: { onBack: () => void }) {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const activeDivision = selectedDivision
    ? DIVISIONS.find(d => d.name === selectedDivision) ?? null
    : null;

  // Derived data based on selection
  const activeCompleted  = activeDivision ? activeDivision.completed : TOTAL_COMPLETED;
  const activeEmployees  = activeDivision ? activeDivision.employees : TOTAL_EMPLOYEES;
  const activeConfidence = activeDivision ? activeDivision.confidence : AVG_CONFIDENCE;
  const activeAiReady    = activeDivision
    ? Math.round(activeDivision.completed * (activeDivision.builder + activeDivision.strategist + activeDivision.visionary) / 100)
    : 2891;
  const activeDivisionsLabel = activeDivision ? '1 / 10' : '10 / 10';

  const activePersonaTotals = activeDivision
    ? computePersonaTotals([activeDivision])
    : ALL_PERSONA_TOTALS;

  const ratio = activeDivision ? activeDivision.completed / TOTAL_COMPLETED : 1;
  const activeCourses = COURSES.map(c => ({
    ...c,
    enrolled:  Math.max(1, Math.round(c.enrolled  * ratio)),
    completed: Math.max(1, Math.round(c.completed * ratio)),
  }));
  const activeTrend = MONTHLY_TREND.map(m => ({
    ...m,
    assessments: Math.max(1, Math.round(m.assessments * ratio)),
    cumulative:  Math.max(1, Math.round(m.cumulative  * ratio)),
  }));

  // Bar chart click handler
  const handleBarClick = (data: any) => {
    const name = data?.activePayload?.[0]?.payload?.name ?? data?.name;
    if (!name) return;
    setSelectedDivision(prev => prev === name ? null : name);
  };

  const counterCompleted = useCounter(activeCompleted);
  const progress = Math.round((activeCompleted / TARGET) * 100);

  // Custom bar tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const div = DIVISIONS.find(d => d.name === label);
    return (
      <div className="bg-card border border-card-border rounded-xl p-3 text-xs shadow-xl">
        <p className="font-bold text-foreground mb-1">{div?.full ?? label}</p>
        <p className="text-primary">{payload[0].value} assessments completed</p>
        <p className="text-muted-foreground">{div?.employees.toLocaleString()} total employees</p>
        <p className="text-muted-foreground">
          {div ? Math.round((div.completed / div.employees) * 100) : 0}% participation
        </p>
        <p className="text-primary/60 mt-1 font-medium">Click to filter all charts ↓</p>
      </div>
    );
  };

  // Custom pie tooltip
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

  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-8 max-w-7xl mx-auto">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-14"
      >
        <div className="mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest">
          ✦ Live Workforce Intelligence · AiNspire
        </div>

        {/* Live count card */}
        <div className="w-full max-w-lg mb-10 px-8 py-6 rounded-3xl bg-card/60 border border-primary/20 backdrop-blur-md shadow-[0_0_60px_rgba(0,212,255,0.08)]">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {activeDivision ? `${activeDivision.full} · Assessments Completed` : 'Total Assessments Completed · Live Count'}
          </p>
          <p className="text-7xl font-black text-primary mb-2" style={{ filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.5))' }}>
            {counterCompleted.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {activeDivision
              ? `of ${activeDivision.employees.toLocaleString()} employees in this division`
              : `of ${TARGET.toLocaleString()} workforce target`}
          </p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-primary font-semibold">{Math.round((activeCompleted / activeEmployees) * 100)}% participation</span>
            <span>+{Math.round(958 * ratio)} this month</span>
            <span>Target: Dec 2025</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          The official TM{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary">
            AI readiness
          </span>{' '}
          signal.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Real-time organisational dashboard tracking Telekom Malaysia's progress toward a fully AI-ready workforce — visible across all divisions, personas, and learning dimensions.
        </p>
      </motion.div>

      {/* ── Active filter banner ── */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            key="filter-banner"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="mb-6 flex items-center justify-between px-5 py-3 rounded-xl border border-primary/40 bg-primary/8 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">
                Filtering by: {activeDivision?.full ?? selectedDivision}
              </span>
              <span className="text-xs text-muted-foreground">· All charts updated below</span>
            </div>
            <button
              onClick={() => setSelectedDivision(null)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-full hover:bg-card/60"
            >
              <X className="w-3.5 h-3.5" /> Clear filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
      >
        <KpiCard icon={Users}     label="Total Assessments"    value={activeCompleted.toLocaleString()} sub={`of ${activeEmployees.toLocaleString()} ${activeDivision ? 'division' : 'TM'} employees`} color="#00d4ff" />
        <KpiCard icon={Brain}     label="AI-Ready Employees"   value={activeAiReady.toLocaleString()}   sub="Builder + Strategist + Visionary personas"  color="#a855f7" />
        <KpiCard icon={Award}     label="Avg Confidence Score" value={`${activeConfidence}%`}           sub="Across all completed assessments"             color="#10b981" />
        <KpiCard icon={BarChart3} label="Divisions Active"     value={activeDivisionsLabel}             sub="TM divisions on the platform"                 color="#f59e0b" />
      </motion.div>

      {/* ── Division Participation ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10 p-6 rounded-2xl bg-card/40 border border-card-border/60"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Participation by Division</h2>
              <p className="text-xs text-muted-foreground">Click a bar to filter all charts by that division</p>
            </div>
          </div>
          {selectedDivision && (
            <button
              onClick={() => setSelectedDivision(null)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={DIVISIONS}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            barCategoryGap="30%"
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,212,255,0.06)' }} />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
              {DIVISIONS.map((d) => {
                const isSelected  = selectedDivision === d.name;
                const hasFilter   = selectedDivision !== null;
                const opacity     = hasFilter && !isSelected ? 0.3 : 1;
                const gradId      = isSelected ? `barGrad-selected` : `barGrad-default`;
                return (
                  <Cell
                    key={d.name}
                    fill={`url(#${gradId})`}
                    opacity={opacity}
                    stroke={isSelected ? '#00d4ff' : 'none'}
                    strokeWidth={isSelected ? 1.5 : 0}
                    style={{ transition: 'opacity 0.25s, filter 0.25s', filter: isSelected ? 'drop-shadow(0 0 6px rgba(0,212,255,0.6))' : 'none' }}
                  />
                );
              })}
            </Bar>
            <defs>
              <linearGradient id="barGrad-default" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00d4ff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0088bb" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGrad-selected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00ffff" stopOpacity={1} />
                <stop offset="100%" stopColor="#00b4d8" stopOpacity={0.85} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Persona Distribution + AI Readiness Index ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Persona donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl bg-card/40 border border-card-border/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Persona Distribution</h2>
              <p className="text-xs text-muted-foreground">
                {activeDivision ? `${activeDivision.name} — classified employees` : 'Breakdown of all classified employees'}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={activePersonaTotals} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {activePersonaTotals.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
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
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-foreground">{p.name}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: p.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground pt-1">{activeCompleted.toLocaleString()} total classified</p>
            </div>
          </div>
        </motion.div>

        {/* AI Readiness Index */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-card/40 border border-card-border/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Readiness Index</h2>
              <p className="text-xs text-muted-foreground">Composite score per division (0 – 100)</p>
            </div>
          </div>
          <div className="space-y-3">
            {[...DIVISIONS].sort((a, b) => b.index - a.index).map((d, i) => {
              const color = d.index >= 70 ? '#10b981' : d.index >= 60 ? '#00d4ff' : '#f59e0b';
              const isSelected  = selectedDivision === d.name;
              const hasFilter   = selectedDivision !== null;
              const dimmed      = hasFilter && !isSelected;
              return (
                <div key={d.name} className="flex items-center gap-3" style={{ opacity: dimmed ? 0.35 : 1, transition: 'opacity 0.25s' }}>
                  <span className={`text-xs font-bold w-16 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>{d.name}</span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: isSelected ? `0 0 8px ${color}66` : 'none' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${d.index}%` }}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
                    >
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
        </motion.div>
      </div>

      {/* ── Persona breakdown per division ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-10 p-6 rounded-2xl bg-card/40 border border-card-border/60"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Persona Mix by Division</h2>
            <p className="text-xs text-muted-foreground">
              {activeDivision ? `${activeDivision.name} — persona breakdown` : 'Stacked percentage of persona types per division'}
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={activeDivision ? [activeDivision] : DIVISIONS}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            barCategoryGap={activeDivision ? '65%' : '30%'}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={35} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 4 }}
              formatter={(value: number, name: string) => [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
            <Bar dataKey="explorer"   stackId="a" fill={PERSONA_COLORS.explorer}   radius={[0,0,0,0]} />
            <Bar dataKey="builder"    stackId="a" fill={PERSONA_COLORS.builder}    radius={[0,0,0,0]} />
            <Bar dataKey="strategist" stackId="a" fill={PERSONA_COLORS.strategist} radius={[0,0,0,0]} />
            <Bar dataKey="visionary"  stackId="a" fill={PERSONA_COLORS.visionary}  radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Learning Pathway Adoption + Monthly Trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Courses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-card/40 border border-card-border/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#6366f1]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Learning Pathway Adoption</h2>
              <p className="text-xs text-muted-foreground">
                {activeDivision ? `${activeDivision.name} — estimated course activity` : 'Enrolment vs completion across recommended courses'}
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {activeCourses.map((c, i) => {
              const completionRate = Math.round((c.completed / c.enrolled) * 100);
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground truncate mr-2">{c.name}</span>
                    <span className="text-muted-foreground flex-shrink-0">{c.enrolled.toLocaleString()} enrolled</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div className="absolute inset-0 rounded-full" style={{ background: `${c.color}20` }} />
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: c.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 0.9, delay: 0.4 + i * 0.07, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span style={{ color: c.color }}>{c.completed.toLocaleString()} completed</span>
                    <span>{completionRate}% completion rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Monthly trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="p-6 rounded-2xl bg-card/40 border border-card-border/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Monthly Assessment Trend</h2>
              <p className="text-xs text-muted-foreground">
                {activeDivision ? `${activeDivision.name} — estimated monthly cadence` : 'Cumulative growth across TM workforce — 2025'}
              </p>
            </div>
          </div>
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
              <Tooltip
                contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 700 }}
                formatter={(v: number) => [v.toLocaleString(), 'Assessments']}
              />
              <Area type="monotone" dataKey="cumulative" stroke="#00d4ff" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ fill: '#00d4ff', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Cumulative" />
              <Line type="monotone" dataKey="assessments" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Monthly" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-5 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-primary inline-block" />Cumulative total</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 border-t-2 border-dashed border-[#a855f7] inline-block" />Monthly new</span>
          </div>
        </motion.div>
      </div>

      {/* ── Cohort Benchmarking ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-10 p-6 rounded-2xl bg-card/40 border border-card-border/60"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#ec4899]/10 border border-[#ec4899]/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#ec4899]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Cohort Benchmarking</h2>
            <p className="text-xs text-muted-foreground">Division AI Readiness vs TM Average vs Telco Industry Benchmark</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-xs">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4ff]" />Division Score</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" />TM Org Average (67)</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ec4899]" />Telco Industry Benchmark (71)</span>
        </div>

        <div className="space-y-4">
          {[...DIVISIONS].sort((a, b) => b.index - a.index).map((d) => {
            const isFiltered = selectedDivision !== null && selectedDivision !== d.name;
            const tmAvg = 67;
            const industryBenchmark = 71;
            const vsAvg = d.index - tmAvg;
            const vsIndustry = d.index - industryBenchmark;
            return (
              <div key={d.name} className="transition-all" style={{ opacity: isFiltered ? 0.25 : 1 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-16 flex-shrink-0">{d.name}</span>
                    <span className="text-xs text-muted-foreground/60 hidden md:block">{d.full}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span style={{ color: vsAvg >= 0 ? '#22c55e' : '#ef4444' }}>
                      {vsAvg >= 0 ? '+' : ''}{vsAvg} vs TM avg
                    </span>
                    <span style={{ color: vsIndustry >= 0 ? '#22c55e' : '#ef4444' }}>
                      {vsIndustry >= 0 ? '+' : ''}{vsIndustry} vs industry
                    </span>
                    <span className="font-black text-foreground w-6 text-right">{d.index}</span>
                  </div>
                </div>
                <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                  {/* Division bar */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-2"
                    style={{ background: 'linear-gradient(90deg, #00d4ff44, #00d4ff)', zIndex: 3 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.index}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  >
                    <span className="text-[10px] font-black text-white">{d.index}</span>
                  </motion.div>
                  {/* TM average line */}
                  <div className="absolute inset-y-1 w-0.5 rounded-full bg-[#f59e0b] z-10" style={{ left: `${tmAvg}%` }} />
                  {/* Industry benchmark line */}
                  <div className="absolute inset-y-1 w-0.5 rounded-full bg-[#ec4899] z-10" style={{ left: `${industryBenchmark}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary callouts */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-card-border/40">
          {[
            { label: 'Above Industry Benchmark', value: DIVISIONS.filter(d => d.index >= 71).length, color: '#22c55e', sub: 'divisions performing above Telco industry avg' },
            { label: 'At TM Average', value: DIVISIONS.filter(d => d.index >= 65 && d.index < 71).length, color: '#f59e0b', sub: 'divisions within ±2 pts of TM organisation average' },
            { label: 'Below Average', value: DIVISIONS.filter(d => d.index < 65).length, color: '#ef4444', sub: 'divisions requiring targeted intervention' },
          ].map(c => (
            <div key={c.label} className="p-4 rounded-xl border border-card-border/60 bg-card/30 text-center">
              <div className="text-3xl font-black mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-xs font-bold text-foreground mb-1">{c.label}</div>
              <div className="text-xs text-muted-foreground">{c.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer note ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="text-center text-xs text-muted-foreground/50 pb-6"
      >
        Data is simulated for demonstration purposes · AiNspire Workforce Intelligence Platform · Telekom Malaysia Berhad
      </motion.div>

      {/* ── Bottom-left back button ── */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Main Page
      </motion.button>

    </div>
  );
}
