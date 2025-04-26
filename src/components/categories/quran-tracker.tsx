
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

// Complete list of surahs with verse counts in Warsh style and Arabic names
const WARSH_SURAH_VERSES: Record<string, { verses: number, arabic: string }> = {
  "Al-Fatihah": { verses: 7, arabic: "الفاتحة" },
  "Al-Baqarah": { verses: 285, arabic: "البقرة" }, // Note: 285 verses in Warsh, not 286 as in Hafs
  "Al-Imran": { verses: 200, arabic: "آل عمران" },
  "An-Nisa": { verses: 176, arabic: "النساء" },
  "Al-Maidah": { verses: 120, arabic: "المائدة" },
  "Al-Anam": { verses: 165, arabic: "الأنعام" },
  "Al-Araf": { verses: 206, arabic: "الأعراف" },
  "Al-Anfal": { verses: 75, arabic: "الأنفال" },
  "At-Tawbah": { verses: 129, arabic: "التوبة" },
  "Yunus": { verses: 109, arabic: "يونس" },
  "Hud": { verses: 123, arabic: "هود" },
  "Yusuf": { verses: 111, arabic: "يوسف" },
  "Ar-Rad": { verses: 43, arabic: "الرعد" },
  "Ibrahim": { verses: 52, arabic: "إبراهيم" },
  "Al-Hijr": { verses: 99, arabic: "الحجر" },
  "An-Nahl": { verses: 128, arabic: "النحل" },
  "Al-Isra": { verses: 111, arabic: "الإسراء" },
  "Al-Kahf": { verses: 110, arabic: "الكهف" },
  "Maryam": { verses: 98, arabic: "مريم" },
  "Ta-Ha": { verses: 135, arabic: "طه" },
  "Al-Anbiya": { verses: 112, arabic: "الأنبياء" },
  "Al-Hajj": { verses: 78, arabic: "الحج" },
  "Al-Muminun": { verses: 118, arabic: "المؤمنون" },
  "An-Nur": { verses: 64, arabic: "النور" },
  "Al-Furqan": { verses: 77, arabic: "الفرقان" },
  "Ash-Shuara": { verses: 227, arabic: "الشعراء" },
  "An-Naml": { verses: 93, arabic: "النمل" },
  "Al-Qasas": { verses: 88, arabic: "القصص" },
  "Al-Ankabut": { verses: 69, arabic: "العنكبوت" },
  "Ar-Rum": { verses: 60, arabic: "الروم" },
  "Luqman": { verses: 34, arabic: "لقمان" },
  "As-Sajdah": { verses: 30, arabic: "السجدة" },
  "Al-Ahzab": { verses: 73, arabic: "الأحزاب" },
  "Saba": { verses: 54, arabic: "سبأ" },
  "Fatir": { verses: 45, arabic: "فاطر" },
  "Ya-Sin": { verses: 83, arabic: "يس" },
  "As-Saffat": { verses: 182, arabic: "الصافات" },
  "Sad": { verses: 88, arabic: "ص" },
  "Az-Zumar": { verses: 75, arabic: "الزمر" },
  "Ghafir": { verses: 85, arabic: "غافر" },
  "Fussilat": { verses: 54, arabic: "فصلت" },
  "Ash-Shura": { verses: 53, arabic: "الشورى" },
  "Az-Zukhruf": { verses: 89, arabic: "الزخرف" },
  "Ad-Dukhan": { verses: 59, arabic: "الدخان" },
  "Al-Jathiyah": { verses: 37, arabic: "الجاثية" },
  "Al-Ahqaf": { verses: 35, arabic: "الأحقاف" },
  "Muhammad": { verses: 38, arabic: "محمد" },
  "Al-Fath": { verses: 29, arabic: "الفتح" },
  "Al-Hujurat": { verses: 18, arabic: "الحجرات" },
  "Qaf": { verses: 45, arabic: "ق" },
  "Adh-Dhariyat": { verses: 60, arabic: "الذاريات" },
  "At-Tur": { verses: 49, arabic: "الطور" },
  "An-Najm": { verses: 62, arabic: "النجم" },
  "Al-Qamar": { verses: 55, arabic: "القمر" },
  "Ar-Rahman": { verses: 78, arabic: "الرحمن" },
  "Al-Waqiah": { verses: 96, arabic: "الواقعة" },
  "Al-Hadid": { verses: 29, arabic: "الحديد" },
  "Al-Mujadila": { verses: 22, arabic: "المجادلة" },
  "Al-Hashr": { verses: 24, arabic: "الحشر" },
  "Al-Mumtahanah": { verses: 13, arabic: "الممتحنة" },
  "As-Saf": { verses: 14, arabic: "الصف" },
  "Al-Jumuah": { verses: 11, arabic: "الجمعة" },
  "Al-Munafiqun": { verses: 11, arabic: "المنافقون" },
  "At-Taghabun": { verses: 18, arabic: "التغابن" },
  "At-Talaq": { verses: 12, arabic: "الطلاق" },
  "At-Tahrim": { verses: 12, arabic: "التحريم" },
  "Al-Mulk": { verses: 30, arabic: "الملك" },
  "Al-Qalam": { verses: 52, arabic: "القلم" },
  "Al-Haqqah": { verses: 52, arabic: "الحاقة" },
  "Al-Maarij": { verses: 44, arabic: "المعارج" },
  "Nuh": { verses: 28, arabic: "نوح" },
  "Al-Jinn": { verses: 28, arabic: "الجن" },
  "Al-Muzzammil": { verses: 20, arabic: "المزمل" },
  "Al-Muddaththir": { verses: 56, arabic: "المدثر" },
  "Al-Qiyamah": { verses: 40, arabic: "القيامة" },
  "Al-Insan": { verses: 31, arabic: "الإنسان" },
  "Al-Mursalat": { verses: 50, arabic: "المرسلات" },
  "An-Naba": { verses: 40, arabic: "النبأ" },
  "An-Naziat": { verses: 46, arabic: "النازعات" },
  "Abasa": { verses: 42, arabic: "عبس" },
  "At-Takwir": { verses: 29, arabic: "التكوير" },
  "Al-Infitar": { verses: 19, arabic: "الإنفطار" },
  "Al-Mutaffifin": { verses: 36, arabic: "المطففين" },
  "Al-Inshiqaq": { verses: 25, arabic: "الإنشقاق" },
  "Al-Buruj": { verses: 22, arabic: "البروج" },
  "At-Tariq": { verses: 17, arabic: "الطارق" },
  "Al-Ala": { verses: 19, arabic: "الأعلى" },
  "Al-Ghashiyah": { verses: 26, arabic: "الغاشية" },
  "Al-Fajr": { verses: 30, arabic: "الفجر" },
  "Al-Balad": { verses: 20, arabic: "البلد" },
  "Ash-Shams": { verses: 15, arabic: "الشمس" },
  "Al-Lail": { verses: 21, arabic: "الليل" },
  "Ad-Dhuha": { verses: 11, arabic: "الضحى" },
  "Ash-Sharh": { verses: 8, arabic: "الشرح" },
  "At-Tin": { verses: 8, arabic: "التين" },
  "Al-Alaq": { verses: 19, arabic: "العلق" },
  "Al-Qadr": { verses: 5, arabic: "القدر" },
  "Al-Bayyinah": { verses: 8, arabic: "البينة" },
  "Az-Zalzalah": { verses: 8, arabic: "الزلزلة" },
  "Al-Adiyat": { verses: 11, arabic: "العاديات" },
  "Al-Qariah": { verses: 11, arabic: "القارعة" },
  "At-Takathur": { verses: 8, arabic: "التكاثر" },
  "Al-Asr": { verses: 3, arabic: "العصر" },
  "Al-Humazah": { verses: 9, arabic: "الهمزة" },
  "Al-Fil": { verses: 5, arabic: "الفيل" },
  "Quraish": { verses: 4, arabic: "قريش" },
  "Al-Maun": { verses: 7, arabic: "الماعون" },
  "Al-Kawthar": { verses: 3, arabic: "الكوثر" },
  "Al-Kafirun": { verses: 6, arabic: "الكافرون" },
  "An-Nasr": { verses: 3, arabic: "النصر" },
  "Al-Masad": { verses: 5, arabic: "المسد" },
  "Al-Ikhlas": { verses: 4, arabic: "الإخلاص" },
  "Al-Falaq": { verses: 5, arabic: "الفلق" },
  "An-Nas": { verses: 6, arabic: "الناس" },
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
    const maxVerses = WARSH_SURAH_VERSES[surah]?.verses || 0;
    if (endVerse > maxVerses) {
      setEndVerse(maxVerses);
    }
    if (startVerse > maxVerses) {
      setStartVerse(1);
    }
  }, [surah]);

  const handleInputChange = (field: 'startVerse' | 'endVerse', value: string) => {
    const numValue = parseInt(value) || 1;
    const maxVerses = WARSH_SURAH_VERSES[surah]?.verses || 0;

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
    const maxVerses = WARSH_SURAH_VERSES[surah]?.verses || 0;
    
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
  
  // Get Arabic name for a surah
  const getArabicName = (englishName: string) => {
    return WARSH_SURAH_VERSES[englishName]?.arabic || englishName;
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
              Last: {quranProgress.surah} ({getArabicName(quranProgress.surah)}) ({quranProgress.startVerse}-{quranProgress.endVerse})
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
                      {getArabicName(surah)} <ChevronDown className="ml-1 h-4 w-4" />
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
                        <span className="inline-flex items-center">
                          <span className="text-base font-arabic ml-1">{WARSH_SURAH_VERSES[surahName].arabic}</span>
                          <span className="ml-2">-</span>
                          <span className="ml-2">{surahName}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({WARSH_SURAH_VERSES[surahName].verses} verses)
                          </span>
                        </span>
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
                  max={WARSH_SURAH_VERSES[surah]?.verses}
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
                  max={WARSH_SURAH_VERSES[surah]?.verses}
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
            <DialogTitle>Completed {surah} ({getArabicName(surah)})</DialogTitle>
          </DialogHeader>
          <p>You have completed all {WARSH_SURAH_VERSES[surah]?.verses} verses of {surah} ({getArabicName(surah)}). Would you like to move to the next surah?</p>
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
                    {getArabicName(reviewSurah)} <ChevronDown className="ml-1 h-4 w-4" />
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
                        <span className="inline-flex items-center">
                          <span className="text-base font-arabic ml-1">{WARSH_SURAH_VERSES[surahName]?.arabic}</span>
                          <span className="ml-2">-</span>
                          <span className="ml-2">{surahName}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            (memorized: {verseCount} verses)
                          </span>
                        </span>
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
                        <td className="py-2">
                          <span className="font-arabic ml-1">{getArabicName(progress.surah)}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({progress.surah})</span>
                        </td>
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
