// import { catchSync } from "../utils/catchSync.js"
import { contract } from "../utils/share.js"
import { JSONbig } from "../utils/share.js"

export const getCoachProfile = async (req, res) => {
	try {
		const { address: coachAddress } = req.body
		// 验证签名
		const result = await contract.getEvents.CoachIsVerified({ coachAddress })

		console.log(result)

		// TODO
		// get data from db

		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.error("server error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getVerifiedCoachHash = (req, res) => {
	try {
		const { useraddress } = req.params

		const result = contract.read.getVerifiedCoachHash([useraddress])
		// TODO
		// get data from db

		const data = {
			verified: result[0],
			hash: result[1],
		}
		res.status(200).json({
			data,
		})
	} catch (error) {
		console.error("server error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getEarnings = async (req, res) => {
	try {
		const { address } = req.user
		// 验证签名
		const result = await contract.read.coachEarnings([address])

		res.status(200).json({
			data: JSONbig.parse(result),
		})
	} catch (error) {
		console.error("server error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const verifyCoach = async (req, res) => {
	try {
		const { address, CID } = req.user
		// 验证签名
		const result = await contract.write.verifyCoach([address, CID])

		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.error("server error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const releaseFunds = async (req, res) => {
	try {
		const { address } = req.user
		// 验证签名
		const result = await contract.write.releaseFunds([address])
		console.log(result)

		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.error("server error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}
