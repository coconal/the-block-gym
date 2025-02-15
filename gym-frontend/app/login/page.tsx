"use client"

import { useAccount, useSignMessage } from "wagmi"

export default function LoginPage() {
	const { address, isConnected } = useAccount()
	const { signMessageAsync, isPending } = useSignMessage()

	const handleLogin = async () => {
		try {
			if (!isConnected) return alert("请先连接钱包")

			// 生成防重放消息
			const nonce = Math.random().toString(36).substring(2)
			const message = `Web3登录验证:\nNonce: ${nonce}`

			// 获取签名
			const signature = await signMessageAsync({ message })

			// 发送到后端验证
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer 123` },
				body: JSON.stringify({ address, message, signature }),
			})

			const data = await res.json()

			if (data.token) {
				localStorage.setItem("web3-token", data.token)
			}
		} catch (error) {
			console.error("登录失败:", error)
		} finally {
		}
	}

	return (
		<div>
			<h1>Web3 登录示例</h1>
			<button onClick={handleLogin} disabled={isPending}>
				{isPending ? "处理中..." : "签名登录"}
			</button>
			<h1>Web3 写入示例</h1>
			<button onClick={handleLogin}>{isPending ? "处理中..." : "签名登录"}</button>
		</div>
	)
}
