import {
	createPublicClient,
	createWalletClient,
	custom,
	getContract,
	http,
	recoverMessageAddress,
} from "viem"
import { mainnet, hardhat } from "viem/chains"
import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import { privateKeyToAccount } from "viem/accounts"
import dotenv from "dotenv"
import { ContractConfig } from "./contract/gymMembership.js"
dotenv.config()

const app = express()
const JWT_SECRET = "your-secure-key"
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

/**
 *
 */
const contract = getContract({
	...ContractConfig,
	client: { public: publicClient, wallet: walletClient },
})

app.use(cors())
app.use(express.json())

// 登录接口
app.post("/api/user/login", async (req, res) => {
	const { message, signature, address } = req.body

	try {
		// 验证签名
		const recoveredAddress = await recoverMessageAddress({
			message,
			signature,
		})

		if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
			return res.status(401).json({ error: "Invalid signature" })
		}
		// 签发 JWT
		const token = jwt.sign({ address }, JWT_SECRET, {
			expiresIn: "1h",
		})

		res.status(200).json({ token })
	} catch (error) {
		console.error("Login error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
})

// 注册接口
app.post("/api/user/signup", async (req, res) => {
	const { usertype, name, address } = req.body
	// console.log(usertype, name, address)

	try {
		const datahash = await contract.write.registerUser([usertype, name, address])

		res.status(201).json({
			datahash,
		})
	} catch (error) {
		console.error("Login error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
})

// 受保护路由
app.get("/api/profile", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1]

	if (!token) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		res.json({ address: decoded.address })
		const txHash = await contract.write.registerUser(2, "dd")
		console.log(txHash)
	} catch (error) {
		res.status(401).json({ error: "Invalid token" })
	}
})

app.listen(3002, () => {
	console.log("Server running on http://localhost:3002")
})
