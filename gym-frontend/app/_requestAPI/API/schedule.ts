import axiosInstance from "@/app/_utils/request"

export async function getSchedule(params: API.Schedule.ScheduleParams) {
	const res = await axiosInstance.get<API.Schedule.ScheduleResponse>("/schedule", { params })
	return res
}

export async function addCompletedDay(params: API.Schedule.AddCompletedParems) {
	const res = await axiosInstance.post<API.Schedule.AddCompletedResponse>(
		`/schedule/${params.scheduleId}`,
		{
			time: params.time,
			day: params.day,
		}
	)
	return res
}
