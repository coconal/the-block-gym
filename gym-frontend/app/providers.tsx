"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "../wagmi"
import { Toaster } from "react-hot-toast"
import { ConfigProvider } from "antd"
import { Store } from "./_store"
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
									titleMarginBottom: 4,
									metaMarginBottom: 6,
								},
								Input: {
									colorBgContainer: "#f1f0f0c0",
									colorBorder: "#cdcbcbcd",
									borderRadius: 8, // 圆角大小
									colorText: "#333333", // 字体颜色
									colorTextPlaceholder: "#999999", // 占位符颜色
									fontSize: 14, // 字体大小
								},
								Select: {
									colorBgContainer: "#f1f0f0c0",
									colorBorder: "#cdcbcbcd",
									borderRadius: 8,
									colorText: "#333333", // 字体颜色
									colorTextPlaceholder: "#999999", // 占位符颜色
									fontSize: 14, // 字体大小
								},
								Switch: {
									colorPrimary: "#9fd8f9fb", // 开关颜色
									colorPrimaryHover: "#9fd8f9fb", // 开关悬停颜色
									colorPrimaryActive: "#9fd8f9fb", // 开关激活颜色
								},
								Table: {
									colorText: "#363131e6",
									colorBgContainer: "#cbcbcbe6",
									colorBgBase: "#646465e6",
									headerBg: "#b1b1b1e6",
									headerSplitColor: "#dcdcdce6",
									headerColor: "#4a5568e6",
								},
							},
						}}
					>
						<Store>
							<div>
								<Toaster />
								{children}
							</div>
						</Store>
					</ConfigProvider>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
