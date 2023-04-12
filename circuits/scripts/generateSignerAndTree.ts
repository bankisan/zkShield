import { secp256k1 } from '@noble/curves/secp256k1'
import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'

import { createWalletClient, Hex, http, keccak256 } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'

import { encodeFunctionData } from 'viem'

import {
  executeTransactionData,
  personalUserOpHash,
  UserOperation,
} from 'common'
import * as pkg from 'common'
const {
  DefaultsForUserOp,
  createTree,
  shieldAccountABI,
  hasher,
  splitToRegisters,
} = pkg

type Signer = {
  privateKey: Hex
  publicKey: Hex
  publicKeyPoint: ProjPointType<bigint>
  secret: bigint
  nullifier: bigint
}

interface SignerWithTree {
  signer: Signer
  root: bigint,
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

console.log('Generating signers...')

const createSignerAndTree = async (privateKey: `0x${string}`) => {
  const signers: Signer[] = []

  const account = privateKeyToAccount(privateKey) 
  const signed = await account.signMessage({ message:'hello world'})
  const secret = BigInt(keccak256(signed))

  let tree: IncrementalMerkleTree
  tree = await createTree(4, 0n, 2)

  const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(account.publicKey.slice(2))

  const Qa = [
    ...splitToRegisters(publicKeyPoint.toAffine().x),
    ...splitToRegisters(publicKeyPoint.toAffine().y),
  ]

  const nullifier = BigInt(await hasher([...Qa, secret]))
  tree.insert(nullifier)

  signers.push({
    privateKey,
    publicKey: account.publicKey,
    publicKeyPoint,
    secret,
    nullifier,
  })

  const root = tree.root

  const signersWithTree: SignerWithTree[] = signers.map((signer, i) => {
    const { pathIndices, siblings } = tree.createProof(i)
    return {
      signer,
      root,
      pathIndices,
      siblings,
    }
  })

  console.log(toJson(signersWithTree))
}

await(createSignerAndTree(`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`))


