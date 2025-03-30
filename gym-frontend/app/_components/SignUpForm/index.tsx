"use client"

import "./index.scss"

import { useMutation } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { Button, Form, Input, Select } from "antd"
import toast from "react-hot-toast"

const { Option } = Select

interface SignUpFormType {
	username: string
	role: string
	address: string
}

export default function SignupForm() {
	const { address, isConnected } = useAccount()
	const [form] = Form.useForm()
	const registerMutation = useMutation({
		mutationFn: async ({ role, username, address }: SignUpFormType) => {
			const res = await fetch("http://localhost:3002/api/user/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role, username, address }),
			})

			if (!res.ok) {
				const errorText = await res.json()
				throw new Error(`signup failed: ${errorText.error}`)
			}
			return res.json()
		},
		onSuccess: () => {
			toast.success("sign up successfully, you can login now!", { duration: 5000 })
			form.resetFields()
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const onFinish = (values: SignUpFormType) => {
		const formData = { ...values, address: address as string }
		// 调用 mutation 进行数据提交
		registerMutation.mutate(formData)
	}

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ width: "100%" }}
			autoComplete="off"
			className="custom-signup-form"
			onFinish={onFinish}
		>
			<Form.Item<SignUpFormType>
				label="Username"
				name="username"
				rules={[
					{
						required: true,
						message: <span className="error-message">Please input your username!</span>,
					},
				]}
			>
				<Input className="custom-input" style={{ color: "#2d3436", borderColor: "#636e72" }} />
			</Form.Item>

			<Form.Item<SignUpFormType>
				label="Usertype"
				name="role"
				rules={[
					{
						required: true,
						message: <span className="error-message">Please select your usertype!</span>,
					},
				]}
			>
				<Select style={{ color: "#2d3436" }} placeholder="Select  your role" allowClear>
					<Option value="user">user</Option>
					<Option value="coach">coach</Option>
				</Select>
			</Form.Item>

			<Form.Item label={null}>
				<Button
					type="primary"
					htmlType="submit"
					disabled={!isConnected}
					loading={registerMutation.isPending}
				>
					{isConnected ? "Submit" : "Please Connect Wallet"}
				</Button>
			</Form.Item>
		</Form>
	)
}
