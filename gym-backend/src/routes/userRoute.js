import { Router } from "express"
import { getUser } from "../controller/userController.js"

const router = Router()

router.get("/:useraddres", getUser)

export default router
