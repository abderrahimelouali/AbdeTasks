
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { EnglishSession, EnglishSkill } from "@/types";
import { generateId, getEnglishSkillIcon } from "@/lib/utils";

interface EnglishTrackerProps {
  englishSession: EnglishSession | null;
  onSessionSave: (session: EnglishSession) => void;
}

export function EnglishTracker({ englishSession, onSessionSave }: EnglishTrackerProps) {
  const [skill, setSkill] = useState<EnglishSkill>(
    englishSession?.skill || "listening"
  );
  const [completed, setCompleted] = useState<boolean>(
    englishSession?.completed || false
  );
  const [notes, setNotes] = useState<string>(englishSession?.notes || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const session: EnglishSession = {
      id: englishSession?.id || generateId(),
      date: new Date().toISOString().split('T')[0],
      skill,
      completed,
      notes
    };
    
    onSessionSave(session);
  };
  
  const skills: EnglishSkill[] = ['listening', 'speaking', 'reading', 'writing', 'grammar', 'mixed', 'rest'];
  
  return (
    <Card className="border-english/50">
      <CardHeader className="bg-english/10 pb-2">
        <CardTitle className="text-english flex items-center gap-2">
          <span>🌎</span> English Skills
        </CardTitle>
        {englishSession && (
          <CardDescription>
            Last: {getEnglishSkillIcon(englishSession.skill)} {englishSession.skill} {englishSession.completed ? '✅' : '❌'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Skill for today</Label>
            <RadioGroup
              value={skill}
              onValueChange={(value) => setSkill(value as EnglishSkill)}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
            >
              {skills.map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <RadioGroupItem value={s} id={`skill-${s}`} />
                  <Label htmlFor={`skill-${s}`} className="capitalize">
                    {getEnglishSkillIcon(s)} {s}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-english focus:ring-english"
            />
            <Label htmlFor="completed" className="text-sm font-medium leading-none">
              Completed (30 minutes)
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you practice today?"
              rows={3}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-english hover:bg-english/90 text-black"
          >
            Save English Practice
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
