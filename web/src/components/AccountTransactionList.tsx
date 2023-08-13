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
import { SubmitDialog } from "./dialogs/SubmitDialog";

const UserOp = (
  props: ShieldAccountUserOp & {
    accountThreshold: number;
    signatureCount: number;
  }
) => {
  const callData = (props.data as { [key: string]: any })["callData"];

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
      <CardHeader>Transaction {props.id}</CardHeader>
      <CardContent>
        <div>Data</div>
        {to && <div>To: {to}</div>}
        {value != null && <div>Value: {String(value)}</div>}
      </CardContent>
      <CardFooter>
        <SignDialog userOp={props} />
        <SubmitDialog
          userOp={props}
          enabled={
            props.accountThreshold != 0 &&
            props.signatureCount >= props.accountThreshold
          }
        />
      </CardFooter>
    </Card>
  );
};

export default function AccountTransactionList({
  accountThreshold,
  userOps,
}: {
  accountThreshold: number;
  userOps:
    | (ShieldAccountUserOp & {
        shield_account_user_op_signatures: [
          {
            count: number;
          }
        ];
      })[]
    | null;
}) {
  return (
    <div>
      <div className="flex gap-2 overflow-hidden">
        <ul>
          {userOps?.map((userOp, i) => (
            <UserOp
              key={i}
              {...userOp}
              accountThreshold={accountThreshold}
              signatureCount={
                userOp.shield_account_user_op_signatures
                  ? userOp.shield_account_user_op_signatures[0].count
                  : 0
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
