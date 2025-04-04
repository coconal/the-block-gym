"use client"
import "./index.scss"
import { Avatar, Button, Card, Input, Upload, Skeleton, Form, Divider } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useGetUser } from "@/app/hooks/useGetUser"
import { blo } from "blo"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { updateMe } from "@/app/_requestAPI/API/user"
import { useEffect } from "react"

interface FormValues {
	username: string
	avatar: string
}
export default function SettingPageComponent() {
	const { userData, isPending } = useGetUser()
	const [form] = Form.useForm<FormValues>()

	const queryClient = useQueryClient()
	const handleSubmit = async (values: FormValues) => {
		const formData = new FormData()
		console.log(values)
		if (values.avatar) {
			formData.append("avatar", values.avatar)
		}
		formData.append("username", values.username)
		try {
			const { data } = await updateMe(formData)
			return data
		} catch (error) {
			throw error
		}
	}
	const mutate = useMutation({
		mutationFn: handleSubmit,
		onSuccess: (data) => {
			console.log(data)

			toast.success("保存成功")
			queryClient.invalidateQueries({ queryKey: ["userRole"] })
			form.resetFields()
			form.setFieldsValue({
				username: data.data?.username,
				avatar: data.data?.userimage,
			})
		},
		onError: (error) => {
			toast.error("保存失败")
			console.log(error)
		},
	})
	useEffect(() => {
		if (userData) {
			form.setFieldsValue({
				username: userData.username,
				avatar: userData.userimage,
			})
		}
	}, [userData, form])

	if (isPending) {
		return <Skeleton />
	}

	return (
		<>
			<div className="settingsContainer">
				<Card title="基本信息">
					<Form
						form={form}
						layout="vertical"
						initialValues={{
							username: userData?.username,
							avatar: userData?.userimage,
						}}
						onFinish={mutate.mutate}
					>
						<Form.Item name="avatar" getValueFromEvent={() => undefined}>
							<div className="formItem">
								<div className="text">头像</div>
								<div
									style={{
										width: "40px",
										height: "40px",
									}}
								>
									{userData?.userimage ? (
										<Avatar size={40} src={userData?.userimage} />
									) : (
										<Avatar size={40} src={blo(userData?.address as `0x${string}`)} />
									)}
								</div>
								<Upload
									maxCount={1}
									multiple={false}
									beforeUpload={(file) => {
										// 限制文件大小为1MB
										const isLt1M = file.size / 1024 / 1024 < 1
										if (!isLt1M) {
											toast.error("图片大小不能超过1MB")
											return Upload.LIST_IGNORE
										}
										return isLt1M
									}}
									// action={`${process.env.NEXT_PUBLIC_BASE_URL}/user/uploadAvatar`}
									customRequest={async ({ file, onSuccess, onError }) => {
										try {
											const formData = new FormData()
											if (file) {
												formData.append("avatar", file)
											} else {
												return toast.error("请选择文件")
											}

											const response = await fetch(
												`${process.env.NEXT_PUBLIC_BASE_URL}/user/uploadAvatar`,
												{
													method: "POST",
													body: formData,
													credentials: "include",
												}
											)

											if (!response.ok) throw new Error("上传失败")
											const result = await response.json()

											onSuccess?.(result, new XMLHttpRequest())

											if (result.url && typeof result.url === "string") {
												form.setFieldValue("avatar", result.url)
											} else {
												toast.error("返回的图片地址格式不正确")
											}
										} catch (error) {
											toast.error("头像上传失败")
											onError?.(new Error("上传失败"))
											console.error("上传错误:", error)
											// form.setFieldValue("avatar", userData?.userimage || "")
										}
									}}
									onChange={(info) => {
										if (info.file.status === "done") {
											// const avatarUrl = info.file.response.url
											// form.setFieldValue("avatar", avatarUrl)
										}
									}}
									className="upload-button"
								>
									<Button icon={<UploadOutlined />} disabled={mutate.isPending}>
										上传头像
									</Button>
								</Upload>
							</div>
						</Form.Item>
						<Form.Item
							name="username"
							rules={[
								{ required: true, message: "请输入用户名" },
								{ min: 2, message: "用户名至少2个字符" },
							]}
							className="formItem"
						>
							<div className="formItem">
								<div className="text">用户名</div>
								<Input
									placeholder={userData?.username || "请输入用户名"}
									disabled={mutate.isPending}
								/>
							</div>
						</Form.Item>
						<Divider />

						<div className="formItem">
							<div className="text">钱包地址</div>
							<Input value={userData?.address} disabled />
						</div>

						<div className="formItem">
							<Button type="primary" htmlType="submit" loading={mutate.isPending}>
								保存更改
							</Button>
						</div>
					</Form>
				</Card>
			</div>
		</>
	)
}
