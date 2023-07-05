import { secp256k1 } from '@noble/curves/secp256k1'
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree'
import { mkdir, writeFile } from 'fs/promises'

import { Hex, keccak256 } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import {
  createTree,
  hasher,
  nullifierMessage,
  splitToRegisters,
  toJsonStrings,
} from 'common'

type Signer = {
  address: Hex
  publicKey: Hex
  nullifier: Hex
}

interface SignerWithTree extends Signer {
  siblings: number[]
  pathIndices: any[]
}

let tree: IncrementalMerkleTree
tree = await createTree(4, 0n, 2)

console.log('Generating signers...')

const createSigners = async (privateKeys: Hex[]) => {
  const signers: Signer[] = []

  for (const privateKey of privateKeys) {
    const account = privateKeyToAccount(privateKey)
    const signed = await account.signMessage({ message: nullifierMessage })
    const secret = BigInt(keccak256(signed))

    const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(
      account.publicKey.slice(2)
    )

    const Qa = [
      ...splitToRegisters(publicKeyPoint.toAffine().x),
      ...splitToRegisters(publicKeyPoint.toAffine().y),
    ]

    const nullifier = BigInt(await hasher([...Qa, secret]))
    tree.insert(nullifier)

    signers.push({
      address: account.address,
      publicKey: account.publicKey,
      nullifier: `0x${nullifier.toString(16)}`,
    })
  }

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
    signers: signersWithTree,
  }

  return output
}
// console.log(toJson(output))

// Note: These are widely used private keys. It's fine to hardcode here.
const oneSignerAccount = await createSigners([
  `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`,
])

const threeSignerAccount = await createSigners([
  `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`,
  `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`,
  `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`,
])

const accountsToSigners = {
  '0x89ac276207912188c62d44143e429e868cC33e5E': oneSignerAccount,
  '0x29A3CFB2a7f01c5c13d80800D1F1D961B303fb14': threeSignerAccount,
}

// Create two test files:
// - Addresses to account addresses
// - Accounts to signers
const signersToAccounts = Object.entries(accountsToSigners).reduce<
  Record<Hex, Hex[]>
>((current, [accountAddress, accountDetails]) => {
  for (const signer of accountDetails.signers) {
    // Use the address for ease of finding.
    const { address } = signer
    current[address] = [accountAddress as Hex, ...(current[address] || [])]
  }
  return current
}, {})

await mkdir('fixtures/', { recursive: true })
console.log('Writing signers to accounts file')
await writeFile(
  `fixtures/signers.json`,
  toJsonStrings(signersToAccounts),
  'utf8'
)

console.log('Writing accounts to signers file')
await writeFile(
  `fixtures/accounts.json`,
  toJsonStrings(accountsToSigners),
  'utf8'
)
