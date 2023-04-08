import { secp256k1 } from '@noble/curves/secp256k1'
import * as mod from '@noble/curves/abstract/modular'
import * as utils from '@noble/curves/abstract/utils'
import { ProjPointType, SignatureType } from '@noble/curves/abstract/weierstrass'
import { createTree, DefaultsForUserOp, executeTransactionData, calculatePrecomputes, addressToProjectivePoint, splitToRegisters, hasher, getUserOpHash, UserOperation } from 'common';
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'

let tree: IncrementalMerkleTree
createTree(4, 0n, 2).then((t) => {
  tree = t
  console.log(tree)

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

type Signer = {
  priv: Uint8Array
  pub: Uint8Array
  publicKeyPoint: ProjPointType<bigint>
  secret: bigint
  nullifier: bigint
}

interface SignerWithTree extends Signer {
  siblings: number[]
  pathIndices: any[]
}

const isDebugMode = false;

function assert(condition: boolean, message?: string) {
  if (isDebugMode && !condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export const generateInputs = async (
  userOp?: UserOperation,
  publicKey?: string,
  msgHash?: Uint8Array,
  sig?: SignatureType
) => { 
  if (!userOp) {
    userOp = DefaultsForUserOp
    userOp.sender = `0x2a9e8fa175F45b235efDdD97d2727741EF4Eee63`
    userOp.verificationGasLimit = 2_000_000n
    userOp.callData = executeTransactionData({
      target: `0x1111111111111111111111111111111111111111`,
      value: 1_000_000_000n,
      payload: `0x`,
      delegate: false,
    })
    userOp.callGasLimit = 100_000n
  } 

  const priv = new Uint8Array(32).fill(1)
  const pub = secp256k1.getPublicKey(priv)
  const publicKeyPoint = publicKey ? addressToProjectivePoint(publicKey) : secp256k1.ProjectivePoint.fromHex(pub);
  const secret = 1n
  
  const Qa = [
    ...splitToRegisters(publicKeyPoint.toAffine().x),
    ...splitToRegisters(publicKeyPoint.toAffine().y),
  ]
  
  const nullifier = BigInt(await hasher([...Qa, secret]))
  tree.insert(nullifier)
  
  const { pathIndices, siblings } = tree.createProof(1)
  const root = tree.root
  if (!msgHash) {
    const hashed = getUserOpHash(
      userOp,
      `0xFEfC6BAF87cF3684058D62Da40Ff3A795946Ab06`,
      31337n,
    )
    msgHash = utils.hexToBytes(hashed.slice(2))
  }
  if (!sig) {
    sig = secp256k1.sign(msgHash, priv)
  }

  const { r, s } = sig
  const m = mod.mod(utils.bytesToNumberBE(msgHash), secp256k1.CURVE.n)
  const sInv = mod.invert(s, secp256k1.CURVE.n) // s^-1
  const u1 = mod.mod(m * sInv, secp256k1.CURVE.n) // u1 = hs^-1 mod n
  const u2 = mod.mod(r * sInv, secp256k1.CURVE.n) // u2 = rs^-1 mod n

  const R = secp256k1.ProjectivePoint.BASE.multiplyAndAddUnsafe(
    publicKeyPoint,
    u1,
    u2,
  ) // R' = u1⋅G + u2⋅P


  // T = r^{-1} * R
  const rInv = mod.invert(sig.r, secp256k1.CURVE.n)
  const T = R?.multiply(rInv)

  // U = (-r^{-1}) * m * G
  const u = mod.mod(
    mod.mod(-rInv, secp256k1.CURVE.n) * utils.bytesToNumberBE(msgHash),
    secp256k1.CURVE.n,
  )
  const U = secp256k1.ProjectivePoint.BASE.multiply(u)

  const sT = T?.multiply(s)
  const recoveredPublicKey = U.add(sT!).toAffine()

  // Recovered public key is not equal to public key point: x
  assert(recoveredPublicKey.x === publicKeyPoint.toAffine().x)
  // Recovered public key is not equal to public key point: y
  assert(recoveredPublicKey.y === publicKeyPoint.toAffine().y)

  const verified = secp256k1.verify(sig, msgHash, pub)

  // Signature could not be verified
  assert(verified)

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
  
  console.log(inputs)
  return inputs;
}
