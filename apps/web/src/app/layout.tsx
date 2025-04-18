import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-poppins",
});

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Discord Bot Dashboard",
	description: "A modern Discord bot dashboard with Aurora Flow design",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${poppins.variable} ${inter.variable} font-sans min-h-screen overflow-x-hidden bg-background relative before:fixed before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_bottom_left,var(--accent)_0%,transparent_50%),radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_50%)] before:opacity-5 before:blur-3xl`}
			>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
