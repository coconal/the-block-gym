import mongoose from "mongoose"

const scheduleSchema = new mongoose.Schema({
	courseId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "courses",
		required: true,
	},
	planId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "courseplans",
		required: true,
	},
	completed: {
		type: [
			{
				day: {
					type: Number, // 星期几
					required: true,
				},
				time: {
					type: Date, // 时间
					required: true,
				},
				state: {
					type: String,
					enum: ["success", "processing"],
					default: "processing",
				},
			},
		],
		default: [],
	},
	// 更新时间
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})

scheduleSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.id // 删除虚拟的 id 字段
		return ret
	},
})
scheduleSchema.set("toObject", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.id // 删除虚拟的 id 字段
		return ret
	},
})
scheduleSchema.virtual("planInfo", {
	ref: "courseplans",
	localField: "planId",
	foreignField: "_id",
	justOne: true,
})

// 添加更新时间中间件
scheduleSchema.pre("save", function (next) {
	this.updatedAt = Date.now()
	next()
})

scheduleSchema.pre(/^find/, function (next) {
	this.populate({
		path: "planInfo",
		select: "-__v",
	}).select("-__v")
	next()
})

const Schedule = mongoose.model("schedules", scheduleSchema)

export default Schedule
