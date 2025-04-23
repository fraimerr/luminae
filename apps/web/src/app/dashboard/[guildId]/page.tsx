import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import GuildDashboardClient from "./GuildDashboardClient";
import { getData } from "~/lib/api/getData";

export default async function DashboardPage({
  params,
}: {
  params: { guildId: string };
}) {
  const { guildId } = params;
  const queryClient = new QueryClient();
  
  // Prefetch the guild data
  await queryClient.prefetchQuery({
    queryKey: [`/guilds/${guildId}`],
    queryFn: () => getData(`/guilds/${guildId}`),
  });
  
  const dehydratedState = dehydrate(queryClient);
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <GuildDashboardClient guildId={guildId} />
    </HydrationBoundary>
  );
}