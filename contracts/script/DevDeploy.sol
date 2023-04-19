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

        bytes memory initializeCallOneSigner = abi.encodeCall(
            ShieldAccount.initialize,
            (
                entryPoint,
                bytes32(
                    uint256(
                        21435439588844460030087438211685181353091391897801874789865100401304871131693
                    )
                ),
                1
            )
        );
        bytes32 saltOneSigner = bytes32(uint256(1));

        address shieldAccountProxyOneSigner = factory
            .predictDeterministicAddress(saltOneSigner);
        factory.deployDeterministicAndCall(
            address(implementation),
            address(shieldAccountProxyOneSigner),
            saltOneSigner,
            initializeCallOneSigner
        );

        bytes memory initializeCallTwoSigners = abi.encodeCall(
            ShieldAccount.initialize,
            (
                entryPoint,
                bytes32(
                    uint256(
                        6441627056893009277322941992738670682972041857144203998054174291300034842422
                    )
                ),
                2
            )
        );
        bytes32 saltTwoSigners = bytes32(uint256(2));

        address shieldAccountProxyTwoSigners = factory
            .predictDeterministicAddress(saltTwoSigners);
        factory.deployDeterministicAndCall(
            address(implementation),
            address(shieldAccountProxyTwoSigners),
            saltTwoSigners,
            initializeCallTwoSigners
        );

        console.log("Entrypoint address");
        console.log(address(entryPoint));

        console.log("ERC1967Factory address:");
        console.log(address(factory));

        console.log("Shield implementation address:");
        console.log(address(implementation));

        console.log("Shield proxy address (one signer):");
        console.log(shieldAccountProxyOneSigner);

        console.log("Shield proxy address (two signers):");
        console.log(shieldAccountProxyTwoSigners);

        vm.stopBroadcast();
    }
}
