import { AntdRegistry } from "@ant-design/nextjs-registry"
import { Metadata } from "next"
import { Roboto } from "next/font/google"

import { Providers } from "./providers"
import Header from "./_components/Header"
import "@rainbow-me/rainbowkit/styles.css"
import "@/app/globals.css"

export const metadata: Metadata = {
	title: {
		template: "%s / The Block Gym",
		default: "Welcome / The Block Gym",
	},
}
const roboto = Roboto({ weight: "700", subsets: ["latin"], display: "swap" })

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				<AntdRegistry>
					<Providers>
						<div
							style={{
								position: "relative",
								minHeight: "100vh",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Header />
							<div>
								<main>{children}</main>
							</div>
						</div>
					</Providers>
				</AntdRegistry>
			</body>
		</html>
	)
}

export default RootLayout
