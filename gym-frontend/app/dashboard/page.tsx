"use client"

import { redirect } from "next/navigation"
import { useGetUser } from "../hooks/useGetUser"
import Spinner from "../_components/Loading/Spinner"

export default function DashboardDefaultPage() {
	const { userData, isPending } = useGetUser()
	if (isPending) return <Spinner />
	if (userData?.role === "admin") {
		redirect("/dashboard/general")
	} else {
		redirect("/dashboard/booking")
	}
}
