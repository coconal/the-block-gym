import CoursePlan from "../model/coursePlanModel.js"
import Schedule from "../model/scheduleModel.js"

export const getCourseSchedule = async (req, res) => {
	const { courseId } = req.query
	try {
		const courseSchedule = await Schedule.findOne({ courseId })

		if (!courseSchedule) {
			return res.status(404).json({ error: "Course schedule not found" })
		}

		res.status(200).json({
			data: courseSchedule,
			message: "Get course schedule successfully",
		})
	} catch (error) {
		console.error("Get course schedule error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const addCompletedDay = async (req, res) => {
	const { _id } = req.params
	const { day, time } = req.body

	try {
		// 查找对应的课程计划
		const schedule = await Schedule.findById({ _id })

		if (!schedule) {
			return res.status(404).json({
				message: "not found schedule",
			})
		}

		// 检查是否已经完成
		const isCompleted = schedule.completed.some((item) => item.time === time && item.day === day)

		if (isCompleted) {
			return res.status(400).json({
				message: "add successfully",
			})
		}

		// 添加完成记录
		schedule.completed.push({ day, time, state: "success" })
		await schedule.save()

		res.status(200).json({
			message: "add successfully",
			data: schedule,
		})
	} catch (error) {
		console.error("添加完成记录失败:", error)
		res.status(500).json({
			message: "服务器内部错误",
		})
	}
}
