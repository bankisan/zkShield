import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Invitation } from "@/types";
import { Badge } from "@/components/ui/badge";

const Invitation = (invitation: Invitation) => {
  return (
    <Card className="mb-4 w-full">
      <CardHeader>{invitation.recipient_address}</CardHeader>
      <CardContent>
        <div className={"flex flex-row min-w-[200px] justify-between"}>
          <div className={"text-sm"}>
            Inviter {invitation.inviter_address}
          </div>
          <Badge variant={"outline"} className={"uppercase"}>
            <div>{invitation.status}</div>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AccountInvitationList({
  invitations,
}: {
  invitations: Invitation[] | null;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2 overflow-hidden w-full">
        {invitations?.map((invitation, i) => (
          <Invitation key={i} {...invitation} />
        ))}
      </div>
    </div>
  );
}
