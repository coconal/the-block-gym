import mongoose from "mongoose"

const reviewmembershipSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	coach: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Coach",
		required: false,
		default: null,
	},
	duration: {
		type: Number,
		required: true,
	},
	verifiedHash: {
		type: String,
		required: true,
	},
	registrationDate: {
		type: Date,
		default: Date.now,
	},
})

const ReviewMembership = mongoose.model("ReviewMembership", reviewmembershipSchema)
export default ReviewMembership
