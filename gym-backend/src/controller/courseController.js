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
