
import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek } from "date-fns";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { DailyTask, Prayer, PrayerStatus, CategoryType } from "@/types";
import { getWeekDates, formatDate, formatReadableDate, getCategoryBgClass } from "@/lib/utils";

const WeeklyPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [weekTasks, setWeekTasks] = useState<Record<string, DailyTask>>({});
  const [view, setView] = useState<"week" | "month">("week");
  
  useEffect(() => {
    const dates = getWeekDates(currentDate);
    setWeekDates(dates);
    
    // Load tasks for these dates
    const tasks = storage.getDailyTasks();
    const dateFormats = dates.map(d => formatDate(d));
    
    const weeklyTasks: Record<string, DailyTask> = {};
    
    dateFormats.forEach(dateStr => {
      const task = tasks.find(t => t.date === dateStr);
      if (task) {
        weeklyTasks[dateStr] = task;
      }
    });
    
    setWeekTasks(weeklyTasks);
  }, [currentDate]);
  
  const navigateWeek = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };
  
  const getPrayerStatusColor = (status: PrayerStatus): string => {
    switch (status) {
      case 'on-time':
        return 'bg-green-500';
      case 'late':
        return 'bg-yellow-500';
      case 'missed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  const getCellColor = (dateStr: string, category: CategoryType): string => {
    const task = weekTasks[dateStr];
    if (!task) return 'bg-gray-100 dark:bg-gray-800 opacity-30';
    
    let completed = false;
    
    switch (category) {
      case 'nofap':
        completed = task.nofapMaintained;
        break;
      case 'prayer':
        completed = task.prayers.filter(p => p.status === 'on-time' || p.status === 'late').length > 3;
        break;
      case 'quran':
        completed = !!task.quran?.completed;
        break;
      case 'study':
        completed = !!task.study;
        break;
      case 'english':
        completed = !!task.english?.completed;
        break;
    }
    
    if (completed) {
      return `${getCategoryBgClass(category)} opacity-100`;
    } else {
      return `${getCategoryBgClass(category)} opacity-30`;
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Weekly View</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigateWeek("prev")}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" onClick={() => navigateWeek("next")}>
              Next
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="font-medium">
            {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMMM d")} - {format(weekDates[6], "MMMM d, yyyy")}
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-6">
              {weekDates.map(date => {
                const dateStr = formatDate(date);
                const hasTask = !!weekTasks[dateStr];
                
                return (
                  <div 
                    key={dateStr} 
                    className={`text-center p-2 rounded-md ${
                      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                        ? 'border-2 border-primary'
                        : ''
                    }`}
                  >
                    <div className={`text-sm ${hasTask ? 'font-bold' : 'text-muted-foreground'}`}>
                      {format(date, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Strength Map */}
            <div className="space-y-4">
              <h3 className="font-semibold">Strength Map</h3>
              
              <div className="space-y-2">
                {(['nofap', 'prayer', 'quran', 'study', 'english'] as CategoryType[]).map(category => (
                  <div key={category} className="flex flex-col">
                    <div className="capitalize font-medium mb-1">{category}</div>
                    <div className="grid grid-cols-7 gap-1">
                      {weekDates.map(date => {
                        const dateStr = formatDate(date);
                        return (
                          <div key={`${category}-${dateStr}`}>
                            <div 
                              className={`h-4 rounded-sm ${getCellColor(dateStr, category)}`}
                              title={`${category} - ${formatReadableDate(date)}`}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prayer Status Detail */}
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold">Prayer Status</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {weekDates.map(date => {
                  const dateStr = formatDate(date);
                  const task = weekTasks[dateStr];
                  
                  return (
                    <div key={`prayer-${dateStr}`} className="space-y-2">
                      <div className="text-sm font-medium">{format(date, 'EEE, MMM d')}</div>
                      
                      {task ? (
                        <div className="grid grid-cols-5 gap-1">
                          {task.prayers.map((prayer) => (
                            <div 
                              key={prayer.name} 
                              className={`w-full h-4 rounded-sm ${getPrayerStatusColor(prayer.status)}`}
                              title={`${prayer.name}: ${prayer.status}`}
                            ></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-1">
                          {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((name) => (
                            <div 
                              key={name} 
                              className="w-full h-4 rounded-sm bg-gray-200 dark:bg-gray-700"
                              title={`${name}: no data`}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeeklyPage;
