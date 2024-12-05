"use client"

import * as React from "react"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"

export interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  mask: string
  onChange: (value: string) => void
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, onChange, ...props }, ref) => {
    return (
      <div className="relative group">
        <IMaskInput
          mask={mask}
          unmask={true}
          onAccept={(value) => onChange(value)}
          className={cn(
            "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300 bg-background/50 border border-primary/20 focus:bg-background/80 focus:border-primary",
            className
          )}
          {...props}
        />
        <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    )
  }
)
MaskedInput.displayName = "MaskedInput"

export { MaskedInput }
