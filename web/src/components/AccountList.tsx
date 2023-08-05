"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldAccount } from "@/types";
import { classNameMerge } from "@/utils/classNameMerge";

const AccountList = (props: { accounts: ShieldAccount[] | null }) => {
  const pathname = usePathname();
  return (
    <div className="flex gap-2">
      <ul>
        {props.accounts?.map((account, i) => (
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
