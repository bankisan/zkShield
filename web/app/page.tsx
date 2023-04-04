'use client';

import WalletConnectButton from '@/components/WalletConnectButton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WalletConnectButton />
    </main>
  )
}
