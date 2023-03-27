export const signatureProofAbi = {
    internalType: 'struct SignatureProof',
    type: 'tuple',
    components: [
        { name: 'a', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'b', internalType: 'uint256[2][2]', type: 'uint256[2][2]' },
        { name: 'c', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'rInv', internalType: 'uint256', type: 'uint256' },
        { name: 'R', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'T', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'U', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'sTHash', internalType: 'uint256', type: 'uint256' },
        { name: 'nullifier', internalType: 'uint256', type: 'uint256' },
    ],
};
export const signatureProofsAbi = {
    internalType: 'struct SignatureProof[]',
    type: 'tuple[]',
    components: [
        { name: 'a', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'b', internalType: 'uint256[2][2]', type: 'uint256[2][2]' },
        { name: 'c', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'rInv', internalType: 'uint256', type: 'uint256' },
        { name: 'R', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'T', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'U', internalType: 'uint256[2]', type: 'uint256[2]' },
        { name: 'sTHash', internalType: 'uint256', type: 'uint256' },
        { name: 'nullifier', internalType: 'uint256', type: 'uint256' },
    ],
};
export const userOperationAbi = {
    components: [
        { name: 'sender', internalType: 'address', type: 'address' },
        { name: 'nonce', internalType: 'uint256', type: 'uint256' },
        { name: 'initCode', internalType: 'bytes', type: 'bytes' },
        { name: 'callData', internalType: 'bytes', type: 'bytes' },
        { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
        {
            name: 'verificationGasLimit',
            internalType: 'uint256',
            type: 'uint256',
        },
        {
            name: 'preVerificationGas',
            internalType: 'uint256',
            type: 'uint256',
        },
        { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
        {
            name: 'maxPriorityFeePerGas',
            internalType: 'uint256',
            type: 'uint256',
        },
        { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
        { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'userOp',
    type: 'tuple',
};
