// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library ShieldErrors {
    error InvalidNonce();
    error InvalidSignature();
    error DuplicateSigner();
    error RequiredSignersNotSatisfied();
    error Unauthorized();
    error TransactionFailed();
}
