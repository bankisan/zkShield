'use client';

import WalletConnectButton from '@/components/WalletConnectButton'
import Signer from '@/components/Signer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WalletConnectButton />
      <Signer />
    </main>
  )
}
