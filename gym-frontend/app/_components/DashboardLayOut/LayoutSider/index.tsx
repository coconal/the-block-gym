"use client"

import "./index.scss"
import InboxIcon from "@mui/icons-material/Inbox"
import LogoutIcon from "@mui/icons-material/Logout"
import SettingsIcon from "@mui/icons-material/Settings"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CheckIcon from "@mui/icons-material/Check"
import RequestQuoteIcon from "@mui/icons-material/RequestQuote"
import SummarizeIcon from "@mui/icons-material/Summarize"
import { Tabs, Button } from "antd"
import Link from "next/link"

interface ILayoutProps {
	selectedIndex: number
	collapsed: boolean
	setSelectedIndex: (index: number) => void
}
export default function LayoutSider(props: ILayoutProps) {
	const { selectedIndex, collapsed, setSelectedIndex } = props

	const data = [
		// { name: "General", icon: <SummarizeIcon /> },
		{ name: "Booking", icon: <InboxIcon /> },
		{ name: "Check", icon: <CheckIcon /> },
		{ name: "Schedule", icon: <CalendarMonthIcon /> },
		{ name: "Request", icon: <RequestQuoteIcon /> },
		{ name: "Settings", icon: <SettingsIcon /> },
	]
	const handleTabChange = (key: string) => {
		const newIndex = data.findIndex((item) => item.name === key)
		setSelectedIndex(newIndex)
	}
	return (
		<div
			className="custom-tabs-container"
			style={{
				height: "90%",
				width: "100%",
				display: "flex",
				flexGrow: 1,
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Tabs
				tabPosition="left"
				animated
				defaultActiveKey={data[selectedIndex].name}
				centered
				activeKey={data[selectedIndex].name}
				className="custom-tabs"
				onChange={handleTabChange}
				style={{ height: "20rem", width: "100%" }}
				items={data.map((item) => ({
					key: item.name,
					label: (
						<Link href={`/dashboard/${item.name.toLowerCase()}`} className="custom-link">
							<div
								className="custom-tab-label"
								style={{
									width: "100%",
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "start",
									gap: "1rem",
								}}
							>
								<div className="custom-tab-icon">{item.icon}</div>

								<span
									className="custom-tab-text"
									style={{
										opacity: collapsed ? 0 : 1,

										maxWidth: collapsed ? "0" : "100%",
										// 过渡效果，宽度在 0.3 秒内以 ease 缓动函数变化
										transition: "opacity max-width 0.8s ease",
										// 防止文本换行
										whiteSpace: "nowrap",
										// 溢出隐藏
									}}
								>
									{item.name}
								</span>
							</div>
						</Link>
					),
				}))}
			/>
			<div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
				<Button
					danger
					ghost
					shape="round"
					icon={<LogoutIcon />}
					size="middle"
					style={{
						maxWidth: collapsed ? "0%" : "90%",
						// 过渡效果，宽度在 0.3 秒内以 ease 缓动函数变化
						transition: "opacity max-width 0.8s ease",
					}}
				>
					{collapsed ? "" : "Logout"}
				</Button>
			</div>
		</div>
	)
}
