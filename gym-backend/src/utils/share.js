import { createPublicClient, createWalletClient, getContract, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet, hardhat } from "viem/chains"
import { ContractConfig } from "../contract/gymMembership.js"
import JSONbig from "json-bigint"
import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const publicClient = createPublicClient({
	chain: hardhat,
	transport: http(),
})
const privatekey = process.env.WALLET_PRIVATE_KEY
const account = privateKeyToAccount(privatekey)
const walletClient = createWalletClient({
	account,
	chain: hardhat,
	transport: http(),
})

const contract = getContract({
	...ContractConfig,
	client: { public: publicClient, wallet: walletClient },
})

export { contract, JWT_SECRET, JSONbig }
