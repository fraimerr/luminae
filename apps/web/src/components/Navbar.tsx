"use client";

import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Loader2, ChevronDown, LogOut, User, Bot } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const Navbar = () => {
	const { user, isLoading, login, logout } = useAuth();
	const pathname = usePathname();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/profile", label: "Your Profile" },
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/donate", label: "Donate" },
	];

	return (
		<nav className="w-full top-0 z-50 transition-all duration-300 border-b bg-background border-border/40">
			<div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center gap-2.5 group">
							<span className="font-bold text-xl bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
								Misu
							</span>
						</Link>
						<Badge variant="secondary" className="font-medium text-xs">
							BETA
						</Badge>
					</div>

					<div className="hidden md:flex items-center">
						<Separator
							className="h-6 mx-2 opacity-50 bg-border"
							orientation="vertical"
						/>

						<div className="flex space-x-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200",
										pathname === link.href
											? "bg-primary/15 text-primary hover:bg-primary/20"
											: "text-muted-foreground hover:text-foreground hover:bg-accent"
									)}
								>
									{typeof link.label === "string" ? link.label : link.label}
								</Link>
							))}
						</div>
					</div>
				</div>

				<div>
					{isLoading ? (
						<div className="h-10 w-10 flex items-center justify-center">
							<Loader2 className="h-5 w-5 animate-spin text-primary" />
						</div>
					) : user ? (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="flex items-center gap-3 py-2 px-3.5 rounded-md border border-border bg-primary/10 hover:bg-primary/15 transition-all duration-200"
								aria-expanded={dropdownOpen}
								aria-label="User menu"
							>
								<Image
									src={
										`https://cdn.discordapp.com/avatars/${user.user.discordId}/${user.user.avatar}` ||
										"https://cdn.discordapp.com/embed/avatars/0.png"
									}
									alt="Avatar"
									width={26}
									height={26}
									className="rounded-full ring-2 ring-primary/30"
								/>
								<span className="text-sm hidden sm:inline font-medium">
									{user.user.username}
								</span>
								<ChevronDown
									className={cn(
										"w-4 h-4 transition-transform duration-200 text-muted-foreground",
										dropdownOpen && "rotate-180"
									)}
								/>
							</button>

							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card/95 backdrop-blur-md text-card-foreground shadow-lg animate-in fade-in-50 duration-100">
									<div className="p-1.5">
										<Link
											href="/profile"
											className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
											onClick={() => setDropdownOpen(false)}
										>
											<User className="w-4 h-4" />
											Profile
										</Link>
										<Link
											href="/profile/apps"
											className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
											onClick={() => setDropdownOpen(false)}
										>
											<Bot className="w-4 h-4" />
											Your Servers
										</Link>
									</div>
									<div className="border-t border-border">
										<div className="p-1.5">
											<button
												onClick={() => {
													logout();
													setDropdownOpen(false);
												}}
												className="flex items-center gap-2.5 px-3 py-2 text-sm w-full rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-left"
											>
												<LogOut className="w-4 h-4" />
												Logout
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					) : (
						<button
							onClick={login}
							className={cn(
								"rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium px-5 h-10",
								"bg-[#5865f2] hover:bg-[#4752c4] text-white hover:shadow-md"
							)}
						>
							Login with Discord
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
