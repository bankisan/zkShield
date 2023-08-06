drop policy "Allow address that is account owner to SELECT self" on "public"."shield_account_addresses";

drop policy "Allow address with accepted invitation to become owner" on "public"."shield_account_addresses";

drop policy "Permit account address to create invitation (INSERT)" on "public"."shield_account_invitations";

drop policy "Permit inviters to SELECT if inviter or recipient" on "public"."shield_account_invitations";

drop policy "Allow address to SELECT accounts" on "public"."shield_accounts";

drop policy "Allow address to create account" on "public"."shield_accounts";

alter table "public"."shield_account_invitations" drop constraint "shield_account_invitations_recipient_address_fkey";

alter table "public"."addresses" add column "nullifier" text;

alter table "public"."shield_account_addresses" add column "path" json;

create policy "Allow address to SELECT self"
on "public"."shield_account_addresses"
as permissive
for select
to public
using (((address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)));


create policy "Allow first address or accepted invitation to become signer"
on "public"."shield_account_addresses"
as permissive
for insert
to public
with check ((( SELECT true
   FROM shield_account_invitations
  WHERE ((shield_account_invitations.shield_account_id = shield_account_invitations.shield_account_id) AND (shield_account_invitations.status = 'accepted'::text) AND ((shield_account_invitations.recipient_address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))) OR (NOT (EXISTS ( SELECT 1
   FROM shield_account_addresses shield_account_addresses_1
  WHERE (shield_account_addresses_1.shield_account_id = shield_account_addresses.shield_account_id))))));


create policy "Permit account signer to create invitation (INSERT)"
on "public"."shield_account_invitations"
as permissive
for insert
to public
with check (( SELECT true
   FROM shield_account_addresses
  WHERE ((shield_account_addresses.shield_account_id = shield_account_invitations.shield_account_id) AND ((shield_account_addresses.address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))));


create policy "Permit inviters to SELECT if inviter or recipient"
on "public"."shield_account_invitations"
as permissive
for select
to public
using ((((((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text) = (inviter_address)::text) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text) = (recipient_address)::text)) AND ( SELECT true
   FROM shield_account_addresses
  WHERE ((shield_account_addresses.shield_account_id = shield_account_invitations.shield_account_id) AND ((shield_account_addresses.address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text))))));


create policy "Allow address to SELECT accounts"
on "public"."shield_accounts"
as permissive
for select
to public
using ((( SELECT true
   FROM shield_account_addresses
  WHERE ((shield_account_addresses.shield_account_id = shield_accounts.id) AND ((shield_account_addresses.address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))) OR (NOT (EXISTS ( SELECT 1
   FROM shield_account_addresses
  WHERE (shield_account_addresses.shield_account_id = shield_accounts.id))))));


create policy "Allow address to create account"
on "public"."shield_accounts"
as permissive
for insert
to public
with check (((((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text) <> ''::text) AND (NOT (EXISTS ( SELECT 1
   FROM shield_account_addresses
  WHERE (shield_account_addresses.shield_account_id = shield_accounts.id))))));



