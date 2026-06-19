import { useState } from 'react';
import { useChallenge } from './store/useChallenge';
import BottomNav, { type Tab } from './components/BottomNav';
import ResetModal from './components/ResetModal';
import StartScreen from './screens/StartScreen';
import TodayScreen from './screens/TodayScreen';
import CalendarScreen from './screens/CalendarScreen';
import PhotosScreen from './screens/PhotosScreen';
import CompletionScreen from './screens/CompletionScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const challenge = useChallenge();
  const { state, showResetModal, resetChallenge, startChallenge } = challenge;

  if (!state.isActive) {
    return (
      <StartScreen
        bestStreak={state.bestStreak}
        onStart={startChallenge}
      />
    );
  }

  // Challenge complete: day 75 record exists and is completed
  const day75Done =
    state.currentDay >= 75 &&
    state.challengeStartDate !== null &&
    (() => {
      const d = new Date(state.challengeStartDate + 'T00:00:00');
      d.setDate(d.getDate() + 74);
      const day75Date = d.toISOString().split('T')[0];
      return state.days[day75Date]?.completed;
    })();

  if (day75Done) {
    return (
      <CompletionScreen
        bestStreak={Math.max(state.bestStreak, 75)}
        onRestart={startChallenge}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {showResetModal && (
        <ResetModal
          currentDay={state.currentDay}
          onReset={resetChallenge}
        />
      )}

      <main className="pb-20">
        {activeTab === 'today' && <TodayScreen challenge={challenge} />}
        {activeTab === 'calendar' && <CalendarScreen challenge={challenge} />}
        {activeTab === 'photos' && <PhotosScreen challenge={challenge} />}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
