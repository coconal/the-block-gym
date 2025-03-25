import axiosInstance from "@/app/_utils/request"

export async function getUserMembership(params: API.UserMembership.MembershipParams) {
	const res = await axiosInstance.get<API.UserMembership.Membership>(
		`/user/membership/${params.index}`
	)
	return res
}

export async function getUserMembershipList() {
	const res = await axiosInstance.get<API.UserMembership.MembershipResponse>("/user/membership")
	return res
}
