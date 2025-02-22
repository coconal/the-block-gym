import { Router } from "express"
import { login, signup } from "../controller/authController.js"
import { getNonce } from "../controller/userController.js"

const router = Router()

router.get("/nonce/:address", getNonce)
router.post("/signup", signup)
router.post("/login", login)

export default router
