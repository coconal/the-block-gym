export const ContractConfig = {
	address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
	abi: [
		{
			inputs: [
				{
					internalType: "address",
					name: "userAddress",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "extraDuration",
					type: "uint256",
				},
			],
			name: "extendMembership",
			outputs: [],
			stateMutability: "payable",
			type: "function",
		},
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
			inputs: [],
			name: "ReentrancyGuardReentrantCall",
			type: "error",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "coachAddress",
					type: "address",
				},
				{
					indexed: false,
					internalType: "string",
					name: "verifiedHash",
					type: "string",
				},
			],
			name: "CoachIsVerified",
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
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "extendDuration",
					type: "uint256",
				},
			],
			name: "DurationExtended",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "user",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "coach",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
			],
			name: "FundsReleased",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "user",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "coach",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "duration",
					type: "uint256",
				},
			],
			name: "MembershipPurchased",
			type: "event",
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
			inputs: [
				{
					internalType: "address",
					name: "coach",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "duration",
					type: "uint256",
				},
			],
			name: "purchaseMembership",
			outputs: [],
			stateMutability: "payable",
			type: "function",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "user",
					type: "address",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
			],
			name: "RefundIssued",
			type: "event",
		},
		{
			inputs: [
				{
					internalType: "enum GymMembership.UserType",
					name: "_userType",
					type: "uint8",
				},
				{
					internalType: "string",
					name: "_name",
					type: "string",
				},
				{
					internalType: "address",
					name: "userAddress",
					type: "address",
				},
			],
			name: "registerUser",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "user",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "releaseFunds",
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
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "requestRefund",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint8",
					name: "fee",
					type: "uint8",
				},
			],
			name: "setPlatformFee",
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
					internalType: "enum GymMembership.UserType",
					name: "userType",
					type: "uint8",
				},
			],
			name: "UserRegistered",
			type: "event",
		},
		{
			inputs: [
				{
					internalType: "string",
					name: "ipfsCertHash",
					type: "string",
				},
			],
			name: "verifiedCoach",
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
			name: "coachEarnings",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "user",
					type: "address",
				},
			],
			name: "getMembership",
			outputs: [
				{
					components: [
						{
							internalType: "uint256",
							name: "id",
							type: "uint256",
						},
						{
							internalType: "uint256",
							name: "totalAmount",
							type: "uint256",
						},
						{
							internalType: "uint256",
							name: "releasedAmount",
							type: "uint256",
						},
						{
							internalType: "uint256",
							name: "startTime",
							type: "uint256",
						},
						{
							internalType: "uint256",
							name: "duration",
							type: "uint256",
						},
						{
							internalType: "address",
							name: "privatecoach",
							type: "address",
						},
						{
							internalType: "uint256",
							name: "lastReleaseTime",
							type: "uint256",
						},
						{
							internalType: "bool",
							name: "isActive",
							type: "bool",
						},
					],
					internalType: "struct GymMembership.Membership[]",
					name: "",
					type: "tuple[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "userAddress",
					type: "address",
				},
			],
			name: "getMembershipLength",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "user",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
			],
			name: "getReleaseFunds",
			outputs: [
				{
					internalType: "uint256",
					name: "releasable",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "platformCut",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "coachCut",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "address",
					name: "user",
					type: "address",
				},
			],
			name: "getUser",
			outputs: [
				{
					internalType: "enum GymMembership.UserType",
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
		{
			inputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			name: "memberships",
			outputs: [
				{
					internalType: "uint256",
					name: "id",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "totalAmount",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "releasedAmount",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "startTime",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "duration",
					type: "uint256",
				},
				{
					internalType: "address",
					name: "privatecoach",
					type: "address",
				},
				{
					internalType: "uint256",
					name: "lastReleaseTime",
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
			inputs: [],
			name: "platformFee",
			outputs: [
				{
					internalType: "uint8",
					name: "",
					type: "uint8",
				},
			],
			stateMutability: "view",
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
					internalType: "enum GymMembership.UserType",
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
		{
			inputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
			],
			name: "verifiedCoaches",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
	],
}
