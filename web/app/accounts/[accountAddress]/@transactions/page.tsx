"use client";

import { NewTransactionDialog } from "@/components/dialogs/NewTransactionDialog";
import { NewTransferDialog } from "@/components/dialogs/NewTransferDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useClientSupabase } from "@/hooks/useSupabase";
import { ShieldAccountUserOp } from "@/types";
import { Database } from "@/utils/db";
import { useEffect, useState } from "react";

const UserOp = (props: ShieldAccountUserOp) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>Transaction 0x1</CardHeader>
      <CardContent>
        <div>This is a simple transaction.</div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="rounded-md px-6 mr-2">
          Sign
        </Button>
        <Button variant="outline" className="rounded-md px-6 mr-2" disabled>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Page() {
  const supabase = useClientSupabase<Database>();
  const [ops, setOps] = useState<ShieldAccountUserOp[]>([]);

  useEffect(() => {
    supabase &&
      (async () => {
        const { data: ops, error } = await supabase!
          .from("shield_accounts_user_ops")
          .select("*");
        if (!error) setOps(ops);
      })();
  }, [supabase]);

  return (
    <div>
      <div className="flex flex-row gap-2">
        <NewTransferDialog />
        <NewTransactionDialog />
      </div>
      <div>
        {ops?.map((op, i) => (
          <UserOp key={i} {...op} />
        ))}
      </div>
    </div>
  );
}
