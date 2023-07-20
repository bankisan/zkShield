"use client";

import { useEffect, useState } from "react";

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
  const session = useCookie(COOKIE_NAME);

  const [supabaseClient, setSupabaseClient] = useState<
    SupabaseClient<Database, SchemaName, Schema>
  >(
    supabaseClientSingleton ??
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
      )
  );

  useEffect(() => {
    if (session) {
      try {
        const token = JSON.parse(decodeURIComponent(session)).token;
        if (!token) {
          throw new Error("No token found in cookie");
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

        supabaseClientSingleton = client;
        setSupabaseClient(client);
      } catch (e) {
        console.log(e);
      }
    }
  }, [session]);

  return supabaseClient;
};
