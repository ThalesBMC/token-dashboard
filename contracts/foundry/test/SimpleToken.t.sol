// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/SimpleToken.sol";

contract SimpleTokenTest is Test {
    SimpleToken public token;
    address public owner;
    address public user1;
    address public user2;
    
    uint256 public initialSupply = 1000000;
    
    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        token = new SimpleToken(initialSupply);
        
        // Transferir alguns tokens para testar
        token.transfer(user1, 10000 * 10**18);
        token.transfer(user2, 5000 * 10**18);
    }
    
    function testInitialSupply() public {
        assertEq(token.totalSupply(), initialSupply * 10**18);
    }
    
    function testBalances() public {
        assertEq(token.balanceOf(user1), 10000 * 10**18);
        assertEq(token.balanceOf(user2), 5000 * 10**18);
    }
    
    function testOwnership() public {
        assertEq(token.owner(), owner);
    }
    
    function testMinting() public {
        uint256 initialBalance = token.balanceOf(user1);
        uint256 mintAmount = 1000 * 10**18;
        
        token.mint(user1, mintAmount);
        
        assertEq(token.balanceOf(user1), initialBalance + mintAmount);
    }
    
    function testStaking() public {
        // Preparação - mudar para o contexto do usuário
        vm.startPrank(user1);
        
        uint256 stakeAmount = 1000 * 10**18;
        uint256 initialBalance = token.balanceOf(user1);
        
        // Verificar saldo antes do staking
        assertFalse(token.isStaking(user1));
        assertEq(token.stakingBalance(user1), 0);
        
        // Fazer stake
        token.stakeTokens(stakeAmount);
        
        // Verificar que o staking foi registrado corretamente
        assertTrue(token.isStaking(user1));
        assertEq(token.stakingBalance(user1), stakeAmount);
        assertEq(token.balanceOf(user1), initialBalance - stakeAmount);
        
        vm.stopPrank();
    }
    
    function testUnstaking() public {
        vm.startPrank(user1);
        
        uint256 stakeAmount = 1000 * 10**18;
        uint256 initialBalance = token.balanceOf(user1);
        
        // Fazer stake
        token.stakeTokens(stakeAmount);
        
        // Avançar o tempo em 30 dias para gerar recompensas
        vm.warp(block.timestamp + 30 days);
        
        // Unstake
        token.unstakeTokens();
        
        // Verificar que o unstaking funcionou
        assertFalse(token.isStaking(user1));
        assertEq(token.stakingBalance(user1), 0);
        
        // O saldo deve ser pelo menos igual ao saldo inicial 
        // (devido às recompensas, será maior)
        assertTrue(token.balanceOf(user1) > initialBalance);
        
        vm.stopPrank();
    }
    
    function testRewardCalculation() public {
        vm.startPrank(user1);
        
        uint256 stakeAmount = 1000 * 10**18;
        
        // Fazer stake
        token.stakeTokens(stakeAmount);
        
        // Avançar o tempo em 365 dias
        vm.warp(block.timestamp + 365 days);
        
        // Verificar recompensa ~10% (pode haver pequenas variações devido ao arredondamento)
        uint256 expectedReward = (stakeAmount * 10) / 100; // 10% do valor em stake
        uint256 calculatedReward = token.calculateReward(user1);
        
        // Permitir uma margem de erro de 0.1%
        uint256 errorMargin = (expectedReward * 1) / 1000;
        
        assertTrue(
            calculatedReward >= expectedReward - errorMargin && 
            calculatedReward <= expectedReward + errorMargin
        );
        
        vm.stopPrank();
    }
} 