"use client";

import { useEffect, useState } from "react";

import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

import { Database } from "@/utils/db";
import { useCookie } from "@/hooks/useCookie";
import type { ISession } from "@/utils/session";

const COOKIE_NAME = "zkshield-siwe";

// Hook intended to be used from client-side components only.
export const useClientSupabase = <
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any
>(): SupabaseClient<Database, SchemaName, Schema> | null => {
  const session = useCookie(COOKIE_NAME);

  // Initialize Supabase client with anonymous key.
  const [supabaseClient, setSupabaseClient] = useState<
    SupabaseClient<Database, SchemaName, Schema>
  >(
    createClient<Database, SchemaName, Schema>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )
  );

  useEffect(() => {
    if (session) {
      try {
        const token = JSON.parse(session).token;
        if (!token) {
          throw new Error("No token found in cookie");
        }

        // Create Supabase client with token from session.
        const client = createClient<Database, SchemaName, Schema>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
            },
          }
        );

        setSupabaseClient(client);
      } catch (e) {
        console.log(e);
      }
    }
  }, [session]);

  return supabaseClient;
};
