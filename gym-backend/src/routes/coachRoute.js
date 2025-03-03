import { Router } from "express"
import { getCoachProfile, getEarnings, releaseFunds } from "../controller/coachController.js"
import { protect } from "../controller/authController.js"

const router = Router()

router.route("/verifiedCID/:coachAddress").get(getCoachProfile)
router.route("/getEarnings").get(protect, getEarnings)
router.route("/getEarnings/release").post(protect, releaseFunds)

export default router
