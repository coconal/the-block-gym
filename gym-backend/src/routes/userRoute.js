import { Router } from "express"
import {
	getMembership,
	getUser,
	getUserAllMembership,
	purchaseMembership,
} from "../controller/userController.js"
import { protect } from "../controller/authController.js"

const router = Router()

router.route("/membership").get(protect, getUserAllMembership)
router.route("/membership/:membershipId").get(protect, getMembership)
router.route("/membership/purchase").post(protect, purchaseMembership)

router.get("/getMe", protect, getUser)

export default router
