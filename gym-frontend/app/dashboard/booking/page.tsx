"use client"
import BookingListItem from "@/app/_components/BookingListItem"
import { getAllCourses } from "@/app/_requestAPI/API/courses"
import { useQuery } from "@tanstack/react-query"
import { List } from "antd"

export default function AsyncBookingPage() {
	const { data, isPending } = useQuery({
		queryKey: ["courses"],
		queryFn: getAllCourses,
	})
	if (isPending) {
		return <h1>Loading...</h1>
	}
	const courseList = data?.courses || []

	return (
		<div>
			<List
				itemLayout="vertical"
				size="small"
				pagination={{ position: "top", align: "end", pageSize: 3 }}
				dataSource={courseList}
				renderItem={(item, index) => <BookingListItem item={item} index={index} />}
			/>
		</div>
	)
}
