// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GymMembership is ReentrancyGuard, Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    struct Membership {
        uint256 id;
        uint256 totalAmount; // 初始总金额
        uint256 releasedAmount; // 已释放金额
        uint256 startTime; // 开始时间
        uint256 duration; // 服务时长（秒）
        address privatecoach; // 关联教练
        uint256 lastReleaseTime; // 上次释放
        bool isActive; // 是否有效
    }

    struct Profile {
        UserType userType;
        uint256 registrationDate;
        bool isActive;
    }

    enum UserType {
        Member,
        Coach
    }

    // 用户地址 => 会员信息
    mapping(address => Membership[]) public memberships;
    // 教练地址 => 可提取收益
    mapping(address => uint256) public coachEarnings;
    // 教练是否验证
    mapping(address => bool) public verifiedCoaches;
    // 用户信息
    mapping(address => Profile) public users;
    // 用户上次退款时间
    mapping(address => mapping(uint256 => uint256)) private lastRefundTime;
    // 平台手续费比例（百分比）
    uint8 public platformFee = 10;
    uint256 public constant REFUND_COOLDOWN = 7 days;
    uint256 public constant FULL_REFUND_WINDOW = 1 days;
    // 事件
    event MembershipPurchased(
        address indexed user,
        address indexed coach,
        uint256 amount,
        uint256 duration
    );

    event FundsReleased(
        address indexed user,
        address indexed coach,
        uint256 amount
    );

    event RefundIssued(address indexed user, uint256 amount);

    event UserRegistered(address indexed userAddress, UserType userType);

    event CoachIsVerified(address indexed coachAddress, string verifiedHash);

    event DurationExtended(
        address indexed userAddress,
        uint256 id,
        uint256 extendDuration
    );

    function registerUser(
        UserType _userType,
        address userAddress
    ) external onlyOwner {
        require(users[userAddress].registrationDate == 0, "Already registered");

        users[userAddress] = Profile({
            userType: _userType,
            registrationDate: block.timestamp,
            isActive: true
        });
        lastRefundTime[userAddress] = block.timestamp;
        emit UserRegistered(userAddress, _userType);
    }

    function verifiedCoach(address coachAddress, string memory ipfsCertHash) external onlyOwner {
        require(bytes(ipfsCertHash).length == 46, "Invalid IPFS hash");
        verifiedCoaches[coachAddress] = true;
        emit CoachIsVerified(coachAddress, ipfsCertHash);
    }

    function getMembershipLength(
        address userAddress
    ) public view returns (uint256) {
        return memberships[userAddress].length;
    }

    // 用户购买会员
    // frontend
    function purchaseMembership(
        address coach,
        uint256 duration
    ) external payable nonReentrant {
        require(msg.value > 0, "Payment required");
        require(duration > 0, "Invalid duration");
        require(users[msg.sender].isActive == true, "No registration");
        if (coach != address(0)) {
            // 记录会员信息
            memberships[msg.sender].push(
                Membership({
                    id: getMembershipLength(msg.sender),
                    totalAmount: msg.value,
                    releasedAmount: 0,
                    startTime: block.timestamp,
                    lastReleaseTime: block.timestamp,
                    duration: duration,
                    privatecoach: coach,
                    isActive: true
                })
            );
        } else {
            memberships[msg.sender].push(
                Membership({
                    id: getMembershipLength(msg.sender),
                    totalAmount: msg.value,
                    releasedAmount: 0,
                    startTime: block.timestamp,
                    lastReleaseTime: block.timestamp,
                    duration: duration,
                    privatecoach: address(0),
                    isActive: true
                })
            );
        }

        emit MembershipPurchased(msg.sender, coach, msg.value, duration);
    }

    // 延长会员有效期
    // frontend
    function extendMembership(
        address userAddress,
        uint256 id,
        uint256 extraDuration
    ) external payable nonReentrant {
        Membership storage m = memberships[msg.sender][id];
        require(m.isActive, "No active membership");

        m.totalAmount += msg.value;
        m.duration += extraDuration;

        emit DurationExtended(userAddress, id, extraDuration);
    }

    // 获取教练可提取收益
    function getReleaseFunds(
        address user,
        uint256 id
    )
        public
        view
        returns (uint256 releasable, uint256 platformCut, uint256 coachCut)
    {
        Membership memory membership = memberships[user][id];
        // 计算已服务时间比例
        uint256 elapsed = block.timestamp - membership.startTime >
            membership.duration
            ? membership.startTime +
                membership.duration -
                membership.lastReleaseTime
            : block.timestamp - membership.lastReleaseTime;
        uint256 releaseRatio = (elapsed * 1e18) / membership.duration;
        releaseRatio = releaseRatio > 1e18 ? 1e18 : releaseRatio;

        // 计算可释放金额
        releasable = (membership.totalAmount * releaseRatio) / 1e18;

        // 分配资金
        platformCut = (releasable * platformFee) / 100;
        coachCut = releasable - platformCut;
    }

    // 按服务进度释放资金
    // owner or coach
    function releaseFunds(
        address user,
        uint256 id
    ) external nonReentrant {
        Membership storage membership = memberships[user][id];
        // bool isAuthed = msg.sender == owner() || msg.sender == membership.privatecoach;
        // require(isAuthed, "Not authorized");
        // require(
        //     block.timestamp > lastWithdrawTime[msg.sender] + 1 days,
        //     "24h cooldown"
        // );
        require(membership.isActive, "Membership not active");
        (
            uint256 releasable,
            uint256 platformCut,
            uint256 coachCut
        ) = getReleaseFunds(user, id);

        // 更新状态
        membership.releasedAmount += releasable;
        membership.lastReleaseTime = block.timestamp - membership.startTime >
            membership.duration
            ? membership.duration + membership.startTime
            : block.timestamp;
        if (membership.releasedAmount == membership.totalAmount) {
            membership.isActive = false;
        }

        payable(owner()).transfer(platformCut);
        payable(membership.privatecoach).transfer(coachCut);

        emit FundsReleased(user, membership.privatecoach, releasable);
    }

    // 用户退款
    // frontend
    function requestRefund(uint256 id) external nonReentrant {
        Membership storage membership = memberships[msg.sender][id];
        require(membership.isActive, "Membership not active");


         // 检查是否在24小时全额退款窗口内
        if (block.timestamp <= membership.startTime + FULL_REFUND_WINDOW) {
            // 全额退款逻辑
            membership.isActive = false;
            payable(msg.sender).transfer(membership.totalAmount);
            emit RefundIssued(msg.sender, membership.totalAmount);
            return;
        }

        // 检查退款冷却时间
        require(
            block.timestamp - lastRefundTime[msg.sender][id] >= REFUND_COOLDOWN,
            "Refund cooldown"
        );

        // 更新最后退款时间
        lastRefundTime[msg.sender][id] = block.timestamp;

        (uint256 releasable, uint256 platformCut, uint256 coachCut) = getReleaseFunds(msg.sender, id);
        // 计算剩余金额
        uint256 remainingAmount = membership.totalAmount - membership.releasedAmount - releasable;
        
        // 重置会员状态
        membership.isActive = false;

        // 退款
        if (platformCut > 0) payable(owner()).transfer(platformCut);
        if (coachCut > 0) payable(membership.privatecoach).transfer(coachCut);
        if (remainingAmount > 0) payable(msg.sender).transfer(remainingAmount);
        emit RefundIssued(msg.sender, remainingAmount);
    }

    // 设置平台手续费
    // admin
    function setPlatformFee(uint8 fee) external onlyOwner {
        require(fee <= 10, "Fee too high");
        platformFee = fee;
    }

    // 查询私教会员状态
    function getMembership(
        address user
    ) external view returns (Membership[] memory) {
        Membership[] memory m = memberships[user];
        return m;
    }

    // 获取注册成员信息
    function getUser(
        address user
    )
        external
        view
        returns (UserType userType, uint256 registrationDate, bool isActive)
    {
        Profile memory m = users[user];
        return (m.userType, m.registrationDate, m.isActive);
    }
}
