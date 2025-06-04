import axiosInstance from "@/app/_utils/request"

export async function getAwards() {
	const res = await axiosInstance.get<API.Award.AwardResponse>("/award/getAll")
	return res
}

// 获取用户奖励
export async function getUserAwards() {
	const res = await axiosInstance.get<API.Award.UserAwardResponse>("/award/user")
	return res
}

// 兑换奖励
export async function redeemAward(index: number) {
	const res = await axiosInstance.post<API.Award.RedeemResponse>("/award/redeemed", {
		index,
	})
	return res
}

// 查询奖励兑换记录
export async function checkAwardBy(index?: number) {
	const res = await axiosInstance.post<API.Award.UserAwardResponse>("/award/check", {
		index,
	})
	return res
}
