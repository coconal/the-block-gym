"use client"

import { updateCourse } from "@/app/_requestAPI/API/courses"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Form } from "antd"
import toast from "react-hot-toast"
import CourseFormModal from "../CourseFormModal"

interface IEditModal {
	open: boolean
	setOpen: (open: boolean) => void
	item?: API.Course.CourseEntity
}

export default function EditModal(props: IEditModal) {
	const { open, setOpen, item } = props
	const [form] = Form.useForm()
	const queryClient = useQueryClient()
	const handleCancel = () => {
		setOpen(false)
		form.resetFields()
	}

	const mutate = useMutation({
		mutationFn: async () => {
			const data = await updateCourse(item?._id as string, form.getFieldsValue())
			return data
		},
		onSuccess: () => {
			toast.success("修改成功")
			queryClient.invalidateQueries({ queryKey: ["courses"] })
			setOpen(false)
		},
		onError: () => {
			toast.error("修改失败")
			console.log("error")
			form.resetFields()
			setOpen(false)
		},
	})

	return (
		<CourseFormModal
			open={open}
			handleCancel={handleCancel}
			onOK={mutate.mutate}
			form={form}
			item={item}
			confirmLoading={mutate.isPending}
			okText="确认修改"
		/>
	)
}
