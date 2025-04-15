import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
	return (
		<main className="min-h-screen">
			<div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
				<div className="md:w-1/2 mb-12 md:mb-0">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Elevate your Discord Server with{" "}
						<span className="text-primary">Zcro</span>
					</h1>
					<p className="text-lg md:text-xl text-gray-300 mb-8">
						Featuring advanced leveling systems and customizable giveaways.
						Perfectly tailor rewards, permissions, and automation to create the
						ultimate engaging experience for your members.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Link href="https://discord.com/api/oauth2/authorize?client_id=1072341278081522432&permissions=8&scope=bot">
							<Button size="lg">Add to Discord</Button>
						</Link>
						<Link href="/docs"></Link>
						<Button variant="ghost" size="lg">
							Documentation
						</Button>
					</div>
				</div>

				<div className="md:w-1/2 flex justify-center">
					<div className="relative w-full max-w-lg">
						<div className="absolute inset-0 bg-gradient-to-r from-discord-blurple to-purple-600 rounded-full blur-3xl opacity-30"></div>
						<div className="relative p-8 rounded-3xl shadow-2xl">
							<Image
								src="/icon.jpg"
								alt="Zcro"
								className="w-full h-auto rounded-3xl"
								width={500}
								height={500}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
