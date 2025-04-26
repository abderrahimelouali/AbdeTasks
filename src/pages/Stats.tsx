
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         PieChart, Pie, Cell } from "recharts";
import { storage } from "@/lib/storage";
import { DailyTask, CategoryType, EnglishSkill, StudySession } from "@/types";
import { calculateStrengthLevel, getCategoryColor } from "@/lib/utils";

const StatsPage = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [strengthData, setStrengthData] = useState<{category: string, level: number, color: string}[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<{date: string, completed: number, total: number}[]>([]);
  const [englishSkillsData, setEnglishSkillsData] = useState<{name: string, value: number, color: string}[]>([]);
  const [studyHoursData, setStudyHoursData] = useState<{topic: string, hours: number}[]>([]);
  const [quranVersesData, setQuranVersesData] = useState<{date: string, verses: number}[]>([]);

  useEffect(() => {
    const loadedTasks = storage.getDailyTasks();
    // Sort tasks by date (newest first)
    loadedTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setTasks(loadedTasks);
    
    // Calculate strength levels
    calculateStrengthData(loadedTasks);
    
    // Calculate task completion data
    calculateTaskCompletionData(loadedTasks);
    
    // Calculate English skills data
    calculateEnglishSkillsData(loadedTasks);
    
    // Get all study sessions from storage instead of just from daily tasks
    const studySessions = storage.getStudySessions();
    calculateStudyHoursData(studySessions);
    
    // Calculate Quran verses data
    calculateQuranVersesData(loadedTasks);
    
  }, []);
  
  const calculateStrengthData = (tasks: DailyTask[]) => {
    const categories: CategoryType[] = ['nofap', 'prayer', 'quran', 'study', 'english'];
    
    const strengthData = categories.map(category => {
      let completedCount = 0;
      let totalCount = 0;
      
      tasks.forEach(task => {
        switch(category) {
          case 'nofap':
            totalCount++;
            if (task.nofapMaintained) completedCount++;
            break;
          case 'prayer':
            totalCount += 5; // 5 prayers per day
            completedCount += task.prayers.filter(p => p.status === 'on-time' || p.status === 'late').length;
            break;
          case 'quran':
            if (task.quran) {
              totalCount++;
              if (task.quran.completed) completedCount++;
            }
            break;
          case 'study':
            if (task.study) {
              totalCount++;
              completedCount++;  // Assuming if there's a study session, it's completed
            }
            break;
          case 'english':
            if (task.english) {
              totalCount++;
              if (task.english.completed) completedCount++;
            }
            break;
        }
      });
      
      return {
        category,
        level: calculateStrengthLevel(completedCount, totalCount),
        color: getCategoryColor(category)
      };
    });
    
    setStrengthData(strengthData);
  };
  
  const calculateTaskCompletionData = (tasks: DailyTask[]) => {
    // Get last 7 days of tasks
    const recentTasks = tasks.slice(-7);
    
    const completionData = recentTasks.map(task => {
      let completed = 0;
      let total = 0;
      
      // NoFap
      total++;
      if (task.nofapMaintained) completed++;
      
      // Prayers
      total += 5;
      completed += task.prayers.filter(p => p.status === 'on-time' || p.status === 'late').length;
      
      // Quran
      if (task.quran) {
        total++;
        if (task.quran.completed) completed++;
      }
      
      // Study
      if (task.study) {
        total++;
        completed++;
      }
      
      // English
      if (task.english) {
        total++;
        if (task.english.completed) completed++;
      }
      
      return {
        date: task.date,
        completed,
        total
      };
    });
    
    setTaskCompletionData(completionData);
  };
  
  const calculateEnglishSkillsData = (tasks: DailyTask[]) => {
    const skills: Record<EnglishSkill, number> = {
      'listening': 0,
      'speaking': 0,
      'reading': 0,
      'writing': 0,
      'grammar': 0,
      'mixed': 0,
      'rest': 0
    };
    
    tasks.forEach(task => {
      if (task.english?.completed) {
        skills[task.english.skill]++;
      }
    });
    
    const skillColors: Record<string, string> = {
      'listening': '#FFE600',
      'speaking': '#FFB800',
      'reading': '#FFA200',
      'writing': '#FF8C00',
      'grammar': '#FF7600',
      'mixed': '#FFD000',
      'rest': '#FFEA80'
    };
    
    const skillsData = Object.entries(skills)
      .filter(([_, count]) => count > 0)
      .map(([skill, value]) => ({
        name: skill,
        value,
        color: skillColors[skill] || '#FFE600'
      }));
    
    setEnglishSkillsData(skillsData);
  };
  
  const calculateStudyHoursData = (studySessions: StudySession[]) => {
    // Fix: Properly aggregate hours by normalized topic name
    const topicHours: Record<string, number> = {};
    const topicNameMap: Record<string, string> = {}; // To preserve original capitalization
    
    studySessions.forEach(session => {
      // Normalize the topic name for consistent grouping
      const normalizedTopic = session.topic.trim().toLowerCase();
      
      // Store the original topic name (for display)
      if (!topicNameMap[normalizedTopic]) {
        topicNameMap[normalizedTopic] = session.topic;
      }
      
      if (!topicHours[normalizedTopic]) {
        topicHours[normalizedTopic] = 0;
      }
      
      // Add hours to the topic total
      topicHours[normalizedTopic] += session.duration;
    });
    
    // Create data array using the original topic names
    const studyHours = Object.entries(topicHours)
      .map(([normalizedTopic, hours]) => ({
        topic: topicNameMap[normalizedTopic] || normalizedTopic,
        hours
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);  // Top 5 topics
    
    setStudyHoursData(studyHours);
  };
  
  const calculateQuranVersesData = (tasks: DailyTask[]) => {
    // Get last 7 days with Quran activity
    const quranTasks = tasks
      .filter(task => task.quran)
      .slice(-7);
    
    const quranData = quranTasks.map(task => {
      const verses = task.quran ? (task.quran.endVerse - task.quran.startVerse) + 1 : 0;
      
      return {
        date: task.date,
        verses
      };
    });
    
    setQuranVersesData(quranData);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Statistics & Strength</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Strength Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strengthData.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{item.category}</span>
                      <span>Level {item.level}/7</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${(item.level / 7) * 100}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={taskCompletionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Tasks Completed" fill="#7F00FF" />
                  <Bar dataKey="total" name="Total Tasks" fill="#e5e7eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>English Skills Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={englishSkillsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {englishSkillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Study Hours by Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={studyHoursData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="topic" width={80} />
                  <Tooltip />
                  <Bar dataKey="hours" name="Hours" fill="#7F00FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Qur'an Verses Per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={quranVersesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="verses" name="Verses" fill="#00FF85" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StatsPage;
