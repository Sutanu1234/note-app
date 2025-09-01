"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface CalendarInputProps {
  label: string;
  required?: boolean;
  className?: string;
}

export function CalendarInput({
  label,
  required,
  className,
}: CalendarInputProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "peer block w-full rounded-md border border-gray-300 bg-transparent p-4 text-left text-sm text-gray-900 focus:border-blue-500 focus:ring-0 focus:outline-none",
              !date && "text-gray-400",
              className
            )}
          >
            <CalendarIcon
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            {date ? format(date, "PPP") : " "}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Floating Label */}
      <label
        className={cn(
          "absolute left-3 top-3 text-gray-500 text-sm transition-all bg-white",
          "peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400",
          "peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-600 peer-focus:px-1",
          date && "top-[-8px] text-xs text-gray-700 px-1"
        )}
      >
        {label} {required && "*"}
      </label>
    </div>
  );
}
