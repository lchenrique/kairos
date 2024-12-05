import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative group">
        {startIcon && (
          <div className="absolute left-2.5 top-2.5">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  outline-transparent focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300 bg-background/50 border border-primary/20 focus:bg-background/80 focus:border-primary",
            startIcon && "pl-8",
            endIcon && "pr-8",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-2.5 top-2.5">
            {endIcon}
          </div>
        )}
        <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }