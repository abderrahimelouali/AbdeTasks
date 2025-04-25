
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { CategoryType, MoodType, EnglishSkill } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatReadableDate(date: Date): string {
  return format(date, 'MMM dd, yyyy (EEE)');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function getCategoryColor(category: CategoryType): string {
  switch (category) {
    case 'nofap':
      return '#FF007F';
    case 'prayer':
      return '#00CFFF';
    case 'quran':
      return '#00FF85';
    case 'english':
      return '#FFE600';
    case 'study':
      return '#7F00FF';
    default:
      return '#7F00FF';
  }
}

export function getCategoryBgClass(category: CategoryType): string {
  switch (category) {
    case 'nofap':
      return 'bg-nofap';
    case 'prayer':
      return 'bg-prayer';
    case 'quran':
      return 'bg-quran';
    case 'english':
      return 'bg-english';
    case 'study':
      return 'bg-study';
    default:
      return 'bg-primary';
  }
}

export function getCategoryTextClass(category: CategoryType): string {
  switch (category) {
    case 'nofap':
      return 'text-nofap';
    case 'prayer':
      return 'text-prayer';
    case 'quran':
      return 'text-quran';
    case 'english':
      return 'text-english';
    case 'study':
      return 'text-study';
    default:
      return 'text-primary';
  }
}

export function getMoodEmoji(mood: MoodType): string {
  switch (mood) {
    case 'great':
      return '😁';
    case 'good':
      return '🙂';
    case 'neutral':
      return '😐';
    case 'bad':
      return '😔';
    case 'terrible':
      return '😢';
    default:
      return '😐';
  }
}

export function getEnglishSkillIcon(skill: EnglishSkill): string {
  switch (skill) {
    case 'listening':
      return '👂';
    case 'speaking':
      return '🗣️';
    case 'reading':
      return '📖';
    case 'writing':
      return '✍️';
    case 'grammar':
      return '📝';
    case 'mixed':
      return '🔄';
    case 'rest':
      return '🛌';
    default:
      return '📚';
  }
}

export function calculateStrengthLevel(completedTasks: number, totalTasks: number): number {
  if (totalTasks === 0) return 0;
  const percentage = (completedTasks / totalTasks) * 100;
  
  if (percentage >= 95) return 7;
  if (percentage >= 85) return 6;
  if (percentage >= 75) return 5;
  if (percentage >= 65) return 4;
  if (percentage >= 55) return 3;
  if (percentage >= 45) return 2;
  if (percentage >= 30) return 1;
  return 0;
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
  
  const monday = new Date(date.setDate(diff));
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  
  return weekDates;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}
