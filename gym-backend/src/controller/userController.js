import User from "../model/userModel.js"

export const getNonce = async (req, res) => {
	try {
		const { address } = req.params
		let user = await User.findOne({ address })

		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		res.status(200).json({
			nonce: user.nonce,
		})
	} catch (error) {
		console.error("Get nonce error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const getUser = async (req, res) => {
	try {
		const user = req.user

		// const result = await contract.read.getUser([useraddress])
		const data = {
			id: user._id,
			address: user.address,
			role: user.role,
			verifiedHash: user.verifiedHash,
			// registrationDate: user.registrationDate,
		}

		res.status(200).json({
			data,
		})
	} catch (error) {
		console.error("Login error:", error)
		res.status(500).json({ error: "Internal server error" })
	}
}
