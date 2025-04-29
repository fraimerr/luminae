import * as React from "react";

import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border bg-card/50 px-4 text-sm transition-all",
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary/20 selection:text-primary dark:bg-input/30",
        "shadow-sm hover:shadow-md focus:shadow-md",
        "outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
