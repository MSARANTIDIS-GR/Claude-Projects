import { CheckCircle2, XCircle, Lock } from 'lucide-react';
import type { useChallenge } from '../store/useChallenge';
import { addDays, today } from '../utils/dates';

type ChallengeHook = ReturnType<typeof useChallenge>;

interface Props {
  challenge: ChallengeHook;
}

export default function CalendarScreen({ challenge }: Props) {
  const { state } = challenge;
  const todayStr = today();

  const startDate = state.challengeStartDate;
  if (!startDate) return null;

  // Build all 75 days
  const allDays = Array.from({ length: 75 }, (_, i) => {
    const dateStr = addDays(startDate, i);
    const record = state.days[dateStr];
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const dayNum = i + 1;
    return { dateStr, record, isPast, isToday, isFuture, dayNum };
  });

  // Current streak: consecutive completed days ending yesterday
  let currentStreak = 0;
  for (let i = state.currentDay - 2; i >= 0; i--) {
    const d = allDays[i];
    if (d.record?.completed) currentStreak++;
    else break;
  }
  // Add today if it's done
  if (state.days[todayStr]?.completed) currentStreak++;

  const completedCount = allDays.filter(d => d.record?.completed).length;

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
        <StatCard label="Best Streak" value={state.bestStreak} unit="days" color="text-amber-400" />
        <StatCard label="Completed" value={completedCount} unit="/ 75" color="text-emerald-400" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {allDays.map(({ dayNum, record, isToday, isFuture }) => {
          const done = record?.completed;
          let bg = 'bg-gray-800 text-gray-500';
          if (done) bg = 'bg-emerald-700/70 text-emerald-200';
          else if (isToday) bg = 'bg-orange-500/30 text-orange-300 ring-1 ring-orange-500';
          else if (isFuture) bg = 'bg-gray-900 text-gray-700';
          else bg = 'bg-red-900/40 text-red-400'; // past incomplete

          return (
            <div
              key={dayNum}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${bg} transition-colors`}
            >
              <span className="text-[10px] leading-none">{dayNum}</span>
              {done && <CheckCircle2 size={10} strokeWidth={3} />}
              {!done && !isToday && !isFuture && record && <XCircle size={10} strokeWidth={2} />}
              {isFuture && <Lock size={8} strokeWidth={1.5} />}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        <LegendItem color="bg-emerald-700/70" label="Complete" />
        <LegendItem color="bg-orange-500/30 ring-1 ring-orange-500" label="Today" />
        <LegendItem color="bg-red-900/40" label="Missed" />
        <LegendItem color="bg-gray-900" label="Future" />
      </div>
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
