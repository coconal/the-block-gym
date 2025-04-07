import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
	// arbitrum, base, optimism, polygon, sepolia,
	mainnet,
	hardhat,
} from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string
const ganache = {
	id: 1337,
	name: "Ganache",
	network: "ganache",
	nativeCurrency: {
		decimals: 18,
		name: "Ether",
		symbol: "ETH",
	},
	rpcUrls: {
		default: { http: ["http://127.0.0.1:7545"] },
		public: { http: ["http://127.0.0.1:7545"] },
	},
}
export const config = getDefaultConfig({
	appName: "GYM-APP",
	projectId: projectId,
	chains: [
		mainnet,
		hardhat,
		ganache,
		// polygon,
		// optimism,
		// arbitrum,
		// base,
		// ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
	],
	// ssr: true,
})
