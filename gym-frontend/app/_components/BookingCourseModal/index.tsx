import { blo } from "blo"
import "./index.scss"
import { Image, Modal } from "antd"

interface IBookingCourseModalProps {
	item: API.Course.CourseEntity
	open: boolean
	setOpen: (value: boolean) => void
	loading: boolean
	handleOk: () => void
}
export default function BookingCourseModal(props: IBookingCourseModalProps) {
	const { item, open, setOpen, loading, handleOk } = props

	const handleCancel = () => {
		setOpen(false)
	}

	return (
		<>
			<Modal
				title={
					<div
						style={{
							fontSize: "1.5rem",
						}}
					>
						课程: $$ {item.coursetype} $$
					</div>
				}
				open={open}
				onOk={handleOk}
				confirmLoading={loading}
				onCancel={handleCancel}
				okText="预定"
				cancelText="取消"
				width={"40rem"}
			>
				<div className="booking-modal-content">
					<div className="divider"></div>
					<div className="modal-card">
						<div className="coach-profile">
							<Image
								alt="coachimgae"
								src={
									item.coachimageurl === ""
										? blo(item.coachAddress as `0x${string}`)
										: item.coachimageurl
								}
								width={80}
							/>

							<div className="coach-info">
								<span className="coach-address">
									<div className="text-large">coach address:</div>
									{item.coachAddress}
								</span>
								<span className="coach-name">
									<div className="text-large">service:</div>
									{item.duration} days
								</span>
							</div>
						</div>
					</div>
					<div className="divider"></div>
					<div className="modal-card">
						<div className="order-info-row">
							<div className="text-large">Course ID</div>
							<div>{item._id}</div>
						</div>
						<div className="order-info-row">
							<div className="text-large">Total Price:</div>
							<div>{item.price} ETH</div>
						</div>
					</div>
					<div className="divider"></div>
					<div className="modal-card">
						<div>{item.description}</div>
					</div>
				</div>
			</Modal>
		</>
	)
}
