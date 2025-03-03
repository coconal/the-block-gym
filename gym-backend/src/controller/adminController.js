export const setPlatformFee = async (req, res) => {
	const { fee } = req.body
	try {
		await contract.write.setPlatformFee([fee])
		res.status(200).json({
			data: "ok",
		})
	} catch (error) {
		console.error("Set platform fee error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}
