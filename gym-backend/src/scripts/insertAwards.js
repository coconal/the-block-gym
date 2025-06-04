import mongoose from "mongoose"
import dotenv from "dotenv"
import fs from "fs"
import Award from "../model/awardModel.js"

dotenv.config()
async function main() {
	const DB = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD)
	try {
		await mongoose.connect(DB)

		// 准备要插入的文档数组

		// const result = await Courses.find({})
		// fs.writeFileSync("./src/scripts/courses.json", JSON.stringify(result, null, 2))
		// console.log(`${result.length} documents were inserted`)

		// 删除所有文档
		// const resultde = await Courses.deleteMany({})
		// console.log(`${resultde} documents were deleted`)

		// 插入文档
		const documents = JSON.parse(fs.readFileSync("./src/scripts/award.json", "utf8"))
		const result = await Award.insertMany(documents)
		console.log(`${result.length} documents were inserted`)
	} finally {
		await mongoose.connection.close()
	}
}

main().catch(console.error)
