"use client"

import { deleteCourse } from "@/app/_requestAPI/API/courses"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Modal } from "antd"
import toast from "react-hot-toast"

interface IDeleteModal {
	open: boolean
	setOpen: (open: boolean) => void
	id: string
}
export default function DeleteModal(props: IDeleteModal) {
	const { open, setOpen, id } = props
	const queryClient = useQueryClient()
	const mutate = useMutation({
		mutationFn: async () => {
			const data = await deleteCourse(id)
			return data
		},
		onSuccess: () => {
			toast.success("删除成功")
			queryClient.invalidateQueries({ queryKey: ["courses"] })
			setOpen(false)
		},
		onError: () => {
			toast.error("删除失败")
			setOpen(false)
		},
	})

	return (
		<Modal
			title="确认删除吗？"
			open={open}
			okText="确认"
			cancelText="取消"
			onOk={() => mutate.mutate()}
			onCancel={() => setOpen(false)}
			confirmLoading={mutate.isPending}
		>
			确认删除这个课程吗？
		</Modal>
	)
}
