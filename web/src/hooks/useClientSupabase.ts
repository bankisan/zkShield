"use client";

import { useEffect, useMemo, useState } from "react";

import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { useCookie } from "@/hooks/useCookie";
import { COOKIE_NAME, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config";

// Un-typed client as we don't have access to the Database, SchemaName, and Schema.
let supabaseClientSingleton: SupabaseClient<any, any, any> | null = null;

export const useClientSupabase = <
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
    Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>(): SupabaseClient<Database, SchemaName, Schema> | null => {
  const anonClient = () => {
    console.log("Creating anonymous client on client-side!");
    return createClient<Database, SchemaName, Schema>(
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
  }

  const [supabaseClient, setSupabaseClient] = useState<
    SupabaseClient<Database, SchemaName, Schema> | null
  >(supabaseClientSingleton);

  const session = useCookie(COOKIE_NAME);

  useEffect(() => {
    if (session) {
      let token: string | null = null;

      try {
        token = JSON.parse(decodeURIComponent(session)).token;
        if (!token) {
          throw new Error("Missing token in session!");
        }
      } catch (error) {
        const client = anonClient();
        supabaseClientSingleton = client;
        setSupabaseClient(client);
      }

      // Create Supabase client with token from session.
      const client = createClient<Database, SchemaName, Schema>(
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

      // Update singleton
      supabaseClientSingleton = client;

      setSupabaseClient(client);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return supabaseClient;
};
