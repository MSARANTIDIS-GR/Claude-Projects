import { useState } from 'react';
import { X, Download, RefreshCw, AlertTriangle, Trophy } from 'lucide-react';
import type { ChallengeState } from '../types';
import { formatDate } from '../utils/dates';
import { haptic } from '../utils/haptics';

interface Props {
  open: boolean;
  onClose: () => void;
  state: ChallengeState;
  onReset: () => void;
}

function exportData(state: ChallengeState) {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `75hard-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function SettingsSheet({ open, onClose, state, onReset }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  const completedDays = Object.values(state.days).filter(d => d.completed).length;
  const photosCount = Object.values(state.days).filter(d => d.photoTaken).length;

  function handleReset() {
    haptic('heavy');
    onReset();
    setConfirmReset(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end animate-fade-in"
      onClick={() => { onClose(); setConfirmReset(false); }}
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg mx-auto bg-gray-900 border border-gray-700 rounded-t-3xl pb-safe animate-sheet-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="text-white font-bold text-lg">Settings</h3>
          <button
            onClick={() => { haptic(); onClose(); setConfirmReset(false); }}
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Challenge info */}
          <div className="bg-gray-800 rounded-2xl p-4 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Challenge</p>
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Started" value={state.challengeStartDate ? formatDate(state.challengeStartDate) : '—'} />
              <InfoItem label="Day" value={`${state.currentDay} / 75`} />
              <InfoItem label="Completed" value={`${completedDays} days`} />
              <InfoItem label="Photos" value={`${photosCount} taken`} />
            </div>
            {state.bestStreak > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-xs text-gray-400">
                  Best streak: <span className="text-amber-400 font-bold">{state.bestStreak} days</span>
                </span>
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={() => { haptic(); exportData(state); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all active:scale-95"
          >
            <Download size={16} />
            Export Data as JSON
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">Danger Zone</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Manual reset */}
          {!confirmReset ? (
            <button
              onClick={() => { haptic('medium'); setConfirmReset(true); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-950/50 hover:bg-red-950/70 border border-red-900/50 text-red-400 text-sm font-medium transition-all active:scale-95"
            >
              <RefreshCw size={16} />
              Manual Reset to Day 1
            </button>
          ) : (
            <div className="space-y-2 animate-slide-up">
              <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-3 flex gap-2">
                <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-300 text-xs leading-relaxed">
                  This resets your current run. Your photos are kept. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { haptic(); setConfirmReset(false); }}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm font-medium active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold active:scale-95 transition-all"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}
