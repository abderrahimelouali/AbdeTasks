
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showPastTasksDialog, setShowPastTasksDialog] = useState(false);
  const [pastTasks, setPastTasks] = useState<DailyTask[]>([]);
  
  useEffect(() => {
    // Load tasks when component mounts
    loadTaskForDate(today);
    
    // Load past tasks for calendar view
    const allTasks = storage.getDailyTasks();
    setPastTasks(allTasks);
  }, [today]);
  
  const loadTaskForDate = (date: string) => {
    // Load task for specific date if exists
    const existingTask = storage.getDailyTaskByDate(date);
    if (existingTask) {
      setDailyTask(existingTask);
    } else if (date === today) {
      // If not found and it's today, initialize with default values and nofap streak
      setDailyTask(prev => ({
        ...prev,
        id: date,
        date: date,
        nofapDay: storage.getNofapStreak()
      }));
    } else {
      // For past dates, create a new empty task
      setDailyTask({
        id: date,
        date: date,
        nofapDay: 0, // Will be calculated properly when saved
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
    }
  };
  
  const saveTask = (updatedTask: DailyTask) => {
    storage.saveDailyTask(updatedTask);
    setDailyTask(updatedTask);
    toast({
      description: "Your progress has been saved.",
    });
    
    // Refresh past tasks list
    setPastTasks(storage.getDailyTasks());
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
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = formatDate(date);
    loadTaskForDate(formattedDate);
    setSelectedDate(date);
    setShowDateSelector(false);
  };
  
  const handleEditPastTask = (date: string) => {
    loadTaskForDate(date);
    setShowPastTasksDialog(false);
  };

  const isSelectedToday = formatDate(selectedDate) === today;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">
            {isSelectedToday ? 'Today' : 'Editing Past Day'} 
            <span className="text-lg font-normal text-muted-foreground ml-2">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </h1>
          
          <div className="flex gap-2 mt-2 sm:mt-0">
            {!isSelectedToday && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDate(new Date());
                  loadTaskForDate(today);
                }}
              >
                Back to Today
              </Button>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Select Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              onClick={() => setShowPastTasksDialog(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Past Tasks
            </Button>
          </div>
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
        
        <Dialog open={showPastTasksDialog} onOpenChange={setShowPastTasksDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Past Tasks</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {pastTasks.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Prayers</th>
                      <th className="text-left py-2">Quran</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastTasks
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((task) => (
                        <tr key={task.date} className="border-b hover:bg-muted/50">
                          <td className="py-2">
                            {format(new Date(task.date), "MMM d, yyyy")}
                            {task.mood && (
                              <span className="ml-2 text-lg" title={`Mood: ${task.mood}`}>
                                {task.mood === 'great' ? '😄' : 
                                 task.mood === 'good' ? '🙂' : 
                                 task.mood === 'neutral' ? '😐' : 
                                 task.mood === 'bad' ? '😔' : '😢'}
                              </span>
                            )}
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-1">
                              {task.prayers.map(prayer => (
                                <div key={prayer.name} 
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                                    ${prayer.status === 'on-time' ? 'bg-green-500' : 
                                     prayer.status === 'late' ? 'bg-yellow-500' : 
                                     prayer.status === 'missed' ? 'bg-red-500' : 'bg-gray-300'} 
                                    text-white capitalize`}
                                  title={`${prayer.name}: ${prayer.status}`}
                                >
                                  {prayer.name[0].toUpperCase()}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-2">
                            {task.quran ? (
                              <span>
                                {task.quran.surah} ({task.quran.startVerse}-{task.quran.endVerse})
                                {task.quran.isReview && " (Review)"}
                              </span>
                            ) : "None"}
                          </td>
                          <td className="py-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPastTask(task.date)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No past tasks found.</p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPastTasksDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Index;
