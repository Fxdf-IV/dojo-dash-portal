import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[104px] w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-base leading-relaxed shadow-soft transition-colors duration-200",
        "placeholder:text-muted-foreground/70 hover:border-muted-foreground/40",
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/25",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
