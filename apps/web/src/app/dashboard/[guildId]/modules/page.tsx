"use client";

import React, { useState } from "react";
import { useApi } from "~/hooks/useApi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { APIV1ModulesResponse } from "@parallel/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const modules = [
	{
		id: "achievements",
		name: "Achievements",
		description:
			"Reward users for completing specific tasks unlocking a variety of achievements",
	},
	{
		id: "giveaways",
		name: "Giveaways",
		description: "Create and manage giveaways for your server",
	},
	{
		id: "leveling",
		name: "Leveling",
		description: "Track user activity and reward them with levels and roles",
	},
];

type PageParams = { guildId: string };

export default function ModulesPage({
	params,
}: {
	params: PageParams | Promise<PageParams>;
}) {
	const resolvedParams = React.use(params as any) as PageParams;
	const guildId = resolvedParams.guildId;

	const queryClient = useQueryClient();
	const { data, isLoading } = useApi<APIV1ModulesResponse>(
		`/modules/${guildId}`,
		true
	);
	const [updatingModules, setUpdatingModules] = useState<string[]>([]);

	const { mutate } = useMutation({
		mutationFn: async (moduleId: string) => {
			setUpdatingModules((prev) => [...prev, moduleId]);
			const enabled = !data?.data?.some(
				(m) => m.name === moduleId && m.enabled
			);

			const response = await fetch(
				`http://localhost:5000/v1/modules/${guildId}/${moduleId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ enabled }),
					credentials: "include",
				}
			);

			if (!response.ok) {
				const error = await response.json().catch(() => null);
				throw new Error(error?.message ?? "Failed to toggle module");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [`/modules/${guildId}`],
			});
		},
		onSettled: (_, __, moduleId) => {
			setUpdatingModules((prev) => prev.filter((id) => id !== moduleId));
		},
	});

	const toggleModule = (moduleId: string) => {
		mutate(moduleId);
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 2 }).map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardHeader>
							<div className="h-6 w-32 bg-muted rounded-md" />
							<div className="h-4 w-2/3 bg-muted rounded-md" />
						</CardHeader>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Modules</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Enable or disable bot modules
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{modules.map((module) => {
					const isEnabled = data?.data?.some(
						(m) => m.name === module.id && m.enabled
					);
					const isUpdating = updatingModules.includes(module.id);

					return (
						<Card key={module.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CardTitle>{module.name}</CardTitle>
									</div>
									<div className="flex items-center gap-2">
										{isUpdating && (
											<Loader2 className="w-4 h-4 animate-spin text-primary" />
										)}
										<Switch
											checked={isEnabled}
											onCheckedChange={() => toggleModule(module.id)}
											disabled={isUpdating}
										/>
									</div>
								</div>
								<CardDescription>{module.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="outline" size="sm" className="w-full" asChild>
									<Link href={`/dashboard/${guildId}/${module.id}`}>
										Configure
									</Link>
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
