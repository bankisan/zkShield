"use client";

import { useClientSupabase } from "@/hooks/useClientSupabase";
import { Database } from "@/utils/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { accountId } = useParams();
  const supabase = useClientSupabase<Database>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!supabase || !accountId) return;
    (async () => {
      const { data: account } = await supabase!
        .from("shield_accounts")
        .select("*")
        .eq("id", Number(accountId))
        .single();
      setName(account?.name ?? "");
      setAddress(account?.address ?? "");
    })();
  }, [accountId, supabase]);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-semibold mt-2 mb-4">
        {name}
      </h1>
      <div className="text-sm text-[grey]">{address}</div>
    </div>
  );
}
