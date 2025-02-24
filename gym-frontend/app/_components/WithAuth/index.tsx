import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
	return function ProtectedRoute(props: P) {
		const router = useRouter()
		const { isConnected } = useAccount()

		useEffect(() => {
			const checkAuth = () => {
				const token = localStorage.getItem("web3_token")
				if (!token || !isConnected) {
					router.push("/login")
				}
			}

			checkAuth()
		}, [router, isConnected])

		return <Component {...props} />
	}
}
