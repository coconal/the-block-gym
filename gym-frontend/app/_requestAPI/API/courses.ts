import axiosInstance from "@/app/_utils/request"

export const getAllCourses = async (params: Model.Booking.CourseFilter) => {
	const { data } = await axiosInstance.get<API.Course.CourseListResponse>("/courses", {
		params,
	})
	return data
}

export const updateCourse = async (id: string, params: Partial<API.Course.CourseUpdateParams>) => {
	const { data } = await axiosInstance.put<API.Course.ActionResponse>(
		`/courses/action/${id}`,
		params
	)
	return data
}

export const deleteCourse = async (id: string) => {
	const { data } = await axiosInstance.delete<API.Course.ActionResponse>(`/courses/action/${id}`)
	return data
}

export const createCourse = async (params: Partial<API.Course.CourseUpdateParams>) => {
	const { data } = await axiosInstance.post<API.Course.ActionResponse>("/courses/create", params)
	return data
}
