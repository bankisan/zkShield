import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ShieldAccountUserOp } from "@/types";
import { shieldAccountABI } from "common";
import { decodeFunctionData } from "viem";
import { SignDialog } from "./dialogs/SignDialog";

const UserOp = (userOp: ShieldAccountUserOp) => {
  const callData = (userOp.data as { [key: string]: any })["callData"];

  const functionData = decodeFunctionData({
    abi: shieldAccountABI,
    data: callData,
  });

  const args = functionData?.args as readonly [
    {
      target: `0x${string}`;
      value: bigint;
      payload: `0x${string}`;
      delegate: boolean;
    }
  ];

  const to = args?.[0].target;
  const value = args?.[0].value;

  return (
    <Card className="w-full mb-4">
      <CardHeader>Transaction {userOp.id}</CardHeader>
      <CardContent>
        <div>Data</div>
        {to && <div>To: {to}</div>}
        {value != null && <div>Value: {String(value)}</div>}
      </CardContent>
      <CardFooter>
        <SignDialog userOp={userOp} />
        <Button variant="outline" className="rounded-md px-6 mr-2" disabled>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AccountTransactionList({
  userOps,
}: {
  userOps: ShieldAccountUserOp[] | null
}) {
  return (
    <div>
      <div className="flex gap-2 overflow-hidden">
        <ul>
          {userOps?.map((userOp, i) => (
            <UserOp key={i} {...userOp} />
          ))}
        </ul>
      </div>
    </div>
  );
}
