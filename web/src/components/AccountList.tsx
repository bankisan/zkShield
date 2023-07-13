"use client";

import { useClientSupabase } from "@/hooks/useSupabase";
import { Database } from "@/utils/db";
import { ShieldAccount } from "@/types";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";

const AccountList = () => {
  const supabase = useClientSupabase<Database>();
  const [accounts, setAccounts] = useState<ShieldAccount[]>([]);

  useEffect(() => {
    supabase &&
      (async () => {
        const { data: accounts, error } = await supabase!
          .from("shield_accounts")
          .select("*");
        if (!error) setAccounts(accounts);
      })();
  }, [supabase]);

  return (
    <div className="flex gap-2">
      <ul>
        {accounts?.map((account) => (
          <Card className="mb-4 hover:bg-slate-100 hover:cursor-pointer">
            <CardHeader>{account.id}</CardHeader>
            <CardContent>
              <li>
                <a href={`/accounts/${account.id}`}>
                  <div
                    className={"flex flex-row min-w-[200px] justify-between"}
                  >
                    <div>{account.id} Members</div>
                    <Badge variant={"outline"}>
                      <div>{account.status}</div>
                    </Badge>
                  </div>
                </a>
              </li>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
