export async function POST(request: Request) {
	// console.log(request.headers.get("authorization"))

	const body = await request.json()

	// 转发到实际后端（隐藏真实地址）
	const res = await fetch("http://localhost:3002/api/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})
	const data = await res.json()
	return Response.json(data)
}
