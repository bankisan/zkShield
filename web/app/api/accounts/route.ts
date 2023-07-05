import { NextRequest, NextResponse } from 'next/server';
import { Session } from '@/utils/session';

import signers from '../../../fixtures/signers.json'

export async function GET(request: NextRequest) {
  const {address} = await Session.fromRequest(request)
  if (!address) {
    // TODO: We want to throw an unauthorized error here as well as
    // everywhere else in the app when the user is not authenticated.
    return NextResponse.json({ error: "not signed in" })
  }

  const accounts = signers[address] as string[]
  return NextResponse.json({ accounts })
}
