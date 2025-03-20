import { Router } from "express"
import { login, signup } from "../controller/authController.js"
import { getNonce } from "../controller/userController.js"
import rateLimit from "express-rate-limit"

// 每个 IP 每天最多注册 2 个账户
const registerLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	max: 20,
	message: "该 IP 今日注册次数已达上限",
})

// 每个 IP 每小时最多登录 3 次
const loginLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	max: 5,
	message: "该 IP 今日登录次数已达上限",
})

const router = Router()

router.get("/nonce/:address", getNonce)
router.post("/signup", registerLimiter, signup)
router.post("/login", loginLimiter, login)

export default router
