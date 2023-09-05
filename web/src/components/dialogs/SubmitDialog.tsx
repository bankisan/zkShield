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
import { Database } from "@/utils/db";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAccountUserOp } from "@/types";
import { useRouter } from "next/navigation";

export const SubmitDialog = ({
  userOp,
  enabled,
}: {
  userOp: ShieldAccountUserOp;
  enabled: boolean;
}) => {
  const supabase = useClientSupabase<Database>();
  const router = useRouter();
  const { toast } = useToast();

  // Dialog / Form State
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (!supabase) {
        throw "Error intializing Supabase client.";
      }

      const response = await fetch(
        `/api/accounts/${userOp.shield_account_id}/send`,
        {
          method: "POST",
          body: JSON.stringify({ userOpId: userOp.id }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status !== 200) {
        throw Error("Error submitting user operation: " + response.statusText);
      }

      // Submit signed user operation
      toast({
        title: "User operation successfully submitted!",
      });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setErrorMessage(e as string);
    }
  }, [supabase, setErrorMessage, setOpen, toast, userOp, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-md px-6 mr-2">
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit User Operation</DialogTitle>
          <DialogDescription>Submit the user operation?</DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm">
            {errorMessage + ". Please try again."}
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() => submit().finally(() => setIsSubmitting(false))}
            disabled={!enabled || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
