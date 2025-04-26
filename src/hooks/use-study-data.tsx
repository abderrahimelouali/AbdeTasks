
import { useState, useEffect } from "react";
import { StudySession } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export function useStudyData() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<StudySession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "topic" | "duration">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [topicData, setTopicData] = useState<{topic: string, hours: number, color: string}[]>([]);
  
  useEffect(() => {
    loadStudySessions();
  }, []);
  
  const loadStudySessions = () => {
    const loadedSessions = storage.getStudySessions();
    setStudySessions(loadedSessions);
    setFilteredSessions(loadedSessions);
    generateTopicData(loadedSessions);
  };

  useEffect(() => {
    let result = [...studySessions];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(session => {
        return (
          session.topic.toLowerCase().includes(term) ||
          session.type.toLowerCase().includes(term) ||
          session.notes.toLowerCase().includes(term) ||
          session.date.toLowerCase().includes(term)
        );
      });
    }
    
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "topic") {
        return sortDirection === "asc"
          ? a.topic.localeCompare(b.topic)
          : b.topic.localeCompare(a.topic);
      } else {
        return sortDirection === "asc"
          ? a.duration - b.duration
          : b.duration - a.duration;
      }
    });
    
    setFilteredSessions(result);
  }, [studySessions, searchTerm, sortBy, sortDirection]);

  const generateTopicData = (sessions: StudySession[]) => {
    const topicHours: Record<string, number> = {};
    
    sessions.forEach(session => {
      const normalizedTopic = session.topic.trim().toLowerCase();
      
      if (!topicHours[normalizedTopic]) {
        topicHours[normalizedTopic] = 0;
      }
      
      topicHours[normalizedTopic] += session.duration;
    });
    
    const colors = [
      "#7F00FF", "#6A00D9", "#5500B3", "#40008C", "#2A0066", 
      "#15003F", "#000019", "#9B00FF", "#B700FF", "#D200FF"
    ];
    
    const topicNameMap: Record<string, string> = {};
    sessions.forEach(session => {
      const normalizedTopic = session.topic.trim().toLowerCase();
      if (!topicNameMap[normalizedTopic]) {
        topicNameMap[normalizedTopic] = session.topic;
      }
    });
    
    const data = Object.entries(topicHours)
      .map(([normalizedTopic, hours], index) => ({
        topic: topicNameMap[normalizedTopic] || normalizedTopic,
        hours,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.hours - a.hours);
    
    setTopicData(data);
  };

  const deleteSession = (session: StudySession) => {
    if (window.confirm(`Are you sure you want to delete this study session for ${session.topic}?`)) {
      const updatedSessions = studySessions.filter(s => s.id !== session.id);
      localStorage.setItem('abdetask_study_sessions', JSON.stringify(updatedSessions));
      
      const dailyTask = storage.getDailyTaskByDate(session.date);
      if (dailyTask && dailyTask.study?.id === session.id) {
        dailyTask.study = null;
        storage.saveDailyTask(dailyTask);
      }
      
      loadStudySessions();
      toast({
        title: "Study session deleted",
        description: `${session.topic} has been removed`,
      });
    }
  };

  const toggleSort = (field: "date" | "topic" | "duration") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  return {
    studySessions,
    filteredSessions,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortDirection,
    topicData,
    deleteSession,
    toggleSort,
    loadStudySessions
  };
}
