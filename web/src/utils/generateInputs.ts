import { secp256k1 } from '@noble/curves/secp256k1'
import * as mod from '@noble/curves/abstract/modular'
import * as utils from '@noble/curves/abstract/utils'
import { hexToNumber, keccak256, hashMessage } from 'viem'
import { SignatureType } from '@noble/curves/abstract/weierstrass'
import {
  createTree,
  DefaultsForUserOp,
  executeTransactionData,
  calculatePrecomputes,
  splitToRegisters,
  hasher,
  getUserOpHash,
  UserOperation,
} from 'common'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'

let tree: IncrementalMerkleTree
createTree(4, 0n, 2).then((t) => {
  tree = t
  const priv = new Uint8Array(32).fill(1)
  const pub = secp256k1.getPublicKey(priv)
  const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(pub)
  const secret = 1n

  const Qa = [
    ...splitToRegisters(publicKeyPoint.toAffine().x),
    ...splitToRegisters(publicKeyPoint.toAffine().y),
  ]

  hasher([...Qa, secret]).then((nullifier) => {
    tree.insert(BigInt(nullifier))
  })
})

export const generateInputs = async (
  secret: bigint,
  msgHash: Uint8Array,
  sig: SignatureType,
  pathIndices: string[],
  siblings: string[][],
) => {

  const publicKeyPoint = sig.recoverPublicKey(msgHash)

  const Qa = [
    ...splitToRegisters(publicKeyPoint.toAffine().x),
    ...splitToRegisters(publicKeyPoint.toAffine().y),
  ]

  const nullifier = BigInt(await hasher([...Qa, secret]))
  console.log("Same?\n", nullifier)
  tree.insert(nullifier)
  // const { pathIndices, siblings } = tree.createProof(1)

  const { r, s } = sig
  const m = mod.mod(utils.bytesToNumberBE(msgHash), secp256k1.CURVE.n)
  const sInv = mod.invert(s, secp256k1.CURVE.n) // s^-1
  const u1 = mod.mod(m * sInv, secp256k1.CURVE.n) // u1 = hs^-1 mod n
  const u2 = mod.mod(r * sInv, secp256k1.CURVE.n) // u2 = rs^-1 mod n

  const R = secp256k1.ProjectivePoint.BASE.multiplyAndAddUnsafe(
    publicKeyPoint,
    u1,
    u2
  ) // R' = u1⋅G + u2⋅P

  // T = r^{-1} * R
  const rInv = mod.invert(sig.r, secp256k1.CURVE.n)
  const T = R?.multiply(rInv)

  // U = (-r^{-1}) * m * G
  const u = mod.mod(
    mod.mod(-rInv, secp256k1.CURVE.n) * utils.bytesToNumberBE(msgHash),
    secp256k1.CURVE.n
  )
  const U = secp256k1.ProjectivePoint.BASE.multiply(u)

  const sRegisters = splitToRegisters(s)

  const URegisters = [
    splitToRegisters(U.toAffine().x),
    splitToRegisters(U.toAffine().y),
  ]
  const TPreComputes = calculatePrecomputes(T!)

  const inputs = {
    s: sRegisters,
    TPreComputes,
    U: URegisters,
    secret,
    pathIndices,
    siblings,
  }

  const contractVerifyInputs = {
    rInv,
    R,
    T,
    U,
  }

  return { inputs, contractVerifyInputs }
}
