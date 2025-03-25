export {}

declare global {
	declare namespace API {
		declare namespace UserMembership {
			declare type Membership = {
				_id: string
				userId: string
				__v: number
				expireAt: string
				index: number
				isActive: boolean
				coursepurchasedhash: string
				courseInfo: API.Course.CourseEntity
			}

			declare type MembershipResponse = {
				data: membership[]
				message: string
			}

			declare type MembershipParams = {
				index: number
			}
		}
	}
}
