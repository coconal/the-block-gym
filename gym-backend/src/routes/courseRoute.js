import { Router } from "express"
import { protect } from "../controller/authController.js"
import { getCourses } from "../controller/courseController.js"

const router = Router()
router.route("/").get(protect, getCourses)
// router.route("/courses/:_coursesid").get(protect)

export default router
