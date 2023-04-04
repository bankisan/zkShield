'use client';

import { ReactNode } from 'react'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
)

const client = createClient({
  provider,
  webSocketProvider,
})

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={client}>
      {children}
    </WagmiConfig>
  );
}
