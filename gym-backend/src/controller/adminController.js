import Membership from "../model/membershipModel.js"

export const setPlatformFee = async (req, res) => {
	const { fee } = req.body
	try {
		await contract.write.setPlatformFee([fee])
		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.error("Set platform fee error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const createMembership = async (req, res) => {
	const { membershipType, description, price, caoachAddress, duration, discount } = req.body
	try {
		const result = await Membership.create({
			membershipType,
			description,
			price,
			caoachAddress,
			duration,
			discount,
		})
		if (result) {
			res.status(200).json({
				data: "ok",
				message: "Membership created successfully",
			})
		} else {
			res.status(400).json({
				data: "error",
				message: "Failed to create membership",
			})
		}
	} catch (error) {
		console.error("Create membership error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const updateMembership = async (req, res) => {
	const { _coursemembershipId } = req.params
	const { membershipType, description, price, caoachAddress, duration, discount } = req.body
	const updateData = Object.fromEntries(
		Object.entries({
			membershipType,
			description,
			price,
			caoachAddress,
			duration,
			discount,
		}).filter(([key, value]) => value !== undefined)
	)
	console.log(_coursemembershipId, updateData)

	try {
		const result = await Membership.findByIdAndUpdate(_coursemembershipId, updateData)
		if (result) {
			res.status(200).json({
				data: "ok",
				message: "Membership updated successfully",
			})
		} else {
			res.status(400).json({
				data: "error",
				message: "Failed to update membership",
			})
		}
	} catch (error) {
		console.error("Update membership error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}
