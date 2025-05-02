
import { DailyTask, Prayer, MoodType } from "@/types";
import { NoFapTracker } from "@/components/categories/nofap-tracker";
import { PrayerTracker } from "@/components/categories/prayer-tracker";
import { QuranTracker } from "@/components/categories/quran-tracker";
import { StudyTracker } from "@/components/categories/study-tracker";
import { EnglishTracker } from "@/components/categories/english-tracker";
import { MoodTracker } from "@/components/categories/mood-tracker";

interface TrackerGridProps {
  dailyTask: DailyTask;
  onPrayersUpdate: (prayers: Prayer[]) => void;
  onNoFapUpdate: (maintained: boolean, streak: number) => void;
  onQuranProgressSave: (progress: any) => void;
  onStudySessionSave: (session: any) => void;
  onEnglishSessionSave: (session: any) => void;
  onMoodChange: (mood: MoodType) => void;
}

export function TrackerGrid({
  dailyTask,
  onPrayersUpdate,
  onNoFapUpdate,
  onQuranProgressSave,
  onStudySessionSave,
  onEnglishSessionSave,
  onMoodChange
}: TrackerGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <NoFapTracker 
        currentStreak={dailyTask.nofapDay}
        maintained={dailyTask.nofapMaintained}
        onStrengthChange={onNoFapUpdate}
      />

      <PrayerTracker 
        prayers={dailyTask.prayers} 
        onPrayersUpdate={onPrayersUpdate} 
      />

      <QuranTracker 
        quranProgress={dailyTask.quran}
        onProgressSave={onQuranProgressSave}
      />

      <StudyTracker 
        studySession={dailyTask.study}
        onSessionSave={onStudySessionSave}
      />

      <EnglishTracker 
        englishSession={dailyTask.english}
        onSessionSave={onEnglishSessionSave}
      />

      <MoodTracker 
        currentMood={dailyTask.mood}
        onMoodChange={onMoodChange}
      />
    </div>
  );
}
