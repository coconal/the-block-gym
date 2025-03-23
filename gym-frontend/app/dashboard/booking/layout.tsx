interface IBookingLayout {
	children: React.ReactNode
}
export default function BookingLayout(props: IBookingLayout) {
	const { children } = props
	return (
		<div style={{ display: "flex", flexDirection: "column", color: "bisque", height: "100%" }}>
			{children}
		</div>
	)
}
