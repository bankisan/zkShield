export declare const signatureProofAbi: {
    readonly internalType: "struct SignatureProof";
    readonly type: "tuple";
    readonly components: readonly [{
        readonly name: "a";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "b";
        readonly internalType: "uint256[2][2]";
        readonly type: "uint256[2][2]";
    }, {
        readonly name: "c";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "rInv";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "R";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "T";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "U";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "sTHash";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "nullifier";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
};
export declare const signatureProofsAbi: {
    readonly internalType: "struct SignatureProof[]";
    readonly type: "tuple[]";
    readonly components: readonly [{
        readonly name: "a";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "b";
        readonly internalType: "uint256[2][2]";
        readonly type: "uint256[2][2]";
    }, {
        readonly name: "c";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "rInv";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "R";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "T";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "U";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "sTHash";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "nullifier";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
};
export type SignatureProof = {
    a: [bigint, bigint];
    b: [[bigint, bigint], [bigint, bigint]];
    c: [bigint, bigint];
    rInv: bigint;
    R: [bigint, bigint];
    T: [bigint, bigint];
    U: [bigint, bigint];
    sTHash: bigint;
    nullifier: bigint;
};
export type Transaction = {
    target: `0x${string}`;
    value: bigint;
    payload: `0x${string}`;
    delegate: boolean;
};
export declare const userOperationAbi: {
    readonly components: readonly [{
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "nonce";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "initCode";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "callData";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "callGasLimit";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "verificationGasLimit";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "preVerificationGas";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "maxFeePerGas";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "maxPriorityFeePerGas";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "paymasterAndData";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "signature";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "userOp";
    readonly type: "tuple";
};
export type UserOperation = {
    sender: `0x${string}`;
    nonce: bigint;
    initCode: `0x${string}`;
    callData: `0x${string}`;
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    paymasterAndData: `0x${string}`;
    signature: `0x${string}`;
};
//# sourceMappingURL=types.d.ts.map