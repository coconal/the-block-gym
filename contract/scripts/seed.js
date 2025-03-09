const { ethers } = require("hardhat")

async function main() {
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

	// 创建初始会员类型（根据路由参数）
	await membership.connect(admin).registerUser(2, admin.address)
	await membership.connect(admin).registerUser(1, coach.address)
	await Promise.all(users.map((user) => membership.connect(admin).registerUser(0, user.address)))
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
