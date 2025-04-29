import LoadingUI from "~/components/ui/shared/LoadingUI";

export default function DashboardLoading() {
  return <LoadingUI type="dashboard" cards={6} className="container mx-auto px-4 py-16 animate-in fade-in-50" />;
}
