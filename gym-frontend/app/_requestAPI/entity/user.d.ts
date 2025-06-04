export {}

declare global {
	declare namespace API {
		declare namespace User {
			declare type PurchaseResponse = {
				data: string
				message: string
			}
			declare type UserEntity = {
				_id: string
				__v: number
				userimage: string
				address: string
				role: "user" | "coach" | "admin"
				verifiedHash: string
				username: string
				points: number
				awards: number[]
			}

			declare type PurchaseParams = {
				id: string
				duration: number
				paymentProof: string
			}
			declare type MembershipEntity = {
				id: number
				totalAmount: number // 初始总金额
				releasedAmount: number // 已释放金额
				startTime: number // 开始时间
				duration: number // 服务时长（秒）
				privatecoach: string // 关联教练
				lastReleaseTime: number // 上次释放
				isActive: boolean // 是否有效
			}
			declare type CheckUserHaveCourseResponse = {
				data: MembershipEntity[]
				message: string
			}
			declare type GetMembershipReleaseResponse = {
				data: API.UserMembership.Membership[]
			}
			declare type logOutResponse = {
				success: boolean
				message: string
			}
			declare type checkAuthResponse = {
				success: boolean
				role: "user" | "coach" | "admin" | ""
				message: string
			}
			declare type userRoleResponse = {
				message: string
				data: UserEntity
			}
			declare type updateUserRoleParams = {
				username: string
				avatar: string
			}
			declare type updateUserRoleResponse = {
				message: string
			}
			declare type GetUserByNameParams = {
				likename: string
			}
			declare type GetUserByNameResponse = {
				data: UserEntity[]
				message: string
			}
			declare type TransferMembershipParams = {
				index: number
				toAddress: string
				verifiedHash: string
			}
			declare type TransferMembershipResponse = {
				data: string
			}
			declare type RequestMembershipParams = {
				index: number
				requestHash: string
			}
			declare type RequestMembershipResponse = {
				data: string
			}
		}
	}
}
