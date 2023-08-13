import { Address, Hex, createPublicClient, createWalletClient, encodeFunctionData, fromBytes, getContract, http, parseEther, publicActions, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'

import { SignatureProof, UserOperation, encodeSignature, entryPointABI, erc1967FactoryABI, shieldAccountABI } from 'common'

import { ENTRYPOINT_CONTRACT_ADDRESS, FACTORY_CONTRACT_ADDRESS, SHIELD_ACCOUNT_IMPLEMENTATION_ADDRESS } from '@/config'

// XXX:
// Using a local private key for development. Eventually, this will be replaced
// with a bundler in testnet and mainnets.
// Private key is safe to be publicly exposed as it is a test account from foundry.
const account = privateKeyToAccount('0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6')

// XXX:
// Chain defaults to foundry for development purposes.
const client = createWalletClient({
  account,
  chain: foundry,
  transport: http()
}).extend(publicActions)

const publicClient = createPublicClient({
  chain: foundry,
  transport: http(),
})

const factoryContract = getContract({
  address: FACTORY_CONTRACT_ADDRESS,
  abi: erc1967FactoryABI,
  walletClient: client,
  publicClient
})

export const entryPointContract = getContract({
  address: ENTRYPOINT_CONTRACT_ADDRESS,
  abi: entryPointABI,
  walletClient: client
})

export const deployShieldAccount = async (root: bigint, numSigners: bigint, salt?: bigint) => {
  const rootHex: Hex = toHex(root)
  const initializeData = encodeFunctionData({
    abi: shieldAccountABI,
    functionName: 'initialize',
    args: [ENTRYPOINT_CONTRACT_ADDRESS, rootHex, numSigners]
  })

  if (!salt) {
    // Transaction fails for salt larger than 10 bytes.
    const randomBytes = crypto.getRandomValues(new Uint8Array(10))
    salt = fromBytes(randomBytes, 'bigint')
  }

  const saltHex: Hex = toHex(salt, { size: 32 })
  const shieldAddress = await factoryContract.read.predictDeterministicAddress([saltHex])
  const txHash = await factoryContract.write.deployDeterministicAndCall([
    SHIELD_ACCOUNT_IMPLEMENTATION_ADDRESS,
    shieldAddress,
    saltHex,
    initializeData
  ])
  await publicClient.waitForTransactionReceipt(
    { hash: txHash }
  )

  // XXX: Testing by sending an ETH to the account. This helps devs send transactions on chain without having to fund the account.
  await client.sendTransaction({ to: shieldAddress, value: parseEther("1") })
  return shieldAddress
}

export const sendUserOp = async (shieldAccount: Address, userOp: UserOperation, signatures: SignatureProof[]) => {
  const shieldAccountContract = getContract({
    address: shieldAccount,
    abi: shieldAccountABI,
    publicClient
  })

  const numSignersRequired = await shieldAccountContract.read.requiredSigners()
  if (numSignersRequired !== BigInt(signatures.length)) {
    throw new Error(`Expected ${numSignersRequired} signatures, got ${signatures.length}`)
  }

  const encodedSignatures = encodeSignature(signatures)
  const finalizedUserOp = {
    ...userOp,
    signature: encodedSignatures
  }

  // Submit the transacation and wait for it to be processed.
  const txHash = await entryPointContract.write.handleOps([[finalizedUserOp], shieldAccount])
  await publicClient.waitForTransactionReceipt({ hash: txHash })
}
