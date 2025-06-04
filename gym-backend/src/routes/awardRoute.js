import { Router } from "express"
import { protect } from "../controller/authController.js"
import {
	getAllAward,
	redeemRewards,
	getReddemAward,
	checkAwardBy,
} from "../controller/awardController.js"

const router = Router()

router.route("/getAll").get(getAllAward)
router.route("/user").get(protect, getReddemAward)
router.route("/redeemed").post(protect, redeemRewards)
router.route("/check").post(protect, checkAwardBy)
export default router
