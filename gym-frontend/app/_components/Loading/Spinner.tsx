import { CircularProgress } from "@mui/material"

export default function Spinner() {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<CircularProgress
				sx={{
					width: "5rem",
					height: "5rem",
				}}
				color="primary"
			/>
			Loading.....
		</div>
	)
}
