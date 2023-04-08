import { secp256k1 } from '@noble/curves/secp256k1'
import * as mod from '@noble/curves/abstract/modular'
import * as utils from '@noble/curves/abstract/utils'
import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'

import { assert } from 'console'
import { mkdir, writeFile } from 'fs/promises'
import { groth16 } from 'snarkjs'
import { encodeFunctionData } from 'viem'

import {
  executeTransactionData,
  personalUserOpHash,
  SignatureProof,
  UserOperation,
} from 'common'
import * as pkg from 'common'
const {
  DefaultsForUserOp,
  calculatePrecomputes,
  createTree,
  encodeSignature,
  shieldAccountABI,
  hasher,
  splitToRegisters,
  toBigInts,
} = pkg

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

// Adapted from https://stackoverflow.com/a/58253280.
const toJson = <T extends Object>(data: T) => {
  return JSON.stringify(
    data,
    (_, v) => (typeof v === 'bigint' ? `${v}#bigint` : v),
    4,
  ).replace(/"(-?\d+)#bigint"/g, (_, a) => a)
}

const defaultSender: `0x${string}` = `0x2a9e8fa175F45b235efDdD97d2727741EF4Eee63`
const defaultUserOp = {
  ...DefaultsForUserOp,
  sender: defaultSender,
  verificationGasLimit: 2_000_000n,
}
const fixtures: Record<string, UserOperation> = {
  default: defaultUserOp,
  transfer: {
    ...defaultUserOp,
    callData: executeTransactionData({
      target: `0x1111111111111111111111111111111111111111`,
      value: 1_000_000_000n,
      payload: `0x`,
      delegate: false,
    }),
  },
  root: {
    ...defaultUserOp,
    callData: encodeFunctionData({
      abi: shieldAccountABI,
      args: [
        `0x1111111111111111111111111111111111111111111111111111111111111111`,
      ],
      functionName: 'updateRoot',
    }),
  },
  signers: {
    ...defaultUserOp,
    callData: encodeFunctionData({
      abi: shieldAccountABI,
      args: [1n],
      functionName: 'updateRequiredSigners',
    }),
  },
}

console.log('Generating test fixtures...')
console.log('Takes a couple minutes ☕️')

const createFixture = async (
  userOp: UserOperation,
  fixtureName: string,
  numberOfSigners: number,
) => {
  const signers: Signer[] = []

  let tree: IncrementalMerkleTree
  tree = await createTree(4, 0n, 2)

  userOp.callGasLimit = 100_000n

  const hashed = personalUserOpHash(
    userOp,
    `0xFEfC6BAF87cF3684058D62Da40Ff3A795946Ab06`,
    31337n,
  )
  console.log(hashed)
  console.log(hashed.length)
  const msgHash = utils.hexToBytes(hashed.slice(2))

  for (let i = 1; i <= numberOfSigners; i++) {
    const priv = new Uint8Array(32).fill(i)
    const pub = secp256k1.getPublicKey(priv)
    const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(pub)
    const secret = 1n

    const Qa = [
      ...splitToRegisters(publicKeyPoint.toAffine().x),
      ...splitToRegisters(publicKeyPoint.toAffine().y),
    ]

    const nullifier = BigInt(await hasher([...Qa, secret]))
    tree.insert(nullifier)

    signers.push({
      priv,
      pub,
      publicKeyPoint,
      secret,
      nullifier,
    })
  }

  const signersWithTree: SignerWithTree[] = signers.map((signer, i) => {
    const { pathIndices, siblings } = tree.createProof(i)
    return {
      ...signer,
      pathIndices,
      siblings,
    }
  })

  const root = tree.root

  const proofs: SignatureProof[] = []
  for (const signer of signersWithTree) {
    const { priv, pub, publicKeyPoint, secret, pathIndices, siblings } = signer

    const sig = secp256k1.sign(msgHash, priv)

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
    assert(R?.toAffine().x === r)

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

    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      'dist/verify_signature.wasm',
      'dist/verify_signature.zkey',
    )
    proofs.push({
      a: toBigInts(proof.pi_a.slice(0, 2)) as [bigint, bigint],
      b: [
        toBigInts(proof.pi_b[0].reverse()),
        toBigInts(proof.pi_b[1].reverse()),
      ] as [[bigint, bigint], [bigint, bigint]],
      c: toBigInts(proof.pi_c.slice(0, 2)) as [bigint, bigint],
      rInv: rInv,
      R: [R?.toAffine().x!, R?.toAffine().y!],
      T: [T?.toAffine().x!, T?.toAffine().y!],
      U: [U?.toAffine().x!, U?.toAffine().y!],
      sTHash: BigInt(publicSignals[0]),
      nullifier: BigInt(publicSignals[1]),
    })
  }

  const signature = encodeSignature(proofs)
  userOp.signature = signature

  const output = {
    msg: hashed,
    root: `0x${BigInt(root).toString(16)}`,
    proofs,
    signature,
    userOp,
  }

  const { proofs: _, ...reducedFixture } = output

  console.log('Writing file:', fixtureName)
  await writeFile(
    `fixtures/${fixtureName}.json`,
    toJson(reducedFixture),
    'utf8',
  )
  await writeFile(`fixtures/${fixtureName}.debug.json`, toJson(output), 'utf8')
  console.log('DONE', fixtureName)
}

await mkdir('fixtures/', { recursive: true })
await Promise.all(
  Object.entries(fixtures).map(([fixtureName, userOp]) =>
    createFixture(userOp, fixtureName, 3),
  ),
)
process.exit()
