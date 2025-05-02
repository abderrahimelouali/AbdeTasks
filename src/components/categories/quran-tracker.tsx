
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QuranProgress } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage } from "@/lib/storage";
import { surahs, getMemorizedVerses, getVerseRanges, getMemorizedSurahs } from "@/data/quran-data";

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
  const [memorizedSurahs, setMemorizedSurahs] = useState<string[]>([]);
  const [verseRanges, setVerseRanges] = useState<{start: number, end: number}[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>("");
  
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
    
    // Load memorized surahs for review
    const tasks = storage.getDailyTasks();
    setMemorizedSurahs(getMemorizedSurahs(tasks));
  }, [quranProgress]);
  
  // Update verse ranges when surah changes in review mode
  useEffect(() => {
    if (isReview && surah) {
      const tasks = storage.getDailyTasks();
      const memorizedVerses = getMemorizedVerses(tasks, surah);
      const ranges = getVerseRanges(memorizedVerses);
      setVerseRanges(ranges);
      
      // Reset selected range
      setSelectedRange("");
      
      // Reset verse inputs
      if (ranges.length > 0) {
        setStartVerse(ranges[0].start);
        setEndVerse(ranges[0].end);
      } else {
        setStartVerse(1);
        setEndVerse(1);
      }
    }
  }, [isReview, surah]);
  
  const handleSaveProgress = () => {
    if (!surah) {
      toast({
        title: "Please select a surah",
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
  
  const handleRangeSelect = (value: string) => {
    setSelectedRange(value);
    
    if (value) {
      const [start, end] = value.split('-').map(Number);
      setStartVerse(start);
      setEndVerse(end);
    }
  };
  
  const getSurahMaxVerses = () => {
    const selectedSurah = surahs.find(s => 
      s.englishName === surah || s.name === surah
    );
    return selectedSurah?.versesCount || 286; // Default to Al-Baqarah max
  };
  
  const renderSurahOption = (surahInfo: typeof surahs[0]) => {
    return `${surahInfo.englishName} (${surahInfo.name})`;
  };
  
  // Filter surahs based on mode
  const availableSurahs = isReview 
    ? surahs.filter(s => memorizedSurahs.includes(s.englishName))
    : surahs;

  return (
    <Card className="border-quran/50">
      <CardHeader className="bg-quran/10 pb-2">
        <CardTitle className="text-quran flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Qur'an
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {!showReviewForm && !quranProgress && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className={`flex-1 ${!isReview ? 'bg-quran/10 text-quran' : ''}`}
                onClick={() => setIsReview(false)}
              >
                New Memorization
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${isReview ? 'bg-quran/10 text-quran' : ''}`}
                onClick={handleToggleReviewForm}
              >
                Review Previous
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="surah">Surah</Label>
                <Select
                  value={surah}
                  onValueChange={setSurah}
                >
                  <SelectTrigger id="surah">
                    <SelectValue placeholder="Select a surah" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSurahs.map((surahInfo) => (
                      <SelectItem key={surahInfo.number} value={surahInfo.englishName}>
                        {renderSurahOption(surahInfo)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isReview && verseRanges.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="verseRange">Memorized Ranges</Label>
                  <Select
                    value={selectedRange}
                    onValueChange={handleRangeSelect}
                  >
                    <SelectTrigger id="verseRange">
                      <SelectValue placeholder="Select a verse range" />
                    </SelectTrigger>
                    <SelectContent>
                      {verseRanges.map((range, index) => (
                        <SelectItem key={index} value={`${range.start}-${range.end}`}>
                          Verses {range.start}-{range.end} ({range.end - range.start + 1} verses)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startVerse">Start Verse</Label>
                  <Input
                    id="startVerse"
                    type="number"
                    min="1"
                    max={getSurahMaxVerses()}
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
                    max={getSurahMaxVerses()}
                    value={endVerse}
                    onChange={(e) => setEndVerse(parseInt(e.target.value) || startVerse)}
                  />
                </div>
              </div>
              
              {!isReview && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="completed"
                    checked={completed}
                    onCheckedChange={setCompleted}
                  />
                  <Label htmlFor="completed">Completed</Label>
                </div>
              )}
              
              <Button 
                className="w-full bg-quran text-black hover:bg-quran/90"
                onClick={handleSaveProgress}
                disabled={isReview && verseRanges.length === 0}
              >
                Save {isReview ? 'Review' : 'Progress'}
              </Button>
              
              {isReview && verseRanges.length === 0 && surah && (
                <p className="text-sm text-red-500 text-center">
                  You haven't memorized any verses from this surah yet.
                </p>
              )}
            </div>
          </div>
        )}
        
        {showReviewForm && !quranProgress && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="surah">Surah to Review</Label>
              <Select
                value={surah}
                onValueChange={setSurah}
              >
                <SelectTrigger id="surah">
                  <SelectValue placeholder="Select a surah you've memorized" />
                </SelectTrigger>
                <SelectContent>
                  {surahs
                    .filter(s => memorizedSurahs.includes(s.englishName))
                    .map((surahInfo) => (
                      <SelectItem key={surahInfo.number} value={surahInfo.englishName}>
                        {renderSurahOption(surahInfo)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {verseRanges.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="verseRange">Memorized Ranges</Label>
                <Select
                  value={selectedRange}
                  onValueChange={handleRangeSelect}
                >
                  <SelectTrigger id="verseRange">
                    <SelectValue placeholder="Select a verse range" />
                  </SelectTrigger>
                  <SelectContent>
                    {verseRanges.map((range, index) => (
                      <SelectItem key={index} value={`${range.start}-${range.end}`}>
                        Verses {range.start}-{range.end} ({range.end - range.start + 1} verses)
                      </SelectItem>
                    ))}
                  </Select>
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startVerse">Start Verse</Label>
                <Input
                  id="startVerse"
                  type="number"
                  min="1"
                  max={getSurahMaxVerses()}
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
                  max={getSurahMaxVerses()}
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
                disabled={verseRanges.length === 0}
              >
                Save Review
              </Button>
            </div>
            
            {verseRanges.length === 0 && surah && (
              <p className="text-sm text-red-500 text-center">
                You haven't memorized any verses from this surah yet.
              </p>
            )}
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
