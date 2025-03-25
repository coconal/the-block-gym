import "./index.scss"
import Link from "next/link"
import { Avatar, List } from "antd"
import { blo } from "blo"
import { WarningFilled } from "@ant-design/icons"
import BookingCourseModal from "../BookingCourseModal"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { checkUserHaveCourse, purchaseCourse } from "@/app/_requestAPI/API/user"
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
interface IBookingListItem {
	item: API.Course.CourseEntity
	index: number
}
interface ApiError extends Error {
	response?: {
		data?: {
			error?: string
		}
	}
}
export default function BookingListItem(props: IBookingListItem) {
	const { sendTransactionAsync } = useSendTransaction()
	const { item, index } = props

	const [open, setOpen] = useState(false)
	const mutation = useMutation({
		mutationFn: async () => {
			const { data: check } = await checkUserHaveCourse()
			if (!check?.data[0]?.isActive) {
				const paymentProof = await sendTransactionAsync({
					to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
					value: parseEther(item.price.toString()),
				})
				const { data } = await purchaseCourse({
					id: item._id,
					duration: item.duration,
					paymentProof,
				})
				return data
			}

			return {
				message: "repeat",
			}
		},
		onSuccess: (data) => {
			setOpen(false)
			if (data.message === "repeat") {
				toast.error("There are courses that have not expired", {
					icon: <WarningFilled />,
					duration: 5000,
					style: {
						color: "red",
					},
				})
				return
			}
			toast.success(data.message, {
				duration: 5000,
			})
		},
		onError: (error: ApiError) => {
			setOpen(false)
			console.log(error)
			const message = error.response?.data?.error || "Something went wrong"
			toast.error(message, {
				icon: <WarningFilled />,
				duration: 5000,
				style: {
					color: "#f44e4ecf",
				},
			})
		},
	})
	return (
		<>
			<BookingCourseModal
				item={item}
				open={open}
				setOpen={setOpen}
				loading={mutation.isPending}
				handleOk={() => {
					mutation.mutate()
				}}
			/>
			<List.Item key={index}>
				<List.Item.Meta
					avatar={
						<Avatar
							src={
								item.coachimageurl === ""
									? blo(item.coachAddress as `0x${string}`)
									: item.coachimageurl
							}
							style={{
								cursor: "pointer",
							}}
							onClick={() => {
								setOpen(true)
							}}
						/>
					}
					title={
						<div
							className="custom-list-title-hover"
							onClick={() => {
								setOpen(true)
							}}
						>
							{item.coursetype}
						</div>
					}
					description={
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "2px",
							}}
						>
							<div
								style={{
									display: "flex",
									gap: "0.5rem",
								}}
							>
								<span>coach address: </span>
								<Link
									className="custom-list-title-hover"
									style={{
										color: "bisque",
									}}
									href=""
								>
									{item.coachAddress}
								</Link>
							</div>
							{item.description} {item.price}ETH---{item.duration}d
						</div>
					}
				/>
			</List.Item>
		</>
	)
}
