"use client"
import "./index.scss"

import { useState } from "react"
import type { MenuProps } from "antd"
import { Menu } from "antd"
import { menuItems } from "./menuItem"
import { useParams, usePathname, useRouter } from "next/navigation"

interface ILayoutContentHeaderNavProps {
	type: number
}

export default function LayoutContentHeaderNav(props: ILayoutContentHeaderNavProps) {
	const { type } = props

	const router = useRouter()
	const pathname = usePathname()

	const items = menuItems[type]
	const state = pathname.split("/")
	const baseSegments = state.slice(0, 3)
	const key = state[state.length - 1]

	const baseUrl = baseSegments.join("/")
	const onClick: MenuProps["onClick"] = (e) => {
		router.replace(`${baseUrl}${e.keyPath.reverse().join("")}`.replace(/\/+/g, "/")) // 添加路径规范化
	}
	return (
		<Menu
			className="custom-menu"
			style={{ background: "transparent" }}
			onClick={onClick}
			selectedKeys={[`/${key}`]}
			mode="horizontal"
			items={items}
		/>
	)
}
