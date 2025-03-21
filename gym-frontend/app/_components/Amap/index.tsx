"use client"

import "./index.scss"
import React, { useEffect, useRef, useState } from "react"
import Spinner from "../Loading/Spinner"
import MapSideBar from "./SideBar"

export interface MarkerData {
	position: [number, number]
	title: string
	desription: string
	image?: string
}

// TODO 添加照片
const locationInitial: MarkerData[] = [
	{
		position: [103.985172, 30.579237], // 标记位置：经度,纬度
		title: "GYM 1", // 鼠标悬浮显示的文字
		desription: "GYM 1-四川省成都市双流区学府路一段-成都信息工程大学一食堂",
		image: "https://www.cuit.edu.cn/__local/6/C8/7F/0AEC37DBFE925C42079A77E38E7_2F0DC092_17C63.jpg",
	},
	{
		position: [103.98852, 30.581832], // 标记位置：经度,纬度
		title: "GYM 2", // 鼠标悬浮显示的文字
		desription: "GYM 2-四川省成都市双流区学府路一段-成都信息工程大学",
		image: "https://www.cuit.edu.cn/__local/E/A2/25/FFA0B74226AA143100F9F992DC0_53164C70_FEB04.jpg",
	},
	{
		position: [103.989759, 30.57793], // 标记位置：经度,纬度
		title: "GYM 3", // 鼠标悬浮显示的文字
		desription: "GYM 3-四川省成都市双流区长江路三段-GYM#3",
	},
]

const AMapComponent = () => {
	const isMountedRef = useRef(true)
	const markersRef = useRef<AMap.Marker[]>([])
	const [mapLoaded, setMapLoaded] = useState(false)
	const mapInstanceRef = useRef<AMap.Map | null>(null)
	const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(null)
	const containerId = useRef(`amap-container-${Math.random().toString(36).slice(2, 11)}`)

	useEffect(() => {
		isMountedRef.current = true

		const initMap = async () => {
			if (typeof window === "undefined") return

			try {
				const AMapLoader = await import("@amap/amap-jsapi-loader")

				let container = document.getElementById(containerId.current)
				if (!container) {
					container = document.createElement("div")
					container.id = containerId.current
					container.style.width = "100%"
					container.style.height = "500px"
					document.getElementById("map-root")?.appendChild(container)
				}

				// 配置安全密钥
				// @ts-expect-error 忽略类型错误
				window._AMapSecurityConfig = {
					securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_KEY,
				}

				const AMap = await AMapLoader.load({
					key: process.env.NEXT_PUBLIC_AMAP_KEY as string,
					version: "2.0",
					plugins: ["AMap.Scale", "AMap.MarkerAnimation"],
				})

				if (!isMountedRef.current) return

				// 初始化地图实例
				mapInstanceRef.current = new AMap.Map(container, {
					viewMode: "3D",
					zoom: 15,
					center: [103.98852, 30.581832],
				})

				// 创建标记
				locationInitial.forEach((data, index) => {
					const marker = new AMap.Marker({
						position: data.position,
						title: data.title,
					})
					marker.setMap(mapInstanceRef.current)
					marker.on("click", () => {
						if (mapInstanceRef.current) {
							mapInstanceRef.current.setZoom(16)
							setActiveMarkerIndex(index)
							mapInstanceRef.current?.setCenter(data.position)
							mapInstanceRef.current.setCenter(data.position) // 移动到中心
						}
					})
					markersRef.current.push(marker)
					return marker
				})
				setMapLoaded(true)
			} catch (error) {
				console.error("地图初始化失败:", error)
				cleanup()
			}
		}
		const cleanup = () => {
			if (mapInstanceRef.current) {
				try {
					mapInstanceRef.current.destroy()
				} catch (e) {
					console.warn("地图实例销毁异常:", e)
				}
				mapInstanceRef.current = null
			}

			const container = document.getElementById(containerId.current)
			if (container && container.parentNode) {
				container.parentNode.removeChild(container)
			}
		}

		initMap()

		return () => {
			isMountedRef.current = false
			markersRef.current = []
			cleanup()
		}
	}, [])
	useEffect(() => {
		if (markersRef.current.length > 0) {
			// 创建原始和放大后的图标
			const originalIcon = new AMap.Icon({
				size: new AMap.Size(19, 32),
				image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
				imageSize: new AMap.Size(19, 32),
			})

			const enlargedIcon = new AMap.Icon({
				size: new AMap.Size(28.5, 48),
				image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
				imageSize: new AMap.Size(28.5, 48),
			})

			// 更新每个 Marker 的图标
			markersRef.current.forEach((marker, index) => {
				if (index === activeMarkerIndex) {
					marker.setIcon(enlargedIcon)
				} else {
					marker.setIcon(originalIcon)
				}
			})
		}
	}, [activeMarkerIndex])
	console.log(activeMarkerIndex)

	return (
		<React.Fragment>
			<MapSideBar
				mapLoaded={mapLoaded}
				activeMarkerIndex={activeMarkerIndex}
				setActiveMarkerIndex={setActiveMarkerIndex}
				locationInitial={locationInitial}
			/>
			<div id="map-root">{!mapLoaded && <Spinner />}</div>
		</React.Fragment>
	)
}

export default AMapComponent
