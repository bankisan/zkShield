import { Ubuntu } from 'next/font/google'

import Provider from '@/components/Provider'
import './globals.css'
import WalletConnectButton from '@/components/WalletConnectButton'

export const metadata = {
  title: 'zkShield',
  description: 'Private multisig with hidden owners',
}

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${ubuntu.variable} bg-[#0d0f12] text-neutral-200`}
    >
      <body className='flex flex-col flex-1'>
        <Provider>
          <header className='flex w-full h-16 justify-end p-4 py-2'>
              <WalletConnectButton />
          </header>
          <main className='flex justify-center items-center w-full'>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  )
}
