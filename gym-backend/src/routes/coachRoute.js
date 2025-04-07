import { Router } from "express"
import { getCoachProfile, releaseFunds } from "../controller/coachController.js"
import { protect } from "../controller/authController.js"

const router = Router()

router.route("/verifiedCID/:coachAddress").get(getCoachProfile)
router.route("/getEarnings/release").post(protect, releaseFunds)

export default router
