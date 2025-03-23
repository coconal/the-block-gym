import CourseSchema from "../model/coursesModel.js"

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

export const createCourse = async (req, res) => {
	const { coursetype, description, price, caoachAddress, duration, discount } = req.body
	try {
		const result = await CourseSchema.create({
			coursetype,
			description,
			price,
			caoachAddress,
			duration,
			discount,
		})
		if (result) {
			res.status(200).json({
				data: "ok",
				message: "CourseSchemacreated successfully",
			})
		} else {
			res.status(400).json({
				data: "error",
				message: "Failed to create membership",
			})
		}
	} catch (error) {
		console.error("Create CourseSchemaerror:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const updateCourse = async (req, res) => {
	const { _coursemembershipId } = req.params
	const { coursetype, description, price, caoachAddress, duration, discount } = req.body
	const updateData = Object.fromEntries(
		Object.entries({
			coursetype,
			description,
			price,
			caoachAddress,
			duration,
			discount,
		}).filter(([key, value]) => value !== undefined)
	)
	console.log(_coursemembershipId, updateData)

	try {
		const result = await CourseSchema.findByIdAndUpdate(_coursemembershipId, updateData)
		if (result) {
			res.status(200).json({
				data: "ok",
				message: "Course updated successfully",
			})
		} else {
			res.status(400).json({
				data: "error",
				message: "Failed to update course",
			})
		}
	} catch (error) {
		console.error("Update course error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}
