"use client"

import BookingListItem from "@/app/_components/BookingListItem"
import DataLoading from "@/app/_components/Loading/DataLoading"
import { getAllCourses } from "@/app/_requestAPI/API/courses"
import { useStore } from "@/app/_store"
import { useQuery } from "@tanstack/react-query"
import { Empty, List, Card, Space, Input, Select, Switch } from "antd"
import { toJS } from "mobx"
import { observer } from "mobx-react-lite"

import toast from "react-hot-toast"

const BookingPage = observer(() => {
	const store = useStore()
	const courseFilter = toJS(store?.BookingStore.courseFilter)
	const { data, isPending } = useQuery({
		queryKey: ["courses", store?.BookingStore.courseFilter],
		queryFn: () => getAllCourses(courseFilter),
	})
	const courseList = data?.courses || []

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				width: "100%",
				height: "calc(100vh-100px)",
			}}
		>
			<>
				<Card
					style={{
						background: "transparent",
						border: "none",
						padding: "8px",
					}}
				>
					<Space direction="vertical" style={{ width: "100%" }}>
						<Input.Search
							placeholder="搜索教练钱包地址 基础课程勿填"
							allowClear
							enterButton
							defaultValue={courseFilter?.coachaddress || ""}
							style={{ maxWidth: "400px" }}
							onSearch={(value) => {
								///^0x[a-fA-F0-9]{40}$/

								if (value === "") {
									store?.BookingStore.setCourseFilter({
										coachaddress: "" as `0x${string}`,
									})
									return
								}
								if (/^0x[a-fA-F0-9]{1,40}$/.test(value)) {
									store?.BookingStore.setCourseFilter({
										coachaddress: value as `0x${string}`,
									})
								} else {
									toast.error("请输入正确的地址: 如: 0x1234...")
								}
							}}
						/>
						<Space>
							<Select
								placeholder="课程类型"
								style={{ width: 150 }}
								options={[
									{ value: "", label: "全部课程" },
									{ value: "BASIC", label: "基础课程" },
									{ value: "VIP", label: "VIP课程" },
									{ value: "Boxing", label: "拳击" },
									{ value: "Yoga", label: "瑜伽" },
									{ value: "Zumba", label: "尊巴" },
									{ value: "SHAPING", label: "塑形" },
									{ value: "FAT_BURNING", label: "燃脂" },
									{ value: "Swimming", label: "游泳" },
								]}
								value={courseFilter?.coursetype || undefined}
								onChange={(value) => store?.BookingStore.setCourseFilter({ coursetype: value })}
							/>
							<Select
								placeholder="价格"
								style={{ width: 150 }}
								options={[
									{ value: 0, label: "全部价格" },
									{ value: 0.05, label: "0.05ETH 以下" },
									{ value: 0.1, label: "0.10ETH 以下" },
									{ value: 0.15, label: "0.15ETH以下" },
									{ value: 0.2, label: "0.20ETH以下" },
									{ value: 0.3, label: "0.30ETH以下" },
									{ value: 0.4, label: "0.40ETH以下" },
									{ value: 0.5, label: "0.50ETH以下" },
								]}
								onChange={(value) => store?.BookingStore.setCourseFilter({ maxprice: value })}
							/>
							<Select
								placeholder="会员时长"
								style={{ width: 150 }}
								options={[
									{ value: 0, label: "全部时长" },
									{ value: 30, label: "一月" },
									{ value: 90, label: "一季" },
									{ value: 180, label: "半年" },
									{ value: 360, label: "一年" },
									{ value: 720, label: "两年" },
								]}
								onChange={(value) => store?.BookingStore.setCourseFilter({ duration: value })}
							/>
							<Select
								placeholder="按照价格排序"
								style={{ width: 150 }}
								defaultValue={courseFilter?.orderby || "asc"}
								options={[
									{ value: "asc", label: "升序" },
									{ value: "desc", label: "降序" },
								]}
								onChange={(value) => {
									store?.BookingStore.setCourseFilter({ orderby: value })
								}}
							/>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "5px",
									padding: "5px",
								}}
							>
								<span style={{ color: "bisque" }}>仅显打折课程</span>
								<Switch
									checked={courseFilter?.Isdiscount === 1}
									onChange={(checked) => {
										store?.BookingStore.setCourseFilter({ Isdiscount: checked ? 1 : 0 })
									}}
								/>
							</div>
						</Space>
					</Space>
				</Card>
				{isPending ? (
					<DataLoading />
				) : courseList.length === 0 ? (
					<Empty />
				) : (
					<List
						itemLayout="vertical"
						size="small"
						style={{
							padding: "8px",
						}}
						pagination={{
							position: "top",
							align: "end",
							showSizeChanger: true,
							pageSizeOptions: ["8", "16", "24", "32"],
						}}
						dataSource={courseList}
						renderItem={(item, index) => <BookingListItem item={item} index={index} />}
					/>
				)}
			</>
		</div>
	)
})

export default BookingPage
