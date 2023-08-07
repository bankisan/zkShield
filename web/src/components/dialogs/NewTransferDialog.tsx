"use client";

import { useCallback, useEffect, useState } from "react";
import { useClientSupabase } from "@/hooks/useClientSupabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "@/utils/db";
import { Hex, hashMessage, hexToBytes, hexToNumber, isAddress } from "viem";
import { useFormState } from "@/hooks/useFormState";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { UserOperation, shieldAccountABI, executeTransactionData } from "common";
import { useContractRead, useFeeData } from "wagmi";
import { readContract } from "@wagmi/core";

const initialUserOperation: UserOperation = {
  sender: `0x000000000000000000000000000000000000000000`,
  nonce: 0n,
  callData: `0x`,
  initCode: `0x`,
  callGasLimit: 140_000n,
  verificationGasLimit: 2_000_000n,
  preVerificationGas: 21_000n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  paymasterAndData: `0x`,
  signature: `0x`,
};

export const NewTransferDialog = () => {
  const supabase = useClientSupabase<Database>();
  const { toast } = useToast();

  // Dialog State
  const [open, setOpen] = useState(false);

  // Form / Validation State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formState = useFormState<{ to: string; value: bigint }>(
    { to: "", value: 0n },
    {
      to: (value) => {
        if (value === "" || typeof value === "undefined") {
          return { valid: false, value };
        }
        if (isAddress(value)) {
          return { valid: true, value };
        }
        return { valid: false, value, error: "Enter a valid address" };
      },
      value: (value) => {
        let v: bigint | null;
        try {
          v = BigInt(value);
          if (v === 0n) {
            return { valid: false, value: v };
          }
          if (v < 0n) {
            return { valid: false, value: v, error: "Enter a positve integer" };
          }
          return { valid: true, value: v };
        } catch {
          return { valid: false, value: 0n, error: "Enter a valid integer" };
        }
      },
    }
  );

  // Account State
  const { accountId } = useParams();
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const { data: feeData } = useFeeData();

  // Fetch account address on load
  useEffect(() => {
    if (!accountId || !supabase) {
      return;
    }

    (async () => {
      try {
        const { data: account, error } = await supabase
          .from("shield_accounts")
          .select()
          .eq("id", accountId)
          .single();
        if (!account || error) {
          throw (
            "Error retrieving account address. " + (error ? error.message : "")
          );
        }
        setAccountAddress(account.address);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [supabase, accountId]);

  const submit = useCallback(async () => {
    setErrorMessage(null);

    try {
      if (!supabase) {
        throw "Error intializing Supabase client.";
      }

      if (!accountAddress) {
        throw "Error retrieving zkShield account address.";
      }

      // Retrieve user address
      const { data: self, error: addressError } = await supabase
        .from("addresses")
        .select()
        .single();
      if (!self || addressError) {
        throw (
          "Error retrieving user address. " +
          (addressError ? addressError.message : "")
        );
      }

      // Retrieve nonce
      const accountNonce = await readContract({
        address: accountAddress as Hex,
        abi: shieldAccountABI,
        functionName: "nonce",
      });

      const userOp = {
        ...initialUserOperation,
        sender: self.address as Hex,
        nonce: accountNonce ?? 0n,
        callData: executeTransactionData({
          target: formState.state.fields.to.value as Hex,
          payload: "0x",
          value: formState.state.fields.value.value,
          delegate: false,
        }),
        maxFeePerGas: feeData?.maxFeePerGas ?? 0n,
      };

      // Create zkShield account user op
      const { data: shieldAccount, error: shieldAccountError } = await supabase
        .from("shield_accounts_user_ops")
        .insert([{ shield_account_id: accountId, data: userOp }])
        .select()
        .single();

      if (!shieldAccount || shieldAccountError) {
        throw (
          "Error creating zkShield account. " +
          (shieldAccountError ? shieldAccountError.message : "")
        );
      }

      toast({
        title: "Successfully submitted transfer!",
      });
      setOpen(false);
    } catch (e) {
      setErrorMessage(e as string);
    }
  }, [
    supabase,
    formState,
    setErrorMessage,
    setOpen,
    toast,
    accountId,
    accountAddress,
    feeData,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6 my-4 rounded-md">
          New Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Transfer</DialogTitle>
          <DialogDescription>
            Submit a new transfer from this Shield Account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="flex flex-col w-full gap-4 my-6">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                type="text"
                name="to"
                id="to"
                placeholder="0x"
                value={formState.state.fields.to.value}
                className="w-full"
                onChange={(e) => formState.setValue("to", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                type="text"
                name="value"
                id="value"
                placeholder="1000000"
                value={formState.state.fields.value.value
                  .toString(10)
                  .replace(/^0+/, "")}
                className="w-full"
                onChange={(e) => formState.setValue("value", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm">
            {errorMessage + ". Please try again."}
          </div>
        )}
        <DialogFooter>
          <Button
            type="submit"
            onClick={submit}
            disabled={!formState.state.valid}
          >
            Submit Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
