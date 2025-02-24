import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
	// const token = request.cookies.get("token")
	const token = localStorage.getItem("web3_token")
	// 需要保护的路由
	const protectedPaths = ["/dashboard", "/membership", "/profile"]
	const path = request.nextUrl.pathname

	if (protectedPaths.some((pp) => path.startsWith(pp)) && !token) {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/dashboard"],
}
