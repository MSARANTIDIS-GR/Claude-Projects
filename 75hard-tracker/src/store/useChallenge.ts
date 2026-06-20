import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

function saveLocal(s: ChallengeState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

// Strip photoData before writing to Firestore (too large for a document)
function stripPhotos(s: ChallengeState): ChallengeState {
  return {
    ...s,
    days: Object.fromEntries(
      Object.entries(s.days).map(([k, v]) => [k, { ...v, photoData: null }])
    ),
  };
}

async function loadFromFirestore(uid: string): Promise<ChallengeState | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'data', 'challenge'));
    if (!snap.exists()) return null;
    return { ...DEFAULT_STATE, ...snap.data() } as ChallengeState;
  } catch { return null; }
}

async function saveToFirestore(uid: string, s: ChallengeState) {
  try {
    await setDoc(doc(db, 'users', uid, 'data', 'challenge'), stripPhotos(s));
  } catch { /* offline — ignore */ }
}

export function useChallenge(userId?: string | null) {
  const [state, setState]           = useState<ChallengeState>(loadState);
  const [showResetModal, setShowResetModal] = useState(false);
  const firestoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Persist to localStorage on every change ──
  useEffect(() => { saveLocal(state); }, [state]);

  // ── Firestore: load when user logs in, save on state change ──
  useEffect(() => {
    if (!userId) return;
    loadFromFirestore(userId).then(remote => {
      if (!remote) {
        // First login — upload local state if active
        if (state.isActive) saveToFirestore(userId, state);
        return;
      }
      // Merge: Firestore wins on challenge metadata,
      // keep local photoData for days that exist locally
      setState(prev => {
        const mergedDays: Record<string, DayRecord> = {};
        const allDates = new Set([...Object.keys(remote.days), ...Object.keys(prev.days)]);
        for (const date of allDates) {
          const r = remote.days[date];
          const l = prev.days[date];
          if (r && l) mergedDays[date] = { ...r, photoData: l.photoData };
          else if (r)  mergedDays[date] = r;
          else if (l)  mergedDays[date] = l;
        }
        // Use remote if it has more progress; otherwise keep local
        return remote.currentDay >= prev.currentDay
          ? { ...remote, days: mergedDays }
          : prev;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId || !state.isActive) return;
    if (firestoreTimer.current) clearTimeout(firestoreTimer.current);
    firestoreTimer.current = setTimeout(() => saveToFirestore(userId, state), 3000);
    return () => { if (firestoreTimer.current) clearTimeout(firestoreTimer.current); };
  }, [state, userId]);

  // ── New-day detection ──
  useEffect(() => {
    if (!state.isActive) return;
    const todayStr = today();
    if (state.lastCheckedDate === todayStr) return;

    const yesterdayStr = yesterday();

    if (state.lastCheckedDate !== null && state.lastCheckedDate < yesterdayStr) {
      setShowResetModal(true); return;
    }
    if (state.lastCheckedDate === yesterdayStr) {
      const yRec = state.days[yesterdayStr];
      if (!yRec?.completed) { setShowResetModal(true); return; }
    }

    setState(prev => {
      if (!prev.isActive) return prev;
      const newDays = { ...prev.days };
      if (!newDays[todayStr]) newDays[todayStr] = createDayRecord(todayStr);
      const startMs  = new Date(prev.challengeStartDate! + 'T00:00:00').getTime();
      const todayMs  = new Date(todayStr + 'T00:00:00').getTime();
      const dayNum   = Math.round((todayMs - startMs) / 86_400_000) + 1;
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
    setState(prev => ({
      challengeStartDate: todayStr,
      currentDay: 1,
      days: { [todayStr]: createDayRecord(todayStr) },
      bestStreak: Math.max(prev.bestStreak, prev.currentDay - 1),
      isActive: true,
      lastCheckedDate: todayStr,
    }));
    setShowResetModal(false);
  }, []);

  const updateTodayRecord = useCallback((updates: Partial<DayRecord>) => {
    const todayStr = today();
    setState(prev => {
      const existing = prev.days[todayStr] ?? createDayRecord(todayStr);
      const updated  = { ...existing, ...updates };
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
