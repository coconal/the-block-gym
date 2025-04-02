import { Modal } from "antd"
import { useWriteContract } from "wagmi"
import { wagmiContractConfig } from "@/contract/gymMembership"
import { requestMembership } from "@/app/_requestAPI/API/user"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

interface RequestModalProps {
	isModalOpen: boolean
	handleCancel: () => void
	index: number
}
export default function RequestModal(props: RequestModalProps) {
	const { isModalOpen, handleCancel, index } = props
	const queryClient = useQueryClient()
	const { writeContractAsync } = useWriteContract()
	const mutate = useMutation({
		mutationFn: async () => {
			const hash = await writeContractAsync({
				...wagmiContractConfig,
				functionName: "requestRefund",
				args: [BigInt(index)],
			})
			if (hash) {
				const { data } = await requestMembership({
					index: index,
					requestHash: hash,
				})
				return data
			}
			return {
				data: "发生错误",
			}
		},
		onSuccess: (data) => {
			if (data.data === "发生错误") {
				toast.error(data.data)
			}
			toast.success(data.data)
			queryClient.invalidateQueries({ queryKey: ["getUserMembership"] })
			handleCancel()
		},
		onError: (error) => {
			let errorMessage = "退款申请失败"
			console.log(error.name)

			if (error.message) {
				// 提取简短错误信息
				errorMessage = error.message.includes("reverted") ? "退款申请被拒绝" : "交易回滚"
			}
			toast.error(errorMessage)
		},
	})
	return (
		<Modal
			title="退款"
			okText="确认"
			cancelText="取消"
			open={isModalOpen}
			onOk={() => {
				mutate.mutate()
			}}
			okButtonProps={{ disabled: mutate.isPending }}
			onCancel={handleCancel}
		>
			<h1>确定要退款吗</h1>
			<h1>七天内不允许退款</h1>
		</Modal>
	)
}
