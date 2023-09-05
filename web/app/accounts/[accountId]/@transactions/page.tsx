import AccountTransactionList from "@/components/AccountTransactionList";
import { NewTransactionDialog } from "@/components/dialogs/NewTransactionDialog";
import { NewTransferDialog } from "@/components/dialogs/NewTransferDialog";
import { createServerComponentClient } from "@/utils/createServerComponentClient";
import { Database } from "@/utils/db";
import { readContract } from "@wagmi/core";
import { shieldAccountABI } from "common";
import { cookies } from "next/headers";
import { createPublicClient, getContract, http, type Hex } from "viem";
import { foundry } from "viem/chains";

export const dynamic = 'force-dynamic'

const publicClient = createPublicClient({
  chain: foundry,
  transport: http(),
});

export default async function Page({
  params: { accountId },
}: {
  params: { accountId: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: userOps } = await supabase
    .from("shield_account_user_ops")
    .select("*, shield_account_user_op_signatures(count)")
    .eq("shield_account_id", accountId);

  const { data: account } = await supabase
    .from("shield_accounts")
    .select("address")
    .eq("id", accountId)
    .single();

  const shieldAccountContract = getContract({
    address: account?.address as Hex,
    abi: shieldAccountABI,
    publicClient,
  });

  const numSignersRequired = account?.address
    ? await shieldAccountContract.read.requiredSigners()
    : 0;

  return (
    <div>
      <div className="flex flex-row gap-2">
        <NewTransferDialog />
        {/* <NewTransactionDialog /> */}
      </div>
      <AccountTransactionList
        userOps={userOps}
        accountThreshold={Number(numSignersRequired)}
      />
    </div>
  );
}
