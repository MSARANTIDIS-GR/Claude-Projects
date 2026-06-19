export interface DayRecord {
  date: string; // "YYYY-MM-DD"
  diet: boolean;
  workout1: boolean;
  workout1Outdoor: boolean;
  workout2: boolean;
  workout2Outdoor: boolean;
  waterOz: number;  // target: 128
  pagesRead: number; // target: 10
  photoTaken: boolean;
  photoData: string | null; // base64 data URL
  notes: string;
  completed: boolean;
}

export interface ChallengeState {
  challengeStartDate: string | null; // "YYYY-MM-DD"
  currentDay: number; // 1–75
  days: Record<string, DayRecord>;
  bestStreak: number;
  isActive: boolean;
  lastCheckedDate: string | null;
}
