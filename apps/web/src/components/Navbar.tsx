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
		<nav className="sticky w-full top-0 z-50 transition-all duration-300 border-b bg-background/80 backdrop-blur-xl border-border/40">
			<div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center gap-2.5 group">
							<div className="relative">
								<div className="absolute inset-0 bg-aurora-gradient blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
								<span className="relative font-bold text-xl bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
									Parallel
								</span>
							</div>
						</Link>
						<Badge variant="secondary" className="font-medium text-xs bg-primary/10 text-primary hover:bg-primary/15">
							BETA
						</Badge>
					</div>

					<div className="hidden md:flex items-center">
						<Separator
							className="h-6 mx-2 opacity-30 bg-border"
							orientation="vertical"
						/>

						<div className="flex space-x-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300",
										pathname === link.href
											? "bg-primary/15 text-primary hover:bg-primary/20 shadow-sm"
											: "text-muted-foreground hover:text-foreground hover:bg-accent/10"
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
								className="flex items-center gap-3 py-2 px-3.5 rounded-md border border-border/50 bg-card/50 hover:bg-card shadow-sm hover:shadow-md transition-all duration-300"
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
									className="rounded-full ring-2 ring-primary/20"
								/>
								<span className="text-sm hidden sm:inline font-medium">
									{user.user.username}
								</span>
								<ChevronDown
									className={cn(
										"w-4 h-4 transition-transform duration-300 text-muted-foreground",
										dropdownOpen && "rotate-180"
									)}
								/>
							</button>

							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-md border border-border/50 bg-card/95 backdrop-blur-xl text-card-foreground shadow-lg animate-in fade-in-50 duration-100 slide-in-from-top-2">
									<div className="p-1.5">
										<Link
											href="/profile"
											className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-accent/10 hover:text-accent transition-colors duration-200"
											onClick={() => setDropdownOpen(false)}
										>
											<User className="w-4 h-4" />
											Profile
										</Link>
										<Link
											href="/profile/apps"
											className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-accent/10 hover:text-accent transition-colors duration-200"
											onClick={() => setDropdownOpen(false)}
										>
											<Bot className="w-4 h-4" />
											Your Servers
										</Link>
									</div>
									<div className="border-t border-border/50">
										<div className="p-1.5">
											<button
												onClick={() => {
													logout();
													setDropdownOpen(false);
												}}
												className="flex items-center gap-2.5 px-3 py-2 text-sm w-full rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 text-left"
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
								"rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium px-5 h-10",
								"bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
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
