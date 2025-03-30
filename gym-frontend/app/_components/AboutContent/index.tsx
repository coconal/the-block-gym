import { Card, Col, Flex, Row } from "antd"
import img1 from "@/public/about1.png"
import React from "react"

import "./index.scss"
import Image from "next/image"
import Meta from "antd/es/card/Meta"
import Link from "next/link"
export default function About() {
	return (
		<div className="about-content">
			<Row gutter={[48, 30]} align="middle" justify={"space-between"}>
				<Col span={14}>
					<div className="p-content">
						<h1>Welcome to The Block Gym</h1>
						<Row style={{ marginTop: "32px" }} gutter={[24, 32]}>
							<Col>
								<p>
									我们的系统是一款基于区块链技术的健身管理平台，旨在为用户、健身中心和教练提供透明、安全、高效的环境。
								</p>
							</Col>
							<Col>
								<p>
									利用区块链技术，确保所有用户数据（如锻炼记录和会员详情）安全存储且不可篡改，增强数据完整性和用户信任。智能合约自动化处理课程预订、支付和奖励分配，减少行政开销，降低错误或争议的可能性。
								</p>
							</Col>
							<Col>
								<p>
									提供安全透明的平台，奖励持续的健身努力，促进健康生活方式，并提供多样化的服务和产品。所有交易（包括支付和奖励）都记录在区块链上，提供透明度和可追溯性。
									用户可以轻松查看自己的活动和奖励，促进社区信任
								</p>
							</Col>
							<Col>
								<p>
									通过利用区块链技术，我们的系统解决了健身行业常见的挑战，如数据安全、支付透明度和用户参与度，创造了一个更具活力和回报的健身生态系统。
								</p>
							</Col>
						</Row>
					</div>
				</Col>
				<Col span={10}>
					<Image alt="gym" src={img1} placeholder="blur" quality={80} width={450} />
				</Col>
			</Row>
			<Flex align="center" vertical gap={48}>
				<h1 style={{ fontSize: "48px", color: "#ead5b9" }}>Coach Profile</h1>
				<Flex gap={30}>
					<Card
						hoverable
						style={{ width: 240 }}
						cover={
							<Image
								alt="coach1"
								src={"https://gym-block.oss-cn-beijing.aliyuncs.com/coach/coach1.png"}
								height={352}
								quality={80}
								width={240}
							/>
						}
					>
						<Meta title="GUYS" description="" />
					</Card>
					<Card
						hoverable
						style={{ width: 240 }}
						cover={
							<Image
								alt="coach2"
								src="https://gym-block.oss-cn-beijing.aliyuncs.com/coach/coach2.png"
								quality={60}
								height={352}
								width={240}
							/>
						}
					>
						<Meta title="Jotaro Kujo" description="" />
					</Card>
					<Card
						hoverable
						style={{ width: 240 }}
						cover={
							<Image
								alt="coach3"
								src={"https://gym-block.oss-cn-beijing.aliyuncs.com/coach/coach3.png"}
								quality={60}
								height={352}
								width={240}
							/>
						}
					>
						<Meta title="Leon" description="" />
					</Card>
					<Link href="/dashboard">
						<Card hoverable style={{ width: "100px", height: "100%" }}>
							<Meta title="more" description=" ......" />
						</Card>
					</Link>
				</Flex>
			</Flex>
		</div>
	)
}
