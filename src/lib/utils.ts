
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CategoryType, MoodType, EnglishSkill } from "@/types";
import { startOfWeek, addDays, format } from "date-fns";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export function getCategoryBgClass(category: CategoryType): string {
  switch(category) {
    case "nofap":
      return "bg-nofap hover:bg-nofap/90 text-black";
    case "prayer":
      return "bg-prayer hover:bg-prayer/90 text-white";
    case "quran":
      return "bg-quran hover:bg-quran/90 text-black";
    case "study":
      return "bg-study hover:bg-study/90";
    case "english":
      return "bg-english hover:bg-english/90";
    default:
      return "bg-primary hover:bg-primary/90";
  }
}

export function getMoodEmoji(mood: MoodType | null): string {
  if (!mood) return '';
  
  switch (mood) {
    case 'great': return '😄';
    case 'good': return '🙂';
    case 'neutral': return '😐';
    case 'bad': return '😔';
    case 'terrible': return '😢';
    default: return '';
  }
}

// New function: getEnglishSkillIcon
export function getEnglishSkillIcon(skill: EnglishSkill): string {
  switch (skill) {
    case 'listening': return '👂';
    case 'speaking': return '🗣️';
    case 'reading': return '📖';
    case 'writing': return '✍️';
    case 'grammar': return '📝';
    case 'mixed': return '🔄';
    case 'rest': return '😴';
    default: return '📚';
  }
}

// New function: calculateStrengthLevel
export function calculateStrengthLevel(completedTasks: number, totalTasks: number): number {
  if (totalTasks === 0) return 0;
  const ratio = completedTasks / totalTasks;
  
  // Return a level from 0-7 based on the completion ratio
  // Level 0: 0%
  // Level 1: 1-14%
  // Level 2: 15-28%
  // Level 3: 29-42%
  // Level 4: 43-56%
  // Level 5: 57-70%
  // Level 6: 71-84%
  // Level 7: 85-100%
  return Math.min(Math.floor(ratio * 8), 7);
}

// New function: getCategoryColor
export function getCategoryColor(category: CategoryType): string {
  switch(category) {
    case "nofap":
      return "#000000";
    case "prayer":
      return "#7F00FF";
    case "quran":
      return "#00FF85";
    case "study":
      return "#FF5733";
    case "english":
      return "#FFE600";
    default:
      return "#1E90FF";
  }
}

// New function: getWeekDates
export function getWeekDates(date: Date): Date[] {
  // Get the Monday (start of week)
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  
  // Return array of 7 days starting from Monday
  return Array.from({ length: 7 }).map((_, index) => addDays(monday, index));
}

// New function: formatReadableDate
export function formatReadableDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}
