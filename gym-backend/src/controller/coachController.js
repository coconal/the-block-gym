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

//TODO
// 获取 schedule 教练的所有课程
