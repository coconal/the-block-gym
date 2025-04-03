import Course from "../model/coursesModel.js"
import QueryFeatures from "../utils/queryFeatures.js"

export const getCourses = async (req, res) => {
	/**
	 * {
		coachaddress: '0x0',
		coursetype: '',
		duration: '0',
		Isdiscount: '1',
		maxprice: '0',
		orderby: 'asc'
		}
	 */
	const query = req.query
	const features = new QueryFeatures(Course.find({}), query).filter().sort()
	const courses = await features.query
	res.status(200).json({
		courses,
	})
}

export const updateCourse = async (req, res) => {
	try {
		const { _coursesid } = req.params
		await Course.findByIdAndUpdate(_coursesid, req.body)
		res.status(200).json({ message: "success" })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

export const deleteCourse = async (req, res) => {
	try {
		const { _coursesid } = req.params
		await Course.deleteOne({ _id: _coursesid })
		res.status(200).json({ message: "success" })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

export const createCourse = async (req, res) => {
	try {
		console.log(req.body)

		const data = await Course.create({ ...req.body })
		if (!data) {
			res.status(400).json({ message: "fail" })
		}
		res.status(200).json({ message: "success" })
	} catch (err) {
		res.status(500).json({ message: err.message })
		console.log(err)
	}
}
