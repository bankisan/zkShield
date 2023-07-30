import { Database } from "@/utils/db";

export type ShieldAccount =
  Database["public"]["Tables"]["shield_accounts"]["Row"];
export type ShieldAccountUserOp =
  Database["public"]["Tables"]["shield_account_user_ops"]["Row"];
export type Invitation =
  Database["public"]["Tables"]["shield_account_invitations"]["Row"];
