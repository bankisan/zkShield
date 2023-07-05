'use client'

import { ConnectKitProvider, SIWEConfig, SIWEProvider, getDefaultConfig } from 'connectkit'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { foundry } from 'wagmi/chains'

import { WALLET_CONNECT_ID } from '@/config'
import { NullifierContextProvider } from '@/hooks/useNullifier'
import { SiweMessage } from 'siwe'

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, foundry],
  [publicProvider()]
)

const queryClient = new QueryClient()
const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: WALLET_CONNECT_ID,
    appName: 'zkShield',
    publicClient,
    webSocketPublicClient,
    // TODO: Add back in other chains.
    chains: [foundry],
  })
)

const siweConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/siwe`, { method: 'PUT' })
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce')

    return res.text()
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      uri: window.location.origin,
      domain: window.location.host,
      statement: 'Sign In With Ethereum to prove you control this wallet.',
    }).prepareMessage()
  },
  verifyMessage: async ({ message, signature }) => {
    return fetch(`/api/siwe`, {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.ok)
  },
  getSession: async () => {
    const res = await fetch(`/api/siwe`)
    if (!res.ok) throw new Error('Failed to fetch SIWE session')

    const { address, chainId } = await res.json()
    return address && chainId ? { address, chainId } : null
  },
  signOut: () => fetch(`/api/siwe`, { method: 'DELETE' }).then((res) => res.ok),
} satisfies SIWEConfig


export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider>
            <NullifierContextProvider>{children}</NullifierContextProvider>
          </ConnectKitProvider>
        </SIWEProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}
