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

export const NewTransferDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-6 my-4 rounded-md">
          New Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Transfer</DialogTitle>
          <DialogDescription>
            Submit a new transfer from this Shield Account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Address</Label>
            <Input id="address" value="0x0" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Amount</Label>
            <Input id="amount" value="0.0" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
