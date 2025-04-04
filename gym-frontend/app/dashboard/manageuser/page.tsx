"use client"

import { Table, Input, Button, Space, Avatar, Tag } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { blo } from "blo"
import { getUserByName } from "@/app/_requestAPI/API/user"
import { useMutation } from "@tanstack/react-query"
import _ from "lodash"
import DataLoading from "@/app/_components/Loading/DataLoading"

export default function ManageuserPage() {
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
	}
	const debounceSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		handleSearchChange(e.target.value)
	}, 600)

	const columns = [
		{
			title: "用户名",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "钱包地址",
			dataIndex: "address",
			key: "address",
			render: (text: string) => (
				<span title={text}>{`${text.slice(0, 6)}...${text.slice(-4)}`}</span>
			),
		},
		{
			title: "角色",
			dataIndex: "role",
			key: "role",
			render: (role: string) => {
				if (role === "admin") {
					return <Tag color="red">管理员</Tag>
				} else {
					return <Tag color="blue">{role === "coach" ? "教练" : "用户"}</Tag>
				}
			},
		},
		{
			title: "用户头像",
			dataIndex: "userimage",
			key: "userimage",
			render: (url: string, record: API.User.UserEntity) => {
				return (
					<Avatar
						src={url ? url : blo(record.address as `0x${string}`)}
						alt="头像"
						style={{ width: 50, height: 50 }}
					/>
				)
			},
		},
		{
			title: "操作",
			dataIndex: "role",
			key: "action",
			render: (role: string) =>
				role === "admin" ? null : (
					<Space size="middle">
						<Button>Edit</Button>
					</Space>
				),
		},
	]

	useEffect(() => {
		mutate.mutate("")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div style={{ padding: 24 }}>
			<div style={{ marginBottom: 16 }}>
				<Space>
					<Input
						placeholder="搜索用户"
						prefix={<SearchOutlined />}
						onChange={(e) => debounceSearch(e)}
						style={{ width: 200 }}
					/>
				</Space>
			</div>
			{mutate.isPending ? (
				<DataLoading />
			) : (
				<Table
					columns={columns}
					dataSource={mutate.data?.data || []}
					rowKey="_id"
					pagination={{ pageSize: 10 }}
				/>
			)}
		</div>
	)
}
