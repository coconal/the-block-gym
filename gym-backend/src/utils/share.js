import { createPublicClient, createWalletClient, getContract, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet, hardhat } from "viem/chains"
import { ContractConfig } from "../contract/gymMembership.js"
import JSONbig from "json-bigint"
import dotenv from "dotenv"
dotenv.config()
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
const JWT_SECRET = process.env.JWT_SECRET
const publicClient = createPublicClient({
	chain: ganache,
	transport: http(),
})
const privatekey = process.env.WALLET_PRIVATE_KEY
const account = privateKeyToAccount(privatekey)
const walletClient = createWalletClient({
	account,
	chain: ganache,
	transport: http(),
})

const contract = getContract({
	...ContractConfig,
	client: { public: publicClient, wallet: walletClient },
})

export { publicClient, contract, JWT_SECRET, JSONbig }
