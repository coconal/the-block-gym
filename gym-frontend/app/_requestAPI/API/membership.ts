import axiosInstance from "@/app/_utils/request"

export async function getUserMembership() {
	const res = await axiosInstance.get<API.UserMembership.MembershipResponse>(
		`/user/membership/active`
	)
	return res
}

export async function getUserMembershipList() {
	const res = await axiosInstance.get<API.UserMembership.MembershipResponse>("/user/membership")
	return res
}
