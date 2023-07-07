import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { SiweErrorType, SiweMessage, generateNonce } from "siwe";
import { createClient } from "@supabase/supabase-js";

import { Session } from "@/utils/session";
import { Database } from "@/utils/db";

// References
// https://github.com/m1guelpf/nextjs13-connectkit-siwe/blob/main/src/

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

const tap = async <T>(
  value: T,
  cb: (value: T) => Promise<unknown>
): Promise<T> => {
  await cb(value);
  return value;
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req);

  return NextResponse.json(session.toJSON());
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  const session = await Session.fromRequest(req);
  if (!session?.nonce) session.nonce = generateNonce();
  return tap(new NextResponse(session.nonce), (res) => session.persist(res));
};

export const POST = async (req: NextRequest) => {
  const { message, signature } = await req.json();
  const session = await Session.fromRequest(req);

  try {
    const siweMessage = new SiweMessage(message);
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    });

    if (fields.nonce !== session.nonce) {
      return tap(new NextResponse("Invalid nonce.", { status: 422 }), (res) =>
        session.clear(res)
      );
    }

    const { data: address, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("address", fields.address)
      .single();
    if (error) {
      return tap(new NextResponse(String(error), { status: 400 }), (res) =>
        session.clear(res)
      );
    }

    if (!address) {
      const { data: address, error } = await supabase
        .from("addresses")
        .insert([{ address: fields.address }])
        .select()
        .single();
      if (error) {
        return tap(new NextResponse(String(error), { status: 400 }), (res) =>
          session.clear(res)
        );
      }
    }

    session.address = fields.address;
    session.chainId = fields.chainId;
    session.token = jwt.sign(
      {
        sub: fields.address,
        aud: "authenticated",
        address: fields.address,
      },
      process.env.JWT!,
      { expiresIn: "1h" }
    );

  } catch (error) {
    switch (error) {
      case SiweErrorType.INVALID_NONCE:
      case SiweErrorType.INVALID_SIGNATURE:
        return tap(new NextResponse(String(error), { status: 422 }), (res) =>
          session.clear(res)
        );

      default:
        return tap(new NextResponse(String(error), { status: 400 }), (res) =>
          session.clear(res)
        );
    }
  }

  return tap(new NextResponse(""), (res) => session.persist(res));
};

export const DELETE = async (req: NextRequest) => {
  const session = await Session.fromRequest(req);

  return tap(new NextResponse(""), (res) => session.clear(res));
};
