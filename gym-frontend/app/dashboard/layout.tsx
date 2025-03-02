"use client"

import DashboardLayOut from "@/app/_components/DashboardLayOut"
import { withAuth } from "../_components/WithAuth"

interface IDashboardLayOutRoot {
	children: React.ReactNode
}
function DashboardLayOutRoot({ children }: IDashboardLayOutRoot) {
	return (
		<div>
			<DashboardLayOut>{children}</DashboardLayOut>
		</div>
	)
}

export default withAuth(DashboardLayOutRoot)
