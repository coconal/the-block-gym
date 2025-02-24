"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React from "react"
import { useAccount } from "wagmi"
import type { FormProps } from "antd"
import { Button, Checkbox, Flex, Form, Input, Radio } from "antd"
import { TextField } from "@mui/material"

interface SignUpFormType {
	usertype: number
	name: string
	address: string
}

type FieldType = {
	usertype?: number
	username?: string
	address?: string
	remember?: string
}

export default function SignupForm() {
	const { address, isConnected } = useAccount()

	const loginMutation = useMutation({
		mutationFn: async ({ usertype, name, address }: SignUpFormType) => {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ usertype, name, address }),
			})
			return res.json()
		},
		onSuccess: (data) => {
			if (data.datahash) {
			}
		},
		onError: (error) => {
			console.error("登录失败:", error)
			alert("登录失败，请重试")
		},
	})
	const handleLogin = async (formdata: FormData) => {
		if (!isConnected) return alert("请先连接钱包")
		console.log(formdata)

		// 提交登录请求
		// loginMutation.mutate({ ...formdata })
	}
	//: FormProps<FieldType>['onFinish']
	function onFinish() {}
	//: FormProps<FieldType>['onFinishFailed']
	function onFinishFailed() {}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "60vh",
				flexDirection: "column",
			}}
		>
			<Flex
				vertical
				gap={20}
				style={{
					width: "300px",
				}}
			>
				<TextField
					id="filled-basic"
					label="Name"
					variant="filled"
					required
					sx={{
						backgroundColor: "#2a2d3e", // 深蓝灰色背景
						borderRadius: "8px",
						"& .MuiInputBase-input": {
							color: "#e4e6ef", // 浅灰白色文字
						},
						"& .MuiInputLabel-root": {
							color: "#8b8fa3", // 中灰色标签
						},
						"& .MuiInputLabel-root.Mui-focused": {
							color: "#7367f0", // 紫色聚焦标签
						},
						"& .MuiFilledInput-underline:after": {
							borderBottomColor: "#7367f0", // 紫色下划线
						},
						"& .MuiFilledInput-root": {
							backgroundColor: "#2a2d3e",
							"&:hover": {
								backgroundColor: "#323548", // 悬停时稍微亮一点
							},
							"&.Mui-focused": {
								backgroundColor: "#323548",
							},
						},
					}}
				/>
			</Flex>
		</div>
	)
}
