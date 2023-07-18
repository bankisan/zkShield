"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { NewInvitationDialog } from "@/components/dialogs/NewInvitationDialog";
import { useClientSupabase } from "@/hooks/useSupabase";
import { Database } from "@/utils/db";
import { useEffect, useState } from "react";
import type { Invitation as InvitationType } from "@/types";

const Invitation = (props: InvitationType) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader>Invitation to {props.recipient_address}</CardHeader>
      <CardContent>
        <div>Invitation Sent to {props.recipient_address}</div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="rounded-md px-6 mr-2">
          Rescind
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Page() {
  const supabase = useClientSupabase<Database>();
  const [invitations, setInvitations] = useState<InvitationType[]>([]);

  useEffect(() => {
    supabase &&
      (async () => {
        const { data: invitations, error } = await supabase!
          .from("shield_accounts_invitations")
          .select("*");
        if (!error) setInvitations(invitations);
      })();
  }, [supabase]);

  return (
    <div>
      <NewInvitationDialog />
      <div>
        {invitations?.map((invitation, i) => (
          <Invitation key={i} {...invitation} />
        ))}
      </div>
    </div>
  );
}
