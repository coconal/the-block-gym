import mongoose from "mongoose"

const awardSchema = new mongoose.Schema({
	name: { type: String, required: true },
	index: { type: Number, required: true },
	description: { type: String, required: true },
	image: { type: String, default: "" },
	points: { type: Number, required: true },
})

const Award = mongoose.model("awards", awardSchema)
export default Award
