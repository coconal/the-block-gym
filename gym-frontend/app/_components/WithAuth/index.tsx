"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
	return function ProtectedRoute(props: P) {
		const router = useRouter()
		const { status } = useAccount()

		useEffect(() => {
			// TODO
			// cookie 过期

			// // 仅当上一次状态是已连接，当前状态变为断开时执行跳转
			if (status === "disconnected") {
				router.push("/auth")
			}
		}, [status, router])

		return <Component {...props} />
	}
}
