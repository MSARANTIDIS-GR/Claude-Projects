import { useState } from 'react';
import { CheckCircle2, XCircle, Lock, Leaf, Dumbbell, Droplets, BookOpen, Camera, Sun, X } from 'lucide-react';
import type { useChallenge } from '../store/useChallenge';
import { addDays, today, formatDate } from '../utils/dates';
import type { DayRecord } from '../types';

type ChallengeHook = ReturnType<typeof useChallenge>;
interface Props { challenge: ChallengeHook; }

function taskBreakdown(r: DayRecord) {
  return [
    { icon: <Leaf size={14} />, label: 'Diet', done: r.diet },
    { icon: <Dumbbell size={14} />, label: `Workout 1${r.workout1Outdoor ? ' 🌳' : ''}`, done: r.workout1 },
    { icon: <Dumbbell size={14} />, label: `Workout 2${r.workout2Outdoor ? ' 🌳' : ''}`, done: r.workout2 },
    { icon: <Sun size={14} />, label: 'Outdoor workout', done: r.workout1Outdoor || r.workout2Outdoor },
    { icon: <Droplets size={14} />, label: `Water — ${r.waterOz} oz`, done: r.waterOz >= 128 },
    { icon: <BookOpen size={14} />, label: `Pages — ${r.pagesRead}`, done: r.pagesRead >= 10 },
    { icon: <Camera size={14} />, label: 'Progress photo', done: r.photoTaken },
  ];
}

export default function CalendarScreen({ challenge }: Props) {
  const { state } = challenge;
  const todayStr = today();
  const [selectedDay, setSelectedDay] = useState<{ dayNum: number; dateStr: string } | null>(null);

  const startDate = state.challengeStartDate;
  if (!startDate) return null;

  const allDays = Array.from({ length: 75 }, (_, i) => {
    const dateStr = addDays(startDate, i);
    const record = state.days[dateStr];
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const dayNum = i + 1;
    return { dateStr, record, isToday, isFuture, dayNum };
  });

  // Completed count (including today if done)
  const completedCount = allDays.filter(d => d.record?.completed).length;

  // Current streak: completed days ending at today (or yesterday if today not done)
  let currentStreak = 0;
  for (let i = state.currentDay - 1; i >= 0; i--) {
    const d = allDays[i];
    if (d.record?.completed) currentStreak++;
    else break;
  }

  // Best streak is max of stored best (from previous runs) and current run
  const displayBestStreak = Math.max(state.bestStreak, state.currentDay - 1);

  // Today's partial progress for the current-day cell
  const todayRecord = state.days[todayStr];
  const todayTasksDone = todayRecord
    ? [todayRecord.diet, todayRecord.workout1, todayRecord.workout2,
       todayRecord.workout1Outdoor || todayRecord.workout2Outdoor,
       todayRecord.waterOz >= 128, todayRecord.pagesRead >= 10, todayRecord.photoTaken
      ].filter(Boolean).length
    : 0;

  const selectedRecord = selectedDay ? state.days[selectedDay.dateStr] : null;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-6">

      {/* Header */}
      <div>
        <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Progress</p>
        <h2 className="text-3xl font-black text-white mt-1">Calendar</h2>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Current Streak" value={currentStreak} unit="days" color="text-orange-400" />
        <StatCard label="Best Streak" value={displayBestStreak} unit="days" color="text-amber-400" />
        <StatCard label="Completed" value={completedCount} unit="/ 75" color="text-emerald-400" />
      </div>

      {/* Grid */}
      <div>
        <p className="text-xs text-gray-600 mb-2">Tap a day to see task details</p>
        <div className="grid grid-cols-7 gap-1.5">
          {allDays.map(({ dayNum, dateStr, record, isToday, isFuture }) => {
            const done = record?.completed;
            let cellClass = '';
            if (done) cellClass = 'bg-emerald-700/70 text-emerald-200';
            else if (isToday) cellClass = 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500';
            else if (isFuture) cellClass = 'bg-gray-900 text-gray-700';
            else if (record) cellClass = 'bg-red-900/40 text-red-400';
            else cellClass = 'bg-gray-900 text-gray-700'; // past, no record (future of a fresh start)

            const tappable = !isFuture;

            return (
              <button
                key={dayNum}
                disabled={!tappable}
                onClick={() => tappable && setSelectedDay({ dayNum, dateStr })}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all
                  ${cellClass}
                  ${tappable ? 'active:scale-90 cursor-pointer' : 'cursor-default'}
                  ${selectedDay?.dayNum === dayNum ? 'ring-2 ring-white/40' : ''}`}
              >
                <span className="text-[10px] leading-none">{dayNum}</span>
                {done && <CheckCircle2 size={10} strokeWidth={3} />}
                {!done && !isToday && !isFuture && record && <XCircle size={10} strokeWidth={2} />}
                {isFuture && <Lock size={8} strokeWidth={1.5} />}
                {isToday && !done && (
                  <span className="text-[8px] leading-none opacity-70">{todayTasksDone}/7</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        <LegendItem color="bg-emerald-700/70" label="Complete" />
        <LegendItem color="bg-orange-500/20 ring-1 ring-orange-500" label="Today" />
        <LegendItem color="bg-red-900/40" label="Missed" />
        <LegendItem color="bg-gray-900" label="Future" />
      </div>

      {/* Day detail bottom sheet */}
      {selectedDay && (
        <div className="fixed inset-0 z-40 flex items-end" onClick={() => setSelectedDay(null)}>
          <div
            className="w-full max-w-lg mx-auto bg-gray-900 border border-gray-700 rounded-t-3xl p-5 space-y-4 shadow-2xl animate-sheet-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">Day {selectedDay.dayNum}</p>
                <p className="text-gray-400 text-sm">{formatDate(selectedDay.dateStr)}</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            {!selectedRecord ? (
              <p className="text-gray-500 text-sm text-center py-4">No data recorded for this day.</p>
            ) : (
              <>
                <div className={`text-center py-2 rounded-xl text-sm font-semibold
                  ${selectedRecord.completed ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/30 text-red-400'}`}>
                  {selectedRecord.completed ? '✓ Day Complete' : '✗ Not Completed'}
                </div>
                <div className="space-y-2">
                  {taskBreakdown(selectedRecord).map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={t.done ? 'text-emerald-400' : 'text-gray-600'}>{t.icon}</span>
                      <span className={`text-sm flex-1 ${t.done ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                        {t.label}
                      </span>
                      {t.done
                        ? <CheckCircle2 size={16} className="text-emerald-500" strokeWidth={2.5} />
                        : <XCircle size={16} className="text-red-800" strokeWidth={1.5} />
                      }
                    </div>
                  ))}
                </div>
                {selectedRecord.notes && (
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedRecord.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-gray-500 text-xs">{unit}</p>
      <p className="text-gray-400 text-xs mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
