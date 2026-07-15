import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import QuestionScreen from './components/QuestionScreen';
import OpenQuestionScreen from './components/OpenQuestionScreen';
import AIThinkingScreen from './components/AIThinkingScreen';
import ResultsScreen from './components/ResultsScreen';
import HRDashboard from './components/HRDashboard';
import { questions, openQuestion } from './data/questions';
import type { Option } from './data/questions';

type Screen = 'landing' | 'assessment' | 'open-question' | 'ai-loading' | 'results' | 'hr-view';

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

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<MCQAnswer[]>([]);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const handleOpenSubmit = async (freeText: string) => {
    setScreen('ai-loading');

    const answers = [
      ...mcqAnswers,
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
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AIResult = await res.json();
      setAiResult(data);
      setScreen('results');
    } catch (err) {
      console.error('Classification error:', err);
      setAiError(String(err));
      setAiResult(null);
      setScreen('results'); // Fall back to rule-based result
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
              <LandingScreen onStart={handleStart} />
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
                question={questions[currentQuestionIdx]}
                currentIndex={currentQuestionIdx}
                totalQuestions={questions.length + 1} // +1 for open question
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
              <AIThinkingScreen />
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
                resultPersonaId={resultPersonaId}
                aiResult={aiResult}
                aiError={aiError}
                onRetake={handleStart}
                onHRView={() => setScreen('hr-view')}
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
                currentUserPersona={resultPersonaId}
                aiResult={aiResult}
                onBack={() => setScreen('results')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
