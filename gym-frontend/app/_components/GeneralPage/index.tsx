"use client"

import React, { useEffect, useRef } from "react"
import { Card } from "antd"
import * as echarts from "echarts"
import dayjs from "dayjs"

const recent5Years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i)
const optionmyChart = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "cross",
			crossStyle: {
				color: "#999",
			},
		},
	},
	toolbox: {
		feature: {
			dataView: { show: true, readOnly: false },
			magicType: { show: true, type: ["line", "bar"] },
			restore: { show: true },
			saveAsImage: { show: true },
		},
	},
	legend: {
		data: ["BASIC课程收入", "其他课程收入", "总收入"],
	},
	xAxis: [
		{
			type: "category",
			data: recent5Years,
			axisPointer: {
				type: "shadow",
			},
		},
	],
	yAxis: [
		{
			type: "value",
			name: "收入",
			min: 0,
			max: 1000000, // 根据实际情况调整最大值
			interval: 200000,
			axisLabel: {
				formatter: "{value} 元",
			},
		},
	],
	series: [
		{
			name: "BASIC课程收入",
			type: "bar",
			tooltip: {
				valueFormatter: function (value: number) {
					return (value as number) + " 元"
				},
			},
			data: [300000, 320000, 350000, 380000, 60000], // 假数据
		},
		{
			name: "其他课程收入",
			type: "bar",
			tooltip: {
				valueFormatter: function (value: number) {
					return (value as number) + " 元"
				},
			},
			data: [200000, 220000, 250000, 280000, 30000], // 假数据
		},
		{
			name: "总收入",
			type: "line",
			tooltip: {
				valueFormatter: function (value: number) {
					return (value as number) + " 元"
				},
			},
			data: [500000, 540000, 600000, 660000, 90000], // 假数据
		},
	],
}
const recent7Days = Array.from({ length: 7 }, (_, i) =>
	dayjs()
		.subtract(6 - i, "day")
		.format("YYYY-MM-DD")
)
const optionhistogram = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
		},
		formatter: (params) => {
			const { value, name } = params[0]
			return `${name}<br/>注册人数: ${value}`
		},
	},
	xAxis: {
		type: "category",
		data: recent7Days,
	},
	yAxis: {
		type: "value",
	},
	series: [
		{
			data: [20, 40, 12, 5, 33, 64, 12],
			type: "bar",
		},
	],
}

export default function GeneralPageComponent() {
	const chartRef = useRef<HTMLDivElement>(null)
	const charthistogramRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (chartRef.current) {
			// 初始化 echarts 实例
			const myChart = echarts.init(chartRef.current)
			const histogram = echarts.init(charthistogramRef.current)
			// 示例数据

			// 使用配置项显示图表
			myChart.setOption(optionmyChart)
			histogram.setOption(optionhistogram)

			// 窗口大小改变时重新调整图表大小
			const resizeHandler = () => {
				myChart.resize()
				histogram.resize()
			}
			window.addEventListener("resize", resizeHandler)

			// 组件卸载时清除图表和事件监听器
			return () => {
				myChart.dispose()
				window.removeEventListener("resize", resizeHandler)
			}
		}
	}, [])

	return (
		<>
			<Card title="近5年收入" style={{ margin: 20 }}>
				<div ref={chartRef} style={{ width: "100%", height: 400 }} />
			</Card>
			<Card title="客户注册数量" style={{ margin: 20 }}>
				<div ref={charthistogramRef} style={{ width: "100%", height: 400 }} />
			</Card>
		</>
	)
}
