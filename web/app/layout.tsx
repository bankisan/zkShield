import { Ubuntu } from "next/font/google";

import Provider from "@/components/Provider";
import "./globals.css";
import WalletConnectButton from "@/components/WalletConnectButton";
import AccountList from "@/components/AccountList";
import { Card } from "@/components/ui/card";
import InvitationList from "@/components/InvitationList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const metadata = {
  title: "zkShield",
  description: "Private multisig with hidden owners",
};

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const Scaffold = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row h-full gap-4 p-4">
      <nav className="flex flex-col h-full">
        <Card className="h-full p-6">
          <Dialog>
            <DialogTrigger className="border rounded-md hover:bg-slate-100 w-full py-2 mb-6">
              {/* <Button variant="outline" className="mb-6 rounded-md w-full"> */}
                New Shield Account
              {/* </Button> */}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="flex flex-col">
            <p className="text-xs font-bold pb-2">SHIELD ACCOUNTS</p>
            <AccountList />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold pb-2">INVITATIONS</p>
            <InvitationList />
          </div>
        </Card>
      </nav>
      <main className="flex w-full h-full">{children}</main>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ubuntu.variable} h-full w-full`}>
      <body className="flex flex-col items-stretch content-stretch h-full w-full">
        <Provider>
          <header className="flex w-full justify-end px-4 pt-3">
            <WalletConnectButton />
          </header>
          <main className="flex-1 flex-col h-full">
            <Scaffold>{children}</Scaffold>
          </main>
        </Provider>
      </body>
    </html>
  );
}
