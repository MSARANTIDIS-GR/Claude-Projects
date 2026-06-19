import { Trophy, RotateCcw } from 'lucide-react';

interface Props {
  bestStreak: number;
  onRestart: () => void;
}

export default function CompletionScreen({ bestStreak, onRestart }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm space-y-8">

        {/* Trophy */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
              <Trophy size={52} className="text-amber-400" strokeWidth={1.5} />
            </div>
            {/* Glow rings */}
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 scale-125 animate-ping" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            75 Days Complete
          </p>
          <h1 className="text-4xl font-black text-white leading-tight">
            You Did<br />The Hard Thing.
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            75 consecutive days. Every single task, every single day. You proved to yourself
            what you're made of.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Days Completed</span>
            <span className="text-emerald-400 font-bold">75 / 75</span>
          </div>
          <div className="h-px bg-gray-800" />
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">All-time Best Streak</span>
            <span className="text-amber-400 font-bold">{Math.max(bestStreak, 75)} days</span>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-orange-950/30 border border-orange-800/30 rounded-2xl p-4">
          <p className="text-orange-300 text-sm leading-relaxed italic">
            "The only way to get to the other side is to go through it."
          </p>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all active:scale-95"
        >
          <RotateCcw size={18} />
          Run It Again
        </button>
      </div>
    </div>
  );
}
