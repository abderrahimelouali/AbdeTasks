
export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  versesCount: number;
}

// List of surahs in the Quran with their Arabic names, English names, and verse counts
export const surahs: SurahInfo[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", versesCount: 7 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", versesCount: 286 },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", versesCount: 200 },
  { number: 4, name: "النساء", englishName: "An-Nisa", versesCount: 176 },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", versesCount: 120 },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", versesCount: 165 },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", versesCount: 206 },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", versesCount: 75 },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", versesCount: 129 },
  { number: 10, name: "يونس", englishName: "Yunus", versesCount: 109 },
  { number: 11, name: "هود", englishName: "Hud", versesCount: 123 },
  { number: 12, name: "يوسف", englishName: "Yusuf", versesCount: 111 },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", versesCount: 43 },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", versesCount: 52 },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", versesCount: 99 },
  { number: 16, name: "النحل", englishName: "An-Nahl", versesCount: 128 },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", versesCount: 111 },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", versesCount: 110 },
  { number: 19, name: "مريم", englishName: "Maryam", versesCount: 98 },
  { number: 20, name: "طه", englishName: "Ta-Ha", versesCount: 135 }
];

// Get a list of memorized verses for a particular surah
export const getMemorizedVerses = (tasks: any[], surahName: string): number[] => {
  const memorizedVerses: number[] = [];
  
  // Filter tasks with the specific surah and not reviews
  tasks.filter(task => 
    task.quran && 
    task.quran.surah === surahName && 
    !task.quran.isReview
  ).forEach(task => {
    // Add all verses in range to the array
    for (let i = task.quran.startVerse; i <= task.quran.endVerse; i++) {
      if (!memorizedVerses.includes(i)) {
        memorizedVerses.push(i);
      }
    }
  });
  
  // Sort verses numerically
  memorizedVerses.sort((a, b) => a - b);
  
  return memorizedVerses;
};

// Get the verse ranges from a list of verses
export const getVerseRanges = (verses: number[]): {start: number, end: number}[] => {
  if (!verses.length) return [];
  
  const ranges: {start: number, end: number}[] = [];
  let start = verses[0];
  let end = verses[0];
  
  for (let i = 1; i < verses.length; i++) {
    if (verses[i] === end + 1) {
      // Continue the current range
      end = verses[i];
    } else {
      // End the current range and start a new one
      ranges.push({start, end});
      start = verses[i];
      end = verses[i];
    }
  }
  
  // Add the last range
  ranges.push({start, end});
  
  return ranges;
};

// Find which surahs the user has memorized verses from
export const getMemorizedSurahs = (tasks: any[]): string[] => {
  const surahs = new Set<string>();
  
  tasks.forEach(task => {
    if (task.quran && !task.quran.isReview) {
      surahs.add(task.quran.surah);
    }
  });
  
  return Array.from(surahs);
};
