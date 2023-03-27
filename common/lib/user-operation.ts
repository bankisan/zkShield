import { encodeAbiParameters, keccak256 } from 'viem'

import { UserOperation, userOperationAbi } from './types'

export const DefaultsForUserOp: UserOperation = {
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
}

export const packUserOp = (op: UserOperation): `0x${string}` => {
  let encoded: string = encodeAbiParameters(
    [userOperationAbi],
    [{ ...op, signature: '0x' }]
  )
  return ('0x' + encoded.slice(66, encoded.length - 64)) as `0x${string}`
}

export const getUserOpHash = (
  op: UserOperation,
  entryPoint: `0x${string}`,
  chainId: bigint
): string => {
  const userOpHash = keccak256(packUserOp(op))
  const enc = encodeAbiParameters(
    [
      { type: 'bytes32', name: 'userOpHash' },
      { type: 'address', name: 'entryPoint' },
      { type: 'uint256', name: 'chainId' },
    ],
    [userOpHash, entryPoint, chainId]
  )
  return keccak256(enc)
}
