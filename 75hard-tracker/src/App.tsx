import { useState } from 'react';
import { useChallenge } from './store/useChallenge';
import BottomNav, { type Tab } from './components/BottomNav';
import ResetModal from './components/ResetModal';
import StartScreen from './screens/StartScreen';
import TodayScreen from './screens/TodayScreen';
import CalendarScreen from './screens/CalendarScreen';
import PhotosScreen from './screens/PhotosScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const challenge = useChallenge();
  const { state, showResetModal, resetChallenge } = challenge;

  if (!state.isActive) {
    return (
      <StartScreen
        bestStreak={state.bestStreak}
        onStart={challenge.startChallenge}
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
