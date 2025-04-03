"use client"

import { Form, FormInstance, Input, Modal, Select } from "antd"

interface ICourseFormModal {
	open: boolean
	handleCancel: () => void
	onOK: () => void
	confirmLoading: boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: FormInstance<any>
	item?: API.Course.CourseEntity
	okText?: string
}

export default function CourseFormModal(props: ICourseFormModal) {
	const { open, item, onOK, confirmLoading, handleCancel, form, okText } = props
	const coursetype = Form.useWatch("coursetype", form)
	return (
		<Modal
			title={
				<div
					style={{
						fontSize: "1.5rem",
					}}
				>
					课程信息
				</div>
			}
			open={open}
			forceRender
			onOk={onOK}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
			okText={okText}
			cancelText="取消"
			width={"40rem"}
		>
			<Form
				form={form}
				name={`courseForm_${item?._id}`}
				initialValues={item}
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 16 }}
			>
				<Form.Item
					label="课程类型"
					name="coursetype"
					rules={[{ required: true, message: "请选择课程类型" }]}
				>
					<Select
						options={[
							{ value: "BASIC", label: "基础课程" },
							{ value: "VIP", label: "VIP课程" },
							{ value: "Boxing", label: "拳击" },
							{ value: "Yoga", label: "瑜伽" },
							{ value: "Zumba", label: "尊巴" },
							{ value: "SHAPING", label: "塑形" },
							{ value: "FAT_BURNING", label: "燃脂" },
							{ value: "Swimming", label: "游泳" },
						]}
						onChange={(value) => {
							if (value === "BASIC") {
								form.setFieldsValue({ coachAddress: "0x0" })
							} else {
								form.setFieldsValue({ coachAddress: "" })
							}
						}}
					/>
				</Form.Item>
				<Form.Item
					label="教练钱包地址"
					name="coachAddress"
					rules={[{ required: true, message: "请输入教练钱包地址" }]}
				>
					<Input disabled={coursetype === "BASIC"} />
				</Form.Item>
				<Form.Item
					label="课程价格"
					name="price"
					rules={[{ required: true, message: "请输入课程价格" }]}
				>
					<Input suffix="ETH" />
				</Form.Item>
				<Form.Item
					label="课程时长"
					name="duration"
					rules={[{ required: true, message: "请输入课程时长" }]}
				>
					<Input suffix="天" />
				</Form.Item>
				<Form.Item
					initialValue={100}
					label="折扣"
					name="discount"
					rules={[{ required: true, message: "输入折扣" }]}
				>
					<Input suffix="%" />
				</Form.Item>
				<Form.Item
					label="课程描述"
					name="description"
					rules={[{ required: true, message: "请输入课程描述" }]}
				>
					<Input.TextArea />
				</Form.Item>
			</Form>
		</Modal>
	)
}
