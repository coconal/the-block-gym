"use client"

import "./index.scss"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { MarkerData } from ".."
import { Image } from "antd"

interface MapSideBar {
	mapLoaded: boolean
	activeMarkerIndex: number | null
	setActiveMarkerIndex: (value: React.SetStateAction<number | null>) => void
	locationInitial: MarkerData[]
}

export default function MapSideBar(props: MapSideBar) {
	const { mapLoaded, activeMarkerIndex, setActiveMarkerIndex, locationInitial } = props
	const length = locationInitial.length
	const handleChange = (index: number) => {
		setActiveMarkerIndex(index)
	}
	return (
		<div className="map-side-bar">
			<div className="side-bar-nav">
				<div
					onClick={() => {
						const num = activeMarkerIndex === null ? 0 : activeMarkerIndex
						handleChange((num - 1 + length) % length)
					}}
					className="side-bar-nav-button"
				>
					<ArrowBackIosNewIcon />
				</div>
				<div>地图导航</div>
				<div
					onClick={() => {
						const num = activeMarkerIndex === null ? 0 : activeMarkerIndex
						handleChange((num + 1) % length)
					}}
					className="side-bar-nav-button"
				>
					<ArrowForwardIosIcon />
				</div>
			</div>
			<div className="side-bar-main-content">
				{!mapLoaded ? (
					"Loading"
				) : (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							gap: "10px",
						}}
					>
						{activeMarkerIndex === null ? (
							<h4>选择标记点来获取更多信息</h4>
						) : (
							<>
								<div>当前标记点: {locationInitial[activeMarkerIndex].title}</div>
								{locationInitial[activeMarkerIndex].desription.split("-").map((item, index) => {
									return <div key={index}>{item}</div>
								})}

								<Image
									width="100%"
									height="100%"
									alt="example"
									src="https://www.cuit.edu.cn/__local/E/A2/25/FFA0B74226AA143100F9F992DC0_53164C70_FEB04.jpg"
								/>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
