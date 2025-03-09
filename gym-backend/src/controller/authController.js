import User from "../model/userModel.js"
import jwt from "jsonwebtoken"
import { contract } from "../utils/share.js"
import { recoverMessageAddress } from "viem"

export const onlyOwner = async (req, res, next) => {
	try {
		const { address } = req.user

		if (address.toLocaleLowerCase() !== process.env.OWNER_ADDRESS.toLocaleLowerCase()) {
			return res.status(403).json({ error: "FORBIDDEN" })
		}
		next()
	} catch (error) {
		console.error("Protect error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const protect = async (req, res, next) => {
	try {
		let token
		// const token2 = req.headers.cookie.split("=")[1]
		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1]
		}
		const { address, id } = jwt.decode(token, process.env.JWT_SECRET)

		const user = await User.findOne({ address, _id: id })
		if (!user) {
			return res.status(401).json({ error: "User not found" })
		}
		req.user = user
		next()
	} catch (error) {
		console.error("Protect error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const signup = async (req, res) => {
	const { address, role } = req.body
	const usertype = role === "user" ? 0 : 1
	try {
		const existingUser = await User.findOne({ address })
		if (existingUser) {
			return res.status(409).json({ error: "User already exists" })
		}

		const datahash = await contract.write.registerUser([usertype, address])
		const data = await User.create({ ...req.body, verifiedHash: datahash })
		res.status(201).json({
			data,
		})
	} catch (error) {
		if (error.message.includes("Already registered")) {
			return res.status(409).json({
				error: "User already registered on blockchain",
			})
		}
		console.error("Signup error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const login = async (req, res) => {
	const { signature, address } = req.body
	if (!signature || !address) {
		res.status(400).json({ error: "Invalid request" })
	}

	try {
		const user = await User.findOne({ address })
		if (!user) {
			return res.status(401).json({ error: "User not found" })
		}
		const nonce = user.nonce

		//TODO get nonce from signature

		const message = `login message&nunce:${nonce}`

		// 	// 验证签名
		const recoveredAddress = await recoverMessageAddress({
			message,
			signature,
		})

		if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
			return res.status(401).json({ error: "Invalid signature" })
		}

		// // 登录成功后更新 nonce
		// const newNonce = Math.floor(Math.random() * 1000000)
		// await User.findByIdAndUpdate(user._id, { nonce: newNonce })
		// 签发 JWT
		const token = jwt.sign({ id: user._id, address }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		})
		res.cookie("jwt", token, {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			// secure: true,
		})

		res.status(200).json({ message: "Login successful", nonce, token })
	} catch (error) {
		console.error("Login error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}
