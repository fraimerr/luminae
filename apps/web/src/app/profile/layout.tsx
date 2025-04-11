"use client";

import { useAuth } from "~/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading } = useAuth();
	const pathname = usePathname();

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 animate-in fade-in-50">
				<div className="relative mb-8">
					<div className="h-48">
						<Skeleton className="w-full h-full" />
					</div>
					<div className="absolute -bottom-16 left-4 flex items-end gap-4">
						<Skeleton className="w-32 h-32 rounded-full" />
						<Skeleton className="h-8 w-48" />
					</div>
				</div>
				<div className="pt-24">
					<div className="flex space-x-8 border-b border-border mb-8">
						<Skeleton className="w-24 h-8" />
						<Skeleton className="w-24 h-8" />
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{Array(4).fill(0).map((_, i) => (
							<Skeleton key={i} className="h-[200px]" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="container mx-auto px-4 py-8 animate-in fade-in-50">
			<div className="relative mb-8">
				<div className="h-48 rounded-lg overflow-hidden">
					<Image
						src={`https://cdn.discordapp.com/banners/${user.user.discordId}/${user.user.banner}?size=1024`}
						alt="User Banner"
						className="w-full h-full object-cover transition-transform hover:scale-105"
						width={1024}
						height={128}
					/>
				</div>

				<div className="absolute -bottom-16 left-4 flex items-end gap-4">
					<div className="relative group">
						<Image
							src={`https://cdn.discordapp.com/avatars/${user.user.discordId}/${user.user.avatar}`}
							alt="User Avatar"
							className="w-32 h-32 rounded-full border-4 border-background shadow-lg transition-transform group-hover:scale-105"
							width={128}
							height={128}
						/>
						<div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<span className="text-white text-sm font-medium">Change Avatar</span>
						</div>
					</div>
					<div className="space-y-1">
						<h1 className="text-3xl font-bold drop-shadow-md">
							{user.user.username}
						</h1>
						<p className="text-sm text-muted-foreground">
							Member since {new Date(user.user.createdAt).toLocaleDateString()}
						</p>
					</div>
				</div>
			</div>

			<div className="pt-24">
				<div className="flex space-x-8 border-b border-border mb-8">
					<TabLink
						href="/profile/servers"
						currentPath={pathname}
						label="Servers"
					/>
					<TabLink
						href="/profile/rank-card"
						currentPath={pathname}
						label="Rank Card"
					/>
				</div>

				{children}
			</div>
		</div>
	);
}

function TabLink({
	href,
	currentPath,
	label,
}: {
	href: string;
	currentPath: string;
	label: string;
}) {
	const isActive = currentPath === href;

	return (
		<Link
			href={href}
			className={cn(
				"pb-4 px-1 text-sm font-medium transition-all",
				isActive
					? "border-b-2 border-primary text-primary"
					: "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border"
			)}
		>
			{label}
		</Link>
	);
}
