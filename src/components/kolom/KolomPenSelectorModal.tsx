import React from 'react';
import { PenConfig, GameMode } from '../../types/kolomGame';
import { PEN_DATABASE } from '../../utils/kolomPens';
import { X, Check, Shield, Zap, Anchor } from 'lucide-react';

interface KolomPenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  player1Pen: PenConfig;
  player2Pen: PenConfig;
  onSelectP1Pen: (pen: PenConfig) => void;
  onSelectP2Pen: (pen: PenConfig) => void;
  gameMode: GameMode;
}

export const KolomPenSelectorModal: React.FC<KolomPenSelectorModalProps> = ({
  isOpen,
  onClose,
  player1Pen,
  player2Pen,
  onSelectP1Pen,
  onSelectP2Pen,
  gameMode,
}) => {
  const [activeTab, setActiveTab] = React.useState<'player1' | 'player2'>('player1');

  if (!isOpen) return null;

  const currentSelected = activeTab === 'player1' ? player1Pen : player2Pen;
  const onSelect = activeTab === 'player1' ? onSelectP1Pen : onSelectP2Pen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-['Hind_Siliguri',sans-serif]">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/40">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-200">
              🖋️ কলম নির্বাচন ও পাওয়ার
            </h2>
            <p className="text-xs sm:text-sm text-amber-400/80">
              ছোটবেলার পছন্দের কলম বেছে নিন—একেকটার ওজন ও গতি ভিন্ন!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher: Player 1 vs Player 2 */}
        <div className="flex items-center gap-2 my-4 p-1 rounded-xl bg-black/50 border border-amber-900/40">
          <button
            onClick={() => setActiveTab('player1')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'player1'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            প্লেয়ার ১ এর কলম ({player1Pen.name})
          </button>

          <button
            onClick={() => setActiveTab('player2')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'player2'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {gameMode === 'vs-computer' ? 'কম্পিউটার' : 'প্লেয়ার ২'} এর কলম ({player2Pen.name})
          </button>
        </div>

        {/* Pens Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
          {PEN_DATABASE.map((pen) => {
            const isSelected = currentSelected.id === pen.id;

            return (
              <div
                key={pen.id}
                onClick={() => onSelect(pen)}
                className={`relative flex flex-col justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                    : 'bg-stone-800/60 border-stone-700/60 hover:border-amber-700 hover:bg-stone-800'
                }`}
              >
                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 p-1 rounded-full bg-amber-400 text-stone-900 shadow-xs">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                )}

                {/* Pen Title & Tagline */}
                <div>
                  <h3 className="font-extrabold text-base text-amber-100 flex items-center gap-1.5">
                    <span
                      className="inline-block w-3 h-3 rounded-full shadow-xs"
                      style={{ backgroundColor: pen.color }}
                    />
                    {pen.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {pen.tagline}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                    {pen.description}
                  </p>
                </div>

                {/* Visual Stats Indicators */}
                <div className="space-y-1.5 mt-3 pt-2.5 border-t border-stone-700/50 text-[11px]">
                  {/* Weight */}
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1">
                      <Anchor size={11} className="text-amber-400" />
                      ওজন (Mass)
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-3.5 h-1.5 rounded-full ${
                            lvl <= pen.weight ? 'bg-amber-400' : 'bg-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Speed */}
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1">
                      <Zap size={11} className="text-sky-400" />
                      গতি (Speed)
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-3.5 h-1.5 rounded-full ${
                            lvl <= pen.speed ? 'bg-sky-400' : 'bg-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Slide / Friction */}
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1">
                      <Shield size={11} className="text-emerald-400" />
                      গ্রিপ / স্থায়িত্ব
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-3.5 h-1.5 rounded-full ${
                            lvl <= pen.friction ? 'bg-emerald-400' : 'bg-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Button */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm transition-all shadow-md cursor-pointer"
          >
            সম্পন্ন করুন (Confirm)
          </button>
        </div>

      </div>
    </div>
  );
};
