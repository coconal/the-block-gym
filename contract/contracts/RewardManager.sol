// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GymMembership.sol";

contract RewardManager is Ownable {
    GymMembership private gymMembership;

    mapping(address => uint[]) userRewards;
    event RewardRedeemed(
        address indexed user,
        uint indexed index,
        uint timestamp
    );

    // 构造函数，传入部署好的 RewardToken 合约地址
    constructor(
        address gymMembershipAddress,
        address ownable
    ) Ownable(ownable) {
        gymMembership = GymMembership(payable(gymMembershipAddress));
    }

    // 发放奖励
    function redeemRewards(address user, uint index) external onlyOwner {
        userRewards[user].push(index);
        emit RewardRedeemed(user, index, block.timestamp);
    }

    // 获取用户奖励
    function getUserRewards(
        address user
    ) external view returns (uint[] memory) {
        return userRewards[user];
    }
}
