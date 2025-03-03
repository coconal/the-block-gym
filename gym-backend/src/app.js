import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
import coachRouter from "./routes/coachRoute.js"
dotenv.config()

const app = express()

const DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD)

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// 登录接口
app.use("/api/user", authRouter, userRouter)
app.use("/api/coach", coachRouter)

mongoose.connect(DB).then(() => {
	// console.log(con.connections);
	console.log("DB connection successful!")
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
