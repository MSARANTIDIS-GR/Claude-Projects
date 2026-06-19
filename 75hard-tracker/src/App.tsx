import { useState } from 'react';
import { useChallenge } from './store/useChallenge';
import { usePWAInstall } from './hooks/usePWAInstall';
import BottomNav, { type Tab } from './components/BottomNav';
import ResetModal from './components/ResetModal';
import InstallBanner from './components/InstallBanner';
import SettingsSheet from './components/SettingsSheet';
import StartScreen from './screens/StartScreen';
import TodayScreen from './screens/TodayScreen';
import CalendarScreen from './screens/CalendarScreen';
import PhotosScreen from './screens/PhotosScreen';
import CompletionScreen from './screens/CompletionScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [showSettings, setShowSettings] = useState(false);
  const challenge = useChallenge();
  const pwa = usePWAInstall();
  const { state, showResetModal, resetChallenge, startChallenge } = challenge;

  if (!state.isActive) {
    return <StartScreen bestStreak={state.bestStreak} onStart={startChallenge} />;
  }

  // Check if day 75 is complete
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
        <ResetModal currentDay={state.currentDay} onReset={resetChallenge} />
      )}

      {pwa.canInstall && !showResetModal && (
        <InstallBanner onInstall={pwa.install} onDismiss={pwa.dismiss} />
      )}

      <SettingsSheet
        open={showSettings}
        onClose={() => setShowSettings(false)}
        state={state}
        onReset={() => { resetChallenge(); setShowSettings(false); }}
      />

      <main className={`pb-safe-nav ${pwa.canInstall ? 'pt-14' : ''}`}>
        {activeTab === 'today' && (
          <TodayScreen challenge={challenge} onOpenSettings={() => setShowSettings(true)} />
        )}
        {activeTab === 'calendar' && <CalendarScreen challenge={challenge} />}
        {activeTab === 'photos' && <PhotosScreen challenge={challenge} />}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
