
interface StudyStatsProps {
  totalHours: number;
  uniqueTopics: number;
  sessionCount: number;
}

export function StudyStats({ totalHours, uniqueTopics, sessionCount }: StudyStatsProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="text-center">
        <div className="text-2xl font-bold text-study">{totalHours.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground">Total Hours</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-study">{uniqueTopics}</div>
        <div className="text-xs text-muted-foreground">Topics</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-study">{sessionCount}</div>
        <div className="text-xs text-muted-foreground">Sessions</div>
      </div>
    </div>
  );
}
