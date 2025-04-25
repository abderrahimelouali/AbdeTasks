export type PrayerStatus = 'not-prayed' | 'on-time' | 'late' | 'missed';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export type CategoryType = 'nofap' | 'prayer' | 'quran' | 'study' | 'english' | string;

export type EnglishSkill = 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'mixed' | 'rest';

export type Prayer = {
  name: PrayerName;
  status: PrayerStatus;
};

export type QuranProgress = {
  date: string;
  surah: string;
  startVerse: number;
  endVerse: number;
  completed: boolean;
};

export type StudySession = {
  id: string;
  date: string;
  topic: string;
  type: string;
  duration: number;
  notes: string;
};

export type EnglishSession = {
  id: string;
  date: string;
  skill: EnglishSkill;
  completed: boolean;
  notes: string;
};

export type DailyTask = {
  id: string;
  date: string;
  nofapDay: number;
  nofapMaintained: boolean;
  prayers: Prayer[];
  quran: QuranProgress | null;
  study: StudySession | null;
  english: EnglishSession | null;
  mood: MoodType | null;
};

export interface CustomCategory {
  name: string;
  color: string;
}
