// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    // 奖励合约，用于在用户达到目标时发放奖励代币

    // 构造函数，设置代币名称和代币符号
    constructor(
        address ownable
    ) ERC20("GymRewardToken", "GRT") Ownable(ownable) {}

    // 只有合约拥有者（例如平台管理员或智能合约）才能铸造奖励
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit RewardMinted(to, amount);
    }

    // 奖励发放事件，用于记录发放记录
    event RewardMinted(address indexed to, uint256 amount);
}

contract RewardManager is Ownable {
    RewardToken public rewardToken;

    // 奖励阈值或奖励比例可以通过构造函数初始化
    uint256 public constant REWARD_AMOUNT = 1 * 10 ** 18; // 奖励 1 个代币

    // 构造函数，传入部署好的 RewardToken 合约地址
    constructor(address _rewardTokenAddress, address ownable) Ownable(ownable) {
        rewardToken = RewardToken(_rewardTokenAddress);
    }

    // 发放奖励函数，只有在满足条件后调用
    // 条件可以是用户完成了特定任务，此处为简单示例，不包含实际验证逻辑
    function grantReward(address user) external onlyOwner {
        // 在实际场景中，此处可添加条件判断，如检查用户的健身记录
        rewardToken.mint(user, REWARD_AMOUNT);
    }
}
