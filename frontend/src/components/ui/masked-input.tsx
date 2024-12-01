import * as React from "react"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"

export interface MaskedInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IMaskInput>, 'value' | 'onChange'> {
  className?: string
  value?: string
  onChange?: (value: string) => void
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <IMaskInput
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={value}
        onAccept={(value, mask) => onChange?.(value)}
        {...props}
      />
    )
  }
)
MaskedInput.displayName = "MaskedInput"

export { MaskedInput }
