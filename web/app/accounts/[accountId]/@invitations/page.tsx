import { cookies } from "next/headers";
import { Database } from "@/utils/db";
import { createServerComponentClient } from "@/utils/createServerComponentClient";
import { NewInvitationDialog } from "@/components/dialogs/NewInvitationDialog";
import AccountInvitationList from "@/components/AccountInvitationList";

export default async function Page({
  params: { accountId },
}: {
  params: { accountId: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: invitations, error } = await supabase!
    .from("shield_account_invitations")
    .select("*")
    .eq("shield_account_id", accountId);
    console.log(error);
  return (
    <div>
      <NewInvitationDialog />
      <AccountInvitationList invitations={invitations} />
    </div>
  );
}
