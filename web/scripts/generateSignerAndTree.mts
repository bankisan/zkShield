import { secp256k1 } from '@noble/curves/secp256k1'
import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'

import { Hex, keccak256 } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'


import {
  createTree,
  hasher,
  nullifierMessage,
  splitToRegisters,
  toJson,
} from 'common'

type Signer = {
  address: Hex
  publicKey: Hex
  nullifier: bigint
}

interface SignerWithTree extends Signer {
  siblings: number[]
  pathIndices: any[]
}

console.log('Generating signers...')

const createSignerAndTree = async (privateKey: `0x${string}`) => {
  const signers: Signer[] = []

  const account = privateKeyToAccount(privateKey) 
  const signed = await account.signMessage({ message: nullifierMessage})
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
    address: account.address,
    publicKey: account.publicKey,
    nullifier,
  })

  const root = tree.root

  const signersWithTree: SignerWithTree[] = signers.map((signer, i) => {
    const { pathIndices, siblings } = tree.createProof(i)
    return {
      ...signer,
      pathIndices,
      siblings,
    }
  })

  const output = {
    root,
    signers: signersWithTree
  }

  console.log(toJson(output))
}

// Note: This is a widely used private key. It's fine to hardcode here.
await(createSignerAndTree(`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`))
