// import BookingPageContent from "@/app/_components/BookingPageContent"
const BookingPageContent = lazy(() => import("@/app/_components/BookingPageContent"))

import { lazy } from "react"

interface IBookingLayout {
	children: React.ReactNode
}
export default function BookingLayout(props: IBookingLayout) {
	const { children } = props
	return (
		<div style={{ display: "flex", flexDirection: "column", color: "bisque" }}>
			<BookingPageContent />
			{children}
		</div>
	)
}
