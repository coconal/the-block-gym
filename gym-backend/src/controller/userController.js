import User from "../model/userModel.js"
import { contract, publicClient } from "../utils/share.js"
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
		console.error("Get Membership error:", error.message)
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

export const purchaseMembership = async (req, res) => {
	const { coachAddress, duration, paymentProof } = req.body
	const useraddress = req.user.address
	try {
		const transaction = await publicClient.getTransaction({
			hash: paymentProof,
		})
		console.log(transaction, contract.address)
		// 验证1：交易接收地址必须是合约地址
		if (transaction.to.toLowerCase() !== contract.address.toLowerCase()) {
			return res.status(400).json({ error: "Invalid payment receiver" })
		}

		// 验证2：交易金额匹配会员价格（假设从合约获取价格）
		// TODO

		// 验证3：付款人地址必须与当前用户匹配
		if (transaction.from.toLowerCase() !== useraddress.toLowerCase()) {
			return res.status(400).json({ error: "Payment sender mismatch" })
		}

		// 验证4：确认交易已经上链
		if (!transaction.blockNumber) {
			return res.status(400).json({ error: "Payment not confirmed" })
		}
		const result = await contract.write.purchaseMembership([
			coachAddress,
			useraddress,
			duration,
			paymentProof,
			transaction.value,
		])
		console.log(result)
		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.log(error)
	}
}
