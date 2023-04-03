import { encodeAbiParameters, hashMessage, keccak256 } from 'viem';
import { userOperationAbi } from './types';
export const DefaultsForUserOp = {
    sender: '0x',
    nonce: 0n,
    initCode: '0x',
    callData: '0x',
    callGasLimit: 0n,
    verificationGasLimit: 100000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
    paymasterAndData: '0x',
    signature: '0x',
};
export const packUserOp = (op) => {
    let encoded = encodeAbiParameters([userOperationAbi], [{ ...op, signature: '0x' }]);
    return ('0x' + encoded.slice(66, encoded.length - 64));
};
export const getUserOpHash = (op, entryPoint, chainId) => {
    const userOpHash = keccak256(packUserOp(op));
    const enc = encodeAbiParameters([
        { type: 'bytes32', name: 'userOpHash' },
        { type: 'address', name: 'entryPoint' },
        { type: 'uint256', name: 'chainId' },
    ], [userOpHash, entryPoint, chainId]);
    return keccak256(enc);
};
export const personalUserOpHash = (op, entryPoint, chainId) => {
    return hashMessage(getUserOpHash(op, entryPoint, chainId));
};
