import { catchSync } from "../utils/catchSync"

export const getCoachProfile = catchSync((contract) => async () => {
	try {
		const { coachAddress } = req.params
		// 验证签名
		const result = await contract.getContractEvents({
			event: contract.getEvents({
				abi: contract.abi,
				eventName: "CoachIsVerified",
				args: {
					coachAddress: coachAddress,
				},
			}),
		})
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
})

export const getVerifiedCoachHash = (req, res) => {
	try {
		const { useraddress } = req.params
		// 验证签名
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
