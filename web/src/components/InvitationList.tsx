"use client";

import { useClientSupabase } from "@/hooks/useClientSupabase";
import { Database } from "@/utils/db";
import { Invitation } from "@/types";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { AcceptInvitationDialog } from "./dialogs/AcceptInvitationDialog";

const InvitationList = ({
  invitations,
}: {
  invitations: Invitation[] | null;
}) => {
  const [acceptInviationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<
    Invitation | null
  >(null);
  return (
    <div className="flex gap-2">
      <AcceptInvitationDialog
        invitation={selectedInvitation}
        open={acceptInviationDialogOpen}
        onOpenChange={setInvitationDialogOpen}
      />
      <ul>
        {invitations &&
          invitations.map((invitation, i) => (
            <Card key={i} className="mb-4 hover:bg-muted hover:cursor-pointer" onClick={() => {
              setSelectedInvitation(invitation);
              setInvitationDialogOpen(true);
            }}>
              <CardHeader>Shield Account {invitation.shield_account_id}</CardHeader>
              <CardContent>
                <li>
                  <a href={`/accounts/${invitation.shield_account_id}`}>
                    <div
                      className={"flex flex-row min-w-[200px] justify-between"}
                    >
                      <div className={"text-sm"}>
                        Inviter {invitation.inviter_address?.substr(0, 8) + "..."}
                      </div>
                      <Badge variant={"outline"} className={"uppercase"}>
                        <div>{invitation.status}</div>
                      </Badge>
                    </div>
                  </a>
                </li>
              </CardContent>
            </Card>
          ))}
      </ul>
    </div>
  );
};

export default InvitationList;
