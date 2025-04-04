"use client"

import "./index.scss"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Avatar, Dropdown, List, Modal, Tag } from "antd"
import Search from "antd/es/input/Search"
import { useState } from "react"
import { getUserByName, transferMembership } from "@/app/_requestAPI/API/user"
import Spinner from "../../Loading/Spinner"
import _ from "lodash"
import { blo } from "blo"
import { useAccount, useWriteContract } from "wagmi"
import { wagmiContractConfig } from "@/contract/gymMembership"
import toast from "react-hot-toast"

interface TransferModalProps {
	isModalOpen: boolean
	handleCancel: () => void
	index: number
	isHaveCoach: boolean
}
export default function TransferModal(props: TransferModalProps) {
	const { address } = useAccount()
	const [newOwener, setNewOwener] = useState({
		userimage: "",
		username: "",
		address: "",
	})
	const { isModalOpen, handleCancel, index, isHaveCoach } = props
	const queryClient = useQueryClient()
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const { writeContractAsync } = useWriteContract()

	const mutateTransfer = useMutation({
		mutationFn: async () => {
			const hash = await writeContractAsync({
				...wagmiContractConfig,
				functionName: "transferMembership",
				args: [BigInt(index), newOwener.address as `0x${string}`],
			})
			if (!hash) {
				throw new Error("转让失败")
			}
			const { data } = await transferMembership({
				index,
				toAddress: newOwener.address,
				verifiedHash: hash,
			})
			return data
		},
		onSuccess: (data) => {
			toast.success(`转让成功, hash: ${data.data}`)
			queryClient.invalidateQueries({ queryKey: ["getUserMembership"] })
			handleCancel()
		},
		onError: (err) => {
			toast.error("转让失败")
			console.log(err)
		},
	})

	const mutate = useMutation({
		mutationKey: ["transfer"],
		mutationFn: async (likename: string) => {
			const { data } = await getUserByName({ likename: likename })
			return data
		},
		onError: (err) => {
			console.log(err)
		},
	})

	const handleSearchChange = (value: string) => {
		mutate.mutate(value)
		// 当输入内容时展示下拉列表
		setDropdownVisible(true)
	}
	const debounceSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		handleSearchChange(e.target.value)
	}, 600)

	// 确认搜索或点击确定按钮时，关闭下拉列表
	const handleSearchConfirm = () => {
		setDropdownVisible(false)
		// 此处可以处理确认后的逻辑，比如提交数据
	}

	return (
		<Modal
			title="转让会员"
			okText="确认"
			cancelText="取消"
			open={isModalOpen}
			onOk={() => {
				mutateTransfer.mutate()
			}}
			okButtonProps={{ disabled: !newOwener.address || (mutateTransfer.isPending && isHaveCoach) }}
			onCancel={handleCancel}
			width={600}
		>
			<Dropdown
				open={dropdownVisible}
				dropdownRender={() => {
					return (
						<>
							{mutate.isPending ? (
								<Spinner />
							) : (
								<List
									style={{
										maxHeight: 400,
										overflowY: "auto",
										backgroundColor: "white",
									}}
									dataSource={mutate.data?.data || []}
									renderItem={(item) => (
										<List.Item
											className="transfer-modal-listitem"
											style={{
												padding: "16px 18px",
												cursor: "pointer",
												color: "black",
											}}
											onClick={() => {
												if (item.address === address) {
													return toast.error("不能转让给自己")
												}
												setNewOwener({
													userimage: item.userimage,
													username: item.username,
													address: item.address,
												})
												setDropdownVisible(false)
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													width: "100%",
												}}
											>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														width: "100%",
														gap: "10px",
														whiteSpace: "nowrap",
														textOverflow: "ellipsis",
														overflow: "hidden",
													}}
												>
													<Avatar
														src={
															item.userimage ? item.userimage : blo(item.address as `0x${string}`)
														}
														alt="avatar"
														size={30}
													/>
													{item.username}
													{item.address === address ? (
														<Tag color="red">本人</Tag>
													) : (
														<Tag color="blue">会员</Tag>
													)}
												</div>
												<div>{item.address}</div>
											</div>
										</List.Item>
									)}
								/>
							)}
						</>
					)
				}}
				trigger={["click"]}
				placement="bottomLeft"
				onOpenChange={() => {
					setDropdownVisible(!dropdownVisible)
				}}
			>
				<Search
					placeholder="请输入搜索内容"
					onChange={debounceSearch}
					onSearch={handleSearchConfirm}
					enterButton="搜索"
					allowClear
				/>
			</Dropdown>
			<div className="transfer-current-user">
				{newOwener.username ? (
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Avatar
								src={
									newOwener.userimage
										? newOwener.userimage
										: blo(newOwener.address as `0x${string}`)
								}
								alt="avatar"
								size={30}
							/>
							<div>
								{newOwener.username && (
									<Tag
										color="blue"
										style={{
											marginRight: 0,
										}}
									>
										会员
									</Tag>
								)}
							</div>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "stretch",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							<div>名字： {newOwener.username}</div>
							<div>钱包地址：{newOwener.address}</div>
						</div>
					</div>
				) : (
					<div>请选择新的拥有者</div>
				)}
			</div>
		</Modal>
	)
}
