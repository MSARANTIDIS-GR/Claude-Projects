import { Minus, Plus } from 'lucide-react';
import { PAGES_TARGET } from '../utils/challenge';
import { haptic } from '../utils/haptics';

interface Props {
  pages: number;
  onChange: (pages: number) => void;
}

export default function PageCounter({ pages, onChange }: Props) {
  const done = pages >= PAGES_TARGET;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => { haptic(); onChange(Math.max(pages - 1, 0)); }}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-90 transition-all"
      >
        <Minus size={18} />
      </button>
      <div className="flex-1 text-center">
        <span className={`text-2xl font-bold transition-colors duration-300 ${done ? 'text-emerald-400' : 'text-white'}`}>
          {pages}
        </span>
        <span className="text-gray-500 text-lg"> / {PAGES_TARGET}</span>
        <p className="text-xs text-gray-500 mt-0.5">pages</p>
      </div>
      <button
        onClick={() => { haptic(); onChange(pages + 1); }}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-900/40 text-orange-300 hover:bg-orange-900/60 active:scale-90 transition-all"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
