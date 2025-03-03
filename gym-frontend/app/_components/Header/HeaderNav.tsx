import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Flex } from "antd"

import Link from "next/link"

export default function HeaderNav() {
	return (
		<Flex gap={34} align="center" justify="space-between" className="flex-nav">
			<Link rel="preload" href="/about">
				<h2>About</h2>
			</Link>
			<Link rel="preload" href="/location">
				<h2>Location</h2>
			</Link>

			<Link rel="preload" href="/dashboard">
				<h2>Course</h2>
			</Link>

			<ConnectButton
				label="Connect Wallet"
				accountStatus={{ smallScreen: "address", largeScreen: "full" }}
				showBalance={{ smallScreen: false, largeScreen: false }}
				chainStatus={{
					largeScreen: "icon",
					smallScreen: "none",
				}}
			/>
		</Flex>
	)
}
