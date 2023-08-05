import { cookies } from "next/headers";

import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config";

const COOKIE_NAME = "zkshield-siwe";

export const createServerComponentClient = <
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>(context: {
  cookies: () => ReturnType<typeof cookies>;
}): SupabaseClient<Database, SchemaName, Schema> => {
  const session = cookies().get(COOKIE_NAME)?.value;
  const anonClient = () =>
    createClient<Database, SchemaName, Schema>(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

  if (!session) {
    return anonClient();
  }

  const token = JSON.parse(decodeURIComponent(session)).token;
  if (!token) {
    return anonClient();
  }

  return createClient<Database, SchemaName, Schema>(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
};
