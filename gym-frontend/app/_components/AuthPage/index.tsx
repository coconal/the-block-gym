"use client"

import "./index.scss"
import SignupForm from "../SignUpForm"
import LoginForm from "../LoginForm/index"
import { Segmented } from "antd"
import { useState } from "react"
import { useAccount } from "wagmi"

export default function AuthPage() {
	const [alignValue, setAlignValue] = useState<Align>("登录")
	const { status } = useAccount()
	type Align = "登录" | "注册"

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
						options={["登录", "注册"]}
					/>
				</div>
				<div className="main-content">
					<div className={`form-opa ${alignValue === "登录" && "active"} `}>
						<LoginForm />
					</div>
					<div className={`form-opa ${alignValue === "注册" && "active"}`}>
						<SignupForm />
					</div>
					{status === "disconnected" && <div>🙁 请连接钱包</div>}
				</div>
			</div>
		</div>
	)
}
