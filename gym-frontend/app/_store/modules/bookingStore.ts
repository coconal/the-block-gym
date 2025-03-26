"use client"
import { makeAutoObservable } from "mobx"
import { makePersistable, stopPersisting, isPersisting } from "mobx-persist-store"

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

		if (typeof window !== "undefined" && !isPersisting(this)) {
			this.initializePersistence()
		}
	}
	private initializePersistence() {
		// 先尝试停止之前的持久化
		try {
			stopPersisting(this)
		} catch {
			console.warn("No previous persistence to stop")
		}

		// 初始化新的持久化
		makePersistable(this, {
			name: "BookingStore",
			properties: ["courseFilter"],
			storage: window.sessionStorage,
		})
	}
	cleanup() {
		stopPersisting(this)
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
