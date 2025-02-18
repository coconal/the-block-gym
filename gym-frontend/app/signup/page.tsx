import { Metadata } from "next"
import SignupForm from "../_components/SignUpForm"

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Signup Page",
}

export default function SignUpPage() {
	return (
		<div>
			<SignupForm />
		</div>
	)
}
