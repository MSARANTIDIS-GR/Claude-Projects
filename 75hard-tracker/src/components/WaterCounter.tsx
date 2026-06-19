import { Minus, Plus } from 'lucide-react';
import { WATER_TARGET_OZ } from '../utils/challenge';
import { haptic } from '../utils/haptics';

interface Props {
  oz: number;
  onChange: (oz: number) => void;
}

const LITERS = (WATER_TARGET_OZ * 0.0295735).toFixed(2);

export default function WaterCounter({ oz, onChange }: Props) {
  const pct = Math.min((oz / WATER_TARGET_OZ) * 100, 100);
  const done = oz >= WATER_TARGET_OZ;

  const add = (amount: number) => { haptic(); onChange(Math.min(oz + amount, WATER_TARGET_OZ + 32)); };
  const sub = (amount: number) => { haptic(); onChange(Math.max(oz - amount, 0)); };

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-blue-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {oz} / {WATER_TARGET_OZ} oz · {(oz * 0.0295735).toFixed(1)} / {LITERS} L
        </span>
        {done && <span className="text-xs text-emerald-400 font-semibold">1 gallon ✓</span>}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => sub(8)}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-95 transition-all text-sm"
        >
          <Minus size={16} /> 8 oz
        </button>
        <button
          onClick={() => add(16)}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-blue-900/50 text-blue-300 hover:bg-blue-900/70 active:scale-95 transition-all text-sm font-medium"
        >
          <Plus size={16} /> 16 oz
        </button>
        <button
          onClick={() => add(8)}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-95 transition-all text-sm"
        >
          <Plus size={16} /> 8 oz
        </button>
      </div>
    </div>
  );
}
