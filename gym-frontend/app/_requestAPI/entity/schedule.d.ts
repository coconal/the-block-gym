export {}

declare global {
	declare namespace API {
		declare namespace Schedule {
			declare type PlanEntity = {
				_id: string
				day: number
				title: string
				content: string
				minutes: number
			}
			declare type PlanResponse = {
				_id: string
				courseType: string
				plan: PlanEntity[]
			}
			declare type CompleteEntity = {
				day: number
				time: string
				state: string
			}
			declare type ScheduleEntity = {
				_id: string
				planId: string
				planInfo: PlanResponse
				completed: CompleteEntity[]
				updatedAt: string
			}
			declare type ScheduleResponse = {
				data: ScheduleEntity
				message: string
			}
			declare type ScheduleParams = {
				courseId: string
			}

			declare type AddCompletedParems = {
				scheduleId: string
				day: string
				time: string
			}

			declare type AddCompletedResponse = {
				message: string
			}
		}
	}
}
