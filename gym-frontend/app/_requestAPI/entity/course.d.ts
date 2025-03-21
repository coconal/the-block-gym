export {}

declare global {
	declare namespace API {
		declare namespace Course {
			declare type CourseEntity = {
				_id: string
				coursetype: string
				description: string
				coachAddress: string
				price: number
				duration: number
				discount: number
				__v: number
			}

			declare type CourseListResponse = {
				courses: CourseEntity[]
			}
		}
	}
}
