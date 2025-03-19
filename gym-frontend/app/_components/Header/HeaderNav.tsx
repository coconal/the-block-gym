"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Flex } from "antd"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function HeaderNav() {
	const pathname = usePathname()
	const active = pathname.split("/")[1]

	return (
		<Flex gap={34} align="center" justify="space-between" className="flex-nav">
			<Link rel="preload" href="/about" className={active === "about" ? "active" : ""}>
				<h2>About</h2>
			</Link>
			<Link rel="preload" href="/location" className={active === "location" ? "active" : ""}>
				<h2>Location</h2>
			</Link>
			<Link rel="preload" href="/dashboard" className={active === "dashboard" ? "active" : ""}>
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
