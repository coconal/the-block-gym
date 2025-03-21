import "./index.scss"
import Link from "next/link"
import { Avatar, List } from "antd"
import { useEnsAvatar, useEnsName } from "wagmi"
interface IBookingListItem {
	item: API.Course.CourseEntity
	index: number
}
export default function BookingListItem(props: IBookingListItem) {
	const { item, index } = props

	return (
		<List.Item key={index}>
			<List.Item.Meta
				avatar={<Avatar src={"d"} />}
				title={
					<Link className="custom-list-title-hover" href="">
						{item.coursetype}
					</Link>
				}
				description={`${item.description}  ￥${item.price}-${item.duration}d`}
			/>
		</List.Item>
	)
}
