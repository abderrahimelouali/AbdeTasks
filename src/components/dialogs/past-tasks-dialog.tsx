
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DailyTask } from "@/types";
import { Edit } from "lucide-react";

interface PastTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pastTasks: DailyTask[];
  onEditTask: (date: string) => void;
}

export function PastTasksDialog({ 
  open, 
  onOpenChange, 
  pastTasks, 
  onEditTask 
}: PastTasksDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Past Tasks</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {pastTasks.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Prayers</th>
                  <th className="text-left py-2">Quran</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastTasks
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((task) => (
                    <tr key={task.date} className="border-b hover:bg-muted/50">
                      <td className="py-2">
                        {format(new Date(task.date), "MMM d, yyyy")}
                        {task.mood && (
                          <span className="ml-2 text-lg" title={`Mood: ${task.mood}`}>
                            {task.mood === 'great' ? '😄' : 
                             task.mood === 'good' ? '🙂' : 
                             task.mood === 'neutral' ? '😐' : 
                             task.mood === 'bad' ? '😔' : '😢'}
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="flex space-x-1">
                          {task.prayers.map(prayer => (
                            <div key={prayer.name} 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                                ${prayer.status === 'on-time' ? 'bg-green-500' : 
                                 prayer.status === 'late' ? 'bg-yellow-500' : 
                                 prayer.status === 'missed' ? 'bg-red-500' : 'bg-gray-300'} 
                                text-white capitalize`}
                              title={`${prayer.name}: ${prayer.status}`}
                            >
                              {prayer.name[0].toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-2">
                        {task.quran ? (
                          <span>
                            {task.quran.surah} ({task.quran.startVerse}-{task.quran.endVerse})
                            {task.quran.isReview && " (Review)"}
                          </span>
                        ) : "None"}
                      </td>
                      <td className="py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditTask(task.date)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No past tasks found.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
