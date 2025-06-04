"use client"

import { checkAwardBy, getAwards, getUserAwards, redeemAward } from "@/app/_requestAPI/API/awards"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import DataLoading from "../Loading/DataLoading"
import { Button, Card, List, Typography, Space, Tag, Popconfirm } from "antd"
import { GiftOutlined, SmileOutlined } from "@ant-design/icons"
import Image from "next/image"
import { useGetUser } from "@/app/hooks/useGetUser"
import toast from "react-hot-toast"

const { Title, Text } = Typography

export default function AwardComponent() {
	const { userData, isPending: isLoading } = useGetUser()
	const queryClient = useQueryClient()
	const { data, isPending } = useQuery({
		queryKey: ["award"],
		queryFn: async () => {
			const { data } = await getAwards()
			return data
		},
	})
	const { data: userAwardData, isPending: isUserAwardPending } = useQuery({
		queryKey: ["userAward"],
		queryFn: async () => {
			const { data } = await getUserAwards()
			return data.data
		},
	})
	const { data: checkAwardData, isPending: isCheckPending } = useQuery({
		queryKey: ["awardcheck"],
		queryFn: async () => {
			const { data } = await checkAwardBy()
			return data.data
		},
	})

	const mutate = useMutation({
		mutationFn: async (awardindex: number) => {
			const { data } = await redeemAward(awardindex)
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userRole"] })
			queryClient.invalidateQueries({ queryKey: ["userAward"] })
			queryClient.invalidateQueries({ queryKey: ["awardcheck"] })
			toast.success("兑换成功")
		},
		onError: () => {
			toast.error("兑换失败")
		},
	})

	if (isPending || isLoading || isUserAwardPending || isCheckPending) {
		return <DataLoading />
	}
	console.log(checkAwardData)

	return (
		<div style={{ padding: 24, backgroundColor: "#1f1f1f", minHeight: "100vh" }}>
			<Card
				title="我的兑换记录"
				style={{
					marginBottom: 24,
					background: "#333",
					borderColor: "#444",
					color: "#eee",
				}}
				styles={{
					header: {
						color: "#ffcc00",
						borderBottomColor: "#444",
					},
				}}
			>
				{checkAwardData?.length ? (
					<List
						dataSource={checkAwardData}
						renderItem={(item) => (
							<List.Item>
								<List.Item.Meta
									title={`奖励 #${item.index}`}
									description={
										<Space direction="vertical">
											<Text type="success">兑换时间: {item.timestamp.toLocaleString()}</Text>
											<Text type="success" copyable>
												交易哈希: {item.transactionHash}
											</Text>
										</Space>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<Text style={{ color: "#888" }}>暂无兑换记录</Text>
				)}
			</Card>
			<div
				style={{
					color: "bisque",
					marginBottom: 24,
				}}
			>
				你拥有的点数为{" "}
				<Tag
					color={userData?.points !== 0 ? "green" : "red"}
					icon={<SmileOutlined rotate={userData?.points !== 0 ? 0 : 180} />}
				>
					{userData?.points || 0} 点数
				</Tag>
			</div>
			<Title level={2} style={{ marginBottom: 24, color: "bisque", textAlign: "center" }}>
				<Space align="center">
					<GiftOutlined />
					可兑换奖励
				</Space>
			</Title>
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 2,
					lg: 3,
					xl: 3,
					xxl: 4,
				}}
				dataSource={data?.data}
				renderItem={(award) => (
					<List.Item
						style={{
							height: "100%",
						}}
					>
						<Card
							hoverable
							style={{
								borderRadius: 8,
								overflow: "hidden",
								boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
							}}
							cover={
								<div style={{ position: "relative", height: 200 }}>
									<Image
										src={award.image ? award.image : `/award/award${award.index + 1}.png`}
										alt={award.name}
										fill
										style={{ objectFit: "cover" }}
									/>
								</div>
							}
						>
							<Card.Meta
								title={award.name}
								description={
									<div style={{ color: "#595959", marginTop: 8, minHeight: 80 }}>
										{award.description}
										<div>
											<Text style={{ color: "#faad14" }}>
												兑换所需点数：{award.points === 0 ? "免费" : award.points}
											</Text>
										</div>
									</div>
								}
							/>
							<div style={{ marginTop: 16, textAlign: "center" }}>
								<Popconfirm
									title="确认兑换?"
									description="你确定要兑换这个奖励吗？"
									okText="是的"
									cancelText="取消"
									onConfirm={() => mutate.mutate(award.index)}
								>
									<Button
										type="primary"
										style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
										disabled={
											!userData?.points ||
											userData.points < award.points ||
											mutate.isPending ||
											userAwardData?.some((userAward) => userAward.index === award.index)
										}
									>
										{userAwardData?.some((userAward) => userAward.index === award.index)
											? "已拥有"
											: "兑换"}
									</Button>
								</Popconfirm>
							</div>
						</Card>
					</List.Item>
				)}
			/>
		</div>
	)
}
