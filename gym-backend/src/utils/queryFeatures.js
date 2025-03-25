class QueryFeatures {
	constructor(query, queryStr) {
		this.query = query
		this.queryStr = queryStr
	}
	filter() {
		const queryCopy = { ...this.queryStr }
		// 过滤价格为0 时间为0 和 类型为空的query
		const removeFields = ["maxprice", "duration", "coursetype", "coachaddress"]
		removeFields.forEach((el) => {
			if (queryCopy[el] === "0" || queryCopy[el] === "") {
				delete queryCopy[el]
			}
		})
		const queryConditions = {}
		if (queryCopy.maxprice) {
			queryConditions.price = { $lte: Number(queryCopy.maxprice) }
		}
		if (queryCopy.duration) {
			queryConditions.duration = { $eq: Number(queryCopy.duration) }
		}
		if (queryCopy.coursetype) {
			queryConditions.coursetype = queryCopy.coursetype
		}
		if (queryCopy.coachaddress) {
			queryConditions.coachAddress = queryCopy.coachaddress
		}
		if (queryCopy.Isdiscount === "1") {
			queryConditions.discount = { $lt: 100 }
		} else {
			queryConditions.discount = { $gte: 0 }
		}
		this.query = this.query.find(queryConditions)
		return this
	}
	sort() {
		if (this.queryStr.orderby) {
			let orderby = this.queryStr.orderby
			// 处理dsc和desc为降序排序
			if (orderby.toLowerCase() === "desc") {
				orderby = "-price"
			} else {
				orderby = "price"
			}
			this.query = this.query.sort(orderby)
		} else {
			this.query = this.query.sort("-price")
		}
		return this
	}
}

export default QueryFeatures
