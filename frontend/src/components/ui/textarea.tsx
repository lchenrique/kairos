import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative group">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none outline-transparent disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-300 bg-background/50 border border-primary/20 focus:bg-background/80 focus:border-primary',
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
