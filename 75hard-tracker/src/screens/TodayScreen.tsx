import { Dumbbell, Leaf, Droplets, BookOpen, Camera, Sun, TreePine, Trophy, ChevronDown, ChevronUp, Settings, Share2 } from 'lucide-react';
import { useState } from 'react';
import TaskCard from '../components/TaskCard';
import WaterCounter from '../components/WaterCounter';
import PageCounter from '../components/PageCounter';
import PhotoCapture from '../components/PhotoCapture';
import ShareModal from '../components/ShareModal';
import { haptic } from '../utils/haptics';
import type { useChallenge } from '../store/useChallenge';

type ChallengeHook = ReturnType<typeof useChallenge>;

interface Props {
  challenge: ChallengeHook;
  onOpenSettings: () => void;
}

function WorkoutCard({
  num,
  done,
  outdoor,
  onToggleDone,
  onToggleOutdoor,
}: {
  num: 1 | 2;
  done: boolean;
  outdoor: boolean;
  onToggleDone: () => void;
  onToggleOutdoor: () => void;
}) {
  return (
    <TaskCard
      done={done}
      icon={<Dumbbell size={22} />}
      title={`Workout ${num} — 45 min`}
      subtitle={num === 1 ? 'First workout of the day' : 'Second workout (at least one must be outdoors)'}
      onToggle={onToggleDone}
    >
      <button
        onClick={() => { haptic(); onToggleOutdoor(); }}
        disabled={!done}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
          ${!done ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
          ${outdoor
            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
          }`}
      >
        {outdoor ? <Sun size={13} /> : <TreePine size={13} />}
        {outdoor ? 'Outdoor ✓' : 'Mark as Outdoor'}
      </button>
    </TaskCard>
  );
}

export default function TodayScreen({ challenge, onOpenSettings }: Props) {
  const { state, todayRecord, updateTodayRecord } = challenge;
  const [showNotes, setShowNotes]   = useState(false);
  const [showShare, setShowShare]   = useState(false);

  const day = state.currentDay;
  const pct = Math.round((day / 75) * 100);
  const isComplete = todayRecord.completed;

  const outdoorWarning =
    todayRecord.workout1 && todayRecord.workout2 &&
    !todayRecord.workout1Outdoor && !todayRecord.workout2Outdoor;

  const tasks = [
    todayRecord.diet,
    todayRecord.workout1,
    todayRecord.workout2,
    todayRecord.workout1Outdoor || todayRecord.workout2Outdoor,
    todayRecord.waterOz >= 128,
    todayRecord.pagesRead >= 10,
    todayRecord.photoTaken,
  ];
  const completedCount = tasks.filter(Boolean).length;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-4">

      {/* Header */}
      <div className="text-center space-y-1 pb-2 relative">
        <button
          onClick={() => { haptic(); onOpenSettings(); }}
          className="absolute right-0 top-0 p-1.5 text-gray-600 hover:text-gray-400 transition-colors active:scale-90"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>

        <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">75 Hard</p>
        <h1 className="text-5xl font-black text-white">
          Day {day} <span className="text-gray-600 font-light text-3xl">/ 75</span>
        </h1>

        <div className="mt-3 relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : 'bg-orange-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">{pct}% of the challenge complete</p>
      </div>

      {/* Day Complete Banner */}
      {isComplete && (
        <div className="bg-emerald-900/50 border border-emerald-600/60 rounded-2xl p-4 flex items-center gap-3 animate-slide-up">
          <Trophy size={28} className="text-emerald-400 shrink-0 animate-check-pop" />
          <div>
            <p className="text-emerald-300 font-bold text-base">Day {day} Complete! 🔥</p>
            <p className="text-emerald-600 text-xs">All 5 tasks crushed. Rest up, come back tomorrow.</p>
          </div>
        </div>
      )}

      {/* Outdoor warning */}
      {outdoorWarning && (
        <div className="bg-amber-950/50 border border-amber-700/50 rounded-xl p-3 text-amber-300 text-sm flex gap-2 animate-slide-up">
          <Sun size={16} className="shrink-0 mt-0.5" />
          <span>Both workouts done — but <strong>at least one must be outdoor</strong> to count!</span>
        </div>
      )}

      {/* Mini progress chips */}
      {!isComplete && (
        <div className="flex gap-1.5 justify-center flex-wrap">
          {['Diet', 'WO1', 'WO2', 'Outdoor', 'Water', 'Pages', 'Photo'].map((label, i) => (
            <span
              key={label}
              className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-300
                ${tasks[i] ? 'bg-emerald-900/60 text-emerald-400' : 'bg-gray-800 text-gray-600'}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* ── Diet ── */}
      <TaskCard
        done={todayRecord.diet}
        icon={<Leaf size={22} />}
        title="Follow Your Diet"
        subtitle="No alcohol · No cheat meals · No exceptions"
        onToggle={() => updateTodayRecord({ diet: !todayRecord.diet })}
      />

      {/* ── Workouts ── */}
      <WorkoutCard
        num={1}
        done={todayRecord.workout1}
        outdoor={todayRecord.workout1Outdoor}
        onToggleDone={() => {
          const next = !todayRecord.workout1;
          updateTodayRecord({ workout1: next, workout1Outdoor: next ? todayRecord.workout1Outdoor : false });
        }}
        onToggleOutdoor={() => updateTodayRecord({ workout1Outdoor: !todayRecord.workout1Outdoor })}
      />
      <WorkoutCard
        num={2}
        done={todayRecord.workout2}
        outdoor={todayRecord.workout2Outdoor}
        onToggleDone={() => {
          const next = !todayRecord.workout2;
          updateTodayRecord({ workout2: next, workout2Outdoor: next ? todayRecord.workout2Outdoor : false });
        }}
        onToggleOutdoor={() => updateTodayRecord({ workout2Outdoor: !todayRecord.workout2Outdoor })}
      />

      {/* ── Water ── */}
      <TaskCard
        done={todayRecord.waterOz >= 128}
        icon={<Droplets size={22} />}
        title="Drink 1 Gallon of Water"
        subtitle="128 oz / 3.78 L"
      >
        <WaterCounter
          oz={todayRecord.waterOz}
          onChange={oz => updateTodayRecord({ waterOz: oz })}
        />
      </TaskCard>

      {/* ── Reading ── */}
      <TaskCard
        done={todayRecord.pagesRead >= 10}
        icon={<BookOpen size={22} />}
        title="Read 10 Pages"
        subtitle="Non-fiction only"
      >
        <PageCounter
          pages={todayRecord.pagesRead}
          onChange={p => updateTodayRecord({ pagesRead: p })}
        />
      </TaskCard>

      {/* ── Photo ── */}
      <TaskCard
        done={todayRecord.photoTaken}
        icon={<Camera size={22} />}
        title="Daily Progress Photo"
        subtitle="Document your transformation"
      >
        <PhotoCapture
          taken={todayRecord.photoTaken}
          photoData={todayRecord.photoData}
          onChange={(taken, data) => updateTodayRecord({ photoTaken: taken, photoData: data })}
        />
      </TaskCard>

      {/* Notes */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => { haptic(); setShowNotes(v => !v); }}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <span>Notes for today</span>
          {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showNotes && (
          <textarea
            value={todayRecord.notes}
            onChange={e => updateTodayRecord({ notes: e.target.value })}
            placeholder="How did it go? What will you do differently tomorrow?"
            rows={4}
            className="w-full bg-transparent px-4 pb-4 text-sm text-gray-300 placeholder-gray-600 resize-none outline-none border-t border-gray-800"
          />
        )}
      </div>

      <p className="text-center text-xs text-gray-600 pb-2">
        {completedCount} / {tasks.length} tasks completed today
      </p>

      {/* Share button */}
      <button
        onClick={() => { haptic('medium'); setShowShare(true); }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-900 border border-gray-800 hover:border-orange-500/50 text-gray-400 hover:text-orange-400 text-sm font-medium transition-all active:scale-95 mb-2"
      >
        <Share2 size={16} />
        Share Progress
      </button>

      {showShare && (
        <ShareModal
          day={state.currentDay}
          record={todayRecord}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
