"use client"

import { useAccount } from "wagmi"
import { type UseAccountReturnType, type UseSignMessageReturnType } from "wagmi"
import { useSignMessage } from "wagmi"

export default function Account() {
	const account: UseAccountReturnType = useAccount()
	const { signMessageAsync, isPending, data }: UseSignMessageReturnType = useSignMessage()
	async function sign(message: string) {
		const signature = await signMessageAsync({ message })
		console.log("Signature:", signature)
	}

	return (
		<div>
			{isPending ? "loading..." : data}
			<button
				onClick={() => {
					sign("Login")
				}}
			>
				Login
			</button>
		</div>
	)
}
