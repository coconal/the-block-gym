require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.26",
	networks: {
		hardhat: {
			mining: {
				auto: true,
				interval: 0,
			},
			initialDate: "2022-01-01T00:00:00Z",
		},
		localhost: {
			url: "http://127.0.0.1:8545",
			chainId: 31337,
			initialDate: "2022-01-01T00:00:00Z",
			mining: {
				auto: true,
				interval: 0,
			},
		},
	},
}
