import { useQuery } from "@tanstack/react-query"
import { getUserMembership } from "@/app/_requestAPI/API/membership"

export const useMembership = () => {
	return useQuery({
		queryFn: async () => {
			const { data } = await getUserMembership()
			return data.data
		},
		queryKey: ["getUserMembership"],
	})
}
