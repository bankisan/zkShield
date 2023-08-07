import { NextRequest, NextResponse } from 'next/server';

import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '@/config';
import { Database } from '@/utils/db';
import { createClient } from "@supabase/supabase-js";
import { SignatureProof, UserOperation } from 'common';
import { sendUserOp } from '@/services/ethClient';
import { Hex } from 'viem';

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
  // Get the user operation id from the request body.

  const { userOpId } = await request.json()
  // TODO: Check the signer address and see if they are allowed to send this operation.
  // const session = await Session.fromRequest(request)
  // const { address } = session

  const { data, error } = await supabase
    .from("shield_accounts")
    .select("address, userOp:shield_account_user_ops(data, signatures:shield_account_user_op_signatures(signer, proof))")
    .eq("id", id)
    .not("address", "is", null)
    .eq("userOp.id", userOpId)
    .single();

  if (error) {
    if (error?.code === "PGRST116") {
      return NextResponse.json({ error: "no user op found" }, { status: 400 })
    }
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }

  // We know a single user operation exists from the check above.
  const userOpObj = data?.userOp.pop()!
  const userOp = userOpObj.data as unknown as UserOperation
  const signatures = userOpObj.signatures.map(v => v.proof as unknown as SignatureProof)

  try {
    await sendUserOp(data.address as Hex, userOp, signatures)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ message: "ok" })
}
