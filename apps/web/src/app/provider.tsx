"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "~/contexts/AuthContext";
import Navbar from "~/components/Navbar";
import { Toaster } from "~/components/ui/sonner";
import Footer from "~/components/Footer";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Navbar />
				<main className="flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col">
					{children}
				</main>
				<Footer/>
				<Toaster />
			</AuthProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
