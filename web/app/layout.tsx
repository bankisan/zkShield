import { cookies } from "next/headers";
import { Ubuntu } from "next/font/google";

import "./globals.css";

import Provider from "@/components/Provider";
import WalletConnectButton from "@/components/WalletConnectButton";
import AccountList from "@/components/AccountList";
import { Card } from "@/components/ui/card";
import { NewShieldAccountDialog } from "@/components/dialogs/NewShieldAccountDialog";
import InvitationList from "@/components/InvitationList";
import { createServerComponentClient } from "@/utils/createServerComponentClient";
import { Database } from "@/utils/db";
import { Toaster } from "@/components/ui/toaster";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: self } = await supabase.from("addresses").select("*").single();

  const { data: shieldAccountAddresses } = await supabase
    .from("shield_account_addresses")
    .select("shield_account_id");

  const { data: accounts } = await supabase
    .from("shield_accounts")
    .select("*")
    .in("id", shieldAccountAddresses?.map((a) => a.shield_account_id) || []);

  const { data: invitations } = await supabase
    .from("shield_account_invitations")
    .select("*")
    .eq("recipient_address", self?.address)
    .eq("status", "pending");

  return (
    <html lang="en" className={`${ubuntu.variable} h-full w-full`}>
      <body className="flex flex-col items-stretch content-stretch h-full w-full dark">
        <Provider>
          <header className="flex w-full justify-end px-4 pt-3">
            <WalletConnectButton />
          </header>
          <div className="flex flex-row h-full gap-4 p-4">
            <nav className="flex flex-col h-full">
              <Card className="h-full p-6">
                <NewShieldAccountDialog />
                <div className="flex flex-col mb-4">
                  <p className="text-xs font-bold pb-4">SHIELD ACCOUNTS</p>
                  <AccountList accounts={accounts} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold pb-4">INVITATIONS</p>
                  <InvitationList invitations={invitations} />
                </div>
              </Card>
            </nav>
            <main className="flex w-full h-full">{children}</main>
          </div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
