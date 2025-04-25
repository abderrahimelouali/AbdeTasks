
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { DailyTask, CategoryType } from "@/types";
import { getMoodEmoji, getCategoryBgClass } from "@/lib/utils";

const TasksPage = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<DailyTask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | "all">("all");
  
  useEffect(() => {
    const loadedTasks = storage.getDailyTasks();
    // Sort tasks by date (newest first)
    loadedTasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTasks(loadedTasks);
    setFilteredTasks(loadedTasks);
  }, []);
  
  useEffect(() => {
    let result = tasks;
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(task => {
        switch(categoryFilter) {
          case "nofap": return true; // Always included
          case "prayer": return true; // Always included
          case "quran": return !!task.quran;
          case "study": return !!task.study;
          case "english": return !!task.english;
          default: return true;
        }
      });
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => {
        return (
          task.date.toLowerCase().includes(term) ||
          (task.study?.topic.toLowerCase().includes(term) || false) ||
          (task.study?.notes.toLowerCase().includes(term) || false) ||
          (task.quran?.surah.toLowerCase().includes(term) || false) ||
          (task.english?.notes.toLowerCase().includes(term) || false)
        );
      });
    }
    
    setFilteredTasks(result);
  }, [tasks, categoryFilter, searchTerm]);
  
  const renderTaskCard = (task: DailyTask) => {
    return (
      <Card key={task.date} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between">
            <span>{format(new Date(task.date), "EEEE, MMMM d, yyyy")}</span>
            {task.mood && <span>{getMoodEmoji(task.mood)}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <span className="font-medium">No Fap:</span> Day {task.nofapDay} {task.nofapMaintained ? '✅' : '❌'}
              </div>
              
              <div className="mb-2">
                <span className="font-medium">Prayers:</span>
                <div className="flex space-x-2 mt-1">
                  {task.prayers.map(prayer => (
                    <div key={prayer.name} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
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
              </div>
            </div>
            
            <div>
              {task.quran && (
                <div className="mb-2">
                  <span className="font-medium">Qur'an:</span> {task.quran.surah} ({task.quran.startVerse}-{task.quran.endVerse})
                </div>
              )}
              
              {task.study && (
                <div className="mb-2">
                  <span className="font-medium">Study:</span> {task.study.topic} - {task.study.duration}h
                  {task.study.notes && <p className="text-sm text-muted-foreground">{task.study.notes}</p>}
                </div>
              )}
              
              {task.english && (
                <div className="mb-2">
                  <span className="font-medium">English:</span> {task.english.skill} {task.english.completed ? '✅' : '❌'}
                  {task.english.notes && <p className="text-sm text-muted-foreground">{task.english.notes}</p>}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const categories: {id: CategoryType | 'all', label: string}[] = [
    { id: 'all', label: 'All' },
    { id: 'nofap', label: 'No Fap' },
    { id: 'prayer', label: 'Prayer' },
    { id: 'quran', label: 'Qur\'an' },
    { id: 'study', label: 'Study' },
    { id: 'english', label: 'English' },
  ];
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={categoryFilter === cat.id ? "default" : "outline"}
                className={`${categoryFilter === cat.id && cat.id !== 'all' ? getCategoryBgClass(cat.id as CategoryType) : ''}`}
                onClick={() => setCategoryFilter(cat.id as CategoryType | 'all')}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(renderTaskCard)
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tasks found. Try changing your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TasksPage;
