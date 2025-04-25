
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudySession } from "@/types";
import { generateId } from "@/lib/utils";

interface StudyTrackerProps {
  studySession: StudySession | null;
  onSessionSave: (session: StudySession) => void;
}

export function StudyTracker({ studySession, onSessionSave }: StudyTrackerProps) {
  const [topic, setTopic] = useState<string>(studySession?.topic || "");
  const [typeOfStudy, setTypeOfStudy] = useState<string>(studySession?.type || "");
  const [duration, setDuration] = useState<number>(studySession?.duration || 1);
  const [notes, setNotes] = useState<string>(studySession?.notes || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const session: StudySession = {
      id: studySession?.id || generateId(),
      date: new Date().toISOString().split('T')[0],
      topic,
      type: typeOfStudy,
      duration,
      notes
    };
    
    onSessionSave(session);
  };
  
  return (
    <Card className="border-study/50">
      <CardHeader className="bg-study/10 pb-2">
        <CardTitle className="text-study flex items-center gap-2">
          <span>📚</span> Study Progress
        </CardTitle>
        {studySession && (
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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={typeOfStudy}
                onChange={(e) => setTypeOfStudy(e.target.value)}
                placeholder="e.g. Review, New Learning"
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
              onChange={(e) => setDuration(parseFloat(e.target.value))}
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
            Save Study Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
