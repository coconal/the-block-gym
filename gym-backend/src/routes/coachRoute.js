import { Router } from "express"
import { getCoachProfile } from "../controller/coachController"

const router = Router()

router.route("/:coachAddress").get(getCoachProfile)

export default router
