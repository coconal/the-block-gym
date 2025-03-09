import mongoose from "mongoose"

const membershipSchema = new mongoose.Schema({
	membershipType: {
		type: String,
		required: true,
		enum: ["BASIC", "VIP", "Boxing", "Yoga", "Zumba", "SHAPING", "FAT_BURNING", "Swimming"],
	},
	description: {
		type: String,
		required: true,
	},
	coachAddress: {
		type: String,
		default: "0x0",
	},
	price: {
		type: Number,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
		validate: {
			validator: function (v) {
				return v > 0
			},
			message: (props) => `${props.value} is not a valid duration!`,
		},
	},
	discount: {
		type: Number,
		validate: {
			validator: function (v) {
				return v >= 50 && v <= 100
			},
			message: (props) => `${props.value} is not a valid discount percentage!`,
		},
		required: true,
	},
})

const Membership = mongoose.model("Membership", membershipSchema)
export default Membership
