"use client"

import { checkUserAuth } from "@/app/_requestAPI/API/user"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "antd"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
	return function ProtectedRoute(props: P) {
		const router = useRouter()
		const { status } = useAccount()

		const { data, isPending } = useQuery({
			queryKey: ["checkUserAuth"],
			queryFn: async () => {
				try {
					const { data } = await checkUserAuth()
					return data
				} catch (err) {
					console.error("认证检查失败:", err)
					return { success: false }
				}
			},
		})

		useEffect(() => {
			// // 仅当上一次状态是已连接，当前状态变为断开时执行跳转
			if (status === "disconnected") {
				router.push("/auth")
			}
		}, [status, router])
		if (isPending) return <Skeleton />
		if (!data?.success) {
			router.push("/auth")
			return null
		}

		return <Component {...props} />
	}
}
