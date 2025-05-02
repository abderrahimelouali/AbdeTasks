
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QuranProgress } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { generateId } from "@/lib/utils";

interface QuranTrackerProps {
  quranProgress: QuranProgress | null;
  onProgressSave: (progress: QuranProgress) => void;
}

export function QuranTracker({ quranProgress, onProgressSave }: QuranTrackerProps) {
  const [surah, setSurah] = useState<string>("");
  const [startVerse, setStartVerse] = useState<number>(1);
  const [endVerse, setEndVerse] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isReview, setIsReview] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  
  // Initialize form with current progress if available
  useEffect(() => {
    if (quranProgress) {
      setSurah(quranProgress.surah);
      setStartVerse(quranProgress.startVerse);
      setEndVerse(quranProgress.endVerse);
      setCompleted(quranProgress.completed);
      setIsReview(quranProgress.isReview || false);
    } else {
      // Reset form
      setSurah("");
      setStartVerse(1);
      setEndVerse(1);
      setCompleted(false);
      setIsReview(false);
    }
  }, [quranProgress]);
  
  const handleSaveProgress = () => {
    if (!surah) {
      toast({
        title: "Please enter a surah",
        variant: "destructive",
      });
      return;
    }
    
    if (startVerse > endVerse) {
      toast({
        title: "Start verse must be less than or equal to end verse",
        variant: "destructive",
      });
      return;
    }
    
    const progress: QuranProgress = {
      date: new Date().toISOString().split('T')[0],
      surah,
      startVerse,
      endVerse,
      completed,
      isReview,
    };
    
    onProgressSave(progress);
    
    toast({
      title: isReview ? "Quran review saved" : "Quran progress saved",
      description: `${surah} (${startVerse}-${endVerse})`,
    });
    
    if (showReviewForm) {
      setShowReviewForm(false);
    }
  };
  
  const handleToggleReviewForm = () => {
    setShowReviewForm(prev => !prev);
    setIsReview(true);
    
    // Reset form for review
    if (!showReviewForm) {
      setSurah("");
      setStartVerse(1);
      setEndVerse(1);
      setCompleted(true);
    }
  };

  return (
    <Card className="border-quran/50">
      <CardHeader className="bg-quran/10 pb-2">
        <CardTitle className="text-quran flex items-center gap-2">
          <span>📖</span> Qur'an
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {!showReviewForm && !quranProgress && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsReview(false)}
              >
                New Memorization
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleToggleReviewForm}
              >
                Review Previous
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="surah">Surah</Label>
                <Input
                  id="surah"
                  value={surah}
                  onChange={(e) => setSurah(e.target.value)}
                  placeholder="e.g. Al-Baqarah"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startVerse">Start Verse</Label>
                  <Input
                    id="startVerse"
                    type="number"
                    min="1"
                    value={startVerse}
                    onChange={(e) => setStartVerse(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endVerse">End Verse</Label>
                  <Input
                    id="endVerse"
                    type="number"
                    min={startVerse}
                    value={endVerse}
                    onChange={(e) => setEndVerse(parseInt(e.target.value) || startVerse)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="completed"
                  checked={completed}
                  onCheckedChange={setCompleted}
                />
                <Label htmlFor="completed">Completed</Label>
              </div>
              
              <Button 
                className="w-full bg-quran text-black hover:bg-quran/90"
                onClick={handleSaveProgress}
              >
                Save Progress
              </Button>
            </div>
          </div>
        )}
        
        {showReviewForm && !quranProgress && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="surah">Surah to Review</Label>
              <Input
                id="surah"
                value={surah}
                onChange={(e) => setSurah(e.target.value)}
                placeholder="e.g. Al-Baqarah"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startVerse">Start Verse</Label>
                <Input
                  id="startVerse"
                  type="number"
                  min="1"
                  value={startVerse}
                  onChange={(e) => setStartVerse(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endVerse">End Verse</Label>
                <Input
                  id="endVerse"
                  type="number"
                  min={startVerse}
                  value={endVerse}
                  onChange={(e) => setEndVerse(parseInt(e.target.value) || startVerse)}
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-quran text-black hover:bg-quran/90"
                onClick={handleSaveProgress}
              >
                Save Review
              </Button>
            </div>
          </div>
        )}
        
        {quranProgress && (
          <div className="space-y-4">
            {quranProgress.isReview ? (
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <p className="font-medium">Reviewed Today:</p>
                <p>{quranProgress.surah} (Verses {quranProgress.startVerse}-{quranProgress.endVerse})</p>
              </div>
            ) : (
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <p className="font-medium">Memorized Today:</p>
                <p>{quranProgress.surah} (Verses {quranProgress.startVerse}-{quranProgress.endVerse})</p>
                <p className="text-sm mt-1">{quranProgress.completed ? '✅ Completed' : '⏳ In Progress'}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onProgressSave(null)}
              >
                Clear
              </Button>
              
              {!quranProgress.isReview && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleToggleReviewForm}
                >
                  Add Review
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
