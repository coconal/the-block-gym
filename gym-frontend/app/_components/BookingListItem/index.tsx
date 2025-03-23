import "./index.scss"
import Link from "next/link"
import { Avatar, List } from "antd"
import { blo } from "blo"
interface IBookingListItem {
	item: API.Course.CourseEntity
	index: number
}
export default function BookingListItem(props: IBookingListItem) {
	const { item, index } = props

	return (
		<List.Item key={index}>
			<List.Item.Meta
				avatar={<Avatar src={blo(item.coachAddress as `0x${string}`)} />}
				title={
					<Link className="custom-list-title-hover" href="">
						{item.coursetype}
					</Link>
				}
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
							<span>coach address: </span>
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
						{item.description} ￥{item.price}---{item.duration}d
					</div>
				}
			/>
		</List.Item>
	)
}
