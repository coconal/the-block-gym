import Membership from "../model/membershipModel.js"

export const getCourses = async (req, res) => {
	const courses = await Membership.find({ ...req.body })
	res.status(200).json({
		courses,
	})
}
