import User from "../model/userModel.js"
import { contract, publicClient } from "../utils/share.js"
import { JSONbig } from "../utils/share.js"
import Course from "../model/coursesModel.js"
import { getAddress, parseEther } from "viem"
import UserMembership from "../model/userMembershipModel.js"

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
	const { index } = req.params
	const useraddress = req.user.address

	try {
		const user = await User.findOne({ address: useraddress })
		const membership = await UserMembership.findOne({
			userId: user._id,
			index,
		})

		if (!membership) {
			return res.status(200).json({ data: {}, message: "Membership not found" })
		}

		res.status(200).json({
			data: membership,
			message: "Membership founded",
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
		const user = await User.findOne({ address: useraddress })
		const memberships = await UserMembership.find({
			userId: user._id,
		})

		if (!memberships) {
			return res.status(200).json({ data: [], message: "Membership not found" })
		}
		res.status(200).json({
			data: memberships,
			message: "Membership founded",
		})
	} catch (error) {
		console.error("Get Membership error:", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const purchaseMembership = async (req, res) => {
	const { id, duration, paymentProof } = req.body
	const useraddress = req.user.address
	try {
		const transaction = await publicClient.getTransaction({
			hash: paymentProof,
		})
		// 验证1：交易接收地址必须是合约地址
		if (transaction.to.toLowerCase() !== contract.address.toLowerCase()) {
			return res.status(400).json({ error: "Invalid payment receiver" })
		}

		// 验证2：交易金额匹配会员价格
		const course = await Course.findById({ _id: id })
		if (!course) {
			return res.status(400).json({ error: "Course not found" })
		}
		if (course.duration !== duration) {
			return res.status(400).json({ error: "Duration mismatch" })
		}
		const priceEth = parseEther(course.price.toString())

		if (transaction.value !== priceEth) {
			await refundETH(useraddress, transaction.value, transaction.hash)
			return res.status(400).json({ error: "Payment amount mismatch ---Ether has been returned." })
		}

		// 验证3：付款人地址必须与当前用户匹配
		if (transaction.from.toLowerCase() !== useraddress.toLowerCase()) {
			return res.status(400).json({ error: "Payment sender mismatch Please contact admin " })
		}

		// 验证4：确认交易已经上链
		if (!transaction.blockNumber) {
			return res.status(400).json({ error: "Payment not confirmed!! Please contact admin" })
		}

		// 验证5：用户是否有课程没有过期
		const memberships = await contract.read.getMembership([useraddress])

		if (memberships.length > 0) {
			const r = JSONbig.stringify(memberships[memberships.length - 1])
			const membership = JSON.parse(r)
			if (membership.isActive) {
				return res.status(400).json({ error: "You have an active membership!!" })
			}
		}
		const coachaddress =
			course.coachAddress === "0x0"
				? "0x0000000000000000000000000000000000000000"
				: course.coachAddress
		const durationtime = duration * 24 * 60 * 60
		const result = await contract.write.purchaseMembership([
			coachaddress,
			useraddress,
			durationtime,
			paymentProof,
			transaction.value,
		])

		res.status(200).json({
			data: result,
			message: "Purchase successful",
		})

		const user = await User.findOne({ address: useraddress })
		// 创建用户会员记录
		const chainMemberships = await contract.read.getMembership([useraddress])
		const index = chainMemberships.length === 0 ? 0 : chainMemberships.length
		const test = await UserMembership.create({
			userId: user._id,
			courseId: id,
			// 存在时间差距
			index,
			expireAt: new Date(
				Number(chainMemberships[index - 1].startTime) * 1000 + durationtime * 1000
			),
			isActive: true,
			coursepurchasedhash: result,
		})
		console.log(test)
	} catch (error) {
		console.log(error.message)
	}
}

export const checkUserMembershipActive = async (req, res) => {
	const { id } = req.params
	const useraddress = req.user.address
	try {
		const result = await contract.read.getMembership([useraddress])
		if (result.length === 0) {
			return res.status(200).json({
				data: result,
				message: "Check successful",
			})
		}
		const r = JSONbig.stringify(result)
		const membership = JSON.parse(r)
		const expireAt =
			membership[membership.length - 1].startTime + membership[membership.length - 1].duration
		const now = Date.now()
		const user = await User.findOne({ address: useraddress })
		if (now > expireAt * 1000) {
			UserMembership.updateOne({ courseId: id, userId: user._id }, { isActive: false })
			return res.status(200).json({
				data: membership,
				message: "Check successful",
			})
		}

		res.status(200).json({
			data: membership,
			message: "Check successful",
		})
	} catch (error) {
		console.error("Check User Membership Active error:", error.shortMessage)
		if (error.shortMessage.split(" ").at(-1).match("0x")) {
			res.status(404).json({ error: "user not registered" })
		}
	}
}

async function refundETH(toAddress, amount, txHash) {
	try {
		// 获取交易详情以计算gas费用
		const receipt = await publicClient.getTransactionReceipt({ hash: txHash })
		const gasUsed = BigInt(receipt.gasUsed)
		const gasPrice = BigInt(receipt.effectiveGasPrice)

		// 计算实际退款金额（扣除gas费用）
		const gasCost = gasUsed * gasPrice
		const refundAmount = amount - gasCost

		// 确保退款金额大于0
		if (refundAmount <= 0n) {
			throw new Error("Refund amount is not enough to cover gas cost")
		}
		// 执行退款
		const refundTx = await contract.write.refundETH([toAddress, refundAmount])

		return refundTx
	} catch (error) {
		console.error("Refund failed:", error.message)
		throw error
	}
}
