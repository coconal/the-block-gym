// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserManager is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    enum UserType {
        Member,
        Coach,
        Admin
    }

    struct Profile {
        UserType userType;
        string name;
        uint256 registrationDate;
        bool isActive;
    }

    mapping(address => Profile) public users;

    event UserRegistered(address indexed userAddress, UserType userType);

    // 管理员权限控制
    modifier onlyAdmin() {
        require(users[msg.sender].userType == UserType.Admin, "Admin only");
        _;
    }

    function registerUser(UserType _userType, string memory _name) external {
        require(users[msg.sender].registrationDate == 0, "Already registered");

        users[msg.sender] = Profile({
            userType: _userType,
            name: _name,
            registrationDate: block.timestamp,
            isActive: true
        });

        emit UserRegistered(msg.sender, _userType);
    }

    function setAdmin(address _admin) external onlyOwner {
        users[_admin] = Profile(UserType.Admin, "Admin", block.timestamp, true);
    }
}
