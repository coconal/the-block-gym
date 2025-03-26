import { Router } from "express"
import {
	checkUserMembershipActive,
	getMembershipActive,
	getUser,
	getUserAllMembership,
	purchaseMembership,
} from "../controller/userController.js"
import { protect } from "../controller/authController.js"

const router = Router()

router.route("/membership").get(protect, getUserAllMembership)
router.route("/membership/check").get(protect, checkUserMembershipActive)
router.route("/membership/active").get(protect, getMembershipActive)
router.route("/membership/purchase").post(protect, purchaseMembership)

router.get("/getMe", protect, getUser)

export default router
