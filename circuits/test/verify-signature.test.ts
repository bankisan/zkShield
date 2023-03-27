import { expect } from 'chai'

import { wasm as circomTester, Circuit } from 'circom_tester'
import { secp256k1 } from '@noble/curves/secp256k1'
import * as mod from '@noble/curves/abstract/modular'
import * as utils from '@noble/curves/abstract/utils'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'

import * as pkg from 'common'
const { calculatePrecomputes, createTree, hasher, splitToRegisters } = pkg

describe('Verify signature', () => {
  let verifySignatureCircuit: Circuit
  let tree: IncrementalMerkleTree
  let validateSMultTCircuit: Circuit

  before(async () => {
    tree = await createTree(4, 0n, 2)
    verifySignatureCircuit = await circomTester('src/verify_signature.circom')
    validateSMultTCircuit = await circomTester('src/validate_s_mult_t.circom')
  })

  it('should calculate witness for verify signature', async () => {
    const priv = secp256k1.utils.randomPrivateKey()
    const pub = secp256k1.getPublicKey(priv)

    const msgHash = secp256k1.CURVE.hash('this is a message!')

    const sig = secp256k1.sign(msgHash, priv)

    const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(pub)

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

    // R'.x == R.x  <==> r' == r
    expect(R?.toAffine().x, "R'.x != R.x").to.eq(r)

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

    expect(
      recoveredPublicKey.x,
      'Recovered public key is not equal to public key point: x',
    ).to.eq(publicKeyPoint.toAffine().x)
    expect(
      recoveredPublicKey.y,
      'Recovered public key is not equal to public key point: y',
    ).to.eq(publicKeyPoint.toAffine().y)

    const verified = secp256k1.verify(sig, msgHash, pub)
    expect(verified, 'Signature could not be verified').to.be.true

    const sRegisters = splitToRegisters(s)
    const URegisters = [
      splitToRegisters(U.toAffine().x),
      splitToRegisters(U.toAffine().y),
    ]
    const TPreComputes = calculatePrecomputes(T!)
    const secret = 1n

    const Qa = [
      ...splitToRegisters(publicKeyPoint.toAffine().x),
      ...splitToRegisters(publicKeyPoint.toAffine().y),
    ]

    const nullifier = await hasher([...Qa, secret])
    tree.insert(BigInt(nullifier))

    const root = BigInt(tree.root)
    const { pathIndices, siblings } = tree.createProof(0)

    const inputs = {
      s: sRegisters,
      TPreComputes,
      U: URegisters,
      secret,
      pathIndices,
      siblings,
    }

    const witness: bigint[] = await verifySignatureCircuit.calculateWitness(
      inputs,
    )
    verifySignatureCircuit.assertOut(witness, {})

    // Ensure sT hashed is correct.
    const sTRegisters = [
      ...splitToRegisters(sT?.toAffine().x!),
      ...splitToRegisters(sT?.toAffine().y!),
    ]
    const sTHash = await hasher(sTRegisters)
    expect(witness[1]).to.eq(sTHash)

    // Calculate the nullifier
    expect(witness[2]).to.eq(nullifier)

    // Calculate the root.
    expect(witness[3]).to.eq(root)
  })

  it('should calculate witness for validating s mult t', async () => {
    const priv = secp256k1.utils.randomPrivateKey()
    const pub = secp256k1.getPublicKey(priv)

    const msgHash = secp256k1.CURVE.hash('this is a message!')

    const sig = secp256k1.sign(msgHash, priv)

    const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(pub)

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

    // R'.x == R.x  <==> r' == r
    expect(R?.toAffine().x, "R'.x != R.x").to.eq(r)

    // T = r^{-1} * R
    const rInv = mod.invert(sig.r, secp256k1.CURVE.n)
    const T = R?.multiply(rInv)

    const sT = T?.multiply(s)

    const verified = secp256k1.verify(sig, msgHash, pub)
    expect(verified, 'Signature could not be verified').to.be.true

    const sRegisters = splitToRegisters(s)
    const TRegisters = [
      splitToRegisters(T?.toAffine().x!),
      splitToRegisters(T?.toAffine().y!),
    ]

    const inputs = {
      s: sRegisters,
      T: TRegisters,
    }

    const witness: bigint[] = await validateSMultTCircuit.calculateWitness(
      inputs,
    )
    validateSMultTCircuit.assertOut(witness, {})

    // Ensure sT hashed is correct.
    const sTRegisters = [
      ...splitToRegisters(sT?.toAffine().x!),
      ...splitToRegisters(sT?.toAffine().y!),
    ]
    const sTHash = await hasher(sTRegisters)
    expect(witness[1]).to.eq(sTHash)
  })
})
