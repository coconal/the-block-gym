import { useQuery } from "@tanstack/react-query"
import { getUserRole } from "../_requestAPI/API/user"

export function useGetUser() {
	const { data: userData, isPending } = useQuery({
		queryKey: ["userRole"],
		queryFn: async () => {
			const { data } = await getUserRole()
			return data.data
		},
		staleTime: 30 * 60 * 1000, // 缓存30分钟
	})
	return { userData, isPending }
}
