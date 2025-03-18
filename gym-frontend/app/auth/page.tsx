import { Metadata } from "next"
import AuthPage from "../_components/AuthPage"

export const metadata: Metadata = {
	title: "Login&Signup Page",
	description: "Auth Page",
}

export default function LoginPage() {
	return (
		<div>
			<AuthPage />
		</div>
	)
}
