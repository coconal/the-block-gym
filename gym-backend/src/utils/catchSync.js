export const catchSync = (fn) => {
	return (res, req, next) => {
		fn(res, req, next).catch(next)
	}
}
