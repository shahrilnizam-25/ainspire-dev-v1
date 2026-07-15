import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import { questions } from './data/questions';

type Screen = 'landing' | 'assessment' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> personaId

  const handleStart = () => {
    setScreen('assessment');
    setCurrentQuestionIdx(0);
    setAnswers({});
  };

  const handleAnswer = (personaId: string) => {
    const questionId = questions[currentQuestionIdx].id;
    setAnswers(prev => ({ ...prev, [questionId]: personaId }));

    if (currentQuestionIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
      }, 600); // Wait for transition after selection
    } else {
      setTimeout(() => {
        setScreen('results');
      }, 600);
    }
  };

  const calculateResult = () => {
    const counts: Record<string, number> = {
      explorer: 0, builder: 0, strategist: 0, visionary: 0
    };
    
    Object.values(answers).forEach((val) => {
      if (counts[val] !== undefined) {
        counts[val]++;
      }
    });

    let maxCount = 0;
    let resultPersona = 'explorer';

    for (const [persona, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        resultPersona = persona;
      }
    }
    
    // Tie breaker: prefer the one that was answered last among ties
    const tiedPersonas = Object.keys(counts).filter(p => counts[p] === maxCount);
    if (tiedPersonas.length > 1) {
      const reversedAnswers = Object.values(answers).reverse();
      for (const ans of reversedAnswers) {
        if (tiedPersonas.includes(ans)) {
          resultPersona = ans;
          break;
        }
      }
    }

    return resultPersona;
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative flex flex-col font-sans overflow-x-hidden">
      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-30" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background opacity-50" />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center min-h-[100dvh] w-full py-8">
        <AnimatePresence mode="wait">
          {screen === 'landing' && (
             <motion.div key="landing" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, scale: 0.95}} transition={{duration: 0.4}} className="w-full flex justify-center">
               <LandingScreen onStart={handleStart} />
             </motion.div>
          )}
          {screen === 'assessment' && (
             <motion.div key="assessment" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, scale: 0.95}} transition={{duration: 0.4}} className="w-full flex justify-center">
               <QuestionScreen 
                  question={questions[currentQuestionIdx]} 
                  currentIndex={currentQuestionIdx}
                  totalQuestions={questions.length}
                  onAnswer={handleAnswer}
               />
             </motion.div>
          )}
          {screen === 'results' && (
             <motion.div key="results" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.4}} className="w-full flex justify-center">
               <ResultsScreen 
                  resultPersonaId={calculateResult()}
                  onRetake={handleStart}
               />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
