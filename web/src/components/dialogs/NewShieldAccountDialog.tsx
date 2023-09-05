"use client";

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
import { useCallback, useState } from "react";
import { useFormState } from "@/hooks/useFormState";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const NewShieldAccountDialog = () => {
  const supabase = useClientSupabase<Database>();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    try {
      if (!supabase) {
        throw "Error intializing Supabase client.";
      }

      // Create Shield Account
      const { data: shieldAccount, error: shieldAccountError } = await supabase
        .from("shield_accounts")
        .insert([{ name: formState.getValues().name }])
        .select()
        .single();

      if (!shieldAccount || shieldAccountError) {
        throw (
          "Error creating zkShield account. " +
          (shieldAccountError ? shieldAccountError.message : "")
        );
      }

      // Retrieve Address (self)
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
        throw (
          "Error associating zkShield account with address. " +
          (shieldAccountAddressError ? shieldAccountAddressError.message : "")
        );
      }

      toast({
        title: "Successfully created zkShield account!",
      });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setErrorMessage(e as string);
    }
  }, [supabase, formState, setErrorMessage, setOpen, toast, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Label htmlFor="name">Name</Label>
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
            Create Shield Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
