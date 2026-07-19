import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import QuestionScreen from './components/QuestionScreen';
import OpenQuestionScreen from './components/OpenQuestionScreen';
import AIThinkingScreen from './components/AIThinkingScreen';
import ResultsScreen from './components/ResultsScreen';
import HRDashboard from './components/HRDashboard';
import ReportScreen from './components/ReportScreen';
import StatisticsScreen from './components/StatisticsScreen';
import ContactScreen from './components/ContactScreen';
import { questionsByLang, openQuestionByLang, type Lang } from './i18n';
import type { Option } from './data/questions';

type Screen = 'landing' | 'assessment' | 'open-question' | 'ai-loading' | 'results' | 'hr-view' | 'statistics' | 'contact' | 'report';

export type MCQAnswer = {
  questionId: number;
  questionText: string;
  selectedOption: string;
  selectedText: string;
  personaId: string;
};

export type AIResult = {
  persona: string;
  confidence: number;
  reasoning: string;
  narrative: string;
  recommendations: Array<{ title: string; description: string }>;
};

const LANGS: Lang[] = ['EN', 'BM', 'CN'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [lang, setLang] = useState<Lang>('EN');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<MCQAnswer[]>([]);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  // Active language-specific data
  const questions = questionsByLang[lang];
  const openQuestion = openQuestionByLang[lang];

  const handleStart = () => {
    setScreen('assessment');
    setCurrentQuestionIdx(0);
    setMcqAnswers([]);
    setAiResult(null);
    setAiError(null);
  };

  const handleAnswer = (option: Option) => {
    const question = questions[currentQuestionIdx];
    const answer: MCQAnswer = {
      questionId: question.id,
      questionText: question.text,
      selectedOption: option.id,
      selectedText: option.text,
      personaId: option.personaId,
    };
    setMcqAnswers((prev) => [...prev, answer]);

    if (currentQuestionIdx < questions.length - 1) {
      setTimeout(() => setCurrentQuestionIdx((prev) => prev + 1), 600);
    } else {
      setTimeout(() => setScreen('open-question'), 600);
    }
  };

  const handleOpenSubmit = async (role: string, freeText: string) => {
    setUserRole(role);
    setScreen('ai-loading');

    const answers = [
      ...mcqAnswers,
      {
        questionId: 6,
        questionText: 'What is your current role in Telekom Malaysia?',
        freeText: role,
      },
      {
        questionId: openQuestion.id,
        questionText: openQuestion.text,
        freeText,
      },
    ];

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, lang }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AIResult = await res.json();
      setAiResult(data);
      setScreen('results');
    } catch (err) {
      console.error('Classification error:', err);
      setAiError(String(err));
      setAiResult(null);
      setScreen('results');
    }
  };

  // Rule-based fallback persona (plurality vote)
  const getFallbackPersona = (): string => {
    const counts: Record<string, number> = {
      explorer: 0,
      builder: 0,
      strategist: 0,
      visionary: 0,
    };
    mcqAnswers.forEach((a) => {
      if (counts[a.personaId] !== undefined) counts[a.personaId]++;
    });
    return (
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'explorer'
    );
  };

  const resultPersonaId = aiResult?.persona ?? getFallbackPersona();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative flex flex-col font-sans overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-30" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background opacity-50" />

      {/* ── Global Language Switcher ── */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-lg">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`relative px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
              lang === l
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === l && (
              <motion.div
                layoutId="global-lang-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{l}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center min-h-[100dvh] w-full py-8">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <LandingScreen
                lang={lang}
                onStart={handleStart}
                onStats={() => setScreen('statistics')}
                onContact={() => setScreen('contact')}
              />
            </motion.div>
          )}

          {screen === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <QuestionScreen
                lang={lang}
                question={questions[currentQuestionIdx]}
                currentIndex={currentQuestionIdx}
                totalQuestions={questions.length + 1}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}

          {screen === 'open-question' && (
            <motion.div
              key="open-question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <OpenQuestionScreen
                lang={lang}
                question={openQuestion}
                currentIndex={questions.length}
                totalQuestions={questions.length + 1}
                onSubmit={handleOpenSubmit}
              />
            </motion.div>
          )}

          {screen === 'ai-loading' && (
            <motion.div
              key="ai-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <AIThinkingScreen lang={lang} />
            </motion.div>
          )}

          {screen === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <ResultsScreen
                lang={lang}
                resultPersonaId={resultPersonaId}
                aiResult={aiResult}
                aiError={aiError}
                onRetake={handleStart}
                onHRView={() => setScreen('hr-view')}
                onReport={() => setScreen('report')}
              />
            </motion.div>
          )}

          {screen === 'hr-view' && (
            <motion.div
              key="hr-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <HRDashboard
                lang={lang}
                currentUserPersona={resultPersonaId}
                aiResult={aiResult}
                onBack={() => setScreen('results')}
              />
            </motion.div>
          )}

          {screen === 'statistics' && (
            <motion.div
              key="statistics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <StatisticsScreen lang={lang} onBack={() => setScreen('landing')} />
            </motion.div>
          )}

          {screen === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <ContactScreen lang={lang} onBack={() => setScreen('landing')} />
            </motion.div>
          )}

          {screen === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <ReportScreen
                lang={lang}
                resultPersonaId={resultPersonaId}
                aiResult={aiResult}
                userRole={userRole}
                onBack={() => setScreen('results')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
