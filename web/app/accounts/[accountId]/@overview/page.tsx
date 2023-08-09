'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useClientSupabase } from "@/hooks/useClientSupabase";
import { Database } from "@/utils/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const supabase = useClientSupabase<Database>();
  const { accountId } = useParams()
  const [isDeployed, setIsDeployed] = useState(true);
  useEffect(() => {
    supabase &&
      (async () => {
        const { data: account, error } = await supabase!
          .from("shield_accounts")
          .select("*").eq("id", accountId).single();
        if (!error) setIsDeployed(account.address != null)
      })();
  }, [supabase, accountId])

  const [isDeploying, setIsDeploying] = useState(false);
  const deployAccount = () => {
    setIsDeploying(true)
    fetch(`/api/accounts/${accountId}/deploy`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => setIsDeployed(true)).finally(() => setIsDeploying(false))
  }

  return (
    <Card className="w-full h-full mt-6">
      <CardHeader>Invitation 0x1</CardHeader>
      <CardContent>
        <div>Invitation Sent to 0x0</div>
      </CardContent>
      <CardFooter></CardFooter>
      {!isDeployed && <Button variant="outline" disabled={isDeploying} className="rounded-md px-6 mr-2" onClick={() => deployAccount()}>Deploy</Button>}
    </Card>
  );
}
