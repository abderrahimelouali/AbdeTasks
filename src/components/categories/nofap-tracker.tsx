
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";

interface NoFapTrackerProps {
  currentStreak: number;
  maintained: boolean;
  onStrengthChange: (maintained: boolean, newStreak: number) => void;
}

export function NoFapTracker({ currentStreak, maintained, onStrengthChange }: NoFapTrackerProps) {
  const handleSuccess = () => {
    const newStreak = currentStreak + 1;
    storage.saveNofapStreak(newStreak);
    onStrengthChange(true, newStreak);
  };
  
  const handleFailed = () => {
    storage.resetNofapStreak();
    onStrengthChange(false, 0);
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
            >
              Maintained ✓
            </Button>
            
            <Button
              variant={!maintained ? "default" : "outline"}
              className={`${!maintained ? "bg-destructive hover:bg-destructive/90" : "border-destructive text-destructive hover:bg-destructive/10"}`}
              onClick={handleFailed}
            >
              Failed ×
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
