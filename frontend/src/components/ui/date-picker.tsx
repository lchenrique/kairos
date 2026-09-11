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
  displayFormat?: "long" | "short";
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
    {
      value,
      onChange,
      placeholder = "Selecione uma data",
      displayFormat = "long",
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const selected = parseDateValue(value);
    const label = selected
      ? displayFormat === "short"
        ? format(selected, "dd/MM/yyyy")
        : format(selected, "PPP", { locale: ptBR })
      : placeholder;

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
            title={label}
            className={cn(
              "h-10 w-full min-w-0 justify-start gap-2 overflow-hidden text-left font-normal",
              !selected && "text-muted-foreground",
              className,
            )}
            {...props}
          >
            <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
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
