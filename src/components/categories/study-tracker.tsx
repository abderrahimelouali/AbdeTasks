
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudySession } from "@/types";
import { generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";

interface StudyTrackerProps {
  studySession: StudySession | null;
  onSessionSave: (session: StudySession) => void;
}

export function StudyTracker({ studySession, onSessionSave }: StudyTrackerProps) {
  const [topic, setTopic] = useState<string>("");
  const [typeOfStudy, setTypeOfStudy] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  
  // Load session data when editing
  useEffect(() => {
    if (studySession) {
      setTopic(studySession.topic);
      setTypeOfStudy(studySession.type);
      setDuration(studySession.duration);
      setNotes(studySession.notes);
    } else {
      // Reset form when adding new
      setTopic("");
      setTypeOfStudy("");
      setDuration(1);
      setNotes("");
    }
  }, [studySession]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const session: StudySession = {
      id: studySession?.id || generateId(),
      date: studySession?.date || new Date().toISOString().split('T')[0],
      topic,
      type: typeOfStudy,
      duration,
      notes
    };
    
    // Save to storage
    storage.saveStudySession(session);
    
    // Update daily task if it exists for this date
    const dailyTask = storage.getDailyTaskByDate(session.date);
    if (dailyTask) {
      dailyTask.study = session;
      storage.saveDailyTask(dailyTask);
    }
    
    onSessionSave(session);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setDuration(value);
    }
  };
  
  return (
    <Card className={studySession ? "" : "border-study/50"}>
      <CardHeader className={studySession ? "pb-2" : "bg-study/10 pb-2"}>
        <CardTitle className={studySession ? "" : "text-study flex items-center gap-2"}>
          {!studySession && <span>📚</span>} {studySession ? "Edit Study Session" : "Study Progress"}
        </CardTitle>
        {!studySession && studySession && (
          <CardDescription>
            Last: {studySession.topic} ({studySession.duration}h)
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. JavaScript Review"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={typeOfStudy}
                onChange={(e) => setTypeOfStudy(e.target.value)}
                placeholder="e.g. Review, New Learning"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min={0.5}
              step={0.5}
              value={duration}
              onChange={handleDurationChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this study session..."
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full bg-study hover:bg-study/90">
            {studySession ? "Update Study Session" : "Save Study Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
