import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import DashboardClient from "./DashboardClient";
import { getData } from "~/lib/api/getData";
import { APIV1UserGuildsResponse } from "@luminae/types";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["/users/@me/guilds"],
    queryFn: () => getData<APIV1UserGuildsResponse>("/users/@me/guilds"),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
