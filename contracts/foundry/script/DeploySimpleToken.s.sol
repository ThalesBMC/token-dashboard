// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/SimpleToken.sol";

contract DeploySimpleToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the token with initial supply of 1,000,000 tokens
        SimpleToken token = new SimpleToken(1000000);
        
        console.log("SimpleToken deployed at:", address(token));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Initial supply:", token.balanceOf(msg.sender));
        
        vm.stopBroadcast();
    }
} 