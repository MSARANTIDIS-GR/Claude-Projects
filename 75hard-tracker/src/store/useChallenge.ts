import { useState, useEffect, useCallback } from 'react';
import type { ChallengeState, DayRecord } from '../types';
import { today, yesterday } from '../utils/dates';
import { isDayComplete, createDayRecord } from '../utils/challenge';

const STORAGE_KEY = '75hard_v1';

const DEFAULT_STATE: ChallengeState = {
  challengeStartDate: null,
  currentDay: 1,
  days: {},
  bestStreak: 0,
  isActive: false,
  lastCheckedDate: null,
};

function loadState(): ChallengeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

function saveState(s: ChallengeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function useChallenge() {
  const [state, setState] = useState<ChallengeState>(loadState);
  const [showResetModal, setShowResetModal] = useState(false);

  // Persist every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // New-day check: detect missed days on app open
  useEffect(() => {
    if (!state.isActive) return;
    const todayStr = today();
    if (state.lastCheckedDate === todayStr) return; // already handled today

    const yesterdayStr = yesterday();

    // User skipped multiple days → auto-reset
    if (state.lastCheckedDate !== null && state.lastCheckedDate < yesterdayStr) {
      setShowResetModal(true);
      return;
    }

    // Check if yesterday was completed
    if (state.lastCheckedDate === yesterdayStr) {
      const yRec = state.days[yesterdayStr];
      if (!yRec?.completed) {
        setShowResetModal(true);
        return;
      }
    }

    // All good — advance to today
    setState(prev => {
      if (!prev.isActive) return prev;
      const newDays = { ...prev.days };
      if (!newDays[todayStr]) newDays[todayStr] = createDayRecord(todayStr);

      const start = prev.challengeStartDate!;
      const startMs = new Date(start + 'T00:00:00').getTime();
      const todayMs = new Date(todayStr + 'T00:00:00').getTime();
      const dayNum = Math.round((todayMs - startMs) / 86_400_000) + 1;

      return { ...prev, currentDay: Math.min(dayNum, 75), days: newDays, lastCheckedDate: todayStr };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isActive, state.lastCheckedDate]);

  const startChallenge = useCallback(() => {
    const todayStr = today();
    setState(prev => ({
      challengeStartDate: todayStr,
      currentDay: 1,
      days: { [todayStr]: createDayRecord(todayStr) },
      bestStreak: prev.bestStreak,
      isActive: true,
      lastCheckedDate: todayStr,
    }));
  }, []);

  const resetChallenge = useCallback(() => {
    const todayStr = today();
    setState(prev => {
      const completedDays = prev.currentDay - 1;
      return {
        challengeStartDate: todayStr,
        currentDay: 1,
        days: { [todayStr]: createDayRecord(todayStr) },
        bestStreak: Math.max(prev.bestStreak, completedDays),
        isActive: true,
        lastCheckedDate: todayStr,
      };
    });
    setShowResetModal(false);
  }, []);

  const updateTodayRecord = useCallback((updates: Partial<DayRecord>) => {
    const todayStr = today();
    setState(prev => {
      const existing = prev.days[todayStr] ?? createDayRecord(todayStr);
      const updated = { ...existing, ...updates };
      updated.completed = isDayComplete(updated);
      return { ...prev, days: { ...prev.days, [todayStr]: updated } };
    });
  }, []);

  const todayRecord = state.days[today()] ?? createDayRecord(today());

  return {
    state,
    todayRecord,
    showResetModal,
    setShowResetModal,
    startChallenge,
    resetChallenge,
    updateTodayRecord,
  };
}
