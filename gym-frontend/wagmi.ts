import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
	// arbitrum, base, optimism, polygon, sepolia,
	mainnet,
	hardhat,
} from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string

export const config = getDefaultConfig({
	appName: "GYM-APP",
	projectId: projectId,
	chains: [
		mainnet,
		hardhat,
		// polygon,
		// optimism,
		// arbitrum,
		// base,
		// ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
	],
	// ssr: true,
})
