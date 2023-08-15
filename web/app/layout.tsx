import { cookies } from "next/headers";
import { Ubuntu } from "next/font/google";

import "./globals.css";

import Provider from "@/components/Provider";
import WalletConnectButton from "@/components/WalletConnectButton";
import AccountList from "@/components/AccountList";
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
    .select(
      "*, shield_account_addresses(count), shield_account_user_ops(count)"
    )
    .in("id", shieldAccountAddresses?.map((a) => a.shield_account_id) || []);

  const { data: invitations } = await supabase
    .from("shield_account_invitations")
    .select("*")
    .eq("recipient_address", self?.address)
    .eq("status", "pending");

  return (
    <html
      lang="en"
      className={`${ubuntu.variable} h-full w-full overflow-hidden`}
    >
      <body className="dark h-full w-full overflow-hidden">
        <Toaster />
        <Provider>
          <div className="grid grid-cols-body grid-rows-body gap-4 h-full overflow-hidden p-2">
            <header className="row-start-1 px-4 py-4">
              <WalletConnectButton />
            </header>
            <nav className="row-start-2 rounded-lg bg-card border overflow-auto p-6">
              <NewShieldAccountDialog />
              {(invitations && invitations.length > 0) && (
                <div className="flex flex-col">
                  <p className="text-xs font-bold pb-4">INVITATIONS</p>
                  <InvitationList invitations={invitations} />
                </div>
              )}
              <div className="mb-4">
                <p className="text-xs font-bold pb-4">SHIELD ACCOUNTS</p>
                {/* We need to upgrade Supabase to support counts of joins. */}
                {/* @ts-ignore */}
                <AccountList accounts={accounts} />
              </div>
            </nav>
            <main className="row-start-2 row-end-auto overflow-auto h-full">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
