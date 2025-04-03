export {}

declare global {
	declare namespace API {
		declare namespace Course {
			declare type CourseEntity = {
				_id: string
				coursetype: string
				description: string
				coachAddress: string
				coachimageurl: string
				price: number
				duration: number
				discount: number
				__v: number
			}

			declare type CourseListResponse = {
				courses: CourseEntity[]
			}

			declare type CourseUpdateParams = {
				coursetype: string
				description: string
				coachAddress: string
				coachimageurl: string
				price: number
				duration: number
				discount: number
			}

			declare type ActionResponse = {
				message: string
			}
		}
	}
}
