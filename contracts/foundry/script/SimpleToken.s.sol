// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/SimpleToken.sol";

contract DeploySimpleToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy with 1 million tokens as initial supply
        SimpleToken token = new SimpleToken(1000000);
        
        vm.stopBroadcast();
        
        console.log("SimpleToken deployed at:", address(token));
    }
} 