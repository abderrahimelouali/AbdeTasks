
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { QuranProgress } from "@/types";

interface QuranTrackerProps {
  quranProgress: QuranProgress | null;
  onProgressSave: (progress: QuranProgress) => void;
}

export function QuranTracker({ quranProgress, onProgressSave }: QuranTrackerProps) {
  const [surah, setSurah] = useState<string>(quranProgress?.surah || "Al-Baqarah");
  const [startVerse, setStartVerse] = useState<number>(quranProgress?.startVerse || 1);
  const [endVerse, setEndVerse] = useState<number>(quranProgress?.endVerse || 1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const progress: QuranProgress = {
      date: new Date().toISOString().split('T')[0],
      surah,
      startVerse,
      endVerse,
      completed: true
    };
    
    onProgressSave(progress);
  };
  
  return (
    <Card className="border-quran/50">
      <CardHeader className="bg-quran/10 pb-2">
        <CardTitle className="text-quran flex items-center gap-2">
          <span>📖</span> Qur'an Memorization
        </CardTitle>
        {quranProgress && (
          <CardDescription>
            Last: {quranProgress.surah} ({quranProgress.startVerse}-{quranProgress.endVerse})
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="surah">Surah</Label>
              <Input
                id="surah"
                value={surah}
                onChange={(e) => setSurah(e.target.value)}
                placeholder="e.g. Al-Baqarah"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startVerse">Start Verse</Label>
              <Input
                id="startVerse"
                type="number"
                min={1}
                value={startVerse}
                onChange={(e) => setStartVerse(parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endVerse">End Verse</Label>
              <Input
                id="endVerse"
                type="number"
                min={startVerse}
                value={endVerse}
                onChange={(e) => setEndVerse(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-quran hover:bg-quran/90 text-black">
            Save Progress
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
