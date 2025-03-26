import mongoose from "mongoose"

const userMembershipSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "courses",
		required: true,
	},
	expireAt: {
		type: Date,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	coursepurchasedhash: {
		type: String,
		required: true,
	},
	releaseHashs: {
		type: [String],
		default: [],
	},
})
userMembershipSchema.set("toJSON", {
	virtuals: true,
})
userMembershipSchema.set("toObject", { virtuals: true })

userMembershipSchema.virtual("courseInfo", {
	ref: "courses",
	localField: "courseId",
	foreignField: "_id",
	justOne: true,
})

userMembershipSchema.pre(/^find/, function (next) {
	this.populate({
		path: "courseInfo",
		select: "-_id -__v",
	})

	next()
})

const UserMembership = mongoose.model("userMemberships", userMembershipSchema)
// 定期检查过期的会员记录
const checkExpiredMemberships = async () => {
	const now = new Date()
	try {
		await UserMembership.updateMany(
			{ expiryDate: { $lt: now }, isActive: true },
			{ isActive: false }
		)
		console.log("Expired memberships updated.")
	} catch (error) {
		console.error("Error updating expired memberships:", error)
	}
}

export default UserMembership
