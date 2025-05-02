
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoodType } from "@/types";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  currentMood: MoodType | null;
  onMoodChange: (mood: MoodType) => void;
}

export function MoodTracker({ currentMood, onMoodChange }: MoodTrackerProps) {
  const moods: { value: MoodType; label: string, emoji: string }[] = [
    { value: "great", label: "Great", emoji: "😄" },
    { value: "good", label: "Good", emoji: "🙂" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "bad", label: "Bad", emoji: "😔" },
    { value: "terrible", label: "Terrible", emoji: "😢" },
  ];

  return (
    <Card className="border-mood/50">
      <CardHeader className="bg-mood/10 pb-2">
        <CardTitle className="text-mood flex items-center gap-2">
          <span>😊</span> Mood
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center h-20 p-2",
                mood.value === currentMood ? "border-2 border-mood bg-mood/10" : ""
              )}
              onClick={() => onMoodChange(mood.value)}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
