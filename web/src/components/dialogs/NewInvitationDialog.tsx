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
import { useParams } from "next/navigation";

export const NewInvitationDialog = () => {
  const supabase = useClientSupabase<Database>();
  const { accountId } = useParams();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formState = useFormState<{ address: string }>(
    {
      address: "",
    },
    {
      address: (value: string) => {
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

      // Create Invitation
      const { data: invitation, error: invitationError } = await supabase
        .from("shield_account_invitations")
        .insert(
          {
            shield_account_id: Number(accountId),
            inviter_address: self.address,
            recipient_address: formState.getValues().address,
            status: "pending",
          },
        )
        .select()
        .single();

      if (!invitation || invitationError) {
        throw (
          "Error creating zkShield invitation. " +
          (invitationError ? invitationError.message : "")
        );
      }

      toast({
        title: "Invitation successfully sent!",
      });
      setOpen(false);
    } catch (e) {
      setErrorMessage(e as string);
    }
  }, [supabase, formState, setErrorMessage, setOpen, toast, accountId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6 my-4 rounded-md">
          New Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Invitation</DialogTitle>
          <DialogDescription>
            Invite another account to join your Shield Account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="flex flex-col w-full gap-4 my-6">
            <Label htmlFor="name">Address</Label>
            <Input
              type="text"
              id="address"
              className="w-full"
              placeholder="0x0"
              value={formState.state.fields.address.value}
              onChange={(e) => formState.setValue("address", e.target.value)}
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
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
