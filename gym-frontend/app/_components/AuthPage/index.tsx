"use client"

import "./index.scss"
import SignupForm from "../SignUpForm"
import LoginForm from "../LoginForm/index"
import { Segmented } from "antd"
import { useState } from "react"

export default function AuthPage() {
	const [alignValue, setAlignValue] = useState<Align>("Login")
	type Align = "Login" | "Signup"
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div className="form-container">
				<div style={{ paddingTop: "2rem" }}>
					<Segmented
						className="custom-segmented"
						value={alignValue}
						style={{ marginBottom: 8 }}
						onChange={setAlignValue}
						options={["Login", "Signup"]}
					/>
				</div>
				<div className="main-content">
					<div className={`form-opa ${alignValue === "Login" && "active"} `}>
						<LoginForm />
					</div>
					<div className={`form-opa ${alignValue === "Signup" && "active"}`}>
						<SignupForm />
					</div>
				</div>
			</div>
		</div>
	)
}
