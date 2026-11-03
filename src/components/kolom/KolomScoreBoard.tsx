import React from 'react';
import { GameMode, PenConfig, AIDifficulty, TableTheme, AimControlMode } from '../../types/kolomGame';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Users, Bot, Palette, Crosshair, Sparkles } from 'lucide-react';

interface KolomScoreBoardProps {
  player1Score: number;
  player2Score: number;
  currentRound: number;
  maxRounds: number;
  currentTurn: 'player1' | 'player2';
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  tableTheme: TableTheme;
  aimMode: AimControlMode;
  player1Pen: PenConfig;
  player2Pen: PenConfig;
  isMuted: boolean;
  onToggleSound: () => void;
  onResetMatch: () => void;
  onOpenRules: () => void;
  onOpenPenSelect: () => void;
  onChangeMode: (mode: GameMode) => void;
  onChangeDifficulty: (difficulty: AIDifficulty) => void;
  onChangeTableTheme: (theme: TableTheme) => void;
  onChangeAimMode: (mode: AimControlMode) => void;
}

export const KolomScoreBoard: React.FC<KolomScoreBoardProps> = ({
  player1Score,
  player2Score,
  currentRound,
  maxRounds,
  currentTurn,
  gameMode,
  aiDifficulty,
  tableTheme,
  aimMode,
  player1Pen,
  player2Pen,
  isMuted,
  onToggleSound,
  onResetMatch,
  onOpenRules,
  onOpenPenSelect,
  onChangeMode,
  onChangeDifficulty,
  onChangeTableTheme,
  onChangeAimMode,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-3 font-['Hind_Siliguri',sans-serif]">
      {/* Top Main Score & Control Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl backdrop-blur-md">
        
        {/* Left Pill: You Score · Opponent Score */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/90 border border-stone-700/60 shadow-inner text-sm text-stone-200">
          <span className="font-bold text-amber-200">আপনি (You)</span>
          <span className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center font-mono shadow-md">
            {player1Score}
          </span>
          <span className="text-stone-500 font-bold">•</span>
          <span className="font-bold text-sky-200">
            {gameMode === 'vs-computer' ? 'কম্পিউটার' : 'প্লেয়ার ২'}
          </span>
          <span className="w-7 h-7 rounded-full bg-sky-400 text-stone-950 font-black text-sm flex items-center justify-center font-mono shadow-md">
            {player2Score}
          </span>
        </div>

        {/* Center Pill: Current Turn Status */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/90 border border-stone-700/60 shadow-inner text-sm font-bold">
          <span
            className={`w-3 h-3 rounded-full animate-pulse ${
              currentTurn === 'player1' ? 'bg-amber-400' : 'bg-sky-400'
            }`}
          />
          <span className={currentTurn === 'player1' ? 'text-amber-300' : 'text-sky-300'}>
            {currentTurn === 'player1'
              ? 'আপনার চাল (Your Turn)'
              : gameMode === 'vs-computer'
              ? 'কম্পিউটারের চাল (AI Turn)'
              : 'প্লেয়ার ২ এর চাল'}
          </span>
        </div>

        {/* Right Controls: Aim Mode, Pen Picker, Sound, Reset, Rules */}
        <div className="flex items-center gap-1.5">
          {/* Aim Mode Switcher (Slingshot vs Direct Aim) */}
          <button
            onClick={() => onChangeAimMode(aimMode === 'slingshot' ? 'direct' : 'slingshot')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/80 hover:bg-stone-800 border border-stone-700/60 text-stone-200 text-xs font-semibold transition-all cursor-pointer"
            title="লক্ষ্য করার মোড পরিবর্তন করুন"
          >
            <Crosshair size={13} className="text-amber-400" />
            <span className="hidden sm:inline">
              {aimMode === 'slingshot' ? 'স্লিংশট টান' : 'ডিরেক্ট লক্ষ্য'}
            </span>
          </button>

          {/* Pen Picker Button */}
          <button
            onClick={onOpenPenSelect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/80 hover:bg-stone-800 border border-stone-700/60 text-stone-200 text-xs font-semibold transition-all cursor-pointer"
            title="কলম পরিবর্তন করুন"
          >
            <Palette size={13} className="text-sky-400" />
            <span className="hidden sm:inline">কলম পছন্দ</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                : 'bg-stone-950/80 border-stone-700/60 text-stone-200 hover:text-white'
            }`}
            title={isMuted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Reset Match */}
          <button
            onClick={onResetMatch}
            className="p-2 rounded-full bg-stone-950/80 hover:bg-stone-800 border border-stone-700/60 text-stone-200 hover:text-white transition-all cursor-pointer"
            title="নতুন ম্যাচ শুরু করুন"
          >
            <RotateCcw size={14} />
          </button>

          {/* Rules Modal */}
          <button
            onClick={onOpenRules}
            className="p-2 rounded-full bg-stone-950/80 hover:bg-stone-800 border border-stone-700/60 text-stone-200 hover:text-white transition-all cursor-pointer"
            title="খেলার আসল নিয়ম"
          >
            <HelpCircle size={14} />
          </button>
        </div>

      </div>

      {/* Sub Bar: Mode Switcher & Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-stone-900/60 border border-stone-800/80 text-xs text-stone-300">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onChangeMode('vs-computer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
              gameMode === 'vs-computer'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Bot size={13} />
            <span>কম্পিউটারের সাথে (vs AI)</span>
          </button>

          <button
            onClick={() => onChangeMode('pass-and-play')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
              gameMode === 'pass-and-play'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Users size={13} />
            <span>২ জন বন্ধু (2 Players)</span>
          </button>

          {gameMode === 'vs-computer' && (
            <div className="flex items-center gap-1 ml-2 text-stone-400 bg-stone-950/60 px-2 py-0.5 rounded-md border border-stone-800">
              <span>লেভেল:</span>
              <select
                value={aiDifficulty}
                onChange={(e) => onChangeDifficulty(e.target.value as AIDifficulty)}
                aria-label="AI ডিফিকাল্টি"
                className="bg-transparent text-amber-300 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="easy" className="bg-stone-900 text-white">সহজ (Easy)</option>
                <option value="medium" className="bg-stone-900 text-white">স্বাভাবিক (Medium)</option>
                <option value="pro" className="bg-stone-900 text-white">প্রো (Pro AI)</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-stone-400">
          <span>রাউন্ড {currentRound} (সেরা {Math.ceil(maxRounds / 2)} জয়)</span>
          <span>•</span>
          <span className="text-amber-300 font-semibold">
            🖋️ {player1Pen.name} বনাম {player2Pen.name}
          </span>
        </div>
      </div>

      {/* DEDICATED TABLE / BENCH CHANGER BAR (Requested by user: "নিচের টেবিল চেঞ্জ করার অপশনও থাকতে হবে") */}
      <div className="p-2.5 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-md">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-400" />
            <span>টেবিলের ধরন নির্বাচন করুন (Select Bench Style):</span>
          </span>
          <span className="text-[11px] text-stone-400">
            {tableTheme === 'scratched-wood' && 'স্কুলের দাগওয়ালা পুরোনো বেঞ্চ (কম্পাসের দাগ ও কালির ফোঁটা)'}
            {tableTheme === 'green-board' && 'সবুজ ক্লাসরুম বেঞ্চ (পেইন্ট ওঠা ও চক ডাস্ট)'}
            {tableTheme === 'dark-teak' && 'গাঢ় সেগুন কাঠের ডেস্ক (স্বাভাবিক কাঠের টেক্সচার)'}
            {tableTheme === 'notebook-desk' && 'খাতা ও মার্জিন পেপারের টেবিল (বাংলা খাতার মার্জিন ও কাটাকাটি)'}
            {tableTheme === 'science-lab' && 'ল্যাবরেটরি স্লেট ডেস্ক (ডার্ক স্টোন ফিনিশ)'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* 1. Scratched Wood */}
          <button
            onClick={() => onChangeTableTheme('scratched-wood')}
            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
              tableTheme === 'scratched-wood'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <span className="text-base">🪵</span>
            <div className="truncate">
              <div className="truncate">দাগওয়ালা কাঠের বেঞ্চ</div>
              <div className="text-[10px] text-stone-500 font-normal">আসল ক্লাসরুম ফিল</div>
            </div>
          </button>

          {/* 2. Green Board */}
          <button
            onClick={() => onChangeTableTheme('green-board')}
            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
              tableTheme === 'green-board'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <span className="text-base">🏫</span>
            <div className="truncate">
              <div className="truncate">সবুজ ক্লাসরুম ডেস্ক</div>
              <div className="text-[10px] text-stone-500 font-normal">চক ও পেন দাগ</div>
            </div>
          </button>

          {/* 3. Dark Teak */}
          <button
            onClick={() => onChangeTableTheme('dark-teak')}
            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
              tableTheme === 'dark-teak'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <span className="text-base">🌲</span>
            <div className="truncate">
              <div className="truncate">গাঢ় সেগুন কাঠ</div>
              <div className="text-[10px] text-stone-500 font-normal">প্রাকৃতিক কাঠের আঁশ</div>
            </div>
          </button>

          {/* 4. Notebook Desk */}
          <button
            onClick={() => onChangeTableTheme('notebook-desk')}
            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
              tableTheme === 'notebook-desk'
                ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <span className="text-base">📝</span>
            <div className="truncate">
              <div className="truncate">খাতা ও মার্জিন পেপার</div>
              <div className="text-[10px] text-stone-500 font-normal">রুল খাতার পাতা</div>
            </div>
          </button>

          {/* 5. Science Lab */}
          <button
            onClick={() => onChangeTableTheme('science-lab')}
            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer col-span-2 sm:col-span-1 ${
              tableTheme === 'science-lab'
                ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <span className="text-base">🔬</span>
            <div className="truncate">
              <div className="truncate">ল্যাবরেটরি স্লেট</div>
              <div className="text-[10px] text-stone-500 font-normal">ডার্ক স্লেট স্টোন</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
