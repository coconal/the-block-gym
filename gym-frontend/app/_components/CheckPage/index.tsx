"use client"
import "./index.scss"
import { useQuery } from "@tanstack/react-query"
import { getUserMembershipList } from "@/app/_requestAPI/API/membership"
import { Image, Table, Tag } from "antd"
import ColumnGroup from "antd/es/table/ColumnGroup"
import Column from "antd/es/table/Column"
import dayjs from "dayjs"
import { blo } from "blo"
import DataLoading from "../Loading/DataLoading"
import { useMemo } from "react"
export default function CheckPageComponent() {
	const { data, isPending } = useQuery({
		queryKey: ["memberships"],
		queryFn: async () => {
			const { data } = await getUserMembershipList()
			return data
		},
	})

	const dataSource = useMemo(() => {
		return data?.data.map((item) => ({
			...item,
			key: item._id,
			expireAt: dayjs(item.expireAt).format("YYYY/MM/DD"),
		}))
	}, [data])
	if (isPending) {
		return <DataLoading />
	}

	return (
		<div>
			<Table
				dataSource={dataSource}
				scroll={{ x: 1500 }}
				pagination={{
					pageSize: 4,
				}}
			>
				<Column title="链上课程索引" dataIndex="index" key="index" />
				<Column
					title="到期时间"
					dataIndex="expireAt"
					key="expireAt"
					defaultSortOrder="descend"
					sorter={(a, b) => {
						return a.expireAt.localeCompare(b.expireAt)
					}}
				/>
				<ColumnGroup title="课程详细">
					<Column
						title="教练照片"
						dataIndex={["courseInfo", "coachimageurl"]}
						key="coachimageurl"
						render={(value, record) => {
							return (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Image
										src={value === "" ? blo(record.courseInfo.coachAddress) : value}
										alt="course image"
										width={40}
										height={40}
										style={{
											objectFit: "cover", // 保持图片比例并填充指定区域
											borderRadius: "50%", // 可选：添加圆形效果
										}}
									/>
								</div>
							)
						}}
					/>
					<Column
						title="教练钱包地址"
						dataIndex={["courseInfo", "coachAddress"]}
						key="coachAddress"
						filterMode="menu"
						filters={Array.from(
							new Set(data?.data.map((item) => item.courseInfo.coachAddress))
						).map((address) => ({
							text: address,
							value: address,
						}))}
						onFilter={(value, record) => {
							return (
								record.courseInfo.coachAddress.toLowerCase() === (value as string).toLowerCase()
							)
						}}
						ellipsis
					/>

					<Column
						title="开通时间"
						dataIndex={["courseInfo", "duration"]}
						key="duration"
						render={(value) => {
							return <span>{value} 天</span>
						}}
						sorter={(a, b) => {
							return a.courseInfo.duration - b.courseInfo.duration
						}}
						filterMode="menu"
						filters={[
							{ text: "7 天", value: 7 },
							{ text: "30 天", value: 30 },
							{ text: "90 天", value: 90 },
							{ text: "180 天", value: 180 },
							{ text: "365 天", value: 365 },
							{ text: "730 天", value: 730 },
						]}
						onFilter={(value, record) => {
							return record.courseInfo.duration === value
						}}
					/>
					<Column
						title="价格"
						dataIndex={["courseInfo", "price"]}
						key="price"
						render={(value) => {
							return <span>{value} ETH</span>
						}}
						sorter={(a, b) => {
							return a.courseInfo.price - b.courseInfo.price
						}}
					/>
					<Column
						title="课程类型"
						dataIndex={["courseInfo", "coursetype"]}
						key="title"
						filters={Array.from(new Set(data?.data.map((item) => item.courseInfo.coursetype))).map(
							(type) => ({
								text: type,
								value: type,
							})
						)}
						onFilter={(value, record) => {
							return record.courseInfo.coursetype === value
						}}
						render={(value) => {
							return <Tag color={value === "BASIC" ? "blue" : "red"}>{value}</Tag>
						}}
					/>
					<Column
						title="课程介绍"
						dataIndex={["courseInfo", "description"]}
						key="description"
						ellipsis
					/>
					<Column
						title="折扣"
						dataIndex={["courseInfo", "discount"]}
						key="discount"
						filters={[{ text: "折扣", value: 100 }]}
						onFilter={(value, record) => {
							return record.courseInfo.discount < value
						}}
						render={(value) => {
							return <Tag color={value === 100 ? "magenta" : "red"}>-{100 - value}%</Tag>
						}}
					/>
				</ColumnGroup>
				<Column
					title="是否活跃"
					dataIndex="isActive"
					key="isActive"
					filters={[
						{ text: "true", value: true },
						{ text: "false", value: false },
					]}
					onFilter={(value, record) => {
						return record.isActive === value
					}}
					render={(value) => {
						return <Tag color={value ? "green" : "red"}>{value ? "true" : "false"}</Tag>
					}}
					ellipsis
				/>
				<Column
					title="链上交易哈希"
					dataIndex="coursepurchasedhash"
					key="coursepurchasedhash"
					ellipsis
				/>
			</Table>
		</div>
	)
}
