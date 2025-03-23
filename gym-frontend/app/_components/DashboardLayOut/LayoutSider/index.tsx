"use client"

import "./index.scss"

import LogoutIcon from "@mui/icons-material/Logout"

import InboxIcon from "@mui/icons-material/Inbox"
import SettingsIcon from "@mui/icons-material/Settings"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CheckIcon from "@mui/icons-material/Check"
import RequestQuoteIcon from "@mui/icons-material/RequestQuote"
import AlarmAddRoundedIcon from "@mui/icons-material/AlarmAddRounded"
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded"
import { Button } from "antd"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ILayoutProps {
	collapsed: boolean
}
const data = [
	// { name: "General", icon: <SummarizeIcon /> },
	{ name: "Booking", icon: <InboxIcon />, role: "user" },
	{ name: "Check", icon: <CheckIcon />, role: "user" },
	{ name: "Schedule", icon: <CalendarMonthIcon />, role: "user" },
	{ name: "Renew", icon: <AlarmAddRoundedIcon />, role: "user" },
	{ name: "Report", icon: <CalendarMonthIcon />, role: "user" },
	{ name: "Request", icon: <RequestQuoteIcon />, role: "user" },
	{ name: "ManageUser", icon: <ManageAccountsRoundedIcon />, role: "admin" },
	{ name: "Settings", icon: <SettingsIcon />, role: "user" },
]
export default function LayoutSider(props: ILayoutProps) {
	const { collapsed } = props
	const pathname = usePathname()

	return (
		<div
			className="custom-tabs-container"
			style={{
				padding: "1rem",
				height: "95%",
				width: "100%",
				display: "flex",
				gap: "1.5rem",
				flexDirection: "column",
			}}
		>
			<div className="custom-tab">
				{data.map((item) => {
					const isActive = pathname?.startsWith(`/dashboard/${item.name.toLowerCase()}`)
					return (
						<Link
							key={item.name}
							href={`/dashboard/${item.name.toLowerCase()}`}
							className={`custom-link  ${isActive ? " active" : ""}`}
						>
							<div className={`custom-tab-label ${collapsed ? "collapsed" : ""}`}>
								<div className="custom-tab-icon">{item.icon}</div>

								<span className={`custom-tab-text ${collapsed ? "collapsed" : ""}`} style={{}}>
									{item.name}
								</span>
							</div>
						</Link>
					)
				})}
			</div>
			<div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
				<Button
					danger
					ghost
					shape="round"
					icon={<LogoutIcon />}
					size="middle"
					style={{
						maxWidth: collapsed ? "0%" : "90%",
						transition: "opacity 0.5s ease",
						minWidth: "50px",
					}}
					onClick={() => {}}
				>
					<span
						style={{
							maxWidth: collapsed ? "0%" : "90%",
							opacity: collapsed ? 0 : 1,
							transition: "opacity 0.5s ease",
						}}
					>
						{"Logout"}
					</span>
				</Button>
			</div>
		</div>
	)
}
