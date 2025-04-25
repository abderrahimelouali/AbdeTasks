
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { NoFapTracker } from "@/components/categories/nofap-tracker";
import { PrayerTracker } from "@/components/categories/prayer-tracker";
import { QuranTracker } from "@/components/categories/quran-tracker";
import { StudyTracker } from "@/components/categories/study-tracker";
import { EnglishTracker } from "@/components/categories/english-tracker";
import { MoodTracker } from "@/components/categories/mood-tracker";
import { Layout } from "@/components/layout/layout";
import { storage } from "@/lib/storage";
import { DailyTask, Prayer, PrayerName, MoodType } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const today = formatDate(new Date());
  const [dailyTask, setDailyTask] = useState<DailyTask>({
    id: today,
    date: today,
    nofapDay: storage.getNofapStreak(),
    nofapMaintained: true,
    prayers: [
      { name: 'fajr', status: 'not-prayed' },
      { name: 'dhuhr', status: 'not-prayed' },
      { name: 'asr', status: 'not-prayed' },
      { name: 'maghrib', status: 'not-prayed' },
      { name: 'isha', status: 'not-prayed' },
    ],
    quran: null,
    study: null,
    english: null,
    mood: null
  });
  
  useEffect(() => {
    // Load today's task if exists
    const existingTask = storage.getDailyTaskByDate(today);
    if (existingTask) {
      setDailyTask(existingTask);
    } else {
      // If not, initialize with default values and nofap streak
      setDailyTask(prev => ({
        ...prev,
        nofapDay: storage.getNofapStreak()
      }));
    }
  }, [today]);
  
  const saveTask = (updatedTask: DailyTask) => {
    storage.saveDailyTask(updatedTask);
    setDailyTask(updatedTask);
    toast({
      description: "Your progress has been saved.",
    });
  };

  const handlePrayersUpdate = (prayers: Prayer[]) => {
    const updatedTask = { ...dailyTask, prayers };
    saveTask(updatedTask);
  };
  
  const handleNoFapUpdate = (maintained: boolean, streak: number) => {
    const updatedTask = { 
      ...dailyTask, 
      nofapMaintained: maintained,
      nofapDay: streak
    };
    saveTask(updatedTask);
  };
  
  const handleQuranProgressSave = (progress: any) => {
    const updatedTask = { ...dailyTask, quran: progress };
    saveTask(updatedTask);
  };
  
  const handleStudySessionSave = (session: any) => {
    const updatedTask = { ...dailyTask, study: session };
    saveTask(updatedTask);
  };
  
  const handleEnglishSessionSave = (session: any) => {
    const updatedTask = { ...dailyTask, english: session };
    saveTask(updatedTask);
  };
  
  const handleMoodChange = (mood: MoodType) => {
    const updatedTask = { ...dailyTask, mood };
    saveTask(updatedTask);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">
            Today <span className="text-lg font-normal text-muted-foreground ml-2">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </span>
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <NoFapTracker 
            currentStreak={dailyTask.nofapDay}
            maintained={dailyTask.nofapMaintained}
            onStrengthChange={handleNoFapUpdate}
          />

          <PrayerTracker 
            prayers={dailyTask.prayers} 
            onPrayersUpdate={handlePrayersUpdate} 
          />

          <QuranTracker 
            quranProgress={dailyTask.quran}
            onProgressSave={handleQuranProgressSave}
          />

          <StudyTracker 
            studySession={dailyTask.study}
            onSessionSave={handleStudySessionSave}
          />

          <EnglishTracker 
            englishSession={dailyTask.english}
            onSessionSave={handleEnglishSessionSave}
          />

          <MoodTracker 
            currentMood={dailyTask.mood}
            onMoodChange={handleMoodChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
