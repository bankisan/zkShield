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

export const NewInvitationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6 my-4 rounded-md">
          New Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Invitation</DialogTitle>
          <DialogDescription>
            <div className={"my-4"}>
              Invite another account to join your Shield Account.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Address</Label>
            <Input id="address" value="0x0" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
