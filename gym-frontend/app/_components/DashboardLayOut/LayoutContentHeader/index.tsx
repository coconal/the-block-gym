"use client"

import "./index.scss"
import { usePathname } from "next/navigation"
import { dashboardHeader } from "@/app/_utils/dashboardheader"

export default function LayoutContentHeader() {
	const pathname = usePathname()
	const path = pathname.split("/")[2]
	const message = dashboardHeader[path]

	return (
		<div className="booing-content">
			<div>{message}</div>
		</div>
	)
}
