"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React from "react"
import { useAccount } from "wagmi"
import type { FormProps } from "antd"
import { Button, Checkbox, Form, Input, Radio } from "antd"

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
		<div>
			<Form
				action={(formdata: FormData) => {
					console.log(formdata)
				}}
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item label="Radio">
					<Radio.Group defaultValue={0}>
						<Radio.Button value={0}>用户</Radio.Button>
						<Radio.Button value={1}>教练</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item<FieldType>
					label="Username"
					name="username"
					rules={[{ required: true, message: "Please input your username!" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item<FieldType>
					label="address"
					name="address"
					rules={[{ required: true, message: "Please input your address!" }]}
				>
					<Input />
				</Form.Item>

				<Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item label={null}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}
