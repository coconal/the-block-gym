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
        Coach,
        Admin
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
    mapping(address => mapping(uint256 => uint256)) public lastRefundTime;
    // 平台手续费比例（百分比）
    uint8 public platformFee = 10;
    // 退款间隔
    uint256 public constant REFUND_COOLDOWN = 7 days;
    // 全退款时间限制
    uint256 public constant FULL_REFUND_WINDOW = 1 days;

    // 事件
    event MembershipPurchased(
        address indexed user,
        address indexed coach,
        uint256 amount,
        uint256 duration,
        bytes32 paymentProof
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
        uint256 extendDuration,
        bytes32 paymentProof
    );

    event MembershipTransferred(
        address indexed from,
        address indexed to,
        uint256 originalId,
        uint256 newId
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
        emit UserRegistered(userAddress, _userType);
    }

    function verifiedCoach(
        address coachAddress,
        string memory ipfsCertHash
    ) external onlyOwner {
        require(bytes(ipfsCertHash).length == 46, "Invalid IPFS hash");
        verifiedCoaches[coachAddress] = true;
        emit CoachIsVerified(coachAddress, ipfsCertHash);
    }

    function getMembershipLength(
        address userAddress
    ) public view returns (uint256) {
        return memberships[userAddress].length;
    }

    function getLastRefundTime(
        address userAddress,
        uint256 _id
    ) public view returns (uint256) {
        return lastRefundTime[userAddress][_id];
    }

    // 用户购买会员
    function purchaseMembership(
        address coach,
        address user,
        uint256 duration,
        bytes32 paymentProof,
        uint256 paymentAmount
    ) external onlyOwner nonReentrant {
        require(users[user].isActive == true, "No registration");
        if (memberships[user].length > 0) {
            require(
                memberships[user][getMembershipLength(user) - 1].isActive ==
                    false,
                "Already has a membership"
            );
        }
        if (coach != address(0)) {
            // 记录会员信息
            memberships[user].push(
                Membership({
                    id: getMembershipLength(user),
                    totalAmount: paymentAmount,
                    releasedAmount: 0,
                    startTime: block.timestamp,
                    lastReleaseTime: block.timestamp,
                    duration: duration,
                    privatecoach: coach,
                    isActive: true
                })
            );
        } else {
            memberships[user].push(
                Membership({
                    id: getMembershipLength(user),
                    totalAmount: paymentAmount,
                    releasedAmount: 0,
                    startTime: block.timestamp,
                    lastReleaseTime: block.timestamp,
                    duration: duration,
                    privatecoach: address(0),
                    isActive: true
                })
            );
        }
        lastRefundTime[user][getMembershipLength(user) - 1] = block.timestamp;
        emit MembershipPurchased(
            user,
            coach,
            paymentAmount,
            duration,
            paymentProof
        );
    }

    // // 延长会员有效期
    // function extendMembership(
    //     uint256 id,
    //     address user,
    //     uint256 extraDuration,
    //     bytes32 paymentProof,
    //     uint256 paymentAmount
    // ) external onlyOwner nonReentrant {
    //     Membership storage m = memberships[user][id];
    //     require(m.isActive, "No active membership");

    //     m.totalAmount += paymentAmount;
    //     m.duration += extraDuration;

    //     emit DurationExtended(user, id, extraDuration, paymentProof);
    // }

    // 转让会员
    function transferMembership(
        uint256 id,
        address newOwner
    ) external nonReentrant {
        require(users[msg.sender].isActive, "Sender inactive");
        require(users[newOwner].isActive, "Recipient inactive");
        require(msg.sender != newOwner, "Cannot transfer to self");

        Membership[] storage senderMemberships = memberships[msg.sender];
        require(id < senderMemberships.length, "Invalid membership ID");
        Membership memory transfering = senderMemberships[id];
        require(transfering.isActive, "Membership not active");

        (
            uint256 releasable,
            uint256 platformCut,
            uint256 coachCut
        ) = getReleaseFunds(msg.sender, id);

        // 更新状态
        senderMemberships[id].releasedAmount += releasable;

        payable(owner()).transfer(platformCut);
        payable(senderMemberships[id].privatecoach).transfer(coachCut);

        // 创建新会员记录
        memberships[newOwner].push(
            Membership({
                id: getMembershipLength(newOwner),
                totalAmount: transfering.totalAmount -
                    transfering.releasedAmount -
                    releasable,
                releasedAmount: 0,
                startTime: block.timestamp, // 重置开始时间
                duration: transfering.duration -
                    (block.timestamp - transfering.startTime),
                privatecoach: transfering.privatecoach,
                lastReleaseTime: block.timestamp,
                isActive: true
            })
        );

        // 使原会员失效
        senderMemberships[id].isActive = false;

        emit MembershipTransferred(
            msg.sender,
            newOwner,
            id,
            memberships[newOwner].length - 1
        );
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

    // 获取没有教练释放资金
    function ReleaseFundsNoCoach(
        address user,
        uint256 id
    ) public nonReentrant returns (uint256 releasable) {
        Membership storage membership = memberships[user][id];
        // 计算已服务时间比例
        uint256 elapsed = block.timestamp - membership.startTime >
            membership.duration
            ? membership.startTime +
                membership.duration -
                membership.lastReleaseTime
            : block.timestamp - membership.lastReleaseTime;
        uint256 releaseRatio = (elapsed * 1e18) / membership.duration;

        // 计算可释放金额
        membership.lastReleaseTime = block.timestamp;
        releasable = (membership.totalAmount * releaseRatio) / 1e18;
        membership.releasedAmount += releasable;
        if (block.timestamp - membership.startTime >= membership.duration) {
            membership.isActive = false;
        }

        payable(owner()).transfer(releasable);
    }

    // 按服务进度释放资金
    function releaseFunds(address user, uint256 id) public nonReentrant {
        Membership storage membership = memberships[user][id];
        require(membership.privatecoach != address(0), "No coach");
        // require(
        //     block.timestamp > membership.lastReleaseTime + 3 days,
        //     "3d cooldown"
        // );
        require(membership.isActive, "Membership not active");
        (
            uint256 releasable,
            uint256 platformCut,
            uint256 coachCut
        ) = getReleaseFunds(user, id);

        // 更新状态
        membership.releasedAmount += releasable;
        membership.lastReleaseTime = block.timestamp;
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
        // 检查退款冷却时间
        // require(
        //     block.timestamp - lastRefundTime[msg.sender][id] >= REFUND_COOLDOWN,
        //     "Refund cooldown"
        // );

        // 更新最后退款时间
        lastRefundTime[msg.sender][id] = block.timestamp;
        (
            uint256 releasable,
            uint256 platformCut,
            uint256 coachCut
        ) = getReleaseFunds(msg.sender, id);
        // 计算剩余金额
        uint256 remainingAmount = membership.totalAmount -
            membership.releasedAmount -
            releasable;
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

    function deactivateUser() external {
        require(users[msg.sender].isActive == true, "No registration");
        // 检查是否还有课程未退款
        for (
            uint256 i = memberships[msg.sender].length - 1;
            i > memberships[msg.sender].length;
            i++
        ) {
            require(
                memberships[msg.sender][i].isActive == false,
                "Membership not active"
            );
        }
        users[msg.sender].isActive = false;
    }

    function adminForceRefund(
        address user,
        uint256 id
    ) external onlyOwner nonReentrant {
        Membership storage membership = memberships[user][id];
        require(membership.isActive, "Already inactive");

        uint256 remainingAmount = membership.totalAmount -
            membership.releasedAmount;
        membership.isActive = false;

        if (remainingAmount > 0) {
            payable(user).transfer(remainingAmount);
        }
        emit RefundIssued(user, remainingAmount);
    }

    // 错误操作，退回传入的 ETH
    function refundETH(address user, uint256 amount) external onlyOwner {
        payable(user).transfer(amount);
    }

    // 接收 ETH 的方法
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    // 当调用不存在的函数时接收 ETH
    fallback() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    // 定义一个事件来记录 ETH 接收信息
    event EtherReceived(address indexed sender, uint256 amount);
}
