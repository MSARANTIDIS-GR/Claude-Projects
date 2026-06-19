import { AlertTriangle, RefreshCw } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface Props {
  currentDay: number;
  onReset: () => void;
}

export default function ResetModal({ currentDay, onReset }: Props) {
  const daysCompleted = currentDay - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-gray-900 border border-red-900/60 rounded-3xl p-6 space-y-6 shadow-2xl shadow-red-900/20 animate-slide-up">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-900/30 border-2 border-red-700/50 flex items-center justify-center">
            <AlertTriangle size={36} className="text-red-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Reset to Day 1</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            You missed completing all 5 tasks yesterday.{' '}
            <strong className="text-red-400">75 Hard has no mercy — that's the point.</strong>
          </p>
          {daysCompleted > 0 && (
            <p className="text-gray-500 text-sm">
              You made it {daysCompleted} day{daysCompleted !== 1 ? 's' : ''} this time.
              That's real. Use it as fuel.
            </p>
          )}
        </div>

        {/* Motivational callout */}
        <div className="bg-orange-950/40 border border-orange-800/40 rounded-2xl p-4">
          <p className="text-orange-300 text-sm font-medium text-center leading-relaxed">
            "It's supposed to be hard. That's why it changes you."
          </p>
        </div>

        {/* Reset button — only way to close */}
        <button
          onClick={() => { haptic('heavy'); onReset(); }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-red-900/40"
        >
          <RefreshCw size={20} strokeWidth={2.5} />
          Start Over — Day 1
        </button>

        <p className="text-center text-xs text-gray-600">
          Your progress photos are preserved.
        </p>
      </div>
    </div>
  );
}
