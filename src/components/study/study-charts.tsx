
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudySession } from "@/types";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

interface StudyChartsProps {
  topicData: Array<{
    topic: string;
    hours: number;
    color: string;
  }>;
}

export function StudyCharts({ topicData }: StudyChartsProps) {
  if (topicData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Study Hours by Topic</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No study data available yet</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Study Topics</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No study data available yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
  );
}
