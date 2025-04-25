
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { StudySession } from "@/types";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const StudyPage = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<StudySession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "topic" | "duration">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [topicData, setTopicData] = useState<{topic: string, hours: number, color: string}[]>([]);
  
  useEffect(() => {
    const loadedSessions = storage.getStudySessions();
    setStudySessions(loadedSessions);
    setFilteredSessions(loadedSessions);
    
    // Generate topic data for charts
    generateTopicData(loadedSessions);
  }, []);
  
  useEffect(() => {
    let result = [...studySessions];
    
    // Apply search term
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
    
    // Apply sorting
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
      if (!topicHours[session.topic]) {
        topicHours[session.topic] = 0;
      }
      
      topicHours[session.topic] += session.duration;
    });
    
    const colors = [
      "#7F00FF", "#6A00D9", "#5500B3", "#40008C", "#2A0066", 
      "#15003F", "#000019", "#9B00FF", "#B700FF", "#D200FF"
    ];
    
    const data = Object.entries(topicHours)
      .map(([topic, hours], index) => ({
        topic,
        hours,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.hours - a.hours);
    
    setTopicData(data);
  };
  
  const getTypeIcon = (type: string): string => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes("review") || lowerType.includes("✅")) return "✅";
    if (lowerType.includes("new") || lowerType.includes("🚀")) return "🚀";
    if (lowerType.includes("practice") || lowerType.includes("🧠")) return "🧠";
    if (lowerType.includes("project") || lowerType.includes("🎯")) return "🎯";
    
    return "📚";
  };
  
  const toggleSort = (field: "date" | "topic" | "duration") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };
  
  const totalHours = studySessions.reduce((total, session) => total + session.duration, 0);
  const uniqueTopics = new Set(studySessions.map(s => s.topic)).size;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Study Progress</h1>
          
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
              <div className="text-2xl font-bold text-study">{studySessions.length}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Hours by Topic</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ topic, percent }) => `${topic.length > 10 ? topic.substring(0, 10) + '...' : topic}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                  >
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Study Topics</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicData.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="topic" width={90} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                  <Bar dataKey="hours" fill="#7F00FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
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
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Topic</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-right">Hours</th>
                  <th className="p-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-muted/20">
                    <td className="p-3">{session.date}</td>
                    <td className="p-3 font-medium">{session.topic}</td>
                    <td className="p-3">
                      <span className="mr-1">{getTypeIcon(session.type)}</span>
                      {session.type}
                    </td>
                    <td className="p-3 text-right">{session.duration}</td>
                    <td className="p-3 text-sm text-muted-foreground">{session.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSessions.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No study sessions found with your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudyPage;
