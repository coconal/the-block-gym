export {}

declare global {
	declare namespace API {
		declare namespace UserMembership {
			declare type Membership = {
				_id: string
				userId: string
				userInfo: {
					address: string
				}[]
				courseId: string
				__v: number
				expireAt: string
				index: number
				isActive: boolean
				transfered: boolean
				releaseHashs: string[]
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
