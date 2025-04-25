
import { DailyTask, StudySession, EnglishSession, QuranProgress } from "@/types";

const TASKS_KEY = 'abdetask_dailytasks';
const STUDY_SESSIONS_KEY = 'abdetask_study_sessions';
const ENGLISH_SESSIONS_KEY = 'abdetask_english_sessions';
const QURAN_PROGRESS_KEY = 'abdetask_quran_progress';
const NOFAP_STREAK_KEY = 'abdetask_nofap_streak';

export const storage = {
  getDailyTasks: (): DailyTask[] => {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  },
  
  saveDailyTask: (task: DailyTask): void => {
    const tasks = storage.getDailyTasks();
    const existingIndex = tasks.findIndex(t => t.date === task.date);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },
  
  getDailyTaskByDate: (date: string): DailyTask | undefined => {
    const tasks = storage.getDailyTasks();
    return tasks.find(task => task.date === date);
  },
  
  getStudySessions: (): StudySession[] => {
    const sessionsJson = localStorage.getItem(STUDY_SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  },
  
  saveStudySession: (session: StudySession): void => {
    const sessions = storage.getStudySessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(STUDY_SESSIONS_KEY, JSON.stringify(sessions));
  },
  
  getEnglishSessions: (): EnglishSession[] => {
    const sessionsJson = localStorage.getItem(ENGLISH_SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  },
  
  saveEnglishSession: (session: EnglishSession): void => {
    const sessions = storage.getEnglishSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(ENGLISH_SESSIONS_KEY, JSON.stringify(sessions));
  },
  
  getQuranProgress: (): QuranProgress[] => {
    const progressJson = localStorage.getItem(QURAN_PROGRESS_KEY);
    return progressJson ? JSON.parse(progressJson) : [];
  },
  
  saveQuranProgress: (progress: QuranProgress): void => {
    const allProgress = storage.getQuranProgress();
    const existingIndex = allProgress.findIndex(p => p.date === progress.date);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(QURAN_PROGRESS_KEY, JSON.stringify(allProgress));
  },

  getNofapStreak: (): number => {
    const streakJson = localStorage.getItem(NOFAP_STREAK_KEY);
    return streakJson ? parseInt(streakJson) : 0;
  },
  
  saveNofapStreak: (streak: number): void => {
    localStorage.setItem(NOFAP_STREAK_KEY, streak.toString());
  },
  
  resetNofapStreak: (): void => {
    localStorage.setItem(NOFAP_STREAK_KEY, '0');
  }
};
