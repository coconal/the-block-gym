import { Router } from "express"
import { createCourse, updateCourse } from "../controller/adminController.js"
import { onlyOwner, protect } from "../controller/authController.js"

const router = Router()

router.route("/createCourseMembership").post(protect, onlyOwner, createCourse)
router.route("/updateCourseMembership/:_coursemembershipId").post(protect, onlyOwner, updateCourse)

export default router
