"use client";

import ErrorUI from "~/components/ui/shared/ErrorUI";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorUI
      error={error}
      reset={reset}
      title="Failed to load servers"
      layout="centered"
      icon="circle"
      className="container mx-auto px-4 py-16"
    />
  );
} 