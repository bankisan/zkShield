import { Ubuntu } from "next/font/google";

import Provider from '@/components/Provider'
import './globals.css'

export const metadata = {
  title: 'zkShield',
  description: 'Private multisig with hidden owners',
}

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${ubuntu.variable} bg-[#0d0f12] text-neutral-200`}
    >
      <body className="flex justify-center items-center h-screen w-full">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
