
import { CategoryType } from "@/types";
import { getCategoryBgClass, calculateStrengthLevel } from "@/lib/utils";

interface StrengthIndicatorProps {
  category: CategoryType;
  completedTasks: number;
  totalTasks: number;
}

export function StrengthIndicator({ category, completedTasks, totalTasks }: StrengthIndicatorProps) {
  const strengthLevel = calculateStrengthLevel(completedTasks, totalTasks);
  const categoryClass = getCategoryBgClass(category);
  
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${categoryClass} strength-${strengthLevel}`}
        style={{ width: `${(completedTasks / Math.max(totalTasks, 1)) * 100}%` }}
      ></div>
    </div>
  );
}
