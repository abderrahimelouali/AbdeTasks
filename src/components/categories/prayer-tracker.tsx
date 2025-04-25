
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prayer, PrayerName, PrayerStatus } from "@/types";

interface PrayerTrackerProps {
  prayers: Prayer[];
  onPrayersUpdate: (prayers: Prayer[]) => void;
}

export function PrayerTracker({ prayers, onPrayersUpdate }: PrayerTrackerProps) {
  const prayerNames: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  
  const handleStatusChange = (name: PrayerName, status: PrayerStatus) => {
    const updatedPrayers = prayers.map(prayer => {
      if (prayer.name === name) {
        return { ...prayer, status };
      }
      return prayer;
    });
    
    onPrayersUpdate(updatedPrayers);
  };
  
  const getStatusColor = (status: PrayerStatus): string => {
    switch (status) {
      case 'on-time':
        return 'bg-green-500';
      case 'late':
        return 'bg-yellow-500';
      case 'missed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  return (
    <Card className="border-prayer/50">
      <CardHeader className="bg-prayer/10 pb-2">
        <CardTitle className="text-prayer flex items-center gap-2">
          <span>🕌</span> Prayers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {prayerNames.map((name) => {
            const prayer = prayers.find(p => p.name === name) || { name, status: 'not-prayed' };
            
            return (
              <div key={name} className="flex flex-col items-center">
                <div className="font-medium capitalize mb-2">{name}</div>
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(name, 'on-time')}
                    className={`${prayer.status === 'on-time' ? 'border-2 border-green-500' : 'border-green-500/30'}`}
                  >
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                    On Time
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(name, 'late')}
                    className={`${prayer.status === 'late' ? 'border-2 border-yellow-500' : 'border-yellow-500/30'}`}
                  >
                    <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                    Late
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(name, 'missed')}
                    className={`${prayer.status === 'missed' ? 'border-2 border-red-500' : 'border-red-500/30'}`}
                  >
                    <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                    Missed
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
