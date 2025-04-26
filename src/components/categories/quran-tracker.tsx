import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { QuranProgress } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, Edit, Pencil } from "lucide-react";

interface QuranTrackerProps {
  quranProgress: QuranProgress | null;
  onProgressSave: (progress: QuranProgress) => void;
}

// Complete list of surahs with verse counts in Warsh style
const WARSH_SURAH_VERSES: Record<string, number> = {
  "Al-Fatihah": 7,
  "Al-Baqarah": 285, // Note: 285 verses in Warsh, not 286 as in Hafs
  "Al-Imran": 200,
  "An-Nisa": 176,
  "Al-Maidah": 120,
  "Al-Anam": 165,
  "Al-Araf": 206,
  "Al-Anfal": 75,
  "At-Tawbah": 129,
  "Yunus": 109,
  "Hud": 123,
  "Yusuf": 111,
  "Ar-Rad": 43,
  "Ibrahim": 52,
  "Al-Hijr": 99,
  "An-Nahl": 128,
  "Al-Isra": 111,
  "Al-Kahf": 110,
  "Maryam": 98,
  "Ta-Ha": 135,
  "Al-Anbiya": 112,
  "Al-Hajj": 78,
  "Al-Muminun": 118,
  "An-Nur": 64,
  "Al-Furqan": 77,
  "Ash-Shuara": 227,
  "An-Naml": 93,
  "Al-Qasas": 88,
  "Al-Ankabut": 69,
  "Ar-Rum": 60,
  "Luqman": 34,
  "As-Sajdah": 30,
  "Al-Ahzab": 73,
  "Saba": 54,
  "Fatir": 45,
  "Ya-Sin": 83,
  "As-Saffat": 182,
  "Sad": 88,
  "Az-Zumar": 75,
  "Ghafir": 85,
  "Fussilat": 54,
  "Ash-Shura": 53,
  "Az-Zukhruf": 89,
  "Ad-Dukhan": 59,
  "Al-Jathiyah": 37,
  "Al-Ahqaf": 35,
  "Muhammad": 38,
  "Al-Fath": 29,
  "Al-Hujurat": 18,
  "Qaf": 45,
  "Adh-Dhariyat": 60,
  "At-Tur": 49,
  "An-Najm": 62,
  "Al-Qamar": 55,
  "Ar-Rahman": 78,
  "Al-Waqiah": 96,
  "Al-Hadid": 29,
  "Al-Mujadila": 22,
  "Al-Hashr": 24,
  "Al-Mumtahanah": 13,
  "As-Saf": 14,
  "Al-Jumuah": 11,
  "Al-Munafiqun": 11,
  "At-Taghabun": 18,
  "At-Talaq": 12,
  "At-Tahrim": 12,
  "Al-Mulk": 30,
  "Al-Qalam": 52,
  "Al-Haqqah": 52,
  "Al-Maarij": 44,
  "Nuh": 28,
  "Al-Jinn": 28,
  "Al-Muzzammil": 20,
  "Al-Muddaththir": 56,
  "Al-Qiyamah": 40,
  "Al-Insan": 31,
  "Al-Mursalat": 50,
  "An-Naba": 40,
  "An-Naziat": 46,
  "Abasa": 42,
  "At-Takwir": 29,
  "Al-Infitar": 19,
  "Al-Mutaffifin": 36,
  "Al-Inshiqaq": 25,
  "Al-Buruj": 22,
  "At-Tariq": 17,
  "Al-Ala": 19,
  "Al-Ghashiyah": 26,
  "Al-Fajr": 30,
  "Al-Balad": 20,
  "Ash-Shams": 15,
  "Al-Lail": 21,
  "Ad-Dhuha": 11,
  "Ash-Sharh": 8,
  "At-Tin": 8,
  "Al-Alaq": 19,
  "Al-Qadr": 5,
  "Al-Bayyinah": 8,
  "Az-Zalzalah": 8,
  "Al-Adiyat": 11,
  "Al-Qariah": 11,
  "At-Takathur": 8,
  "Al-Asr": 3,
  "Al-Humazah": 9,
  "Al-Fil": 5,
  "Quraish": 4,
  "Al-Maun": 7,
  "Al-Kawthar": 3,
  "Al-Kafirun": 6,
  "An-Nasr": 3,
  "Al-Masad": 5,
  "Al-Ikhlas": 4,
  "Al-Falaq": 5,
  "An-Nas": 6,
};

