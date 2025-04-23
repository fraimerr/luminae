"use client";

import ErrorUI from "~/components/ui/shared/ErrorUI";

export default function GuildDashboardError({
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
      title="Error Loading Server"
      message="This could be due to a connection issue or the server may no longer be accessible."
      backPath="/dashboard"
      backLabel="Back to Servers"
      layout="centered"
    />
  );
} 