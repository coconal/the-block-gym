"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "../wagmi"
import { Toaster } from "react-hot-toast"
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<div>
						<Toaster />
						{children}
					</div>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
