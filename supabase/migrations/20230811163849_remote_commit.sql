drop policy "Allow first address or accepted invitation to become signer" on "public"."shield_account_addresses";

drop policy "Permit account signer to create invitation (INSERT)" on "public"."shield_account_invitations";

drop policy "Allow account address to SELECT user ops" on "public"."shield_account_user_ops";

drop policy "Allow account address to create (INSERT) user op" on "public"."shield_account_user_ops";

alter table "public"."shield_account_user_op_signatures" drop constraint "shield_account_user_op_signatures_shield_account_id_fkey";

alter table "public"."shield_account_user_op_signatures" drop constraint "shield_account_user_op_signatures_user_op_id_fkey";

alter table "public"."shield_account_addresses" alter column "address" set not null;

alter table "public"."shield_account_addresses" alter column "shield_account_id" set not null;

alter table "public"."shield_account_invitations" alter column "inviter_address" set not null;

alter table "public"."shield_account_invitations" alter column "recipient_address" set not null;

alter table "public"."shield_account_invitations" alter column "shield_account_id" set not null;

alter table "public"."shield_account_user_op_signatures" drop column "shield_account_id";

alter table "public"."shield_account_user_op_signatures" alter column "proof" set not null;

alter table "public"."shield_account_user_op_signatures" alter column "proof" set data type jsonb using "proof"::jsonb;

alter table "public"."shield_account_user_op_signatures" alter column "signer" set not null;

alter table "public"."shield_account_user_op_signatures" alter column "user_op_id" set not null;

alter table "public"."shield_account_user_op_signatures" disable row level security;

alter table "public"."shield_account_user_ops" alter column "data" set not null;

alter table "public"."shield_account_user_ops" alter column "data" set data type json using "data"::json;

alter table "public"."shield_account_user_ops" disable row level security;

alter table "public"."shield_accounts" add column "address" character varying;

CREATE UNIQUE INDEX shield_account_addresses_pkey ON public.shield_account_addresses USING btree (shield_account_id, address);

CREATE UNIQUE INDEX shield_account_invitations_pkey ON public.shield_account_invitations USING btree (shield_account_id, inviter_address, recipient_address);

CREATE UNIQUE INDEX shield_account_user_op_signatures_pkey ON public.shield_account_user_op_signatures USING btree (user_op_id, signer);

CREATE UNIQUE INDEX shield_accounts_address_key ON public.shield_accounts USING btree (address);

alter table "public"."shield_account_addresses" add constraint "shield_account_addresses_pkey" PRIMARY KEY using index "shield_account_addresses_pkey";

alter table "public"."shield_account_invitations" add constraint "shield_account_invitations_pkey" PRIMARY KEY using index "shield_account_invitations_pkey";

alter table "public"."shield_account_user_op_signatures" add constraint "shield_account_user_op_signatures_pkey" PRIMARY KEY using index "shield_account_user_op_signatures_pkey";

alter table "public"."shield_accounts" add constraint "shield_accounts_address_key" UNIQUE using index "shield_accounts_address_key";

alter table "public"."shield_account_user_op_signatures" add constraint "shield_account_user_op_signatures_user_op_id_fkey" FOREIGN KEY (user_op_id) REFERENCES shield_account_user_ops(id) ON DELETE CASCADE not valid;

alter table "public"."shield_account_user_op_signatures" validate constraint "shield_account_user_op_signatures_user_op_id_fkey";

create policy "Enable update for users based on their address"
on "public"."addresses"
as permissive
for update
to public
using ((((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text) = (address)::text))
with check (true);


create policy "Allow first address or accepted invitation to become signer"
on "public"."shield_account_addresses"
as permissive
for insert
to public
with check ((( SELECT true
   FROM shield_account_invitations sai
  WHERE ((sai.shield_account_id = shield_account_addresses.shield_account_id) AND (sai.status = 'accepted'::text) AND ((sai.recipient_address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))) OR (NOT (EXISTS ( SELECT 1
   FROM shield_account_addresses saa
  WHERE (saa.shield_account_id = shield_account_addresses.shield_account_id))))));


create policy "Permit account signer to create invitation (INSERT)"
on "public"."shield_account_invitations"
as permissive
for insert
to public
with check ((( SELECT true
   FROM shield_account_addresses
  WHERE ((shield_account_addresses.shield_account_id = shield_account_invitations.shield_account_id) AND ((shield_account_addresses.address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))) AND (((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text) <> 'recipient_address'::text)));


create policy "Allow account address to SELECT user ops"
on "public"."shield_account_user_ops"
as permissive
for select
to public
using (( SELECT true
   FROM shield_account_addresses
  WHERE ((shield_account_addresses.shield_account_id = shield_account_user_ops.shield_account_id) AND ((shield_account_addresses.address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))));


create policy "Allow account address to create (INSERT) user op"
on "public"."shield_account_user_ops"
as permissive
for insert
to public
with check (( SELECT true
   FROM shield_account_addresses
  WHERE ((shield_account_user_ops.shield_account_id = shield_account_addresses.shield_account_id) AND ((shield_account_addresses.address)::text = ((current_setting('request.jwt.claims'::text, true))::json ->> 'address'::text)))));



