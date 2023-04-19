'use client'

import { secp256k1 } from '@noble/curves/secp256k1'
import { hasher, nullifierMessage, splitToRegisters } from 'common'
import { ReactNode, createContext, useContext, useState } from 'react'
import { Hex, hashMessage, hexToNumber, keccak256 } from 'viem'
import { useAccount, useSignMessage } from 'wagmi'

type INullifierContext = {
  nullifier?: Hex
  connectNullifier: () => Promise<void>
}
const NullifierContext = createContext<INullifierContext>(
  {} as INullifierContext
)

export const NullifierContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [nullifier, setNullifier] = useState<Hex>()
  const { signMessageAsync: signNullifierAsync } = useSignMessage({
    message: nullifierMessage,
  })

  const connectNullifier = async () => {
    if (nullifier) {
      // TODO: Fix when switching accounts.
      return
    }

    const nullifierMessageHashed = hashMessage(nullifierMessage!)
    const signature = await signNullifierAsync()
    const v = hexToNumber(`0x${signature.slice(130)}`)
    const pub = secp256k1.Signature.fromCompact(signature.substring(2, 130))
      .addRecoveryBit(v - 27)
      .recoverPublicKey(nullifierMessageHashed.substring(2))
      .toHex(false)

    const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(pub)
    const secret = BigInt(keccak256(signature))

    const Qa = [
      ...splitToRegisters(publicKeyPoint.toAffine().x),
      ...splitToRegisters(publicKeyPoint.toAffine().y),
    ]

    const nullifierHex = `0x${BigInt(await hasher([...Qa, secret])).toString(
      16
    )}` as Hex
    setNullifier(nullifierHex)
  }

  useAccount({ onConnect: connectNullifier, onDisconnect: () => setNullifier(undefined) })
  // TODO: Add a way to connect nullifier and display status of it.

  return (
    <NullifierContext.Provider value={{ nullifier, connectNullifier }}>
      {children}
    </NullifierContext.Provider>
  )
}

export const useNullifierContext = () => useContext(NullifierContext)
