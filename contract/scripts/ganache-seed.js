const { ethers } = require("hardhat")
const courses = [
	{
		courseId: "67cd41e12654229ee413d716",
		duration: 30,
		price: 0.026,
		index: 0,
		startTime: 1640995209,
		isActive: false,
		coursepurchasedhash: "0x5303fd65944d0b1f065e96bad6fed836c4c0bd0e723cc0032f2548dcf43ad6d2",
		releaseHashs: ["0x6efde73c9b86205144660760b8efc43c7e5a3b8a27fae6607b4bef1497fa9157"],
	},
	{
		courseId: "67cd47eedb3b4066d66d4d10",
		duration: 30,
		price: 0.0357,
		index: 1,
		startTime: 1645315212,
		isActive: false,
		coursepurchasedhash: "0x0ffa655be499de8fbfb164744b1e7084dbee93ddeb6189872da8c10ec3795638",
		releaseHashs: ["0xdcedeba5a5620af3ebcd1ed3f720d7931a67bb430eb3de62fea6f4254f77568b"],
	},
	{
		courseId: "67cd48dbdb3b4066d66d4d19",
		duration: 30,
		price: 0.6285,
		index: 2,
		startTime: 1649635215,
		isActive: false,
		coursepurchasedhash: "0x2e3056369fe15a910bad867d86d47c78b221ca76b864ac26e0905011c1538c0b",
		releaseHashs: ["0xdfe71cfc3d380485c1da120e3690a36889f8e127be22afa67303a8966d0de884"],
	},
	{
		courseId: "67cd49d1db3b4066d66d4d2b",
		duration: 30,
		price: 0.4714,
		index: 3,
		startTime: 1653955218,
		isActive: false,
		coursepurchasedhash: "0xfa32c751d62b400f9454ea290ed098a467f1d5b1041bca6e442b77da8ca3f116",
		releaseHashs: ["0x981add46cb501089bb8a823267d2db4d2283b7df59a283e6b27e1851fc6973c5"],
	},
	{
		courseId: "67cd4a03db3b4066d66d4d31",
		duration: 30,
		price: 0.6286,
		index: 4,
		isActive: false,
		startTime: 1658275221,
		coursepurchasedhash: "0x7279227f0dc5f738ee5505036bd325a163bf1b39324229ab5bff7b2d1a1907ab",
		releaseHashs: ["0x1a8ad83e687a3992aadf8a16d6c3164d6c10aea8d6390c4fc6f5cf57fa6cacad"],
	},
]

async function setTime(targetDate) {
	const timestamp = Math.floor(new Date(targetDate).getTime() / 1000)
	if (isNaN(timestamp)) {
		throw new Error(
			`Invalid date format: ${targetDate}. Use ISO format (e.g. "2025-03-15T00:00:00Z")`
		)
	}

	// 使用Ganache的特殊时间设置方法
	await network.provider.send("evm_setTime", [timestamp * 1000]) // Ganache需要毫秒级时间戳
	await network.provider.send("evm_mine")

	// 验证时间设置
	const block = await ethers.provider.getBlock("latest")
	const actualTime = new Date(block.timestamp * 1000)
	console.log("设置时间为:", actualTime.toLocaleString())

	// 如果时间设置不成功，抛出错误
	if (Math.abs(block.timestamp - timestamp) > 60) {
		// 允许60秒误差
		throw new Error(`时间设置失败！当前区块时间: ${actualTime}`)
	}

	return block.timestamp
}

async function setCurrentTime() {
	const now = Math.floor(Date.now())
	await network.provider.send("evm_setTime", [now])
	await network.provider.send("evm_mine")

	const block = await ethers.provider.getBlock("latest")
	console.log("最终区块时间:", new Date(block.timestamp * 1000).toLocaleString())
	return block.timestamp
}

async function increaseTime(seconds) {
	// 使用Ganache的增量时间设置方法
	await network.provider.send("evm_increaseTime", [seconds])
	await network.provider.send("evm_mine")

	// 验证时间增量
	const block = await ethers.provider.getBlock("latest")
	console.log(
		"时间已增加:",
		seconds,
		"秒，当前时间:",
		new Date(block.timestamp * 1000).toLocaleString()
	)
}

