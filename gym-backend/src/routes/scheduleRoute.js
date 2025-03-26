import { Router } from "express"
import { protect } from "../controller/authController.js"
import { addCompletedDay, getCourseSchedule } from "../controller/scheduleComtroller.js"

const router = Router()

router.use("/:_id", protect, addCompletedDay)
router.use("/", protect, getCourseSchedule)

export default router
