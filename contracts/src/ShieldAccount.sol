// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {BaseAccount, UserOperation, UserOperationLib} from "account-abstraction/core/BaseAccount.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

import {VerifySignatureVerifier} from "./verifiers/VerifySignatureVerifier.sol";

import {ECUtils} from "./ECUtils.sol";
import {MultiTokenReceiver} from "./MultiTokenReceiver.sol";
import {ShieldErrors} from "./ShieldErrors.sol";

struct SignatureProof {
    // Proof.
    uint256[2] a;
    uint256[2][2] b;
    uint256[2] c;
    // s*T + U = Q_a
    // T = r^{-1} * R
    // U = -(r^{-1})*m * G
    uint256 rInv;
    uint256[2] R;
    uint256[2] T;
    uint256[2] U;
    uint256 sTHash;
    uint256 nullifier;
}

struct Transaction {
    address payable target;
    uint256 value;
    bytes payload;
    bool delegate;
}

contract ShieldAccount is BaseAccount, MultiTokenReceiver {
    using UserOperationLib for UserOperation;

    // Membership set root.
    bytes32 public root;

    // Multisig threshold.
    uint96 public requiredSigners;
    IEntryPoint _entrypoint;

    uint256 _nonce;

    bool hasInitialized;

    function initialize(
        IEntryPoint __entryPoint,
        bytes32 _root,
        uint96 _requiredSigners
    ) external {
        if (hasInitialized) {
            revert ShieldErrors.AlreadyInitialized();
        }

        _entrypoint = __entryPoint;
        root = _root;
        requiredSigners = _requiredSigners;

        hasInitialized = true;
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entrypoint;
    }

    function nonce() public view override returns (uint256) {
        return _nonce;
    }

    function _validateAndUpdateNonce(UserOperation calldata userOp)
        internal
        override
    {
        if (userOp.nonce != nonce()) {
            revert ShieldErrors.InvalidNonce();
        }
        _nonce++;
    }

    function verifyProof(SignatureProof memory proof, bytes32 userOpHash)
        public
        view
        returns (bool)
    {
        uint256[11] memory input;
        uint256 u = ECUtils.calculateUScalar(proof.rInv, uint256(userOpHash));

        // Assert that U = -r^{-1} * m * G
        if (
            !ECUtils.validateECMult(
                u,
                ECUtils.Gx,
                ECUtils.Gy,
                proof.U[0],
                proof.U[1]
            )
        ) {
            revert ShieldErrors.InvalidSignature();
        }

        // Assert that T = r^{-1} * R
        if (
            !ECUtils.validateECMult(
                proof.rInv,
                proof.R[0],
                proof.R[1],
                proof.T[0],
                proof.T[1]
            )
        ) {
            revert ShieldErrors.InvalidSignature();
        }

        input[0] = proof.sTHash;
        input[1] = proof.nullifier;
        input[2] = uint256(root);

        uint256[4] memory ux = ECUtils.toRegister(proof.U[0]);
        uint256[4] memory uy = ECUtils.toRegister(proof.U[1]);
        for (uint256 i = 0; i < 4; ++i) {
            input[3 + i] = ux[i];
            input[3 + 4 + i] = uy[i];
        }

        // TODO: Requires additional verification.

        return
            VerifySignatureVerifier.verifyProof(
                proof.a,
                proof.b,
                proof.c,
                input
            );
    }

    function extractSignatureProofs(bytes calldata data)
        public
        pure
        returns (SignatureProof[] memory proofs)
    {
        proofs = abi.decode(data, (SignatureProof[]));
    }

    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal view override returns (uint256 deadline) {
        // Only occurs during the creation of the account.
        if (userOp.initCode.length > 0) {
            return 0;
        }

        bytes calldata signature = userOp.signature;
        SignatureProof[] memory proofs = extractSignatureProofs(signature);
        uint256 proofsLength = proofs.length;

        if (proofsLength < requiredSigners) {
            revert ShieldErrors.RequiredSignersNotSatisfied();
        }

        bytes32 signedHash = getEthSignedMessageHash(userOpHash);

        for (uint256 i; i < proofsLength; ++i) {
            uint256 j = i + 1;
            SignatureProof memory proof = proofs[i];
            if (!verifyProof(proof, signedHash)) {
                revert ShieldErrors.InvalidSignature();
            }

            for (j; j < proofsLength; ++j) {
                SignatureProof memory nextProof = proofs[j];
                if (proof.nullifier == nextProof.nullifier) {
                    revert ShieldErrors.DuplicateSigner();
                }
            }
        }

        return 0;
    }

    function getEthSignedMessageHash(bytes32 hash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    modifier onlyEntryPoint() {
        if (msg.sender != address(entryPoint())) {
            revert ShieldErrors.Unauthorized();
        }
        _;
    }

    function execute(Transaction calldata tx_) external onlyEntryPoint {
        (bool success, ) = tx_.delegate
            ? tx_.target.delegatecall(tx_.payload)
            : tx_.target.call{value: tx_.value}(tx_.payload);
        if (!success) {
            revert ShieldErrors.TransactionFailed();
        }
    }

    function updateRoot(bytes32 _root) external onlyEntryPoint {
        root = _root;
    }

    function updateRequiredSigners(uint96 _requiredSigners)
        external
        onlyEntryPoint
    {
        requiredSigners = _requiredSigners;
    }
}
