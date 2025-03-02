"use client"

import Spinner from "@/app/_components/Loading/Spinner"
import { useQuery } from "@tanstack/react-query"

async function getBookingData(): Promise<IBookingData> {
	const res = await fetch("https://fakestoreapi.com/products/1")
	return res.json()
}

interface IBookingData {
	id: number
	title: string
	price: number
	description: string
	category: string
	image: string
	rating: {
		rate: number
		count: number
	}
}

export default function BookingPage() {
	const { data, isPending, error, isError } = useQuery({
		queryKey: ["bookingData"],
		queryFn: getBookingData,
	})

	if (isPending) {
		return <Spinner />
	}
	if (isError) {
		return <div>Error: {error.message}</div>
	}
	return (
		<div>
			<h1>Booking Page</h1>
			<div>
				<div key={data.id}>
					<h2>{data.title}</h2>
					<p>{data.description}</p>
					<p>Price: {data.price}</p>
					<p>Category: {data.category}</p>
					<p>Rating: {data.rating.rate}</p>
					<p>Count: {data.rating.count}</p>
				</div>
			</div>
		</div>
	)
}
