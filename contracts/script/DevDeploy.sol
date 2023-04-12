// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {EntryPoint, IEntryPoint} from "account-abstraction/core/EntryPoint.sol";
import {ERC1967Factory} from "solady/utils/ERC1967Factory.sol";

import {ShieldAccount} from "../src/ShieldAccount.sol";

contract DevDeploy is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        EntryPoint entryPoint = new EntryPoint();
        ShieldAccount implementation = new ShieldAccount();
        ERC1967Factory factory = new ERC1967Factory();

        bytes memory initializeCall = abi.encodeCall(
            ShieldAccount.initialize,
            (
                entryPoint,
                bytes32(
                    uint256(
                        8928183938886732580969833976465404985165044469287174649878281769279498810766
                    )
                ),
                1
            )
        );
        bytes32 salt = bytes32(uint256(1));

        address shieldAccountProxy = factory.predictDeterministicAddress(salt);

        factory.deployDeterministicAndCall(
            address(implementation),
            address(shieldAccountProxy),
            salt,
            initializeCall
        );

        console.log("Entrypoint address");
        console.log(address(entryPoint));

        console.log("ERC1967Factory address:");
        console.log(address(factory));

        console.log("Shield implementation address:");
        console.log(address(implementation));

        console.log("Shield proxy address:");
        console.log(shieldAccountProxy);

        vm.stopBroadcast();
    }
}
