
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface NoFapTrackerProps {
  currentStreak: number;
  maintained: boolean;
  onStrengthChange: (maintained: boolean, newStreak: number) => void;
}

export function NoFapTracker({ currentStreak, maintained, onStrengthChange }: NoFapTrackerProps) {
  const [todayChecked, setTodayChecked] = useState(false);
  const [weeklyFailures, setWeeklyFailures] = useState(0);
  
  useEffect(() => {
    const lastCheck = storage.getNofapLastCheck();
    const today = format(new Date(), 'yyyy-MM-dd');
    setTodayChecked(lastCheck === today);
    
    const failures = storage.getNofapWeeklyFailures();
    setWeeklyFailures(failures);
  }, []);
  
  const handleSuccess = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastCheck = storage.getNofapLastCheck();
    
    if (lastCheck === today) {
      toast({
        description: "You've already checked in today. Come back tomorrow!",
        variant: "destructive"
      });
      return;
    }
    
    const newStreak = currentStreak + 1;
    storage.saveNofapStreak(newStreak);
    storage.saveNofapLastCheck(today);
    setTodayChecked(true);
    onStrengthChange(true, newStreak);
    
    toast({
      description: `Great job! ${newStreak} days streak 💪`,
    });
  };
  
  const handleFailed = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastCheck = storage.getNofapLastCheck();
    
    if (lastCheck === today) {
      toast({
        description: "You've already checked in today. Start fresh tomorrow!",
        variant: "destructive"
      });
      return;
    }
    
    const newFailures = weeklyFailures + 1;
    setWeeklyFailures(newFailures);
    storage.saveNofapWeeklyFailures(newFailures);
    
    if (newFailures >= 5) {
      storage.resetNofapStreak();
      storage.resetNofapWeeklyFailures();
      setWeeklyFailures(0);
      onStrengthChange(false, 0);
      toast({
        description: "Streak reset. Time to start fresh. You can do this! 💪",
        variant: "destructive"
      });
    } else {
      const newStreak = Math.max(0, currentStreak - 2);
      storage.saveNofapStreak(newStreak);
      storage.saveNofapLastCheck(today);
      onStrengthChange(false, newStreak);
      toast({
        description: `Lost 2 days of progress. Current streak: ${newStreak} days`,
        variant: "destructive"
      });
    }
    
    setTodayChecked(true);
  };
  
  const strengthLevel = Math.min(Math.floor(currentStreak / 7), 7);
  
  return (
    <Card className="border-nofap/50">
      <CardHeader className="bg-nofap/10 pb-2">
        <CardTitle className="text-nofap flex items-center gap-2">
          <span>💪</span> No Fap Challenge
        </CardTitle>
        <CardDescription>
          Current streak: {currentStreak} days
          {weeklyFailures > 0 && (
            <span className="text-destructive ml-2">
              ({weeklyFailures}/5 failures this week)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-nofap h-2.5 rounded-full transition-all duration-500 ease-out strength-animate" 
              style={{ width: `${Math.min(currentStreak * 3, 100)}%`, opacity: 0.3 + (strengthLevel * 0.1) }}
            ></div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant={maintained ? "default" : "outline"}
              className={`${maintained ? "bg-nofap hover:bg-nofap/90" : "border-nofap text-nofap hover:bg-nofap/10"}`}
              onClick={handleSuccess}
              disabled={todayChecked}
            >
              Maintained ✓
            </Button>
            
            <Button
              variant={!maintained ? "default" : "outline"}
              className={`${!maintained ? "bg-destructive hover:bg-destructive/90" : "border-destructive text-destructive hover:bg-destructive/10"}`}
              onClick={handleFailed}
              disabled={todayChecked}
            >
              Failed ×
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
