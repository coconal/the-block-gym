export async function POST(request: Request) {
	const body = await request.json()

	const res = await fetch("http://localhost:3002/api/user/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})

	const data = await res.json()

	return Response.json(data)
}
