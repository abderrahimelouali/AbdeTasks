
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  today: string;
}

export function DateSelector({ selectedDate, onDateSelect, today }: DateSelectorProps) {
  const isSelectedToday = formatDate(selectedDate) === today;
  
  return (
    <div className="flex gap-2 mt-2 sm:mt-0">
      {!isSelectedToday && (
        <Button 
          variant="outline" 
          onClick={() => onDateSelect(new Date())}
        >
          Back to Today
        </Button>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Select Date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
