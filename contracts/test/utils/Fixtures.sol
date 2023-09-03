// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {EntryPoint, IEntryPoint, UserOperation} from "account-abstraction/core/EntryPoint.sol";

// Sorted struct for JSON parsing.
struct SortedUserOperation {
    bytes callData;
    uint256 callGasLimit;
    bytes initCode;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    uint256 nonce;
    bytes paymasterAndData;
    uint256 preVerificationGas;
    address sender;
    bytes signature;
    uint256 verificationGasLimit;
}

struct FixtureJSONIntermediate {
    bytes32 msg;
    uint256 root;
    bytes signature;
    SortedUserOperation userOp;
}

struct Fixture {
    bytes32 msg;
    uint256 root;
    bytes signature;
    UserOperation userOp;
}

library LoadFixture {
    function loadFixture(Vm vm, string memory fixtureName)
        internal
        view
        returns (Fixture memory fixture)
    {
        string memory root = vm.projectRoot();
        string memory path = string.concat(
            root,
            "/test/fixtures/",
            fixtureName,
            ".json"
        );
        string memory json = vm.readFile(path);
        bytes memory encoded = vm.parseJson(json);
        FixtureJSONIntermediate memory intermediate = abi.decode(
            encoded,
            (FixtureJSONIntermediate)
        );

        fixture.msg = intermediate.msg;
        fixture.root = intermediate.root;
        fixture.signature = intermediate.signature;
        fixture.userOp = toFixture(intermediate.userOp);
        return fixture;
    }

    function toFixture(SortedUserOperation memory sortedUserOp)
        internal
        pure
        returns (UserOperation memory userOp)
    {
        userOp.callData = sortedUserOp.callData;
        userOp.callGasLimit = sortedUserOp.callGasLimit;
        userOp.initCode = sortedUserOp.initCode;
        userOp.maxFeePerGas = sortedUserOp.maxFeePerGas;
        userOp.maxPriorityFeePerGas = sortedUserOp.maxPriorityFeePerGas;
        userOp.nonce = sortedUserOp.nonce;
        userOp.paymasterAndData = sortedUserOp.paymasterAndData;
        userOp.preVerificationGas = sortedUserOp.preVerificationGas;
        userOp.sender = sortedUserOp.sender;
        userOp.signature = sortedUserOp.signature;
        userOp.verificationGasLimit = sortedUserOp.verificationGasLimit;
    }
}
