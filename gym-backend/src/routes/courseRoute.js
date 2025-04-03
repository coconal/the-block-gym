import { Router } from "express"
import { onlyOwner, protect } from "../controller/authController.js"
import {
	createCourse,
	deleteCourse,
	getCourses,
	updateCourse,
} from "../controller/courseController.js"

const router = Router()
router.route("/").get(protect, getCourses)
router.route("/create").post(protect, onlyOwner, createCourse)
router
	.route("/action/:_coursesid")
	.put(protect, onlyOwner, updateCourse)
	.delete(protect, onlyOwner, deleteCourse)

export default router
