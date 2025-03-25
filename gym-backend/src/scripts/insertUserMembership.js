import mongoose from "mongoose"
import dotenv from "dotenv"
import fs from "fs"
import UserMembership from "../model/userMembershipModel.js"
dotenv.config()
async function main() {
	const DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD)
	try {
		await mongoose.connect(DB)

		// 准备要插入的文档数组

		const documents = JSON.parse(fs.readFileSync("./src/scripts/userMembership.json", "utf8"))
		const data = documents.map(({ startTime, duration, ...rest }) => {
			return {
				...rest,
				expireAt: new Date(duration * 24 * 60 * 60 * 1000 + startTime * 1000),
				userId: "67cd372b59e5609a4452a758",
			}
		})
		// console.log(data)

		// 插入文档
		const result = await UserMembership.insertMany(data)
		console.log(`${result.length} documents were inserted`)
	} finally {
		await mongoose.connection.close()
	}
}

main().catch(console.error)
