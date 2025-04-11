import { Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-6 px-4 text-center">
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-3xl" />

				<div className="relative space-y-6 items-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						404 - Page Not Found
					</h1>
					<p className="text-muted-foreground max-w-[500px] text-lg">
						Seems like you&apos;ve taken a wrong turn. The page you&apos;re
						looking for doesn&apos;t exist.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<Button asChild className="w-full sm:w-auto group">
							<Link href="/">
								<Home className="mr-2 h-4 w-4" />
								Return Home
							</Link>
						</Button>
						<Button asChild variant="ghost" className="w-full sm:w-auto group">
							<Link href="/support">Support Server</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
