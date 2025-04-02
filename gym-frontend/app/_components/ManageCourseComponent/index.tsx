"use client"

import "./index.scss"
import dayjs from "dayjs"
import { Button, Card, Flex, Tag } from "antd"
import { useMembership } from "@/app/hooks/useUserMembership"
import { MoneyCollectOutlined, SearchOutlined } from "@ant-design/icons"
import DataLoading from "../Loading/DataLoading"
import { useState } from "react"
import RequestModal from "./RequestModal"
import TransferModal from "./TransferModal"
export default function ManageCourseComponent() {
	const [open1, setOpen1] = useState(false)
	const [open2, setOpen2] = useState(false)

	const { data, isPending } = useMembership()

	if (isPending) {
		return <DataLoading />
	}

	return (
		<div className="manage-course-container">
			{data?.length !== 0 ? (
				<>
					<div>
						<div
							className="manage-course-title"
							style={{
								color: "bisque",
							}}
						>
							<h1>当前活跃课程</h1>
						</div>
					</div>

					<Card
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							gap: "4px",
						}}
					>
						<div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
							课程Id: {data?.[0].courseId}
						</div>
						<div style={{ fontSize: "14px", color: "#666" }}>
							有无教练 {data?.[0].courseInfo.coachAddress === "0x0" ? "无" : "有"}
						</div>
						<div style={{ fontSize: "14px", color: "#666" }}>
							课程价格：{data?.[0].courseInfo.price} ETH
						</div>
						<div style={{ fontSize: "14px", color: "#666" }}>
							课程有效期：
							{dayjs(data?.[0].expireAt).format("YYYY/MM/DD")}
						</div>
						<div style={{ fontSize: "14px", color: "#666" }}>
							课程描述：{data?.[0].courseInfo.description}
						</div>
						<div style={{ fontSize: "14px", color: "#666" }}>课程链上索引：{data?.[0].index}</div>
						<div style={{ fontSize: "14px", color: "#666" }}>
							课程类型：
							<Tag color={data?.[0].courseInfo.coursetype === "BASIC" ? "blue" : "red"}>
								{data?.[0].courseInfo.coursetype}
							</Tag>
						</div>
						<Flex gap="small" wrap align="center" justify="center">
							<>
								<Button
									onClick={() => {
										setOpen1(true)
									}}
									type="primary"
									icon={<MoneyCollectOutlined />}
									danger
								>
									退款
								</Button>
								<RequestModal
									isModalOpen={open1}
									handleCancel={() => {
										setOpen1(false)
									}}
									index={data?.[0].index as number}
								/>
							</>
							<>
								<Button
									type="primary"
									onClick={() => {
										setOpen2(true)
									}}
									icon={<SearchOutlined />}
								>
									转让
								</Button>
								<TransferModal
									isModalOpen={open2}
									handleCancel={() => {
										setOpen2(false)
									}}
									index={data?.[0].index as number}
									isHaveCoach={data?.[0].courseInfo.coachAddress === "0x0" ? false : true}
								/>
							</>
						</Flex>
					</Card>
					<Tag
						color="red"
						style={{
							fontSize: "14px",
						}}
					>
						警告：七天内不接受退款，谨慎操作！！！
					</Tag>
				</>
			) : (
				<div style={{ color: "bisque", fontSize: "1.5rem" }}>没有活跃课程</div>
			)}
		</div>
	)
}
