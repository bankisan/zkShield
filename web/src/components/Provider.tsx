'use client'

import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { foundry } from 'wagmi/chains'

import { WALLET_CONNECT_ID } from '@/config'
import { NullifierContextProvider } from '@/hooks/useNullifier'

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
    chains: [mainnet, foundry],
  })
)
export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <NullifierContextProvider>{children}</NullifierContextProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}
