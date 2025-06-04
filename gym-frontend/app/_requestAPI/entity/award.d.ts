export {}

declare global {
	declare namespace API {
		declare namespace Award {
			declare interface AwardEntity {
				_id: number
				name: string
				index: number
				description: string
				image: string
				points: number
			}

			declare interface UserAward {
				index: number
				timestamp: Date
				transactionHash: string
			}

			declare interface AwardResponse {
				data: AwardEntity[]
				message: string
			}

			declare interface UserAwardResponse {
				data: UserAward[]
				message: string
			}

			declare interface RedeemResponse {
				message: string
				hash: string
			}
		}
	}
}
