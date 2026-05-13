/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, User, Cpu } from 'lucide-react';

interface Question {
  problem: string;
  answer: number;
  options: number[];
}

const generateQuestion = (): Question => {
  const operations = ['+', '-'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  
  if (op === '-' && a < b) {
    [a, b] = [b, a];
  }
  
  const answer = op === '+' ? a + b : a - b;
  
  const options = new Set<number>([answer]);
  while (options.size < 3) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const opt = Math.max(0, answer + offset);
    if (opt !== answer || Math.random() > 0.5) {
      options.add(opt);
    }
  }
  
  return {
    problem: `${a} ${op} ${b} = ?`,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};

export default function App() {
  const [ropePosition, setRopePosition] = useState(0); // -100 to 100
  const [leftQuestion, setLeftQuestion] = useState<Question>(generateQuestion());
  const [rightQuestion, setRightQuestion] = useState<Question>(generateQuestion());
  const [gameState, setGameState] = useState<'playing' | 'left_won' | 'right_won'>('playing');
  const [leftPulling, setLeftPulling] = useState(false);
  const [rightPulling, setRightPulling] = useState(false);

  useEffect(() => {
    if (ropePosition >= 80) setGameState('right_won');
    if (ropePosition <= -80) setGameState('left_won');
  }, [ropePosition]);

  const handleAnswer = (side: 'left' | 'right', selected: number) => {
    if (gameState !== 'playing') return;

    const current = side === 'left' ? leftQuestion : rightQuestion;
    
    if (selected === current.answer) {
      // Pull rope towards current side
      if (side === 'left') {
        setRopePosition(prev => Math.max(-100, prev - 15));
        setLeftPulling(true);
        setTimeout(() => setLeftPulling(false), 300);
        setLeftQuestion(generateQuestion());
      } else {
        setRopePosition(prev => Math.min(100, prev + 15));
        setRightPulling(true);
        setTimeout(() => setRightPulling(false), 300);
        setRightQuestion(generateQuestion());
      }
    } else {
      // Penalty: push rope away or just shake
      if (side === 'left') {
        setRopePosition(prev => Math.min(100, prev + 5));
        setLeftQuestion(generateQuestion());
      } else {
        setRopePosition(prev => Math.max(-100, prev - 5));
        setRightQuestion(generateQuestion());
      }
    }
  };

  const restartGame = () => {
    setRopePosition(0);
    setGameState('playing');
    setLeftQuestion(generateQuestion());
    setRightQuestion(generateQuestion());
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-between p-4 font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 mt-2">
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-blue-400">CHAP JAMOASI</span>
          <h2 className="text-lg font-black tracking-widest text-white">MOVIYLAR</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            MATEMATIK JANG
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">Kim kuchliroq bo'lsa o'sha yutadi</div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-red-400">O'NG JAMOASI</span>
          <h2 className="text-lg font-black tracking-widest text-white">QIZILLAR</h2>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center gap-16">
        
        {/* Rope Visualization */}
        <div className="w-full h-80 relative flex items-center justify-center overflow-visible">
          {/* Center Mark Line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-40 bg-white/5 rounded-full z-0"></div>

          {/* Winning Thresholds */}
          <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-1 h-32 bg-blue-500/20 border-l border-dashed border-blue-500/30"></div>
          <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-1 h-32 bg-red-500/20 border-r border-dashed border-red-500/30"></div>

          <motion.div 
            className="absolute w-[200%] flex items-center justify-center"
            animate={{ x: `${-ropePosition * 2.5}%` }}
            transition={{ type: 'spring', stiffness: 40, damping: 12 }}
          >
            {/* Left Player Team */}
            <div className="flex items-center">
              <motion.div 
                className="flex flex-col items-center"
                animate={leftPulling ? { x: [-15, 0], scale: [1.1, 1], rotate: [-15, 0] } : {}}
              >
                {/* Character 1 */}
                <div className="relative w-28 h-40 flex flex-col items-center justify-end">
                   {/* Hair */}
                   <div className="w-14 h-8 bg-slate-800 rounded-t-full absolute top-1 z-20"></div>
                   {/* Head */}
                   <div className="w-14 h-14 bg-orange-200 rounded-full border-2 border-blue-400 absolute top-4 shadow-sm z-10">
                      <div className="flex gap-2 justify-center mt-4">
                         <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                         <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                      </div>
                      <motion.div 
                        animate={leftPulling ? { scale: [1, 1.5, 1] } : {}}
                        className="w-4 h-2 border-b-2 border-slate-900 rounded-full mx-auto mt-1"
                      ></motion.div>
                   </div>
                   {/* Body/Shirt */}
                   <div className="w-20 h-24 bg-blue-600 rounded-t-3xl flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] border-4 border-blue-400 overflow-hidden relative z-0">
                      <div className="absolute inset-0 bg-blue-400/20 mix-blend-overlay"></div>
                      <div className="font-black text-2xl">01</div>
                   </div>
                   {/* Arms */}
                   <motion.div 
                     animate={leftPulling ? { rotate: [0, -40, 0] } : {}}
                     className="absolute w-28 h-4 bg-blue-500 top-20 -right-8 rounded-full origin-left z-20 border-b-2 border-blue-700 shadow-md"
                   >
                     {/* Hand */}
                     <div className="w-6 h-6 bg-orange-200 rounded-full absolute -right-2 top-1/2 -translate-y-1/2 border-2 border-blue-900/10 shadow-sm"></div>
                   </motion.div>
                   {/* Legs */}
                   <div className="flex gap-4 absolute -bottom-4">
                      <div className="w-6 h-6 bg-slate-800 rounded-b-lg"></div>
                      <div className="w-6 h-6 bg-slate-800 rounded-b-lg"></div>
                   </div>
                </div>
                <div className="mt-8 font-black text-blue-400 text-sm tracking-widest uppercase bg-blue-500/10 px-4 py-1 rounded-full">MOVIYLAR</div>
              </motion.div>
              
              <div className="h-8 w-96 bg-amber-900 border-y-4 border-amber-950/40 relative shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-30"></div>
                <div className="absolute inset-0 flex justify-around">
                   {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-full bg-black/20"></div>)}
                </div>
              </div>
            </div>

            {/* Tie-Mark */}
            <motion.div 
              animate={{ rotate: [-8, 8] }}
              transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
              className="w-16 h-16 bg-red-600 flex items-center justify-center rounded-2xl shadow-2xl relative z-30 border-4 border-white"
            >
               <div className="w-1.5 h-24 bg-red-600 absolute -top-20 rounded-full border-t border-white/30 shadow-lg"></div>
               <div className="w-4 h-4 bg-white rounded-full"></div>
            </motion.div>

            {/* Right Player Team */}
            <div className="flex items-center">
              <div className="h-8 w-96 bg-amber-900 border-y-4 border-amber-950/40 relative shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-30"></div>
                <div className="absolute inset-0 flex justify-around">
                   {[...Array(12)].map((_, i) => <div key={i} className="w-2 h-full bg-black/20"></div>)}
                </div>
              </div>

              <motion.div 
                className="flex flex-col items-center"
                animate={rightPulling ? { x: [15, 0], scale: [1.1, 1], rotate: [15, 0] } : {}}
              >
                {/* Character 1 */}
                <div className="relative w-28 h-40 flex flex-col items-center justify-end">
                   {/* Hair */}
                   <div className="w-14 h-8 bg-slate-800 rounded-t-full absolute top-1 z-20"></div>
                   {/* Head */}
                   <div className="w-14 h-14 bg-orange-200 rounded-full border-2 border-red-400 absolute top-4 shadow-sm z-10">
                      <div className="flex gap-2 justify-center mt-4">
                         <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                         <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                      </div>
                      <motion.div 
                        animate={rightPulling ? { scale: [1, 1.5, 1] } : {}}
                        className="w-4 h-2 border-b-2 border-slate-900 rounded-full mx-auto mt-1"
                      ></motion.div>
                   </div>
                   {/* Body/Shirt */}
                   <div className="w-20 h-24 bg-red-600 rounded-t-3xl flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] border-4 border-red-400 overflow-hidden relative z-0">
                      <div className="absolute inset-0 bg-red-400/20 mix-blend-overlay"></div>
                      <div className="font-black text-2xl">02</div>
                   </div>
                   {/* Arms */}
                   <motion.div 
                     animate={rightPulling ? { rotate: [0, 40, 0] } : {}}
                     className="absolute w-28 h-4 bg-red-500 top-20 -left-8 rounded-full origin-right z-20 border-b-2 border-red-700 shadow-md"
                   >
                     {/* Hand */}
                     <div className="w-6 h-6 bg-orange-200 rounded-full absolute -left-2 top-1/2 -translate-y-1/2 border-2 border-red-900/10 shadow-sm"></div>
                   </motion.div>
                   {/* Legs */}
                   <div className="flex gap-4 absolute -bottom-4">
                      <div className="w-6 h-6 bg-slate-800 rounded-b-lg"></div>
                      <div className="w-6 h-6 bg-slate-800 rounded-b-lg"></div>
                   </div>
                </div>
                <div className="mt-8 font-black text-red-400 text-sm tracking-widest uppercase bg-red-500/10 px-4 py-1 rounded-full">QIZILLAR</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Question Controls */}
        <div className="w-full max-w-6xl flex justify-between gap-8 px-4 mb-8">
          
          {/* Left Controls */}
          <div className="flex-1 flex flex-col items-center">
             <div className="w-full bg-blue-600/10 p-6 rounded-[2.5rem] border-2 border-blue-500/20 flex flex-col gap-6">
                <div className="text-4xl font-black text-center text-blue-400 bg-blue-500/10 py-4 rounded-2xl border-b-4 border-blue-500/30">
                  {leftQuestion.problem}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {leftQuestion.options.map((opt, i) => (
                    <button 
                      key={i}
                      disabled={gameState !== 'playing'}
                      onClick={() => handleAnswer('left', opt)}
                      className="bg-blue-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg border-b-4 border-blue-800 disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="bg-white/10 w-px h-full"></div>
            <div className="h-12 w-12 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center font-black text-sm text-white/40 my-4 z-10">VS</div>
            <div className="bg-white/10 w-px h-full"></div>
          </div>

          {/* Right Controls */}
          <div className="flex-1 flex flex-col items-center">
             <div className="w-full bg-red-600/10 p-6 rounded-[2.5rem] border-2 border-red-500/20 flex flex-col gap-6">
                <div className="text-4xl font-black text-center text-red-400 bg-red-500/10 py-4 rounded-2xl border-b-4 border-red-500/30">
                  {rightQuestion.problem}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {rightQuestion.options.map((opt, i) => (
                    <button 
                      key={i}
                      disabled={gameState !== 'playing'}
                      onClick={() => handleAnswer('right', opt)}
                      className="bg-red-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-red-500 transition-all active:scale-95 shadow-lg border-b-4 border-red-800 disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Result Overlay */}
      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className={`p-12 rounded-[3.5rem] text-center border-8 shadow-2xl ${
                gameState === 'left_won' ? 'bg-blue-600/20 border-blue-500 shadow-blue-500/50' : 'bg-red-600/20 border-red-500 shadow-red-500/50'
              }`}
            >
              <div className="flex justify-center mb-6">
                <Trophy size={120} className={gameState === 'left_won' ? 'text-blue-400' : 'text-red-400'} />
              </div>
              <h2 className="text-6xl font-black text-white mb-4 uppercase tracking-tighter italic">
                {gameState === 'left_won' ? 'MOVİYLAR YUTDI!' : 'QIZILLAR YUTDI!'}
              </h2>
              <p className="text-xl text-white/70 mb-10 font-bold uppercase tracking-widest">
                Matematika shohi {gameState === 'left_won' ? 'Chap' : 'O\'ng'} jamoa bo'ldi!
              </p>
              
              <button 
                onClick={restartGame}
                className="px-16 py-6 bg-white text-slate-950 rounded-3xl font-black text-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto"
              >
                <RefreshCw size={28} /> QAYTA O'YNASH
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


