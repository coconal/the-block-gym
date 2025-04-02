"use client"

import { useGetUser } from "@/app/hooks/useGetUser"
import { Tag } from "antd"
import Loading from "@/app/loading"

interface IUserType {
	isOpen: boolean
}

export default function UserType(props: IUserType) {
	const { isOpen } = props
	const { userData, isPending } = useGetUser()
	if (isPending) {
		return <Loading />
	}
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "0.5rem",
			}}
		>
			<div
				style={{
					color: "bisque",
					fontSize: "0.875rem",
					textWrap: "nowrap",
				}}
			>
				{!isOpen ? "用户类型：" : ""}
			</div>
			<Tag color={userData?.role === "admin" ? "red" : "#2db7f5"}>{userData?.role}</Tag>
		</div>
	)
}
