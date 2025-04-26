
import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StudyTracker } from "@/components/categories/study-tracker";
import { StudyCharts } from "@/components/study/study-charts";
import { StudyTable } from "@/components/study/study-table";
import { StudyStats } from "@/components/study/study-stats";
import { useStudyData } from "@/hooks/use-study-data";
import { StudySession } from "@/types";

const StudyPage = () => {
  const {
    filteredSessions,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortDirection,
    topicData,
    deleteSession,
    toggleSort,
    loadStudySessions
  } = useStudyData();
  
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSessionSave = () => {
    setIsDialogOpen(false);
    loadStudySessions();
  };

  const totalHours = filteredSessions.reduce((total, session) => total + session.duration, 0);
  const uniqueTopics = new Set(filteredSessions.map(s => s.topic.trim().toLowerCase())).size;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Study Progress</h1>
          
          <div className="flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSession(null)}>Add Study Session</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSession ? "Edit Study Session" : "Add Study Session"}</DialogTitle>
                </DialogHeader>
                <StudyTracker studySession={editingSession} onSessionSave={handleSessionSave} />
              </DialogContent>
            </Dialog>
            
            <StudyStats
              totalHours={totalHours}
              uniqueTopics={uniqueTopics}
              sessionCount={filteredSessions.length}
            />
          </div>
        </div>
        
        <StudyCharts topicData={topicData} />
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Input
              placeholder="Search topics, types, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-xs"
            />
            
            <div className="flex gap-2">
              <Button 
                variant={sortBy === "date" ? "default" : "outline"} 
                onClick={() => toggleSort("date")}
                size="sm"
              >
                Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
              <Button 
                variant={sortBy === "topic" ? "default" : "outline"} 
                onClick={() => toggleSort("topic")}
                size="sm"
              >
                Topic {sortBy === "topic" && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
              <Button 
                variant={sortBy === "duration" ? "default" : "outline"} 
                onClick={() => toggleSort("duration")}
                size="sm"
              >
                Duration {sortBy === "duration" && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
            </div>
          </div>
          
          <StudyTable
            sessions={filteredSessions}
            onEdit={(session) => {
              setEditingSession(session);
              setIsDialogOpen(true);
            }}
            onDelete={deleteSession}
          />
        </div>
      </div>
    </Layout>
  );
};

export default StudyPage;
