import { Flame, Dumbbell, Droplets, BookOpen, Camera, Leaf } from 'lucide-react';

interface Props {
  bestStreak: number;
  onStart: () => void;
}

const rules = [
  { icon: <Leaf size={18} />, text: 'Follow a diet — no alcohol, no cheat meals' },
  { icon: <Dumbbell size={18} />, text: 'Two 45-min workouts — at least one outdoor' },
  { icon: <Droplets size={18} />, text: 'Drink 1 gallon (3.78 L) of water' },
  { icon: <BookOpen size={18} />, text: 'Read 10 pages of non-fiction' },
  { icon: <Camera size={18} />, text: 'Take a daily progress photo' },
];

export default function StartScreen({ bestStreak, onStart }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Flame size={40} className="text-orange-400" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">75 Hard</h1>
          <p className="text-gray-400 text-sm">The mental toughness program.</p>
        </div>

        {/* Rules */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
            Every. Single. Day.
          </p>
          {rules.map((r, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-orange-400 shrink-0 mt-0.5">{r.icon}</span>
              <p className="text-sm text-gray-300 leading-snug">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Reset warning */}
        <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3">
          <p className="text-red-400 text-sm text-center font-medium">
            Miss any task on any day → RESET to Day 1
          </p>
        </div>

        {bestStreak > 0 && (
          <p className="text-center text-gray-500 text-sm">
            Best streak: <span className="text-orange-400 font-bold">{bestStreak} days</span>
          </p>
        )}

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-orange-900/40"
        >
          Begin the Challenge
        </button>
      </div>
    </div>
  );
}
