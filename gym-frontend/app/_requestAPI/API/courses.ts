import axiosInstance from "@/app/_utils/request"

export const getAllCourses = async () => {
	const { data } = await axiosInstance.post<API.Course.CourseListResponse>("/courses")

	return data
}
