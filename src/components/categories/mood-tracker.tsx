
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoodType } from "@/types";
import { getMoodEmoji } from "@/lib/utils";

interface MoodTrackerProps {
  currentMood: MoodType | null;
  onMoodChange: (mood: MoodType) => void;
}

export function MoodTracker({ currentMood, onMoodChange }: MoodTrackerProps) {
  const moods: MoodType[] = ['great', 'good', 'neutral', 'bad', 'terrible'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span>😊</span> Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between">
          {moods.map(mood => (
            <Button
              key={mood}
              variant="ghost"
              className={`text-3xl ${currentMood === mood ? 'bg-accent animate-pulse-gentle' : ''}`}
              onClick={() => onMoodChange(mood)}
            >
              {getMoodEmoji(mood)}
            </Button>
          ))}
        </div>
        <p className="text-center mt-3 text-sm text-muted-foreground">
          {currentMood ? `You're feeling ${currentMood} today` : "How are you feeling today?"}
        </p>
      </CardContent>
    </Card>
  );
}
