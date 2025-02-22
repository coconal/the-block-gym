import {
	createPublicClient,
	createWalletClient,
	getContract,
	http,
	recoverMessageAddress,
} from "viem"
import { mainnet, hardhat } from "viem/chains"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { privateKeyToAccount } from "viem/accounts"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { ContractConfig } from "./contract/gymMembership.js"
import { protect } from "./controller/authController.js"

import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
dotenv.config()

const app = express()

const DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD)

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

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// 登录接口
app.use("/api/user", authRouter)
app.use("/api/user", protect, userRouter)

mongoose.connect(DB).then(() => {
	// console.log(con.connections);
	console.log("DB connection successful!")
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
