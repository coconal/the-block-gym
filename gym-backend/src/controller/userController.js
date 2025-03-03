import User from "../model/userModel.js"
import { contract } from "../utils/share.js"
import { JSONbig } from "../utils/share.js"

export const getNonce = async (req, res) => {
	try {
		const { address } = req.params
		let user = await User.findOne({ address })

		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		res.status(200).json({
			nonce: user.nonce,
		})
	} catch (error) {
		console.error("Get nonce error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getUser = async (req, res) => {
	try {
		const user = req.user

		// const result = await contract.read.getUser([useraddress])
		const data = {
			id: user._id,
			address: user.address,
			role: user.role,
			verifiedHash: user.verifiedHash,
			// registrationDate: user.registrationDate,
		}

		res.status(200).json({
			data,
		})
	} catch (error) {
		console.error("Get User error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getMembership = async (req, res) => {
	const { membershipId } = req.params
	const useraddress = req.user.address

	try {
		const result = await contract.read.getMembership([useraddress])

		if (result.length === 0) {
			return res.status(404).json({ message: "Membership not found" })
		}
		const r = JSONbig.stringify(result[membershipId])
		const data = await JSON.parse(r)
		res.status(200).json({
			data,
		})
	} catch (error) {
		console.error("Get Membership error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getLastRefundTime = async (req, res) => {
	const useraddress = req.user.address
	const { id } = req.params
	try {
		const result = await contract.read.getLastRefundTime([useraddress, id])
		console.log(result)
		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.error("Get Last Refund Time error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getUserAllMembership = async (req, res) => {
	const useraddress = req.user.address

	try {
		const result = await contract.read.getMembership([useraddress])
		// 处理返回的会员信息数组
		const memberships = result.map((item, index) => {
			const r = JSONbig.stringify(item)
			const membership = JSON.parse(r)
			return {
				...membership,
				id: index,
			}
		})
		console.log(memberships)

		res.status(200).json({
			data: memberships,
		})
	} catch (error) {}
}
