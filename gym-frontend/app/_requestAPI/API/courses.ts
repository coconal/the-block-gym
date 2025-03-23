import axiosInstance from "@/app/_utils/request"

export const getAllCourses = async (params: Model.Booking.BookingFilter) => {
	const { data } = await axiosInstance.get<API.Course.CourseListResponse>("/courses", {
		params,
	})

	return data
}
