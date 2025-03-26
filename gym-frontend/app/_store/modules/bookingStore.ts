"use client"
import { makeAutoObservable } from "mobx"
import { makePersistable } from "mobx-persist-store"

class BookingStore {
	courseFilter: Model.Booking.CourseFilter = {
		coachaddress: "",
		coursetype: "",
		duration: 0,
		Isdiscount: 0,
		maxprice: 0,
		orderby: "asc",
	}
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })

		makePersistable(this, {
			name: "BookingStore",
			properties: ["courseFilter"],
			storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
		})
	}

	setCourseFilter<K extends keyof Model.Booking.CourseFilter>(
		key: K | Partial<Model.Booking.CourseFilter>,
		value?: Model.Booking.CourseFilter[K]
	) {
		if (typeof key === "object") {
			this.courseFilter = {
				...this.courseFilter,
				...key,
			}
		} else {
			if (value === undefined) {
				return
			}
			this.courseFilter = {
				...this.courseFilter,
				[key]: value,
			}
		}
	}
}

export default BookingStore
