import { encodeAbiParameters, encodeFunctionData, keccak256 } from 'viem'
import { secp256k1 } from '@noble/curves/secp256k1'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'
import { keccak_256 } from'@noble/hashes/sha3';
import { bytesToHex } from '@noble/hashes/utils';
import { buildPoseidon } from 'circomlibjs'

import * as mod from '@noble/curves/abstract/modular'
import * as utils from '@noble/curves/abstract/utils'

import { AffinePoint } from '@noble/curves/abstract/curve'
import { ProjPointType } from '@noble/curves/abstract/weierstrass'

import { shieldAccountABI } from './generated'
import { signatureProofsAbi, SignatureProof, Transaction } from './types'

export const nullifierMessage = "Signing this message keeps your account hidden\n\nDo not sign this message outside the domain of zkshield.io";

// Adapted from:
// https://github.com/personaelabs/efficient-zk-ecdsa/tree/main/scripts/utils
export const REGISTERS = 4n
export const STRIDE = 8n
export const NUM_STRIDES = 256n / STRIDE // = 32

let poseidon: any

export const encodeSignature = (proofs: SignatureProof[]): `0x${string}` => {
  return encodeAbiParameters([signatureProofsAbi], [proofs])
}

export const toHex = (value: bigint): string => {
  return `0x${utils.numberToHexUnpadded(value).padStart(64, '0')}`
}

export const toBigInts = (input: string[]): bigint[] => {
  return input.map((el) => BigInt(el))
}

export const splitToRegisters = (value: bigint) => {
  const registers = [] as bigint[]

  const hex = utils.numberToHexUnpadded(value).padStart(64, '0')
  for (let k = 0; k < REGISTERS; k++) {
    // 64bit = 16 chars in hex
    const val = hex.slice(k * 16, (k + 1) * 16)

    registers.unshift(BigInt(`0x${val}`))
  }

  return registers
}

export const calculatePrecomputes = (point: ProjPointType<bigint>) => {
  const precomputedPoints = [] as bigint[][][][]

  const fastPoint = secp256k1.utils.precompute(8, point)

  for (let i = 0n; i < NUM_STRIDES; i++) {
    const stride: bigint[][][] = []
    const power = 2n ** (i * STRIDE)
    for (let j = 0n; j < 2n ** STRIDE; j++) {
      const l = mod.mod(j * power, secp256k1.CURVE.n)

      let precomputedPoint: AffinePoint<bigint>
      if (l === 0n) {
        precomputedPoint = secp256k1.ProjectivePoint.ZERO.toAffine()
      } else {
        precomputedPoint = fastPoint.multiply(l).toAffine()
      }
      const x = splitToRegisters(precomputedPoint.x)
      const y = splitToRegisters(precomputedPoint.y)
      stride.push([x, y])
    }
    precomputedPoints.push(stride)
  }
  return precomputedPoints
}

export const hasher = async (inputs: bigint[]): Promise<bigint> => {
  if (!poseidon) {
    poseidon = await buildPoseidon()
  }
  return BigInt(poseidon.F.toString(poseidon(inputs)) as unknown as string)
}

export const createTree = async (
  depth: number,
  zeroValue: bigint,
  arity?: number
) => {
  if (!poseidon) {
    poseidon = await buildPoseidon()
  }
  const hasherPoseidon = (inputs: string[]): string => {
    return poseidon.F.toString(poseidon(inputs)) as unknown as string
  }

  return new IncrementalMerkleTree(hasherPoseidon, depth, zeroValue, arity)
}

export const executeTransactionData = (tx: Transaction) => {
  return encodeFunctionData({
    abi: shieldAccountABI,
    args: [tx],
    functionName: 'execute',
  })
}

export const publicKeyToAddress = (publicKey: Uint8Array): string => { 
  const pub = secp256k1.ProjectivePoint.fromHex(publicKey).toRawBytes(false)
  console.log(pub)
  const addr = "0x" + bytesToHex(keccak_256(pub.subarray(1, 65))).slice(24);
  return addr;
}
