
import { Button } from "@/components/ui/button";
import { StudySession } from "@/types";
import { Edit, Trash2 } from "lucide-react";

interface StudyTableProps {
  sessions: StudySession[];
  onEdit: (session: StudySession) => void;
  onDelete: (session: StudySession) => void;
}

export function StudyTable({ sessions, onEdit, onDelete }: StudyTableProps) {
  const getTypeIcon = (type: string): string => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes("review") || lowerType.includes("✅")) return "✅";
    if (lowerType.includes("new") || lowerType.includes("🚀")) return "🚀";
    if (lowerType.includes("practice") || lowerType.includes("🧠")) return "🧠";
    if (lowerType.includes("project") || lowerType.includes("🎯")) return "🎯";
    
    return "📚";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Topic</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-right">Hours</th>
            <th className="p-3 text-left">Notes</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-b hover:bg-muted/20">
              <td className="p-3">{session.date}</td>
              <td className="p-3 font-medium">{session.topic}</td>
              <td className="p-3">
                <span className="mr-1">{getTypeIcon(session.type)}</span>
                {session.type}
              </td>
              <td className="p-3 text-right">{session.duration}</td>
              <td className="p-3 text-sm text-muted-foreground">{session.notes}</td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(session)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onDelete(session)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {sessions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No study sessions found with your current filters.</p>
        </div>
      )}
    </div>
  );
}
