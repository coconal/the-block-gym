import { Flex } from "antd"

import "./indes.scss"
import HeaderNav from "./HeaderNav"
import Logo from "./Logo"

export default function Header() {
	return (
		<header className="header-content">
			<Flex className="flex-content" justify="space-between" align="center">
				<Logo />
				<HeaderNav />
			</Flex>
		</header>
	)
}
