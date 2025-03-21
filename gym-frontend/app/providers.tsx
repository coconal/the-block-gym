"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "../wagmi"
import { Toaster } from "react-hot-toast"
import { ConfigProvider } from "antd"
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
		},
	},
})

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<ConfigProvider
						theme={{
							components: {
								List: {
									colorText: "bisque",
									colorTextDescription: "#ecddcba3",
								},
							},
						}}
					>
						<div>
							<Toaster />
							{children}
						</div>
					</ConfigProvider>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
