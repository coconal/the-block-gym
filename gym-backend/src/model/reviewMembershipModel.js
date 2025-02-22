import mongoose from "mongoose"

const membershipSchema = new mongoose.Schema({
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

const Membership = mongoose.model("Membership", membershipSchema)
export default Membership
