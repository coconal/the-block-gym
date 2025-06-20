"use client"

import "./index.scss"

import LogoutIcon from "@mui/icons-material/Logout"

import InboxIcon from "@mui/icons-material/Inbox"
import SettingsIcon from "@mui/icons-material/Settings"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CheckIcon from "@mui/icons-material/Check"
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined"
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded"
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange"
import BarChartIcon from "@mui/icons-material/BarChart"
import { Button, Modal, Skeleton } from "antd"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "@/app/_requestAPI/API/user"
import toast from "react-hot-toast"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import { useGetUser } from "@/app/hooks/useGetUser"
import UserType from "./UserType"

interface ILayoutProps {
	collapsed: boolean
}
const data = [
	{ name: "General", zh: "总体情况", icon: <BarChartIcon />, role: ["admin"] },
	{ name: "Booking", zh: "预定", icon: <InboxIcon />, role: ["user", "coach"] },
	{ name: "Check", zh: "查看", icon: <CheckIcon />, role: ["user", "coach"] },
	{ name: "Schedule", zh: "日程规划", icon: <CalendarMonthIcon />, role: ["user", "coach"] },
	{
		name: "ManageCourse",
		zh: "管理课程",
		icon: <ClassOutlinedIcon />,
		role: ["user", "admin", "coach"],
	},
	{ name: "ManageUser", zh: "管理用户", icon: <ManageAccountsRoundedIcon />, role: ["admin"] },
	{ name: "Release", zh: "获取收益", icon: <CurrencyExchangeIcon />, role: ["admin", "coach"] },
	{ name: "Settings", zh: "设置", icon: <SettingsIcon />, role: ["user", "admin", "coach"] },
	{ name: "Award", zh: "兑换奖励", icon: <EmojiEventsIcon />, role: ["user", "coach"] },
]
export default function LayoutSider(props: ILayoutProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { collapsed } = props
	const pathname = usePathname()
	const queryClient = useQueryClient()
	const handleCancel = () => {
		setIsModalOpen(false)
	}
	const { userData, isPending } = useGetUser()
	const roleData = userData?.role
	const mutate = useMutation({
		mutationFn: async () => {
			const { data } = await logout()
			return data
		},
		onSuccess: (data) => {
			if (data.success) {
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
			handleCancel()
			queryClient.invalidateQueries({ queryKey: ["checkUserAuth"] })
			queryClient.invalidateQueries({ queryKey: ["userRole"] })
		},
		onError: (error) => {
			toast.error(error.message)
			console.error(error)
		},
	})

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
			{isPending ? (
				<Skeleton />
			) : (
				<>
					<UserType isOpen={collapsed} />
					<div className="custom-tab">
						{data.map((item) => {
							const isActive = pathname?.startsWith(`/dashboard/${item.name.toLowerCase()}`)
							return item.role.includes(roleData || "user") ? (
								<Link
									key={item.name}
									href={`/dashboard/${item.name.toLowerCase()}`}
									className={`custom-link  ${isActive ? " active" : ""}`}
								>
									<div className={`custom-tab-label ${collapsed ? "collapsed" : ""}`}>
										<div className="custom-tab-icon">{item.icon}</div>

										<span className={`custom-tab-text ${collapsed ? "collapsed" : ""}`} style={{}}>
											{item.zh}
										</span>
									</div>
								</Link>
							) : (
								""
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
							onClick={() => {
								setIsModalOpen(true)
							}}
						>
							<span
								style={{
									maxWidth: collapsed ? "0%" : "90%",
									opacity: collapsed ? 0 : 1,
									transition: "opacity 0.5s ease",
								}}
							>
								{"登出"}
							</span>
						</Button>
						<Modal
							title="确认退出"
							open={isModalOpen}
							onOk={() => mutate.mutate()}
							onCancel={handleCancel}
							okText="确认"
							cancelText="取消"
							loading={mutate.isPending}
						>
							<p>确定要退出登录吗？</p>
						</Modal>
					</div>
				</>
			)}
		</div>
	)
}
