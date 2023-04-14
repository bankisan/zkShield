'use client';

import { ReactNode } from 'react'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { foundry } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const { chains, provider } = configureChains(
  [mainnet, foundry],
  [
    publicProvider()
  ]
);

const client = createClient(
  getDefaultClient({
    appName: "zkShield",
    chains,
  }),
);

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
