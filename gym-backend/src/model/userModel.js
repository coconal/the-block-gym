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
	username: {
		type: String,
		length: 20,
		required: true,
	},
	nonce: {
		type: Number,
		required: true,
		default: Math.floor(Math.random() * 1000000),
	},
	role: {
		type: String,
		enum: ["user", "coach", "admin"],
		required: true,
	},
	verifiedHash: {
		type: String,
		required: true,
		default: "0x0",
	},
	userimage: {
		type: String,
		default: "",
	},
	points: {
		type: Number,
		default: 0,
	},
})

const User = mongoose.model("users", userSchema)
export default User
