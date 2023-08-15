"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useClientSupabase } from "@/hooks/useClientSupabase";
import { ShieldAccount } from "@/types";
import { Database } from "@/utils/db";
import { shieldAccountABI } from "common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Hex } from "viem";
import { getBalance } from "viem/dist/types/actions/public/getBalance";
import { useBalance, useContractRead } from "wagmi";

export default function Page() {
  const supabase = useClientSupabase<Database>();
  const { toast } = useToast();

  const { accountId } = useParams();
  const [account, setAccount] = useState<ShieldAccount | null>(null);

  // Account Information
  const { data: balance, error: balanceError } = useBalance({
    address: account?.address as Hex,
  });
  const { data: requiredSigners, error: requiredSignersError } =
    useContractRead({
      abi: shieldAccountABI,
      address: account?.address as Hex,
      functionName: "requiredSigners",
    });
  const { data: nonce, error: nonceError } = useContractRead({
    abi: shieldAccountABI,
    address: account?.address as Hex,
    functionName: "nonce",
  });

  const [isDeployed, setIsDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    supabase &&
      (async () => {
        const { data: account, error } = await supabase!
          .from("shield_accounts")
          .select("*")
          .eq("id", accountId)
          .single();
        if (!error) setIsDeployed(account.address != null);
        if (account && !error) setAccount(account);
      })();
  }, [supabase, accountId]);

  const deployAccount = () => {
    setIsDeploying(true);
    fetch(`/api/accounts/${accountId}/deploy`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setIsDeployed(true);
        toast({ title: "Successfully deployed zkShield account!" });
      })
      .finally(() => setIsDeploying(false));
  };

  return (
    <div className="flex flex-col w-full mt-6">
      {!isDeployed && (
        <Button
          variant="outline"
          disabled={isDeploying}
          className="rounded-md px-6 mb-4"
          onClick={() => deployAccount()}
        >
          Deploy
        </Button>
      )}
      {isDeployed && (
        <div className="flex justify-between gap-4">
          <Card className="flex-1">
            <CardHeader className="text-center text-xs uppercase">
              Balance
            </CardHeader>
            <CardContent className="text-center text-xl">
              <div>
                {!balanceError && balance ? balance?.formatted : String(0)} ETH
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="text-center text-xs uppercase">
              Nonce
            </CardHeader>
            <CardContent className="text-center text-xl">
              <div>{!nonceError ? String(nonce ?? 0) : 0}</div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="text-center text-xs uppercase">
              Signers
            </CardHeader>
            <CardContent className="text-center text-xl">
              <div>
                {!requiredSignersError ? String(requiredSigners ?? 0) : 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
