import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Invitation } from "@/types";
import { Badge } from "@/components/ui/badge";

const Invitation = (invitation: Invitation) => {
  return (
    <Card className="mb-4 hover:bg-muted hover:cursor-pointer">
      <CardHeader>Shield Account {invitation.shield_account_id}</CardHeader>
      <CardContent>
        <li>
          <a href={`/accounts/${invitation.shield_account_id}`}>
            <div className={"flex flex-row min-w-[200px] justify-between"}>
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
  );
};

export default function AccountInvitationList({
  invitations,
}: {
  invitations: Invitation[] | null;
}) {
  return (
    <div>
      <div className="flex gap-2 overflow-hidden">
        <ul>
          {invitations?.map((invitation, i) => (
            <Invitation key={i} {...invitation} />
          ))}
        </ul>
      </div>
    </div>
  );
}
