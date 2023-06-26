import { NextResponse } from 'next/server';

import signers from '../../../fixtures/signers.json'

export async function GET(request: Request) {
  // const accounts = signers[address] as string[]

  // console.log("Here we are:", accounts)
  return NextResponse.json({ hello: "world" })
}
