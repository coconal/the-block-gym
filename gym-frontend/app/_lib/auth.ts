import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { recoverMessageAddress } from "viem"

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Web3",
			credentials: {
				message: { label: "Message", type: "text" },
				signature: { label: "Signature", type: "text" },
				address: { label: "Address", type: "text" },
			},
			async authorize(credentials) {
				// 验证签名
				const recoveredAddress = await recoverMessageAddress({
					message: credentials!.message,
					signature: credentials!.signature as `0x${string}`,
				})

				if (recoveredAddress.toLowerCase() !== credentials!.address.toLowerCase()) {
					return null
				}

				// 返回用户信息
				return {
					id: credentials!.address,
					name: credentials!.address,
					role: "user", // 从数据库或合约获取真实角色
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role
				token.address = user.id
			}
			return token
		},
		async signIn() {},
	},
	secret: process.env.NEXTAUTH_SECRET!,
	session: {
		strategy: "jwt" as const,
	},
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
