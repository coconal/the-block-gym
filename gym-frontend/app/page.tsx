import Image from "next/image"

import bg from "@/public/bg-2.png"
import LinkButton from "./_components/LinkButton"

function Page() {
	return (
		<div>
			<Image
				alt="bg"
				src={bg}
				fill
				placeholder="blur"
				quality={80}
				style={{
					objectFit: "cover",
					objectPosition: "top",
					zIndex: "-1",
				}}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "80vh",
					textAlign: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "2rem",
					}}
				>
					<div
						style={{
							color: "#E1E8EF",
							fontSize: "100px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "10px",
						}}
					>
						Welcome The Block Gym
						<LinkButton href="/dashboard" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
