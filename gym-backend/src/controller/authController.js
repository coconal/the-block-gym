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
		let token = req.cookies.jwt
		if (!token) {
			return res.status(401).json({ error: "Unauthorized" })
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
	const { address, username, role } = req.body
	const usertype = role === "user" ? 0 : 1
	if (!address || !username || !role) {
		res.status(400).json({ error: "Invalid request" })
	}
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
			sameSite: "Strict", // 防止 CSRF
			secure: process.env.NODE_ENV === "production",
		})
		res.status(200).json({ message: "Login successful", nonce })
	} catch (error) {
		console.error("Login error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const logout = (req, res) => {
	try {
		// 设置一个已过期的 token
		res.cookie("jwt", "", {
			expires: new Date(0),
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		})

		res.status(200).json({
			success: true,
			message: "退出登录成功",
		})
	} catch (error) {
		console.error("退出登录失败:", error)
		res.status(500).json({
			success: false,
			message: "服务器内部错误",
		})
	}
}

export const checkToken = (req, res) => {
	const address = req.user.address
	try {
		let token = req.cookies.jwt
		const { address: tokenAddress } = jwt.decode(token)
		if (address !== tokenAddress) {
			return res.status(401).json({
				success: false,
				message: "Token 无效",
			})
		}
		res.status(200).json({
			success: true,
			message: "Token 有效",
		})
	} catch (error) {
		res.status(500).json({
			error: "Internal server error",
		})
		console.log(error)
	}
}