async function main() {
	// 设置初始时间
	let currentTimestamp = await setTime("2022-01-01T00:00:00Z")
	const currentBlock = await ethers.provider.getBlock("latest")
	// 获取预置账户
	const accounts = await ethers.getSigners()

	// 角色分配
	const admin = accounts[0]
	const coach = accounts[1]
	const users = accounts.slice(2, 5) // 3-5号为普通用户

	console.log("管理员地址:", admin.address)
	console.log("教练地址:", coach.address)
	console.log(
		"普通用户地址:",
		users.map((u) => u.address)
	)

	// 部署会员合约（示例）
	const Membership = await ethers.getContractFactory("GymMembership")
	const membership = await Membership.deploy(admin.address)
	console.log("合约地址:", membership.target)

	// 创建数组存储所有注册哈希
	const registrationHashes = []

	// 创建初始会员类型（根据路由参数）
	const adminRegTx = await membership.connect(admin).registerUser(2, admin.address)
	const adminRegReceipt = await adminRegTx.wait()
	console.log("交易hash", adminRegTx.hash)
	registrationHashes.push(adminRegReceipt.hash)

	const coachRegTx = await membership.connect(admin).registerUser(1, coach.address)
	console.log("交易hash", coachRegTx.hash)
	const coachRegReceipt = await coachRegTx.wait()
	registrationHashes.push(coachRegReceipt.hash)
	const userRegTxs = await Promise.all(
		users.map((user) => membership.connect(admin).registerUser(0, user.address))
	)
	const userRegReceipts = await Promise.all(userRegTxs.map((tx) => tx.wait()))
	userRegReceipts.forEach((receipt) => registrationHashes.push(receipt.hash))
	console.log("所有用户注册哈希:", registrationHashes)
	for (let i = 0; i < courses.length; i++) {
		const recipt = await users[0].sendTransaction({
			to: membership.target,
			value: ethers.parseEther(courses[i].price.toString()),
		})
		const hash = await recipt.wait()
		const tx = await membership
			.connect(admin)
			.purchaseMembership(
				i === 0 ? "0x0000000000000000000000000000000000000000" : coach.address,
				users[0].address,
				courses[i].duration * 24 * 60 * 60,
				hash.hash,
				ethers.parseEther(courses[i].price.toString())
			)
		const rec = await tx.wait()
		console.log("购买会员成功:", "index", i, "hash", rec.hash)

		const tiemincrease = 60 * 60 * 24 * (courses[i].duration + 20)
		await increaseTime(tiemincrease) // 替换原来的time.increase
		if (i === 0) {
			const txre_no_c = await membership.connect(admin).ReleaseFundsNoCoach(users[0].address, i)
			console.log("释放资金成功:", "index", i, "hash", txre_no_c.hash)
		} else {
			const txre = await membership.connect(admin).releaseFunds(users[0].address, i)
			console.log("释放资金成功:", "index", i, "hash", txre.hash)
		}
	}
	// const membershipData = await membership.getMembership(users[0].address)
	// console.log("用户会员信息:", membershipData)
	await setTime("2025-03-15T00:00:00Z")
	const recipt = await users[0].sendTransaction({
		to: membership.target,
		value: ethers.parseEther("0.15"),
	})
	const tx = await membership
		.connect(admin)
		.purchaseMembership(
			"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
			users[0].address,
			180 * 24 * 60 * 60,
			recipt.hash,
			ethers.parseEther("0.15")
		)
	// 恢复为当前时间
	console.log("购买目前一个会员")
	// 会员过期时间
	const membershipData = await membership.memberships(users[0].address, 5)
	console.log(membershipData.startTime, membershipData.duration)

	console.log(
		"过期时间：",
		new Date(
			(Number(membershipData.startTime) + Number(membershipData.duration)) * 1000
		).toLocaleString()
	)

	currentTimestamp = await setCurrentTime()
	const nowblock = await ethers.provider.getBlock("latest")
	console.log("当前时间:", new Date(nowblock.timestamp * 1000).toLocaleString())
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
