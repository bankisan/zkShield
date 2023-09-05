"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShieldAccount } from "@/types";
import { classNameMerge } from "@/utils/classNameMerge";
import Link from "next/link";

const AccountList = (props: {
  accounts:
  | (ShieldAccount & {
    shield_account_user_ops: [
      {
        count: number;
      }
    ];
  })[]
  | null;
}) => {
  const pathname = usePathname();
  return (
    <div>
      {props.accounts?.map((account, i) => (
        <Link key={i} href={`/accounts/${account.id}`}>
          <Card
            className={classNameMerge(
              "mb-4",
              pathname === `/accounts/${account.id}`
                ? "bg-brand"
                : "bg-inherit hover:cursor-pointer hover:bg-muted"
            )}
          >
            <CardHeader className={"font-semibold"}>{account.name}</CardHeader>
            <CardContent>
            {/* <div className={"text-sm mb-2"}>{account.address && `${account.address.substr(0, 20)}...`}</div> */}
              <div className={"flex flex-row min-w-[200px] justify-between"}>
                <div className={"text-sm"}>{account.shield_account_user_ops.length} Txs
                </div>
                {!account?.address && (
                  <Badge variant={"outline"}>
                    <div className={"uppercase"}>{account.status}</div>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AccountList;
