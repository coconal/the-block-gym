import Link from "next/link"

import "./LinkButton.scss"
interface Params {
	href: string
}

export default function LinkButton({ href }: Params) {
	return (
		<Link href={href} className="link-button">
			Explore More
		</Link>
	)
}
