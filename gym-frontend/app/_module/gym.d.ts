export {}

declare global {
	declare namespace Model {
		declare namespace Booking {
			interface CourseFilter {
				coachaddress: `0x${string}` | ""
				coursetype: string
				duration: number
				Isdiscount: number
				maxprice: number
				orderby: "asc" | "desc"
			}
		}
		declare namespace Course {
			interface CurrentCourse {
				courseId: string
				expireAt: string
			}
		}
	}
}
