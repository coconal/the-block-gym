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
				userimgae: string
				address: string
				role: "user" | "coach" | "admin"
				verifiedHash: string
				username: string
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
			declare type logOutResponse = {
				success: boolean
				message: string
			}
			declare type checkAuthResponse = {
				success: boolean
				message: string
			}
		}
	}
}
