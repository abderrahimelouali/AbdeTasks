
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QuranProgress } from "@/types";
import { toast } from "@/hooks/use-toast";

interface QuranTrackerProps {
  quranProgress: QuranProgress | null;
  onProgressSave: (progress: QuranProgress) => void;
}

const SURAH_VERSES = {
  "Al-Baqarah": 286,
  "Al-Imran": 200,
  // Add more surahs as needed
};

export function QuranTracker({ quranProgress, onProgressSave }: QuranTrackerProps) {
  const [surah, setSurah] = useState<string>(quranProgress?.surah || "Al-Baqarah");
  const [startVerse, setStartVerse] = useState<number>(quranProgress?.startVerse || 1);
  const [endVerse, setEndVerse] = useState<number>(quranProgress?.endVerse || 1);
  const [showNextSurahDialog, setShowNextSurahDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewVerses, setReviewVerses] = useState<number>(10);
  const [isReview, setIsReview] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReview) {
      const progress: QuranProgress = {
        date: new Date().toISOString().split('T')[0],
        surah,
        startVerse: 1,
        endVerse: reviewVerses,
        completed: true
      };
      
      onProgressSave(progress);
      setIsReview(false);
      toast({
        description: `Review session saved for ${reviewVerses} verses`,
      });
      return;
    }

    // Validate verse numbers
    const maxVerses = SURAH_VERSES[surah as keyof typeof SURAH_VERSES] || 286;
    
    if (endVerse > maxVerses) {
      toast({
        description: `${surah} has only ${maxVerses} verses.`,
        variant: "destructive"
      });
      return;
    }
    
    const progress: QuranProgress = {
      date: new Date().toISOString().split('T')[0],
      surah,
      startVerse,
      endVerse,
      completed: true
    };
    
    onProgressSave(progress);
    
    // Check if we reached the end of the surah
    if (endVerse === maxVerses) {
      setShowNextSurahDialog(true);
    }
  };

  const handleNextSurah = () => {
    // Logic to move to next surah
    if (surah === "Al-Baqarah") {
      setSurah("Al-Imran");
      setStartVerse(1);
      setEndVerse(1);
    }
    setShowNextSurahDialog(false);
  };

  const startReview = () => {
    setIsReview(true);
    setShowReviewDialog(false);
  };
  
  return (
    <>
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
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              className="text-quran border-quran/50 hover:bg-quran/10"
              onClick={() => setShowReviewDialog(true)}
            >
              Review Previous
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="surah">Surah</Label>
                <Input
                  id="surah"
                  value={surah}
                  onChange={(e) => setSurah(e.target.value)}
                  placeholder="e.g. Al-Baqarah"
                  disabled={isReview}
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
                  disabled={isReview}
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
                  disabled={isReview}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-quran hover:bg-quran/90 text-black">
              {isReview ? "Save Review" : "Save Progress"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showNextSurahDialog} onOpenChange={setShowNextSurahDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completed {surah}</DialogTitle>
          </DialogHeader>
          <p>You have completed all verses of {surah}. Would you like to move to the next surah?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNextSurahDialog(false)}>Cancel</Button>
            <Button onClick={handleNextSurah} className="bg-quran hover:bg-quran/90 text-black">
              Next Surah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Previous Verses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewVerses">How many verses would you like to review?</Label>
              <Input
                id="reviewVerses"
                type="number"
                min={1}
                max={100}
                value={reviewVerses}
                onChange={(e) => setReviewVerses(parseInt(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Cancel</Button>
            <Button onClick={startReview} className="bg-quran hover:bg-quran/90 text-black">
              Start Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
