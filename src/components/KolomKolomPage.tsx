import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { KolomCanvas } from './kolom/KolomCanvas';
import { KolomScoreBoard } from './kolom/KolomScoreBoard';
import { KolomPenSelectorModal } from './kolom/KolomPenSelectorModal';
import { KolomRulesModal } from './kolom/KolomRulesModal';
import { GameMode, AIDifficulty, PenConfig, TableTheme, AimControlMode } from '../types/kolomGame';
import { DEFAULT_PLAYER1_PEN, DEFAULT_PLAYER2_PEN } from '../utils/kolomPens';
import {
  setSoundMuted,
  getSoundMuted,
  playVictorySound,
  playRoundLossSound,
} from '../utils/kolomSoundEffects';
import { Trophy, RotateCcw, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

export const KolomKolomPage: React.FC = () => {
  // Game Setup & Configurations
  const [gameMode, setGameMode] = useState<GameMode>('vs-computer');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
  const [tableTheme, setTableTheme] = useState<TableTheme>(() => {
    return (localStorage.getItem('kolom_table_theme') as TableTheme) || 'scratched-wood';
  });
  const [aimMode, setAimMode] = useState<AimControlMode>(() => {
    return (localStorage.getItem('kolom_aim_mode') as AimControlMode) || 'slingshot';
  });
  const [player1Pen, setPlayer1Pen] = useState<PenConfig>(DEFAULT_PLAYER1_PEN);
  const [player2Pen, setPlayer2Pen] = useState<PenConfig>(DEFAULT_PLAYER2_PEN);

  // Score & Round States
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const maxRounds = 3; // Best of 3 (first to 2 wins)

  // Turn & Physics Simulation
  const [currentTurn, setCurrentTurn] = useState<'player1' | 'player2'>('player1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [roundStateKey, setRoundStateKey] = useState(1);

  // Modals & Banners
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPenSelectOpen, setIsPenSelectOpen] = useState(false);
  const [isMuted, setIsMutedState] = useState(getSoundMuted());
  const [roundWinnerBanner, setRoundWinnerBanner] = useState<string | null>(null);
  const [matchWinner, setMatchWinner] = useState<'player1' | 'player2' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Strictly enforce NOINDEX, NOFOLLOW as requested by user
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'কলম-কলম (Pen Fight) — ছোটবেলার স্কুলের বেঞ্চের খেলা';

    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let createdRobots = false;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
      createdRobots = true;
    }
    const previousRobots = robotsMeta.content;
    robotsMeta.content = 'noindex, nofollow';

    return () => {
      document.title = originalTitle;
      if (createdRobots && robotsMeta?.parentNode) {
        robotsMeta.parentNode.removeChild(robotsMeta);
      } else if (robotsMeta) {
        robotsMeta.content = previousRobots || 'index, follow';
      }
    };
  }, []);

  // Sound toggle
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setSoundMuted(nextMuted);
    setIsMutedState(nextMuted);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Reset entire match
  const handleResetMatch = useCallback(() => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentRound(1);
    setCurrentTurn('player1');
    setIsSimulating(false);
    setRoundWinnerBanner(null);
    setMatchWinner(null);
    setRoundStateKey((k) => k + 1);
  }, []);

  // Mode change
  const handleChangeMode = (mode: GameMode) => {
    if (mode === gameMode) return;
    setGameMode(mode);
    handleResetMatch();
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#10b981'],
    });
  };

  // Handle Turn End and detect winners
  const handleTurnEnd = useCallback(
    (fallenPen: 'player1' | 'player2' | 'both' | null) => {
      if (!fallenPen) {
        // No pen fell off table, switch turns
        setCurrentTurn((prev) => (prev === 'player1' ? 'player2' : 'player1'));
        return;
      }

      // Someone fell off!
      const neededToWin = Math.ceil(maxRounds / 2); // 2 in Best of 3
      let nextP1Score = player1Score;
      let nextP2Score = player2Score;
      let winnerName = '';

      if (fallenPen === 'player2') {
        // Player 1 scores!
        nextP1Score += 1;
        setPlayer1Score(nextP1Score);
        winnerName = 'প্লেয়ার ১ এই রাউন্ড জিতেছে! 🏆';
        setRoundWinnerBanner(winnerName);
        playVictorySound();
        triggerConfetti();
      } else if (fallenPen === 'player1') {
        // Player 2 scores!
        nextP2Score += 1;
        setPlayer2Score(nextP2Score);
        winnerName = `${gameMode === 'vs-computer' ? 'কম্পিউটার' : 'প্লেয়ার ২'} এই রাউন্ড জিতেছে!`;
        setRoundWinnerBanner(winnerName);
        if (gameMode === 'vs-computer') {
          playRoundLossSound();
        } else {
          playVictorySound();
        }
      } else {
        // Both fell off (Draw)
        setRoundWinnerBanner('উভয় কলমই টেবিল থেকে পড়ে গেছে! (রাউন্ড ড্র)');
      }

      // Check Match Winner
      if (nextP1Score >= neededToWin) {
        setTimeout(() => {
          setMatchWinner('player1');
          triggerConfetti();
        }, 1200);
      } else if (nextP2Score >= neededToWin) {
        setTimeout(() => {
          setMatchWinner('player2');
          if (gameMode !== 'vs-computer') triggerConfetti();
        }, 1200);
      } else {
        // Continue to Next Round after short delay
        setTimeout(() => {
          setRoundWinnerBanner(null);
          setCurrentRound((r) => r + 1);
          setRoundStateKey((k) => k + 1);
          // Alternate starting turn on next round
          setCurrentTurn(currentRound % 2 === 0 ? 'player1' : 'player2');
        }, 2200);
      }
    },
    [currentRound, gameMode, maxRounds, player1Score, player2Score]
  );

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-between px-3 sm:px-6 py-4 sm:py-6 overflow-x-hidden font-['Hind_Siliguri',sans-serif] selection:bg-amber-500 selection:text-white"
      style={{
        backgroundColor: '#1c1917', // Dark wood classroom vibe
        backgroundImage: 'radial-gradient(#44281d 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* Background Chalkboard & Wooden Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 rounded-full pointer-events-none blur-3xl opacity-20 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(180, 83, 9, 0.1) 60%, transparent 80%)',
        }}
      />

      {/* Main Game Container */}
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center flex-1 my-auto space-y-4">
        
        {/* Header Title & Nostalgic Tagline */}
        <header className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-semibold shadow-xs">
            <Sparkles size={12} className="text-amber-400" />
            <span>ছোটবেলার ক্লাসরুমের স্মৃতি</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-100 tracking-tight drop-shadow-md">
            কলম-কলম <span className="text-amber-500 text-2xl sm:text-3xl font-bold">(Pen Fight)</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            স্কুলের কাঠের বেঞ্চে কলম ফ্লিক করে প্রতিপক্ষের কলমকে নিচে ফেলে দেওয়ার লড়াই!
          </p>
        </header>

        {/* Scoreboard and Action Bar */}
        <KolomScoreBoard
          player1Score={player1Score}
          player2Score={player2Score}
          currentRound={currentRound}
          maxRounds={maxRounds}
          currentTurn={currentTurn}
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          tableTheme={tableTheme}
          aimMode={aimMode}
          player1Pen={player1Pen}
          player2Pen={player2Pen}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onResetMatch={handleResetMatch}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenPenSelect={() => setIsPenSelectOpen(true)}
          onChangeMode={handleChangeMode}
          onChangeDifficulty={setAiDifficulty}
          onChangeAimMode={(m) => {
            setAimMode(m);
            try {
              localStorage.setItem('kolom_aim_mode', m);
            } catch {}
          }}
          onChangeTableTheme={(t) => {
            setTableTheme(t);
            try {
              localStorage.setItem('kolom_table_theme', t);
            } catch {}
          }}
        />

        {/* Round Winner Notification Banner */}
        {roundWinnerBanner && !matchWinner && (
          <div className="w-full max-w-lg p-2.5 rounded-2xl bg-amber-500 text-stone-950 font-black text-center text-sm sm:text-base animate-bounce shadow-xl border-2 border-white/20">
            {roundWinnerBanner}
          </div>
        )}

        {/* 60FPS Physics Wooden Table Canvas */}
        <KolomCanvas
          player1Pen={player1Pen}
          player2Pen={player2Pen}
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          tableTheme={tableTheme}
          aimMode={aimMode}
          currentTurn={currentTurn}
          isSimulating={isSimulating}
          roundStateKey={roundStateKey}
          onTurnEnd={handleTurnEnd}
          onSimulationChange={setIsSimulating}
        />

        {/* Controls Footer */}
        <div className="flex flex-wrap items-center justify-between w-full max-w-5xl gap-2 pt-1 text-xs text-stone-400 px-2">
          <div>
            <span>
              💡 <strong>টিপ:</strong>{' '}
              {aimMode === 'slingshot'
                ? 'কলমে চেপে পেছনের দিকে টেনে (Slingshot) ছেড়ে দিন — সামনের উজ্জ্বল তীরে লক্ষ্য স্থির হবে।'
                : 'কলমে চেপে সরাসরি যেদিকে মারবেন সেদিকে টেনে ছেড়ে দিন (Direct Aim)।'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isFullscreen ? 'ফুলস্ক্রিন বন্ধ' : 'ফুলস্ক্রিন'}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              নিয়ম ও সহায়িকা
            </button>
          </div>
        </div>

      </main>

      {/* Match Victory Dialog Modal */}
      {matchWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-['Hind_Siliguri',sans-serif]">
          <div className="w-full max-w-md bg-stone-900 border-4 border-amber-500 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-lg">
              <Trophy size={36} className="animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-200">
              {matchWinner === 'player1'
                ? '🎉 অভিনন্দন! প্লেয়ার ১ চ্যাম্পিয়ন!'
                : gameMode === 'vs-computer'
                ? '🤖 কম্পিউটার ম্যাচ জিতেছে!'
                : '🎉 অভিনন্দন! প্লেয়ার ২ চ্যাম্পিয়ন!'}
            </h2>

            <p className="text-sm text-stone-300">
              ফাইনাল স্কোর: প্লেয়ার ১ <span className="font-bold text-sky-400">{player1Score}</span> —{' '}
              <span className="font-bold text-rose-400">{player2Score}</span>{' '}
              {gameMode === 'vs-computer' ? 'কম্পিউটার' : 'প্লেয়ার ২'}
            </p>

            <div className="pt-3">
              <button
                onClick={handleResetMatch}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-base shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>আবার খেলুন (Rematch)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pen Selection Modal */}
      <KolomPenSelectorModal
        isOpen={isPenSelectOpen}
        onClose={() => setIsPenSelectOpen(false)}
        player1Pen={player1Pen}
        player2Pen={player2Pen}
        onSelectP1Pen={setPlayer1Pen}
        onSelectP2Pen={setPlayer2Pen}
        gameMode={gameMode}
      />

      {/* Rules Modal */}
      <KolomRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

    </div>
  );
};
