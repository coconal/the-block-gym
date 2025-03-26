import mongoose from "mongoose"

const coursePlanSchema = new mongoose.Schema({
	courseType: {
		type: String,
		required: true,
		enum: ["VIP", "Boxing", "Yoga", "Zumba", "SHAPING", "FAT_BURNING", "Swimming"],
	},
	plan: {
		type: [
			{
				day: {
					type: Number,
					required: true,
				},
				title: {
					type: String,
					required: true,
				},
				content: {
					type: String,
					required: true,
				},
				minutes: {
					type: Number,
					required: true,
				},
			},
		],
	},
})

const CoursePlan = mongoose.model("courseplans", coursePlanSchema)

export default CoursePlan
