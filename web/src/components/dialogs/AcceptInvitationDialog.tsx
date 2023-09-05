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
import { useParams, useRouter } from "next/navigation";
import { DialogProps } from "@radix-ui/react-dialog";
import { Invitation } from "@/types";

export const AcceptInvitationDialog = ({
  invitation,
  open,
  onOpenChange,
}: Required<Pick<DialogProps, "open" | "onOpenChange">> & {
  invitation: Invitation | null;
}) => {
  const supabase = useClientSupabase<Database>();
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      // Accept Invitation
      const { data: acceptInvitation, error: acceptInvitationError } =
        await supabase
          .from("shield_account_invitations")
          .update({
            status: "accepted",
          })
          .eq("shield_account_id", invitation?.shield_account_id)
          .eq("recipient_address", invitation?.recipient_address)
          .eq("inviter_address", invitation?.inviter_address)
          .select()
          .single();

      if (!acceptInvitation || acceptInvitationError) {
        throw (
          "Error accepting zkShield invitation. " +
          (acceptInvitationError ? acceptInvitationError.message : "")
        );
      }

      // Associate self with zkShield account
      const { data: association, error: associationError } = await supabase
        .from("shield_account_addresses")
        .insert({
          shield_account_id: invitation?.shield_account_id,
          address: self.address,
        })
        .select()
        .single();

      if (!association || associationError) {
        throw (
          "Error creating zkShield account association. " +
          (associationError ? associationError.message : "")
        );
      }

      toast({
        title: "Accepted invitation!",
        description: "You are now a member of this Shield Account.",
      });

      onOpenChange(false);
      router.refresh();
    } catch (e) {
      setErrorMessage(e as string);
    }
  }, [supabase, invitation, setErrorMessage, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Accept Invitation</DialogTitle>
          <DialogDescription>
            Confirm that you would like to accept this invitation from{" "}
            {invitation?.inviter_address} to join zkShield{" "}
            {invitation?.shield_account_id}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="flex flex-col w-full gap-4 my-6"></div>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm">
            {errorMessage + ". Please try again."}
          </div>
        )}
        <DialogFooter>
          <Button type="submit" onClick={submit}>
            Accept Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
