"use client"

import "./index.scss"
import Divider from "@mui/material/Divider"

export default function BookingPageContent() {
	// 获取当前时间

	return (
		<div className="booing-content">
			<h1>🤩 Welcome | Let&apos;s book a course 🏋</h1>
			<div style={{ display: "flex", gap: "0.5rem" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginRight: "10px",
						fontSize: "20px",
						fontWeight: "bold",
					}}
				></div>
			</div>
			<Divider
				sx={{
					width: "100%",
					margin: "10px 0",
					borderWidth: "2px",
				}}
			/>
		</div>
	)
}
