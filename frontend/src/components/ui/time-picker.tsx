"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = String(Math.floor(index / 4)).padStart(2, "0");
  const minutes = String((index % 4) * 15).padStart(2, "0");
  return `${hours}:${minutes}`;
});

export function isValidTime(value?: string | null) {
  return Boolean(value && /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value));
}

interface TimeListProps {
  value?: string | null;
  onSelect: (value: string) => void;
}

export function TimeList({ value, onSelect }: TimeListProps) {
  const selectedRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <ScrollArea className="h-64 w-[7.5rem]">
      <div className="flex flex-col gap-1 p-1" role="listbox" aria-label="Horários">
        {TIME_OPTIONS.map((time) => {
          const isSelected = value === time;
          return (
            <Button
              key={time}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              variant={isSelected ? "default" : "ghost"}
              role="option"
              aria-selected={isSelected}
              className="h-9 justify-center font-normal"
              onClick={() => onSelect(time)}
            >
              {time}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export type TimePickerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "onChange" | "defaultValue"
> & {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    { value, onChange, placeholder = "Selecione um horário", className, disabled, ...props },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

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
              !isValidTime(value) && "text-muted-foreground",
              className,
            )}
            {...props}
          >
            <Clock className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
            {isValidTime(value) ? (
              value
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <TimeList
            value={value}
            onSelect={(time) => {
              onChange?.(time);
              setOpen(false);
            }}
          />
          {value && (
            <div className="border-t p-1">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-center font-normal text-muted-foreground"
                onClick={() => {
                  onChange?.("");
                  setOpen(false);
                }}
              >
                Limpar
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);
TimePicker.displayName = "TimePicker";
