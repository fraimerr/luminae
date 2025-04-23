import LoadingUI from "~/components/ui/shared/LoadingUI";

export default function GuildDashboardLoading() {
  return (
    <LoadingUI 
      type="dashboard" 
      cards={3}
    />
  );
} 