import { Router } from "express"
import multer from "multer"
import MAO from "multer-aliyun-oss"
import {
	checkUserMembershipActive,
	getMembershipActive,
	getUser,
	getUserAllMembership,
	purchaseMembership,
	updateProfile,
	uploadAvatar,
} from "../controller/userController.js"
import { protect } from "../controller/authController.js"

const router = Router()
// OSS 相关配置
const uplod = multer({
	storage: MAO({
		config: {
			region: "oss-cn-beijing",
			accessKeyId: process.env.ACCESS_KEY_ID,
			accessKeySecret: process.env.ACCESS_KEY_SECRET,
			bucket: "gym-block",
		},
		destination: "user",
	}),
	limits: { fileSize: 1 * 1024 * 1024 }, // 限制文件大小为 1MB
})
router.route("/membership").get(protect, getUserAllMembership)
router.route("/membership/check").get(protect, checkUserMembershipActive)
router.route("/membership/active").get(protect, getMembershipActive)
router.route("/membership/purchase").post(protect, purchaseMembership)
router.post("/updateProfile", protect, updateProfile)
router.post("/uploadAvatar", protect, uplod.single("avatar"), uploadAvatar)
router.get("/getMe", protect, getUser)

export default router
