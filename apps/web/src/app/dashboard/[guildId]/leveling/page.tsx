import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import LevelingClient from "./LevelingClient";
import { getData } from "~/lib/api/getData";

export default async function LevelingPage({
	params,
}: {
	params: { guildId: string };
}) {
	const { guildId } = params;
	const queryClient = new QueryClient();
	
	// Prefetch the leveling config data
	await queryClient.prefetchQuery({
		queryKey: [`/guilds/${guildId}/config/leveling`],
		queryFn: () => getData(`/guilds/${guildId}/config/leveling`),
	});
	
	// Prefetch the channels data
	await queryClient.prefetchQuery({
		queryKey: [`/guilds/${guildId}/channels`],
		queryFn: () => getData(`/guilds/${guildId}/channels`),
	});
	
	const dehydratedState = dehydrate(queryClient);
	
	return (
		<HydrationBoundary state={dehydratedState}>
			<LevelingClient guildId={guildId} />
		</HydrationBoundary>
	);
}
