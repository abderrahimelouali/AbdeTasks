
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CategoryType, MoodType } from "@/types";
 
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
