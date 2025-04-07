"use client"

import { wagmiContractConfig } from "@/contract/gymMembership"
import "./index.scss"
import { getMembershipRelease, releaseMembership } from "@/app/_requestAPI/API/user"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button, Card, Col, Empty, Modal, Pagination, Row, Skeleton, Tag } from "antd"
import { useState } from "react"
import { useReadContract, useWriteContract } from "wagmi"
import React from "react"
import toast from "react-hot-toast"

const cardStyle: React.CSSProperties = {
	whiteSpace: "nowrap",
	overflow: "hidden",
	marginBottom: 8,
}

export default function ReleasePageComponent() {
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [userInfo, setUserInfo] = useState({
		index: 0,
		address: "",
	})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data, isPending } = useQuery({
		queryKey: ["getRelease"],
		queryFn: async () => {
			const { data } = await getMembershipRelease()
			return data
		},
	})
	const { data: releaseData, isLoading } = useReadContract({
		...wagmiContractConfig,
		functionName: "getReleaseFunds",
		args: [userInfo.address as `0x${string}`, BigInt(userInfo.index)],
	})

	const { writeContractAsync } = useWriteContract()

	const mutate = useMutation({
		mutationFn: async (params: { coachaddress: string; courseId: string }) => {
			const { coachaddress, courseId } = params
			const hash = await writeContractAsync({
				...wagmiContractConfig,
				functionName: coachaddress === "0x0" ? "ReleaseFundsNoCoach" : "releaseFunds",
				args: [userInfo.address as `0x${string}`, BigInt(userInfo.index)],
			})
			if (hash) {
				const data = await releaseMembership({
					courseId,
					index: userInfo.index,
					verifiedHash: hash,
				})
				return data.data
			}
			return {
				message: "释放失败",
			}
		},
		onSuccess: () => {
			toast.success("释放成功")
			setIsModalOpen(false)
		},
		onError: (error) => {
			toast.error("释放失败")
			console.log("release error", error.message)
		},
	})

	if (isPending) {
		return <Skeleton active />
	}
	const formatBigInt = (value: bigint | undefined) => {
		if (value === undefined) return "0"
		return (Number(value) / 1e18).toFixed(4) + " ETH" // 假设是18位小数
	}
	if (data?.data?.length === 0) return <Empty />
	return (
		<div
			style={{
				padding: 16,
				display: "flex",
				flexDirection: "column",
				gap: 16,
			}}
		>
			<div style={{ marginTop: 16, textAlign: "right" }}>
				<Pagination
					current={currentPage}
					pageSize={pageSize}
					total={data?.data?.length || 0}
					onChange={(page, size) => {
						setCurrentPage(page)
						setPageSize(size)
					}}
					showSizeChanger
					showQuickJumper
				/>
			</div>
			{data?.data?.map((item) => {
				return (
					item.isActive && (
						<React.Fragment key={item._id}>
							<Card
								key={`${item._id}-card`}
								title={`会员ID: ${item._id}`}
								styles={{
									header: { backgroundColor: "#f0f2f5" },
									body: cardStyle,
								}}
								style={{ marginBottom: 16, cursor: "pointer" }}
								onClick={() => {
									setIsModalOpen(true)
									setUserInfo({
										address: item.userInfo[0].address,
										index: item.index,
									})
								}}
							>
								<Row gutter={16}>
									<Col span={12} className="custom-col">
										<p>
											<strong>用户ID:</strong> {item.userId}
										</p>
										<p>
											<strong>课程ID:</strong> {item.courseId}
										</p>
										<p>
											<strong>版本号:</strong> {item.__v}
										</p>
										<p>
											<strong>过期时间:</strong> {new Date(item.expireAt).toLocaleString()}
										</p>
										<p>
											<strong>索引:</strong> {item.index}
										</p>
									</Col>
									<Col span={12}>
										<p>
											<strong>购买哈希:</strong> {item.coursepurchasedhash}
										</p>
										<p>
											<strong>课程价格:</strong> {item.courseInfo?.price?.toFixed(4) || "0.0000"}{" "}
											ETH
										</p>
										<p>
											<strong>课程时长:</strong> {item.courseInfo?.duration || 0}天
										</p>
									</Col>
								</Row>
								<div style={{ marginTop: 12 }}>
									<Tag color={item.isActive ? "green" : "red"}>
										{item.isActive ? "有效" : "已失效"}
									</Tag>
									<Tag color={!item.transfered ? "green" : "red"}>
										{!item.transfered ? "未转让" : "已转让"}
									</Tag>
								</div>
							</Card>
							<Modal
								key={`${item._id}-modal`}
								title="收益详情"
								open={isModalOpen}
								onCancel={() => setIsModalOpen(false)}
								footer={null}
							>
								{isLoading ? (
									<Skeleton active />
								) : (
									<div>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												justifyContent: "center",
											}}
										>
											<div>可释放金额: {formatBigInt(releaseData?.[0])}</div>
											<div>平台收取: {formatBigInt(releaseData?.[1])}</div>
											<div>教练收取(如有): {formatBigInt(releaseData?.[2])}</div>
										</div>
										<Button
											type="primary"
											style={{ marginTop: 16 }}
											onClick={() =>
												mutate.mutate({
													coachaddress: item.courseInfo?.coachAddress || "0x0",
													courseId: item.courseId,
												})
											}
											loading={mutate.isPending}
										>
											收取收益
										</Button>
									</div>
								)}
							</Modal>
						</React.Fragment>
					)
				)
			})}
		</div>
	)
}
