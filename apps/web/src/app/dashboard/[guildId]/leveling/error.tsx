"use client";

import ErrorUI from "~/components/ui/shared/ErrorUI";

export default function LevelingError({
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
      title="Error Loading Leveling Settings"
      icon="circle"
      resetLabel="Try again"
    />
  );
} 