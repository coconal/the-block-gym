import Image from "next/image"
import Link from "next/link"
import logo from "@/public/logo.png"

export default function Logo() {
	return (
		<Link href="/" className="logo-content">
			<Image src={logo} height="60" quality={60} width="60" alt="The Block Gym logo" />
			<h2 style={{ color: "#d2e3f3", fontWeight: "600" }}>The Block Gym</h2>
		</Link>
	)
}
