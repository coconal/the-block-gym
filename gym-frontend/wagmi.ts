import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { arbitrum, base, mainnet, optimism, polygon, sepolia, hardhat } from "wagmi/chains"

export const config = getDefaultConfig({
	appName: "GYM-APP",
	projectId: "YOUR_PROJECT_ID",
	chains: [
		mainnet,
		hardhat,
		polygon,
		optimism,
		arbitrum,
		base,
		// ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
	],
	// ssr: true,
})
