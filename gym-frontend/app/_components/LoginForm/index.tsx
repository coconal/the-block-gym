"use client"

import { useMutation } from "@tanstack/react-query"
import { Alert, AlertProps, Button, Snackbar, SnackbarOrigin } from "@mui/material"
import { Flex } from "antd"
import { useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import LoginIcon from "@mui/icons-material/Login"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface SnackbarState extends SnackbarOrigin {
	open: boolean
}

export default function LoginForm() {
	const [state, setState] = useState<SnackbarState>({
		open: true,
		vertical: "top",
		horizontal: "center",
	})
	const [error, setError] = useState<{
		open: boolean
		message: string
	}>({
		open: false,
		message: "",
	})
	const { open } = state
	const { address, isConnected } = useAccount()
	const { signMessageAsync } = useSignMessage()
	const router = useRouter()
	const handleClose = () => {
		setState({ ...state, open: false })
	}

	const loginMutation = useMutation({
		mutationFn: async () => {
			// 添加请求超时处理
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 10000)

			try {
				// 1. 添加响应状态检查
				const nonceRes = await fetch(`http://localhost:3002/api/user/nonce/${address}`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					signal: controller.signal,
				})

				if (!nonceRes.ok) {
					throw new Error(`获取 nonce 失败：${nonceRes.status}`)
				}

				const { nonce } = await nonceRes.json()

				// 2. 添加签名错误处理

				const signature = await Promise.race([
					signMessageAsync({
						message: `login message&nunce:${nonce}`,
					}).catch((err) => {
						console.error("[2/3] 签名错误详情:", err)
						// 添加更明确的错误类型判断
						if (err.code === 4001) {
							throw new Error("用户取消签名操作")
						} else if (err.code === -32602) {
							throw new Error("无效的消息参数")
						} else {
							throw new Error(`钱包签名失败: ${err.message}`)
						}
					}),
					new Promise(
						(_, reject) =>
							setTimeout(() => {
								reject(new Error("签名操作超时，请重试"))
							}, 30000) // 设置超时时间为 30 秒
					),
				])
				// console.log(signature)

				// 3. 添加登录响应检查
				const loginRes = await fetch(`http://localhost:3002/api/user/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ address, signature }),
					signal: controller.signal,
				})
				if (!loginRes.ok) {
					throw new Error(`登录失败：${loginRes.status}`)
				}
				if (loginRes.status === 401) {
					throw new Error("无效的签名")
				}
				if (loginRes.status === 404) {
					throw new Error("用户不存在")
				}
				if (loginRes.status === 200) {
					// 登录成功，移动到 dashboard 页面
					router.replace("/dashboard")
				}
				return loginRes.json()
			} finally {
				clearTimeout(timeoutId)
			}
		},
		onSuccess: (data) => {
			if (data.token) {
				localStorage.setItem("web3_token", data.token)
				toast.success("login successfully", { duration: 2000 })
			}
		},
		onError: (err: Error) => {
			toast.error("login failed: " + err.message, { duration: 5000 })
		},
	})

	return (
		<div>
			{isConnected ? (
				<>
					<Flex justify="center" align="center" style={{ height: "40vh" }}>
						<Button
							loading={loginMutation.isPending}
							loadingPosition="start"
							startIcon={<LoginIcon />}
							sx={{
								backgroundColor: "rgba(39, 137, 228, 0.919)",
								padding: "12px 26px",
								fontSize: "1.2rem",
								color: "#ffffff",
								"& .MuiSvgIcon-root": {
									color: "#ebeff3",
									fontSize: "1.5rem",
								},
								"&:hover": {
									backgroundColor: "rgba(199, 212, 224, 0.04)",
								},
							}}
							onClick={() => loginMutation.mutate()}
						>
							Login with wallet signature
						</Button>
					</Flex>
					<Notifaction
						SnackbarOpen={error.open}
						handleClose={() => setError({ ...error, open: false })}
						severity="error"
						variant="filled"
						content={error.message}
					/>
				</>
			) : (
				<Notifaction
					SnackbarOpen={open}
					handleClose={handleClose}
					severity="info"
					variant="filled"
					content="Please Connect Wallet"
				/>
			)}
		</div>
	)
}

interface NotifactionProps {
	SnackbarOpen: boolean
	handleClose: () => void
	severity: AlertProps["severity"]
	variant: AlertProps["variant"]
	content: string
}

function Notifaction({ ...props }: NotifactionProps) {
	return (
		<Snackbar open={props.SnackbarOpen} autoHideDuration={6000}>
			<Alert
				onClose={props.handleClose}
				severity={props.severity}
				variant={props.variant}
				sx={{ width: "100%" }}
			>
				{props.content}
			</Alert>
		</Snackbar>
	)
}
