"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "onChange" | "defaultValue"
> & {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const DATE_FORMAT = "yyyy-MM-dd";

export function parseDateValue(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const base = value.length > 10 ? value.slice(0, 10) : value;
  const parsed = parse(base, DATE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    { value, onChange, placeholder = "Selecione uma data", className, disabled, ...props },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const selected = parseDateValue(value);

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
              format(selected, "PPP", { locale: ptBR })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              onChange?.(date ? format(date, DATE_FORMAT) : "");
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";
