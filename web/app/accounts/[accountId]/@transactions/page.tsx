import AccountTransactionList from "@/components/AccountTransactionList";
import { NewTransactionDialog } from "@/components/dialogs/NewTransactionDialog";
import { NewTransferDialog } from "@/components/dialogs/NewTransferDialog";
import { createServerComponentClient } from "@/utils/createServerComponentClient";
import { Database } from "@/utils/db";
import { cookies } from "next/headers";

export default async function Page({
  params: { accountId },
}: {
  params: { accountId: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: userOps } = await supabase
    .from("shield_account_user_ops")
    .select("*")
    .eq("shield_account_id", accountId);
  return (
    <div>
      <div className="flex flex-row gap-2">
        <NewTransferDialog />
        <NewTransactionDialog />
      </div>
      <AccountTransactionList userOps={userOps} />
    </div>
  );
}
