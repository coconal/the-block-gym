"use client"

import "./index.scss"
import { Calendar, Card, Tag, Button, Empty } from "antd"
import type { Dayjs } from "dayjs"
import { useMemo, useState } from "react"
import dayjs from "dayjs"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserMembership } from "@/app/_requestAPI/API/membership"
import { addCompletedDay, getSchedule } from "@/app/_requestAPI/API/schedule"
import DataLoading from "../Loading/DataLoading"
import toast from "react-hot-toast"

interface ScheduleItem {
	id: string
	day: string
	title: string
	content: string
	minutes: string
	time: string
	state: string
}

const SchedulePageComponent = () => {
	const queryClient = useQueryClient()
	const { data, isPending } = useQuery({
		queryFn: async () => {
			const { data } = await getUserMembership()
			if (data.data.length === 0) return null
			const { data: schedule } = await getSchedule({
				courseId: data?.data[0]?.courseId,
			})
			return schedule.data
		},
		queryKey: ["getUserMembership"],
	})

	const scheduleItems = useMemo(() => {
		return data?.planInfo?.plan || []
	}, [data?.planInfo?.plan])
	const [showData, setShowData] = useState<ScheduleItem | null>({
		id: data?._id || "",
		day: "",
		title: "",
		content: "",
		minutes: "",
		time: dayjs(new Date()).format("YYYY/MM/DD"),
		state: "",
	})
	const handleDateSelect = (date: Dayjs) => {
		const weekday = date.day() === 0 ? 7 : date.day()
		const dayItems = scheduleItems.find((item) => item.day === weekday)
		const state = completed.find((item) => {
			return dayjs(item.time).format("YYYY/MM/DD") === dayjs(date).format("YYYY/MM/DD")
		})
		setShowData({
			id: data?._id || "",
			day: dayItems?.day.toString() || "",
			title: dayItems?.title || "",
			content: dayItems?.content || "",
			minutes: dayItems?.minutes.toString() || "",
			time: state?.time || date.format("YYYY/MM/DD"),
			state: state?.state || "",
		})
	}

	const mutate = useMutation({
		mutationFn: async () => {
			const { data } = await addCompletedDay({
				scheduleId: showData?.id as string,
				day: showData?.day as string,
				time: dayjs(new Date()).format("YYYY-MM-DD"),
			})
			return data
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["getUserMembership"] })
			toast.success(data.message)
		},
		onError: (error) => {
			toast.error("add failed")
			console.error(error)
		},
	})

	const completed = useMemo(() => {
		return data?.completed || []
	}, [data?.completed])
	if (isPending) {
		return <DataLoading />
	}
	if (!data)
		return (
			<div
				style={{
					display: "flex",
					width: "100",
					justifyContent: "center",
					gap: "2rem",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<h1
					style={{
						color: "bisque",
					}}
				>
					😕 没有可用课程
				</h1>
				<Empty />
				<Button type="primary" href="/dashboard/booking">
					Create Now
				</Button>
			</div>
		)
	return (
		<div style={{ padding: "4px" }}>
			<div style={{ display: "flex", gap: "24px" }}>
				<Card
					style={{
						width: 300,
					}}
				>
					{showData && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "2px",
							}}
						>
							<div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
								{showData.time} 训练计划
							</div>
							点击日历单元格查看详细
							<div
								style={{
									padding: "12px",
									background: "#f5f5f5",
									borderRadius: "8px",
									marginBottom: "12px",
								}}
							>
								<div style={{ fontSize: "14px", fontWeight: "bold" }}>{showData.title}</div>
								<div style={{ margin: "8px 0", color: "#666" }}>{showData.content}</div>
								<div style={{ fontSize: "12px", color: "#999" }}>
									训练时长：
									{dayjs()
										.startOf("day")
										.add(Number(showData.minutes), "minutes")
										.format("HH:mm")}{" "}
									小时
								</div>
							</div>
							{showData.state && showData.content && (
								<div
									style={{
										display: "flex",
										width: "100%",
										justifyContent: "center",
									}}
								>
									<Tag color={showData.state === "success" ? "success" : "processing"}>
										{showData.state}
									</Tag>
								</div>
							)}
							<div
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "center",
								}}
							>
								{dayjs(showData.time).isSame(dayjs(), "day") &&
									showData.content &&
									showData.state !== "success" && (
										<Button
											color="primary"
											loading={mutate.isPending}
											onClick={() => {
												mutate.mutate()
											}}
										>
											finish
										</Button>
									)}
							</div>
						</div>
					)}
				</Card>
				<Card
					style={{
						flex: 1,
					}}
				>
					<Calendar
						onSelect={handleDateSelect}
						className="small-calendar"
						cellRender={(value) => {
							const weekday = value.day() === 0 ? 7 : value.day()
							const items = scheduleItems.filter((item) => item.day === weekday)
							const today = dayjs()

							const isInNext7Days =
								value.isAfter(today.subtract(1, "day"), "day") &&
								value.isBefore(today.add(7, "day"), "day")
							const completedItem = completed.filter((item) => {
								const IsCompleted =
									dayjs(item.time).format("YYYY/MM/DD") === value.format("YYYY/MM/DD")
								return IsCompleted
							})

							return scheduleItems.length > 0 ? (
								<div
									style={{
										display: "felx",
										flexDirection: "column",
										gap: "4px",
										height: "100%",
										padding: "2px",
									}}
								>
									{isInNext7Days || items?.length === 0
										? items.map((item, index) => (
												<div
													key={index}
													style={{
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
													}}
												>
													{item.title}
												</div>
										  ))
										: ""}
									{completedItem.length === 0 ? (
										""
									) : (
										<div
											style={{
												display: "flex",
												width: "100%",
												justifyContent: "center",
											}}
										>
											<Tag color={`${showData?.state === "success" ? "success" : "processing"}`}>
												{showData?.state}
											</Tag>
										</div>
									)}
								</div>
							) : null
						}}
					/>
				</Card>
			</div>
		</div>
	)
}

export default SchedulePageComponent
