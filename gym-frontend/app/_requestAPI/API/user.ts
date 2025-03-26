import axiosInstance from "@/app/_utils/request"

export async function purchaseCourse(params: API.User.PurchaseParams) {
	const res = await axiosInstance.post<API.User.PurchaseResponse>(
		"/user/membership/purchase",
		params
	)
	return res
}

export async function checkUserHaveCourse() {
	const res = await axiosInstance.get<API.User.CheckUserHaveCourseResponse>(
		"/user/membership/check"
	)
	return res
}

export async function logout() {
	const res = await axiosInstance.post<API.User.logOutResponse>("/user/logout")
	return res
}

export async function checkUserAuth() {
	const res = await axiosInstance.get<API.User.checkAuthResponse>("/user/checkAuth")
	return res
}
