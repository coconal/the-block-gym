"use client"
import "./index.scss"
import Link from "next/link"
import { Avatar, List, Tag } from "antd"
import { blo } from "blo"
import { useState } from "react"
import EditModal from "../EditModal"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import DeleteModal from "../DeleteModal"

interface ICourseItem {
	item: API.Course.CourseEntity
	index: number
}
export default function CourseItem(props: ICourseItem) {
	const { item, index } = props
	const [open, setOpen] = useState(false)
	const [open1, setOpen1] = useState(false) // 用于控制删除Modal的显隐
	return (
		<>
			<EditModal open={open} setOpen={setOpen} item={item} />
			<DeleteModal open={open1} setOpen={setOpen1} id={item._id} />
			<List.Item
				key={index}
				actions={[
					<div
						key="list-edit"
						style={{
							cursor: "pointer",
							color: "bisque",
						}}
						className="custom-list-actions"
						onClick={() => {
							setOpen(true)
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								gap: "2px",
							}}
						>
							修改
							<EditOutlined />
						</div>
					</div>,
					<div
						key="list-delete"
						style={{
							cursor: "pointer",
							color: "bisque",
						}}
						className="custom-list-actions"
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								gap: "2px",
							}}
							onClick={() => {
								setOpen1(true)
							}}
						>
							删除
							<DeleteOutlined />
						</div>
					</div>,
				]}
			>
				<List.Item.Meta
					avatar={
						<Avatar
							src={
								item.coachimageurl === ""
									? blo(item.coachAddress as `0x${string}`)
									: item.coachimageurl
							}
							style={{
								cursor: "pointer",
							}}
						/>
					}
					title={<div>课程类型：{item.coursetype}</div>}
					description={
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "2px",
							}}
						>
							<div
								style={{
									display: "flex",
									gap: "0.5rem",
								}}
							>
								<span>教练地址: </span>
								<Link
									className="custom-list-title-hover"
									style={{
										color: "bisque",
									}}
									href=""
								>
									{item.coachAddress}
								</Link>
							</div>
							<div
								style={{
									display: "flex",
									gap: "0.5rem",
								}}
							>
								{item.description} {item.price}ETH---{item.duration}d{" "}
								<Tag color={item.discount === 100 ? "red" : "green"}>- {100 - item.discount} %</Tag>
							</div>
						</div>
					}
				/>
			</List.Item>
		</>
	)
}
