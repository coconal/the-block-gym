import axios from "axios"

// 创建 Axios 实例，并确保携带 Cookie
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	withCredentials: true, // 自动携带 HTTP Only Cookie
	headers: { "Content-Type": "application/json" },
	timeout: 30000, // 设置请求超时时间为 30 秒
})
// 响应拦截器：当请求返回 401 错误时尝试刷新 Token
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				// 请求刷新 Token 接口（假设路径为 /auth/refresh）
				// await axiosInstance.post("/auth/refresh")
				// // 刷新成功后重新发送原请求
				// return axiosInstance(originalRequest)
			} catch (refreshError) {
				// 刷新失败，可在这里跳转到登录页面或者其他处理
				return Promise.reject(refreshError)
			}
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