// Preserve Quranic order of surahs
const ORDERED_SURAHS = [
  "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah", 
  "Al-Anam", "Al-Araf", "Al-Anfal", "At-Tawbah", "Yunus", 
  "Hud", "Yusuf", "Ar-Rad", "Ibrahim", "Al-Hijr", 
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", 
  "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", 
  "Ash-Shuara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", 
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", 
  "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", 
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", 
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", 
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", 
  "Al-Waqiah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", 
  "As-Saf", "Al-Jumuah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", 
  "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", 
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", 
  "Al-Insan", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa", 
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", 
  "At-Tariq", "Al-Ala", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", 
  "Ash-Shams", "Al-Lail", "Ad-Dhuha", "Ash-Sharh", "At-Tin", 
  "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", 
  "Al-Qariah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", 
  "Quraish", "Al-Maun", "Al-Kawthar", "Al-Kafirun", "An-Nasr", 
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

export function QuranTracker({ quranProgress, onProgressSave }: QuranTrackerProps) {
  const [surah, setSurah] = useState<string>(quranProgress?.surah || "Al-Baqarah");
  const [startVerse, setStartVerse] = useState<number>(quranProgress?.startVerse || 1);
  const [endVerse, setEndVerse] = useState<number>(quranProgress?.endVerse || 1);
  const [showNextSurahDialog, setShowNextSurahDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewVerses, setReviewVerses] = useState<number>(10);
  const [isReview, setIsReview] = useState(false);
  const [reviewSurah, setReviewSurah] = useState<string>(quranProgress?.surah || "Al-Baqarah");
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const [memorizedVersesBySurah, setMemorizedVersesBySurah] = useState<Record<string, number>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [quranProgressList, setQuranProgressList] = useState<QuranProgress[]>([]);
  const [selectedProgressToEdit, setSelectedProgressToEdit] = useState<QuranProgress | null>(null);
  
  // Load memorized verses on component mount
  useEffect(() => {
    const progressList = localStorage.getItem('abdetask_quran_progress');
    if (progressList) {
      const progressEntries: QuranProgress[] = JSON.parse(progressList);
      setQuranProgressList(progressEntries);
      
      const memorizedCounts: Record<string, number> = {};
      
      // Calculate the maximum verse number memorized for each surah
      progressEntries.forEach(entry => {
        const { surah, endVerse } = entry;
        if (!memorizedCounts[surah] || endVerse > memorizedCounts[surah]) {
          memorizedCounts[surah] = endVerse;
        }
      });
      
      setMemorizedVersesBySurah(memorizedCounts);
    }
  }, []);

  // Update endVerse when surah changes to prevent exceeding max verses
  useEffect(() => {
    const maxVerses = WARSH_SURAH_VERSES[surah] || 0;
    if (endVerse > maxVerses) {
      setEndVerse(maxVerses);
    }
    if (startVerse > maxVerses) {
      setStartVerse(1);
    }
  }, [surah]);

  const handleInputChange = (field: 'startVerse' | 'endVerse', value: string) => {
    const numValue = parseInt(value) || 1;
    const maxVerses = WARSH_SURAH_VERSES[surah] || 0;

    if (field === 'startVerse') {
      if (numValue < 1) {
        setStartVerse(1);
      } else if (numValue > maxVerses) {
        setStartVerse(maxVerses);
        toast({
          description: `${surah} only has ${maxVerses} verses in Warsh narration.`,
          variant: "destructive"
        });
      } else {
        setStartVerse(numValue);
        // If start verse is greater than end verse, update end verse
        if (numValue > endVerse) {
          setEndVerse(numValue);
        }
      }
    } else { // endVerse
      if (numValue < startVerse) {
        setEndVerse(startVerse);
        toast({
          description: `End verse cannot be less than start verse (${startVerse}).`,
          variant: "destructive"
        });
      } else if (numValue > maxVerses) {
        setEndVerse(maxVerses);
        toast({
          description: `${surah} only has ${maxVerses} verses in Warsh narration.`,
          variant: "destructive"
        });
      } else {
        setEndVerse(numValue);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReview) {
      // Validate review verses count against memorized verses
      const maxMemorizedVerses = memorizedVersesBySurah[reviewSurah] || 0;
      
      if (reviewVerses > maxMemorizedVerses) {
        toast({
          description: `You can only review ${maxMemorizedVerses} verses from ${reviewSurah} as that's all you've memorized.`,
          variant: "destructive"
        });
        return;
      }
      
      const progress: QuranProgress = {
        date: new Date().toISOString().split('T')[0],
        surah: reviewSurah,
        startVerse: 1,
        endVerse: reviewVerses,
        completed: true,
        isReview: true
      };
      
      onProgressSave(progress);
      setIsReview(false);
      toast({
        description: `Review session saved for ${reviewVerses} verses of ${reviewSurah}`,
      });
      return;
    }

    // Validate verse numbers
    const maxVerses = WARSH_SURAH_VERSES[surah] || 0;
    
    if (endVerse > maxVerses) {
      setEndVerse(maxVerses);
      toast({
        description: `${surah} has only ${maxVerses} verses in Warsh narration.`,
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
    
    // Update memorized verses count for this surah
    setMemorizedVersesBySurah(prev => ({
      ...prev,
      [surah]: Math.max(prev[surah] || 0, endVerse)
    }));
    
    // Update quran progress list
    setQuranProgressList(prevList => {
      const existingIndex = prevList.findIndex(p => p.date === progress.date && !p.isReview);
      if (existingIndex >= 0) {
        const updatedList = [...prevList];
        updatedList[existingIndex] = progress;
        return updatedList;
      }
      return [...prevList, progress];
    });
    
    // Check if we reached the end of the surah
    if (endVerse === maxVerses) {
      setShowNextSurahDialog(true);
    }
  };

  const handleNextSurah = () => {
    // Find the current surah index and move to the next one
    const currentIndex = ORDERED_SURAHS.indexOf(surah);
    if (currentIndex >= 0 && currentIndex < ORDERED_SURAHS.length - 1) {
      const nextSurah = ORDERED_SURAHS[currentIndex + 1];
      setSurah(nextSurah);
      setStartVerse(1);
      setEndVerse(1);
    }
    setShowNextSurahDialog(false);
  };

  const startReview = () => {
    if (!reviewSurah) {
      toast({
        description: "Please select a surah to review.",
        variant: "destructive"
      });
      return;
    }
    
    const maxMemorizedVerses = memorizedVersesBySurah[reviewSurah] || 0;
    
    if (maxMemorizedVerses === 0) {
      toast({
        description: `You haven't memorized any verses from ${reviewSurah} yet.`,
        variant: "destructive"
      });
      return;
    }
    
    // Set default review verses to the minimum of 10 or the total memorized
    setReviewVerses(Math.min(10, maxMemorizedVerses));
    setIsReview(true);
    setShowReviewDialog(false);
  };
  
  const showAllProgress = () => {
    setShowEditDialog(true);
  };
  
  const handleEditProgress = (progress: QuranProgress) => {
    setSelectedProgressToEdit(progress);
    
    // Set form values to match the selected progress
    setSurah(progress.surah);
    setStartVerse(progress.startVerse);
    setEndVerse(progress.endVerse);
    setIsReview(progress.isReview || false);
    
    setShowEditDialog(false);
  };
  
  const handleDeleteProgress = (dateToDelete: string, isReviewEntry: boolean = false) => {
    setQuranProgressList(prevList => {
      const updatedList = prevList.filter(p => !(p.date === dateToDelete && p.isReview === isReviewEntry));
      localStorage.setItem('abdetask_quran_progress', JSON.stringify(updatedList));
      
      // Recalculate memorized verses
      const memorizedCounts: Record<string, number> = {};
      updatedList.forEach(entry => {
        if (!entry.isReview) {
          const { surah, endVerse } = entry;
          if (!memorizedCounts[surah] || endVerse > memorizedCounts[surah]) {
            memorizedCounts[surah] = endVerse;
          }
        }
      });
      
      setMemorizedVersesBySurah(memorizedCounts);
      
      return updatedList;
    });
    
    toast({
      description: "Entry deleted successfully",
    });
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
              {quranProgress.isReview && " (Review)"}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-between mb-4">
            <Button 
              variant="outline" 
              className="text-quran border-quran/50 hover:bg-quran/10"
              onClick={showAllProgress}
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit Progress
            </Button>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between" disabled={isReview}>
                      {surah} <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-80 overflow-y-auto">
                    {ORDERED_SURAHS.map((surahName) => (
                      <DropdownMenuItem
                        key={surahName}
                        onClick={() => {
                          setSurah(surahName);
                          setStartVerse(1);
                          setEndVerse(1);
                        }}
                      >
                        {surahName} ({WARSH_SURAH_VERSES[surahName]} verses)
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startVerse">Start Verse</Label>
                <Input
                  id="startVerse"
                  type="number"
                  min={1}
                  max={WARSH_SURAH_VERSES[surah]}
                  value={startVerse}
                  onChange={(e) => handleInputChange('startVerse', e.target.value)}
                  disabled={isReview}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endVerse">End Verse</Label>
                <Input
                  id="endVerse"
                  type="number"
                  min={startVerse}
                  max={WARSH_SURAH_VERSES[surah]}
                  value={endVerse}
                  onChange={(e) => handleInputChange('endVerse', e.target.value)}
                  disabled={isReview}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-quran hover:bg-quran/90 text-black">
              {selectedProgressToEdit ? "Update Progress" : isReview ? "Save Review" : "Save Progress"}
            </Button>
            
            {selectedProgressToEdit && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => {
                  setSelectedProgressToEdit(null);
                  setSurah(quranProgress?.surah || "Al-Baqarah");
                  setStartVerse(quranProgress?.startVerse || 1);
                  setEndVerse(quranProgress?.endVerse || 1);
                }}
              >
                Cancel Editing
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Dialog open={showNextSurahDialog} onOpenChange={setShowNextSurahDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completed {surah}</DialogTitle>
          </DialogHeader>
          <p>You have completed all {WARSH_SURAH_VERSES[surah]} verses of {surah}. Would you like to move to the next surah?</p>
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
              <Label>Select Surah to Review</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between">
                    {reviewSurah} <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-80 overflow-y-auto">
                  {Object.entries(memorizedVersesBySurah)
                    .filter(([_, verseCount]) => verseCount > 0)
                    .sort(([a], [b]) => {
                      // Sort by Quranic order
                      return ORDERED_SURAHS.indexOf(a) - ORDERED_SURAHS.indexOf(b);
                    })
                    .map(([surahName, verseCount]) => (
                      <DropdownMenuItem
                        key={surahName}
                        onClick={() => {
                          setReviewSurah(surahName);
                          setReviewVerses(Math.min(10, verseCount));
                        }}
                      >
                        {surahName} (memorized: {verseCount} verses)
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reviewVerses">
                How many verses would you like to review?
                {memorizedVersesBySurah[reviewSurah] > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Max: {memorizedVersesBySurah[reviewSurah] || 0} verses)
                  </span>
                )}
              </Label>
              <Input
                id="reviewVerses"
                type="number"
                min={1}
                max={memorizedVersesBySurah[reviewSurah] || 100}
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
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Progress History</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {quranProgressList.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Surah</th>
                    <th className="text-left py-2">Verses</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quranProgressList
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((progress, idx) => (
                      <tr key={`${progress.date}-${idx}`} className="border-b hover:bg-muted/50">
                        <td className="py-2">{progress.date}</td>
                        <td className="py-2">{progress.surah}</td>
                        <td className="py-2">{progress.startVerse}-{progress.endVerse}</td>
                        <td className="py-2">{progress.isReview ? "Review" : "New"}</td>
                        <td className="py-2 space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProgress(progress)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteProgress(progress.date, progress.isReview)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No progress entries found.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEditDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
