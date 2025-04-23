"use client";

import { Button } from "~/components/ui/button";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export type ErrorUIProps = {
  error: Error;
  reset: () => void;
  title?: string;
  message?: string;
  backPath?: string;
  backLabel?: string;
  resetLabel?: string;
  layout?: "centered" | "inline";
  icon?: "triangle" | "circle";
  className?: string;
};

export default function ErrorUI({
  error,
  reset,
  title = "An error occurred",
  message,
  backPath,
  backLabel = "Back",
  resetLabel = "Try Again",
  layout = "inline",
  icon = "triangle",
  className = "",
}: ErrorUIProps) {
  const errorMessage = message || error.message || "An unexpected error occurred. Please try again later.";
  
  const ErrorIcon = icon === "triangle" ? AlertTriangle : AlertCircle;
  
  const contentWrapperClass = layout === "centered" 
    ? "flex justify-center items-center min-h-[50vh]" 
    : "space-y-4";
  
  const cardClass = layout === "centered" 
    ? "w-full max-w-md border-destructive/30" 
    : "border-destructive/30";

  return (
    <div className={`${contentWrapperClass} ${className}`}>
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ErrorIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {errorMessage}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {backPath && (
            <Button 
              variant="outline" 
              onClick={() => window.location.href = backPath}
            >
              {backLabel}
            </Button>
          )}
          <Button onClick={reset}>
            {resetLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 