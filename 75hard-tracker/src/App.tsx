import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useChallenge } from './store/useChallenge';
import { usePWAInstall } from './hooks/usePWAInstall';
import BottomNav, { type Tab } from './components/BottomNav';
import ResetModal from './components/ResetModal';
import InstallBanner from './components/InstallBanner';
import SettingsSheet from './components/SettingsSheet';
import AuthScreen from './screens/AuthScreen';
import StartScreen from './screens/StartScreen';
import TodayScreen from './screens/TodayScreen';
import CalendarScreen from './screens/CalendarScreen';
import PhotosScreen from './screens/PhotosScreen';
import CompletionScreen from './screens/CompletionScreen';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab,    setActiveTab]    = useState<Tab>('today');
  const [showSettings, setShowSettings] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();
  const pwa       = usePWAInstall();
  const challenge = useChallenge(user?.uid ?? null);
  const { state, showResetModal, resetChallenge, startChallenge } = challenge;

  // Wait for Firebase to resolve auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 size={36} className="text-orange-400 animate-spin" />
      </div>
    );
  }

  // Not authenticated → show login/signup
  if (!user) return <AuthScreen />;

  // Challenge not started
  if (!state.isActive) {
    return <StartScreen bestStreak={state.bestStreak} onStart={startChallenge} />;
  }

  // Day 75 complete
  const day75Done =
    state.currentDay >= 75 &&
    state.challengeStartDate !== null &&
    (() => {
      const d = new Date(state.challengeStartDate + 'T00:00:00');
      d.setDate(d.getDate() + 74);
      return state.days[d.toISOString().split('T')[0]]?.completed;
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
        onLogout={logout}
        userEmail={user.email}
      />

      <main className={`pb-safe-nav ${pwa.canInstall ? 'pt-14' : ''}`}>
        {activeTab === 'today' && (
          <TodayScreen challenge={challenge} onOpenSettings={() => setShowSettings(true)} />
        )}
        {activeTab === 'calendar' && <CalendarScreen challenge={challenge} />}
        {activeTab === 'photos'   && <PhotosScreen   challenge={challenge} />}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
