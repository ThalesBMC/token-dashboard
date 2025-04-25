// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    // Staking variables
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingTimestamp;
    mapping(address => bool) public isStaking;
    
    // Reward rate: 1000% annual return (changed from 10% for faster testing)
    uint256 public rewardRate = 1000;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);

    constructor(uint256 initialSupply) ERC20("dOrg", "DORG") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }

    // Mint new tokens - allows anyone to mint for testing purposes
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Stake tokens
    function stakeTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Update staking status
        if (isStaking[msg.sender]) {
            uint256 reward = calculateReward(msg.sender);
            _mint(msg.sender, reward);
        }
        
        // Transfer tokens to contract for staking
        _transfer(msg.sender, address(this), amount);
        
        // Update staking details
        stakingBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        
        emit Staked(msg.sender, amount);
    }
    
    // Unstake tokens with rewards
    function unstakeTokens() public {
        require(isStaking[msg.sender], "No tokens staked");
        require(stakingBalance[msg.sender] > 0, "Staking balance is 0");
        
        // Calculate staking reward
        uint256 reward = calculateReward(msg.sender);
        uint256 balance = stakingBalance[msg.sender];
        
        // Reset staking variables
        stakingBalance[msg.sender] = 0;
        stakingTimestamp[msg.sender] = 0;
        isStaking[msg.sender] = false;
        
        // Return staked tokens + reward
        _transfer(address(this), msg.sender, balance);
        _mint(msg.sender, reward);
        
        emit Unstaked(msg.sender, balance, reward);
    }
    
    // Calculate reward based on staking duration and amount
    function calculateReward(address user) public view returns (uint256) {
        require(isStaking[user], "User is not staking");
        
        uint256 stakingDuration = block.timestamp - stakingTimestamp[user];
        uint256 yearInSeconds = 365 days;
        
        // Calculate reward: (staking_balance * reward_rate * staking_duration) / (year_in_seconds * 100)
        uint256 reward = (stakingBalance[user] * rewardRate * stakingDuration) / (yearInSeconds * 100);
        
        return reward;
    }
    
    // Get staking information for a user
    function getStakingInfo(address user) public view returns (
        uint256 _stakingBalance,
        uint256 _stakingDuration,
        uint256 _potentialReward,
        bool _isStaking
    ) {
        _stakingBalance = stakingBalance[user];
        _stakingDuration = isStaking[user] ? block.timestamp - stakingTimestamp[user] : 0;
        _potentialReward = isStaking[user] ? calculateReward(user) : 0;
        _isStaking = isStaking[user];
        
        return (_stakingBalance, _stakingDuration, _potentialReward, _isStaking);
    }
} 