import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
import coachRouter from "./routes/coachRoute.js"
import adminRouter from "./routes/adminRoute.js"
import coursesRouter from "./routes/courseRoute.js"
import shceduleRouter from "./routes/scheduleRoute.js"
dotenv.config()

const app = express()

const DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD)
const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan("dev"))

// 登录接口
app.use("/api/user", authRouter, userRouter)
app.use("/api/coach", coachRouter)
app.use("/api/admin", adminRouter)
app.use("/api/courses", coursesRouter)
app.use("/api/schedule", shceduleRouter)

mongoose.connect(DB).then(() => {
	// console.log(con.connections);
	console.log("DB connection successful!")
})
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
