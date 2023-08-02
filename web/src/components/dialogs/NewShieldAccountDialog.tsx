"use client";

import { useClientSupabase } from "@/hooks/useClientSupabase";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Database } from "@/utils/db";
import { useCallback, useState } from "react";
import { useFormState } from "@/hooks/useFormState";

export const NewShieldAccountDialog = () => {
  const supabase = useClientSupabase<Database>();
  const formState = useFormState<{ name: string }>(
    {
      name: "",
    },
    {
      name: (value: string) => {
        if (value === "" || typeof value === "undefined") {
          return { valid: false, value };
        }
        return { valid: true, value };
      },
    }
  );

  const submit = useCallback(async () => {
    if (!supabase) {
      console.log("Supabase not initialized");
      return;
    }

    // Create Shield Account
    const { data: shieldAccount, error: shieldAccountError } = await supabase
      .from("shield_accounts")
      .insert([{ name: formState.getValues().name }])
      .select()
      .single();

    if (!shieldAccount || shieldAccountError) {
      console.error("Shield Account Creation Error: " + shieldAccountError);
      return;
    }

    // Retrieve Address (self)
    const { data: self, error: addressError } = await supabase
      .from("addresses")
      .select()
      .single();
    if (!self || addressError) {
      console.log("Address Retrieval Error: " + addressError);
      return;
    }

    // Associate Address (self) with Shield Account
    const { data: shieldAccountAddress, error: shieldAccountAddressError } =
      await supabase
        .from("shield_account_addresses")
        .insert([
          { shield_account_id: shieldAccount.id, address: self.address },
        ])
        .select()
        .single();

    if (!shieldAccountAddress || shieldAccountAddressError) {
      console.error(
        "Shield Account Address Creation Error: " + shieldAccountAddressError
      );
    }
  }, [supabase, formState]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6 rounded-md w-full">
          New Shield Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Shield Account</DialogTitle>
          <DialogDescription>
            Specify a name for your new Shield Account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="flex flex-col w-full gap-4 my-6">
            <Label htmlFor="name">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              className="w-full"
              placeholder="Shield Account Name"
              value={formState.state.fields.name.value}
              onChange={(e) => formState.setValue("name", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={submit}
            disabled={!formState.state.valid}
          >
            Create Shield Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
