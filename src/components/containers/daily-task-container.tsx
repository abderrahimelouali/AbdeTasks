
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { DailyTask, Prayer, PrayerName, MoodType } from "@/types";
import { storage } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { DateSelector } from "@/components/date/date-selector";
import { PastTasksDialog } from "@/components/dialogs/past-tasks-dialog";
import { TrackerGrid } from "@/components/trackers/tracker-grid";

export function DailyTaskContainer() {
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
  
  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    loadTaskForDate(formattedDate);
    setSelectedDate(date);
  };
  
  const handleEditPastTask = (date: string) => {
    loadTaskForDate(date);
    setSelectedDate(new Date(date));
    setShowPastTasksDialog(false);
  };

  const isSelectedToday = formatDate(selectedDate) === today;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">
          {isSelectedToday ? 'Today' : 'Editing Past Day'} 
          <span className="text-lg font-normal text-muted-foreground ml-2">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </span>
        </h1>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          <DateSelector 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            today={today}
          />
          
          <Button
            variant="outline"
            onClick={() => setShowPastTasksDialog(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Past Tasks
          </Button>
        </div>
      </div>

      <TrackerGrid 
        dailyTask={dailyTask}
        onPrayersUpdate={handlePrayersUpdate}
        onNoFapUpdate={handleNoFapUpdate}
        onQuranProgressSave={handleQuranProgressSave}
        onStudySessionSave={handleStudySessionSave}
        onEnglishSessionSave={handleEnglishSessionSave}
        onMoodChange={handleMoodChange}
      />
      
      <PastTasksDialog 
        open={showPastTasksDialog}
        onOpenChange={setShowPastTasksDialog}
        pastTasks={pastTasks}
        onEditTask={handleEditPastTask}
      />
    </div>
  );
}
