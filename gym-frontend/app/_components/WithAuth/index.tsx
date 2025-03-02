"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
	return function ProtectedRoute(props: P) {
		const router = useRouter()
		const { isConnected, status } = useAccount()

		useEffect(() => {
			const token = localStorage.getItem("web3_token")
			// 等待自动连接状态确认
			if (status === "reconnecting" || "connecting") return

			if (!token || !isConnected) {
				router.push("/login")
			}
		}, [router, isConnected, status])

		return <Component {...props} />
	}
}
