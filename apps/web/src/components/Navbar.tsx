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
						<Badge
							variant="secondary"
							className="font-medium text-xs bg-primary/10 text-primary hover:bg-primary/15"
						>
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
							className="cursor-pointer text-zinc-200 flex gap-2 items-center bg-[#5865F2] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#3b4aed] transition-all ease-in duration-200"
							onClick={login}
						>
							<svg
								className="w-6"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 48 48"
							>
								<path
									d="M39.248,10.177c-2.804-1.287-5.812-2.235-8.956-2.778c-0.057-0.01-0.114,0.016-0.144,0.068	c-0.387,0.688-0.815,1.585-1.115,2.291c-3.382-0.506-6.747-0.506-10.059,0c-0.3-0.721-0.744-1.603-1.133-2.291	c-0.03-0.051-0.087-0.077-0.144-0.068c-3.143,0.541-6.15,1.489-8.956,2.778c-0.024,0.01-0.045,0.028-0.059,0.051	c-5.704,8.522-7.267,16.835-6.5,25.044c0.003,0.04,0.026,0.079,0.057,0.103c3.763,2.764,7.409,4.442,10.987,5.554	c0.057,0.017,0.118-0.003,0.154-0.051c0.846-1.156,1.601-2.374,2.248-3.656c0.038-0.075,0.002-0.164-0.076-0.194	c-1.197-0.454-2.336-1.007-3.432-1.636c-0.087-0.051-0.094-0.175-0.014-0.234c0.231-0.173,0.461-0.353,0.682-0.534	c0.04-0.033,0.095-0.04,0.142-0.019c7.201,3.288,14.997,3.288,22.113,0c0.047-0.023,0.102-0.016,0.144,0.017	c0.22,0.182,0.451,0.363,0.683,0.536c0.08,0.059,0.075,0.183-0.012,0.234c-1.096,0.641-2.236,1.182-3.434,1.634	c-0.078,0.03-0.113,0.12-0.075,0.196c0.661,1.28,1.415,2.498,2.246,3.654c0.035,0.049,0.097,0.07,0.154,0.052	c3.595-1.112,7.241-2.79,11.004-5.554c0.033-0.024,0.054-0.061,0.057-0.101c0.917-9.491-1.537-17.735-6.505-25.044	C39.293,10.205,39.272,10.187,39.248,10.177z M16.703,30.273c-2.168,0-3.954-1.99-3.954-4.435s1.752-4.435,3.954-4.435	c2.22,0,3.989,2.008,3.954,4.435C20.658,28.282,18.906,30.273,16.703,30.273z M31.324,30.273c-2.168,0-3.954-1.99-3.954-4.435	s1.752-4.435,3.954-4.435c2.22,0,3.989,2.008,3.954,4.435C35.278,28.282,33.544,30.273,31.324,30.273z"
									className="fill-zinc-200"
								></path>
							</svg>
							Login with Discord
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
