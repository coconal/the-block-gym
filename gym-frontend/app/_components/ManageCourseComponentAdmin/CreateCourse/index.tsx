"use client"
import { useState } from "react"
import { Button, Form } from "antd"
import CourseFormModal from "../CourseFormModal"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { createCourse } from "@/app/_requestAPI/API/courses"

export default function CreateCourse() {
	const [open, setOpen] = useState(false)
	const [form] = Form.useForm()
	const queryClient = useQueryClient()
	const mutate = useMutation({
		mutationFn: async () => {
			const data = await createCourse(form.getFieldsValue())
			return data
		},
		onSuccess: () => {
			toast.success("创建成功")
			queryClient.invalidateQueries({ queryKey: ["courses"] })
			setOpen(false)
		},
		onError: () => {
			toast.error("创建失败")
		},
	})
	return (
		<div>
			<CourseFormModal
				open={open}
				handleCancel={() => {
					setOpen(false)
				}}
				onOK={async () => {
					await form.validateFields()
					mutate.mutate()
				}}
				form={form}
				confirmLoading={mutate.isPending}
				okText="确认创建"
			/>
			<Button onClick={() => setOpen(true)}>创建课程</Button>
		</div>
	)
}
