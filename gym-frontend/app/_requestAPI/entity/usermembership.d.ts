export {}

declare global {
	declare namespace API {
		declare namespace UserMembership {
			declare type Membership = {
				_id: string
				userId: string
				courseId: string
				__v: number
				expireAt: string
				index: number
				isActive: boolean
				coursepurchasedhash: string
				courseInfo: API.Course.CourseEntity
			}

			declare type MembershipResponse = {
				data: Membership[]
				message: string
			}
		}
	}
}
