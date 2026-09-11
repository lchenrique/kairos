"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DATE_FORMAT, parseDateValue } from "@/components/ui/date-picker";
import { isValidTime, TimeList } from "@/components/ui/time-picker";

export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm";

const splitValue = (value?: string | null) => {
  if (!value) return { date: undefined, time: "" };
  const [datePart, timePart = ""] = value.split("T");
  return {
    date: datePart || undefined,
    time: timePart.slice(0, 5),
  };
};

export type DateTimePickerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "onChange" | "defaultValue"
> & {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const DateTimePicker = React.forwardRef<
  HTMLButtonElement,
  DateTimePickerProps
>(
  (
    { value, onChange, placeholder = "Selecione data e hora", className, disabled, ...props },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const { date, time } = splitValue(value);
    const selected = parseDateValue(date);

    const emit = (nextDate?: string, nextTime?: string) => {
      if (!nextDate) {
        onChange?.("");
        return;
      }
      onChange?.(`${nextDate}T${isValidTime(nextTime) ? nextTime : "00:00"}`);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "h-10 w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground",
              className,
            )}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
            {selected ? (
              <span>
                {format(selected, "dd/MM/yyyy")}
                {isValidTime(time) ? ` às ${time}` : " às 00:00"}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex divide-x">
            <Calendar
              mode="single"
              selected={selected}
              defaultMonth={selected}
              onSelect={(nextDate) =>
                emit(
                  nextDate ? format(nextDate, DATE_FORMAT) : undefined,
                  time,
                )
              }
              initialFocus
            />
            <div className="flex flex-col">
              <p className="px-3 pt-3 text-xs font-medium uppercase text-muted-foreground">
                Horário
              </p>
              <TimeList
                value={time}
                onSelect={(nextTime) => emit(date, nextTime)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
DateTimePicker.displayName = "DateTimePicker";
