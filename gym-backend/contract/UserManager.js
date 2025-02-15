export const ContractConfig = {
	address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
	abi: [
		{
			inputs: [
				{
					internalType: "address",
					name: "initialOwner",
					type: "address",
				},
			],
			stateMutability: "nonpayable",
			type: "constructor",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "owner",
					type: "address",
				},
			],
			name: "OwnableInvalidOwner",
			type: "error",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "account",
					type: "address",
				},
			],
			name: "OwnableUnauthorizedAccount",
			type: "error",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "previousOwner",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "newOwner",
					type: "address",
				},
			],
			name: "OwnershipTransferred",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "userAddress",
					type: "address",
				},
				{
					indexed: false,
					internalType: "enum UserManager.UserType",
					name: "userType",
					type: "uint8",
				},
			],
			name: "UserRegistered",
			type: "event",
		},
		{
			inputs: [],
			name: "owner",
			outputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "enum UserManager.UserType",
					name: "_userType",
					type: "uint8",
				},
				{
					internalType: "string",
					name: "_name",
					type: "string",
				},
			],
			name: "registerUser",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "renounceOwnership",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "_admin",
					type: "address",
				},
			],
			name: "setAdmin",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "newOwner",
					type: "address",
				},
			],
			name: "transferOwnership",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
			],
			name: "users",
			outputs: [
				{
					internalType: "enum UserManager.UserType",
					name: "userType",
					type: "uint8",
				},
				{
					internalType: "string",
					name: "name",
					type: "string",
				},
				{
					internalType: "uint256",
					name: "registrationDate",
					type: "uint256",
				},
				{
					internalType: "bool",
					name: "isActive",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
	],
}
