"use client";

import { usePathname } from "next/navigation";
import { useClientSupabase } from "@/hooks/useSupabase";
import { Database } from "@/utils/db";
import { ShieldAccount } from "@/types";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { classNameMerge } from "@/utils/classNameMerge";

const AccountList = () => {
  const pathname = usePathname();
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
        {accounts?.map((account, i) => (
          <a key={i} href={`/accounts/${account.id}`}>
            <Card
              className={classNameMerge(
                "mb-4",
                pathname === `/accounts/${account.id}`
                  ? "bg-brand"
                  : "bg-inherit hover:cursor-pointer hover:bg-muted"
              )}
            >
              <CardHeader>{account.id}</CardHeader>
              <CardContent>
                <li>
                  <div
                    className={"flex flex-row min-w-[200px] justify-between"}
                  >
                    <div className={"text-sm"}>{account.id} Members</div>
                    <Badge variant={"outline"}>
                      <div className={"uppercase"}>{account.status}</div>
                    </Badge>
                  </div>
                </li>
              </CardContent>
            </Card>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
