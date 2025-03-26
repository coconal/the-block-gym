const { expect } = require("chai")
const { ethers } = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-network-helpers")

function generateTestIPFSHash() {
	const prefix = "Qm"
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	let hash = ""
	for (let i = 0; i < 44; i++) {
		hash += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return prefix + hash
}

describe("GymMembership", function () {
	let gymMembership
	let owner, coach, user, otherUser
	let paymentAmount = ethers.parseEther("1")
	let duration = 30 * 24 * 60 * 60 // 30 days
	let paymentProof = ethers.keccak256(ethers.toUtf8Bytes("payment proof"))

	beforeEach(async function () {
		;[owner, coach, user, otherUser] = await ethers.getSigners()
		const GymMembership = await ethers.getContractFactory("GymMembership")
		gymMembership = await GymMembership.deploy(owner.address)
		await gymMembership.waitForDeployment()
		await user.sendTransaction({
			to: gymMembership.target,
			value: ethers.parseEther("1"),
		})
	})

	describe("Registration", function () {
		it("Should register a user", async function () {
			await gymMembership.connect(owner).registerUser(0, user.address)
			const { userType, registrationDate, isActive } = await gymMembership.getUser(user.address)
			expect(userType).to.equal(0)
			expect(Number(registrationDate)).to.be.greaterThan(0)
			expect(isActive).to.be.true
		})

		it("Should verify a coach", async function () {
			let ipfsCertHash = generateTestIPFSHash()
			await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
			expect(await gymMembership.verifiedCoaches(coach.address)).to.be.true
		})
	})

	describe("Membership Purchase", function () {
		beforeEach(async function () {
			let ipfsCertHash = generateTestIPFSHash()
			await gymMembership.connect(owner).registerUser(0, user.address)
			await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
		})
		it("Should transfer 1 ETH to the contract", async function () {
			const balance = await ethers.provider.getBalance(gymMembership.target)
			expect(balance).to.equal(ethers.parseEther("1"))
		})
		it("Should purchase a membership", async function () {
			await expect(
				gymMembership
					.connect(owner)
					.purchaseMembership(coach.address, user.address, duration, paymentProof, paymentAmount)
			)
				.to.emit(gymMembership, "MembershipPurchased")
				.withArgs(user.address, coach.address, paymentAmount, duration, paymentProof)
			expect(Number(await gymMembership.getMembershipLength(user.address))).to.equal(1)
		})
	})

	// describe("Membership Extension", function () {
	// 	let id
	// 	let ipfsCertHash = generateTestIPFSHash()
	// 	beforeEach(async function () {
	// 		await gymMembership.connect(owner).registerUser(0, user.address)
	// 		await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
	// 		await gymMembership
	// 			.connect(owner)
	// 			.purchaseMembership(coach.address, user.address, duration, paymentProof, paymentAmount)

	// 		id = (await gymMembership.getMembershipLength(user.address)) - 1n
	// 	})

	// 	it("Should extend a membership", async function () {
	// 		let extraDuration = 15 * 24 * 60 * 60 // 15 days
	// 		await expect(
	// 			gymMembership
	// 				.connect(owner)
	// 				.extendMembership(id, user.address, extraDuration, paymentProof, paymentAmount)
	// 		)
	// 			.to.emit(gymMembership, "DurationExtended")
	// 			.withArgs(user.address, id, extraDuration, paymentProof)
	// 		const membership = (await gymMembership.getMembership(user.address))[Number(id)]
	// 		expect(Number(membership.duration)).to.equal(duration + extraDuration)
	// 	})
	// })

	describe("Membership Transfer", function () {
		let id
		let ipfsCertHash = generateTestIPFSHash()
		let plantFee

		beforeEach(async function () {
			await gymMembership.connect(owner).registerUser(0, user.address)
			await gymMembership.connect(owner).registerUser(0, otherUser.address)
			await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
			await gymMembership
				.connect(owner)
				.purchaseMembership(coach.address, user.address, duration, paymentProof, paymentAmount)
			id = (await gymMembership.getMembershipLength(user.address)) - 1n
		})

		it("Should transfer a membership", async function () {
			console.log("Transferring membership with ID:", id)
			console.log("Transferring to address:", otherUser.address)
			plantFee = await gymMembership.platformFee()
			console.log("Platform fee:", plantFee)

			await time.increase(86400)
			await expect(gymMembership.connect(user).transferMembership(id, otherUser.address))
				.to.emit(gymMembership, "MembershipTransferred")
				.withArgs(
					user.address,
					otherUser.address,
					id,
					await gymMembership.getMembershipLength(otherUser.address)
				)
			const senderMemberships = await gymMembership.getMembership(user.address)
			expect(senderMemberships[Number(id)].isActive).to.be.false
			const recipientMemberships = await gymMembership.getMembership(otherUser.address)
			expect(recipientMemberships[0].isActive).to.be.true
			expect(recipientMemberships[0].totalAmount).to.equal(
				senderMemberships[Number(id)].totalAmount - senderMemberships[Number(id)].releasedAmount
			)
			const total =
				ethers.parseUnits("10000", 18) +
				(BigInt(senderMemberships[Number(id)].releasedAmount) * (100n - BigInt(plantFee)) + 99n) /
					100n
			expect(await ethers.provider.getBalance(coach.address)).to.equal(total)

			// expect(recipientMemberships[0].duration).to.equal(duration - 86400)
			expect(recipientMemberships.length).to.equal(1)
		})
	})

	describe("Fund Release", function () {
		let id
		let ipfsCertHash = generateTestIPFSHash()
		beforeEach(async function () {
			await gymMembership.connect(owner).registerUser(0, user.address)
			await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
			await gymMembership
				.connect(owner)
				.purchaseMembership(coach.address, user.address, duration, paymentProof, paymentAmount)
			id = (await gymMembership.getMembershipLength(user.address)) - 1n
		})

		it("Should release funds", async function () {
			console.log("Funds released for user:", user.address)
			console.log("Membership ID:", id)

			const initialMembership = (await gymMembership.getMembership(user.address))[Number(id)]

			expect(initialMembership.isActive).to.be.true
			await time.increase(3 * 24 * 60 * 60)

			await expect(gymMembership.connect(owner).releaseFunds(user.address, id)).to.emit(
				gymMembership,
				"FundsReleased"
			)

			const membership = (await gymMembership.getMembership(user.address))[Number(id)]
			expect(Number(membership.releasedAmount)).to.be.greaterThan(0)
			console.log("Funds released:", membership.releasedAmount)
		})
	})

	describe("Refund", function () {
		let id
		let ipfsCertHash = generateTestIPFSHash()
		beforeEach(async function () {
			await gymMembership.connect(owner).registerUser(0, user.address)
			await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
			await gymMembership
				.connect(owner)
				.purchaseMembership(coach.address, user.address, duration, paymentProof, paymentAmount)
			id = (await gymMembership.getMembershipLength(user.address)) - 1n
		})

		it("Should issue a refund", async function () {
			await time.increase(7 * 24 * 60 * 60)
			await expect(gymMembership.connect(user).requestRefund(id)).to.emit(
				gymMembership,
				"RefundIssued"
			)
			const membership = (await gymMembership.getMembership(user.address))[Number(id)]
			expect(membership.isActive).to.be.false
		})

		it("Should allow admin to force a refund", async function () {
			await expect(gymMembership.connect(owner).adminForceRefund(user.address, id)).to.emit(
				gymMembership,
				"RefundIssued"
			)
			const membership = (await gymMembership.getMembership(user.address))[Number(id)]
			expect(membership.isActive).to.be.false
		})
	})

	describe("Platform Fee", function () {
		it("Should set the platform fee", async function () {
			let newFee = 5
			await gymMembership.connect(owner).setPlatformFee(newFee)
			expect(Number(await gymMembership.platformFee())).to.equal(newFee)
		})
	})

	describe("error and refund to user", function () {
		let id
		let ipfsCertHash = generateTestIPFSHash()
		beforeEach(async function () {
			await gymMembership.connect(owner).registerUser(0, user.address)
			await gymMembership.connect(owner).verifiedCoach(coach.address, ipfsCertHash)
			await gymMembership
				.connect(owner)
				.purchaseMembership(coach.address, user.address, duration, paymentProof, paymentAmount)
			id = (await gymMembership.getMembershipLength(user.address)) - 1n
		})

		it("refund to user", async function () {
			await time.increase(7 * 24 * 60 * 60)
			//9990.766021516914982529 ethers
			console.log(await ethers.provider.getBalance(user.address))
			await gymMembership.connect(owner).refundETH(user.address, ethers.parseEther("0.5"))
			//9991.266021516914982529 ethers
			console.log(await ethers.provider.getBalance(user.address))
		})
	})
})
