// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library ShieldErrors {
    error AlreadyInitialized();
    error DuplicateSigner();
    error InvalidNonce();
    error InvalidSignature();
    error RequiredSignersNotSatisfied();
    error TransactionFailed();
    error Unauthorized();
}
