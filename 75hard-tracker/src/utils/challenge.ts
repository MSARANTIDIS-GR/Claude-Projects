import type { DayRecord } from '../types';

export const WATER_TARGET_OZ = 128;
export const PAGES_TARGET = 10;

export function isDayComplete(r: Partial<DayRecord>): boolean {
  return !!(
    r.diet &&
    r.workout1 &&
    r.workout2 &&
    (r.workout1Outdoor || r.workout2Outdoor) &&
    (r.waterOz ?? 0) >= WATER_TARGET_OZ &&
    (r.pagesRead ?? 0) >= PAGES_TARGET &&
    r.photoTaken
  );
}

export function createDayRecord(date: string): DayRecord {
  return {
    date,
    diet: false,
    workout1: false,
    workout1Outdoor: false,
    workout2: false,
    workout2Outdoor: false,
    waterOz: 0,
    pagesRead: 0,
    photoTaken: false,
    photoData: null,
    notes: '',
    completed: false,
  };
}

export function calcCurrentStreak(
  days: Record<string, DayRecord>,
  startDate: string,
  currentDay: number
): number {
  let streak = 0;
  for (let i = currentDay - 2; i >= 0; i--) {
    const d = new Date(startDate + 'T00:00:00');
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split('T')[0];
    if (days[key]?.completed) streak++;
    else break;
  }
  return streak;
}
