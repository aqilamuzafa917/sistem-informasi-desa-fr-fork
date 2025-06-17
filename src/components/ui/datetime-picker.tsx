"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  granularity?: "day" | "minute";
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  className,
}: DateTimePickerProps) {
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Set time to noon to avoid timezone issues
      const normalizedDate = new Date(date);
      normalizedDate.setHours(12, 0, 0, 0);
      onChange?.(normalizedDate);
    } else {
      onChange?.(undefined);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pilih Tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface TimePickerProps {
  date?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function TimePicker({
  date,
  onChange,
  className,
  placeholder,
}: TimePickerProps) {
  const [hours, setHours] = React.useState<string>(
    date ? date.getHours().toString().padStart(2, "0") : "",
  );
  const [minutes, setMinutes] = React.useState<string>(
    date ? date.getMinutes().toString().padStart(2, "0") : "",
  );

  React.useEffect(() => {
    if (date) {
      setHours(date.getHours().toString().padStart(2, "0"));
      setMinutes(date.getMinutes().toString().padStart(2, "0"));
    } else {
      setHours("");
      setMinutes("");
    }
  }, [date]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
      setHours(value);
      updateTime(value, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      setMinutes(value);
      updateTime(hours, value);
    }
  };

  const updateTime = (h: string, m: string) => {
    if (h === "" || m === "") {
      onChange?.(undefined);
      return;
    }

    const newDate = new Date();
    newDate.setHours(parseInt(h));
    newDate.setMinutes(parseInt(m));
    onChange?.(newDate);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-1">
        <input
          type="text"
          value={hours}
          onChange={handleHoursChange}
          className="w-12 rounded-md border p-2 text-center"
          maxLength={2}
          placeholder={placeholder ? "00" : undefined}
        />
        <span>:</span>
        <input
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          className="w-12 rounded-md border p-2 text-center"
          maxLength={2}
          placeholder={placeholder ? "00" : undefined}
        />
      </div>
    </div>
  );
}
