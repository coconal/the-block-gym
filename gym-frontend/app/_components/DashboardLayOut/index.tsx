"use client"

import "./index.scss"

import { Button, Layout, theme } from "antd"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import LayoutSider from "./LayoutSider"
import { useState } from "react"
import LayoutContentHeader from "./LayoutContentHeader"

const { Header, Content, Sider } = Layout

interface IDashboardLayOut {
	children: React.ReactNode
}

export default function DashboardLayOut({ children }: IDashboardLayOut) {
	const [collapsed, setCollapsed] = useState(false)

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
			}}
		>
			<Layout style={{ background: "transparent" }} className="dashboard-layout">
				<Sider
					className="layout-sider"
					collapsed={collapsed}
					collapsible
					trigger={null}
					collapsedWidth={80}
				>
					<LayoutSider collapsed={collapsed} />
				</Sider>
				<Layout style={{ background: "transparent", gap: "15px" }}>
					<Header style={{ padding: 0, background: "transparent" }}>
						<div
							style={{
								width: "100%",
								justifyContent: "left",
								border: "1px solid #3e3e3e",
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
								borderRadius: borderRadiusLG,
								background: "transparent",
							}}
						>
							<div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
								<Button
									type="text"
									icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
									onClick={() => setCollapsed(!collapsed)}
									style={{
										fontSize: "16px",
										height: 64,
										width: 64,
										background: "transparent",
										color: colorBgContainer,
									}}
								/>
								<LayoutContentHeader />
								{/* <LayoutContentHeaderNav type={selectedIndex} /> */}
							</div>
						</div>
					</Header>
					<Content
						style={{
							background: "transparent",
							padding: "24px",
							minHeight: 280,
							borderRadius: borderRadiusLG,
							color: colorBgContainer,
							border: "1px solid #3e3e3e",
							boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							overflow: "scroll",
							overflowY: "auto",
							overflowX: "hidden",
							scrollbarWidth: "thin",
							height: "calc(100vh - 180px)",
						}}
						className="layout-content"
					>
						{children}
					</Content>
				</Layout>
			</Layout>
		</div>
	)
}
