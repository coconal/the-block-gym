"use client"
import Spinner from "@/app/_components/Loading/Spinner"
import ManageCourseComponent from "@/app/_components/ManageCourseComponent"
import ManageCourseComponentAdmin from "@/app/_components/ManageCourseComponentAdmin"
import { useGetUser } from "@/app/hooks/useGetUser"

export default function ManageCourse() {
	const { userData, isPending } = useGetUser()
	if (isPending) {
		return <Spinner />
	}

	return (
		<div>
			{userData?.role === "admin" ? <ManageCourseComponentAdmin /> : <ManageCourseComponent />}
		</div>
	)
}
