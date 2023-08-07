import { NextRequest, NextResponse } from 'next/server';
import { Session } from '@/utils/session';

import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '@/config';
import { Database } from '@/utils/db';
import { createClient } from "@supabase/supabase-js";
import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree';
import { createTree, toJsonStrings } from 'common';
import { deployShieldAccount } from '@/services/ethClient';
import { Address, Hex } from 'viem';

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export async function POST(request: NextRequest, { params: { id } }: { params: { id: number } }) {
  if (!id) {
    return NextResponse.json({ error: "missing account id" }, { status: 400 })
  }

  const session = await Session.fromRequest(request)
  const { address } = session

  const { data, error } = await supabase
    .from("shield_accounts")
    .select("*, signers:shield_account_addresses(address, nullifier:addresses(nullifier))")
    .eq("id", id)
    .is("address", null)
    .single();

  if (error) {
    if (error?.code === "PGRST116") {
      return NextResponse.json({ error: "account already deployed" }, { status: 400 })
    }
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }


  const isSigner = (data?.signers?.filter(v => v.address === address).length || 0) > 0
  if (!isSigner) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 })
  }

  // Roll up nullifiers into a merkle tree.
  let tree: IncrementalMerkleTree

  // Maximum tree size is 2^4 - 1 = 15.
  tree = await createTree(4, 0n, 2)
  for (const nullifier of data.signers.map(v => v.nullifier?.nullifier)) {
    const nullifierBigInt = BigInt(nullifier!)
    tree.insert(nullifierBigInt)
  }

  // Root of the merkle tree of signers.
  const root = BigInt(tree.root)
  const accountAddressesUpsert: { shield_account_id: number, address: Address, path: any }[] = []
  for (const [i, address] of data.signers.map(v => v.address!).entries()) {
    const { pathIndices, siblings } = tree.createProof(i)
    accountAddressesUpsert.push({ shield_account_id: id, address: address as Hex, path: JSON.parse(toJsonStrings({ pathIndices, siblings })) })
  }

  const accountAddress = await deployShieldAccount(root, BigInt(data.signers.length))

  // TODO: Switch to transaction for atomicity.
  const { error: upsertError } = await supabase.from("shield_account_addresses").upsert(accountAddressesUpsert, { onConflict: "shield_account_id,address" })
  if (upsertError) {
    return NextResponse.json({ error: upsertError?.message }, { status: 500 })
  }
  const { error: updateError } = await supabase.from("shield_accounts").update({
    address: accountAddress
  }).eq("id", id)
  if (updateError) {
    return NextResponse.json({ error: updateError?.message }, { status: 500 })
  }

  return NextResponse.json({ ok: "ok" })
}
