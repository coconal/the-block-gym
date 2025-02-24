import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Dropdown, Flex, Space } from "antd"
import type { MenuProps } from "antd"
import Link from "next/link"

export default function HeaderNav() {
	const items: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<Link href="/course">
					<h2>Course</h2>
				</Link>
			),
		},
		{
			key: "2",
			label: (
				<Link href="/course">
					<h2>Course</h2>
				</Link>
			),
		},
		{
			key: "3",
			label: (
				<Link href="/course">
					<h2>Course</h2>
				</Link>
			),
		},
	]

	return (
		<Flex gap={34} align="center" justify="space-between" className="flex-nav">
			<Link href="/about">
				<h2>About</h2>
			</Link>
			<Link href="/location">
				<h2>Location</h2>
			</Link>
			<Space direction="vertical">
				<Space wrap>
					<Dropdown menu={{ items }} placement="bottomLeft" arrow>
						<Link href="/dashboard">
							<h2>Course</h2>
						</Link>
					</Dropdown>
				</Space>
			</Space>
			<ConnectButton
				label="Connect Wallet"
				accountStatus={{ smallScreen: "address", largeScreen: "full" }}
			/>
		</Flex>
	)
}
