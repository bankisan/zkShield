import { Database } from "@/utils/db"

export type ShieldAccount = Database["public"]["Tables"]["shield_accounts"]["Row"];
export type Invitation = Database["public"]["Tables"]["shield_account_invitations"]["Row"];
