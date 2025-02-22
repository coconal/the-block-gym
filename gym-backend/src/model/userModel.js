import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
	address: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (v) {
				return /^0x[a-fA-F0-9]{40}$/.test(v)
			},
			message: (props) => `${props.value} is not a valid Ethereum address!`,
		},
	},
	nonce: {
		type: Number,
		required: true,
		default: Math.floor(Math.random() * 1000000),
	},
	role: {
		type: String,
		enum: ["user", "coach"],
		required: true,
	},
	// registrationDate:{
	// 	type: Date,
	// 	required: true,
	// },
	verifiedHash: {
		type: String,
		required: true,
	},
})

const User = mongoose.model("User", userSchema)
export default User
