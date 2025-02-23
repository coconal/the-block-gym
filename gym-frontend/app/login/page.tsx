"use client"

import { Alert, AlertProps, Button, Snackbar, SnackbarOrigin } from "@mui/material"
import { Flex } from "antd"
import { useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import LoginIcon from "@mui/icons-material/Login"

interface SnackbarState extends SnackbarOrigin {
	open: boolean
}

export default function LoginPage() {
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
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { open } = state
	const { address, isConnected } = useAccount()
	const { signMessageAsync } = useSignMessage()

	const handleClose = () => {
		setState({ ...state, open: false })
	}

	const handleLogin = async () => {
		try {
			// 生成防重放消息
			setIsLoading(true)
			// // 发送到后端验证
			const res = await fetch(`http://localhost:3002/api/user/nonce/${address}`, {
				method: "GET",
				headers: { "Content-Type": "application/json", Authorization: `Bearer 123` },
			})

			const data = await res.json()
			// console.log(data)
			const message = `login message&nunce:${data.nonce}`
			const signature = await signMessageAsync({ message })
			const res2 = await fetch(`http://localhost:3002/api/user/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					address: address,
					signature: signature,
				}),
			})
			const data2 = await res2.json()
			// console.log(data2)
			if (data.token) {
				localStorage.setItem("web3-token", data2.token)
			}
		} catch (err: any) {
			setError({
				open: true,
				message: `Something went wrong: ${err.message}`,
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			{isConnected ? (
				<>
					<Flex justify="center" align="center" style={{ height: "80vh" }}>
						<Button
							loading={isLoading}
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
							onClick={handleLogin}
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
