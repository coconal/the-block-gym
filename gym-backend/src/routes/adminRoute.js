import { Router } from "express"
import { createMembership, updateMembership } from "../controller/adminController.js"
import { onlyOwner, protect } from "../controller/authController.js"

const router = Router()

router.route("/createCourseMembership").post(protect, onlyOwner, createMembership)
router.route("/updateCourseMembership/:_membershipId").post(protect, onlyOwner, updateMembership)

export default router
