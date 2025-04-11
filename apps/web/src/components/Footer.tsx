import Link from "next/link";

const Footer = () => {
	return (
		<footer className="mt-auto border-t border-border/40">
			<div className="container-responsive py-12 sm:py-16 px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
					<div className="flex flex-col space-y-6 md:pr-10">
						<div>
							<span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
								Misu
							</span>
						</div>
						<p className="text-muted-foreground/90 text-sm sm:text-base leading-relaxed max-w-md">
							Misu is a 100% free advanced ad customizable Discord Giveaway and Leveling bot.
						</p>
					</div>

					<div className="hidden md:block"></div>

					<div className="flex flex-col space-y-6 md:pl-6">
						<h3 className="font-semibold text-foreground text-lg">Quick Links</h3>
						<nav className="w-full">
							<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-y-3 gap-x-8">
								<li>
									<Link
										href="/"
										className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex px-1 py-1.5"
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										href="/terms"
										className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex px-1 py-1.5"
									>
										Terms of Use
									</Link>
								</li>
								<li>
									<Link
										href="/privacy"
										className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex px-1 py-1.5"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href="/support"
										className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex px-1 py-1.5"
									>
										Support
									</Link>
								</li>
								<li>
									<Link
										href="/vote"
										className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex px-1 py-1.5"
									>
										Vote
									</Link>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-12 border-t border-border/40">
					<div className="text-muted-foreground/80 text-sm py-2">
						© {new Date().getFullYear()} Trustify. All rights reserved.
					</div>
					<div className="flex items-center gap-2.5 py-2">
						<span className="text-sm text-muted-foreground/80">
							Made with{" "}
							<span className="text-red-500" aria-label="love">
								❤️
							</span>{" "}
							by
						</span>
						<a
							href="https://discord.com/users/225176015016558593"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
						>
							faimerdev
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
