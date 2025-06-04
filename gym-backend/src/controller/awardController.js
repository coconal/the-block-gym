import Award from "../model/awardModel.js"
import User from "../model/userModel.js"
import { awardContract } from "../utils/share.js"

export async function getAllAward(req, res) {
	try {
		const allAwards = await Award.find()
		if (!allAwards) {
			res.status(404).json({ message: "没有找到奖励" })
		}
		res.status(200).json({
			data: allAwards,
			message: "获取所有奖励成功",
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "获取所有奖励失败" })
	}
}

export async function redeemRewards(req, res) {
	const useraddress = req.user.address
	const { index } = req.body

	try {
		const recipt = await awardContract.write.redeemRewards({
			args: [useraddress, index],
		})
		const user = await User.findOne({ address: useraddress })
		if (!user) {
			res.status(404).json({ message: "没有找到用户" })
		}
		const award = await Award.findOne({ index: index })
		if (!award) {
			res.status(404).json({ message: "兑换错误" })
		}
		user.points -= award.points
		await user.save()
		res.status(200).json({ message: "兑换奖励成功", hash: recipt.hash })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "兑换奖励失败" })
	}
}

export async function getReddemAward(req, res) {
	const useraddress = req.user.address
	try {
		const awards = await awardContract.read.getUserRewards([useraddress])
		const userAwards = awards.map((item) => ({
			index: Number(item),
		}))
		if (!userAwards) {
			res.status(404).json({ data: [], message: "没有找到用户奖励" })
		}
		res.status(200).json({
			data: userAwards,
			message: "获取用户奖励成功",
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "获取用户奖励失败" })
	}
}

export async function checkAwardBy(req, res) {
	const useraddress = req.user.address
	const index = req.body.index
	try {
		const filter = {
			user: useraddress,
		}
		if (index) {
			filter.index = index
		}

		const events = await awardContract.getEvents.RewardRedeemed(filter, {
			fromBlock: 0n, // 从区块 0 开始
			toBlock: "latest", // 一直拉到最新
		})

		const result = events.map((event) => ({
			user: event.args.user,
			index: Number(event.args.index),
			timestamp: new Date(Number(event.args.timestamp) * 1000),
			transactionHash: event.transactionHash,
		}))

		res.status(200).json({
			data: result,
			message: "查询奖励兑换记录成功",
		})
	} catch (error) {
		console.log(error)

		res.status(500).json({ message: "获取用户奖励失败" })
	}
}
