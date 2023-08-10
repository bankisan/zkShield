"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { secp256k1 } from "@noble/curves/secp256k1";
import { generateInputs } from "@/utils/generateInputs";
import { Proof, generateCommitProof } from "@/services/snark";
import {
  useSignMessage,
  useContractRead,
  useBalance,
  useFeeData,
  useChainId,
  useAccount,
  useWalletClient,
} from "wagmi";
import { Address, Hex, bytesToHex, createPublicClient, createWalletClient, getContract, hashMessage, hexToBytes, hexToNumber, http, isAddress, publicActions, stringToBytes } from "viem";
import {
  UserOperation,
  encodeSignature,
  entryPointABI,
  executeTransactionData,
  getUserOpHash,
  shieldAccountABI,
  toBigInts,
  toJsonStrings,
} from "common";

// XXX - This will be removed once we have a kv-store.
// Using only for development.
import accounts from "../../../../fixtures/accounts.json";
import { useNullifierContext } from "@/hooks/useNullifier";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormState } from "@/hooks/useFormState";
import { SendIcon } from "lucide-react";
import { useClientSupabase } from "@/hooks/useClientSupabase";
import { Database } from "@/utils/db";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from 'viem/chains'
import { ENTRYPOINT_CONTRACT_ADDRESS } from "@/config";

export type CallData = {
  target: `0x${string}`;
  value: bigint;
  payload: `0x${string}`;
  delegate: boolean;
};

export type FormItems = Omit<UserOperation, "callData"> & {
  callData: Hex;
  nullifier?: string;
  proof?: Proof;
  publicSignals?: string[];
};

const initialUserOperation: UserOperation = {
  sender: `0x000000000000000000000000000000000000000000`,
  nonce: 0n,
  callData: `0x`,
  initCode: `0x`,
  callGasLimit: 140_000n,
  verificationGasLimit: 2_000_000n,
  preVerificationGas: 21_000n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  paymasterAndData: `0x`,
  signature: `0x`,
};

// Using a local private key for development. Eventually, this will be replaced
// with a bundler in testnet and mainnets.
// Private key is safe to be publicly exposed as it is a test account from foundry.
const account = privateKeyToAccount('0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6')

// XXX:
// Chain defaults to foundry for development purposes.
const client = createWalletClient({
  account,
  chain: foundry,
  transport: http()
}).extend(publicActions)
const pubClient = createPublicClient({
  chain: foundry,
  transport: http()
})


const entryPointContract = getContract({
  address: ENTRYPOINT_CONTRACT_ADDRESS,
  abi: entryPointABI,
  walletClient: client,
  publicClient: pubClient,
})

export default function AccountAddressPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const supabase = useClientSupabase<Database>();

  const { address: userAddress } = useAccount()
  const [accountAddress, setAccountAddress] = useState<Address | undefined>()

  const params = useParams();
  const { accountId }: { accountId?: number } = params;

  const { data: feeData } = useFeeData();

  const { signNullifierMessage } = useNullifierContext();

  useEffect(() => {

    if (accountAddress || !supabase) {
      return
    }
    supabase.from("shield_accounts").select("address").eq("id", accountId).single().then(({ data }) => {
      setAccountAddress(data?.address as Hex)
    })

  }, [accountAddress, supabase]);

  const [isProving, setIsProving] = useState(false);
  const { data: accountNonce } = useContractRead({
    abi: shieldAccountABI,
    address: accountAddress,
    functionName: "nonce",
    enabled: accountAddress !== undefined,
  });

  const { data: entryPointAddress } = useContractRead({
    abi: shieldAccountABI,
    address: accountAddress,
    functionName: "entryPoint",
  });

  const { data: requiredSigners } = useContractRead({
    abi: shieldAccountABI,
    address: accountAddress,
    functionName: "requiredSigners",
  });

  const { refetch: getEthSignedMessageHash } = useContractRead({
    abi: shieldAccountABI,
    address: accountAddress,
    functionName: "getEthSignedMessageHash",
    enabled: false

  });

  const shieldAccount = getContract({
    address: accountAddress!,
    abi: shieldAccountABI,
    publicClient: pubClient,
  })

  const { data: balance } = useBalance({
    address: accountAddress,
  });

  const chainId = useChainId();

  const { data: walletClient } = useWalletClient()

  const handleProve = async () => {
    if (!supabase) {
      // TODO: Error here.
      return;
    }

    const { secret } = await signNullifierMessage();

    const { data: addressData } = await supabase.from("shield_account_addresses").select("path").eq("address", userAddress).eq("shield_account_id", accountId).single()
    // @ts-ignore
    const { pathIndices, siblings } = addressData.path // @ts-ignore
    console.log(pathIndices);
    console.log(siblings);

    const refinedUserOp = {
      ...initialUserOperation,
      sender: accountAddress as Hex,
      nonce: accountNonce ?? 0n,
      callData: executeTransactionData({
        target: formState.state.fields.to.value as Hex,
        payload: "0x",
        value: formState.state.fields.value.value,
        delegate: false,
      }),
      maxFeePerGas: feeData?.maxFeePerGas ?? 0n,
    };

    console.log("What is this:", refinedUserOp);

    const userOpHash = getUserOpHash(
      refinedUserOp,
      entryPointAddress!,
      BigInt(chainId)
    ) as Hex;
    // hexToBytes(userOpHash)
    // Test the next line before checking this.
    // const signedUserOp = await signMessageAsync({
    //   message: userOpHash,
    // });
    const signedUserOp = await walletClient?.signMessage({
      message: { raw: hexToBytes(userOpHash) }
    })
    if (!signedUserOp) {
      return
    }
    const messageHash = hexToBytes(hashMessage({ raw: hexToBytes(userOpHash) }));

    const v = hexToNumber(`0x${signedUserOp.slice(130)}`);
    const sig = secp256k1.Signature.fromCompact(
      signedUserOp.substring(2, 130)
    ).addRecoveryBit(v - 27);

    const { inputs, contractVerifyInputs } = await generateInputs(
      secret,
      messageHash,
      sig,
      pathIndices,
      siblings
    );

    const { rInv, R, T, U } = contractVerifyInputs;
    console.log("proving...");
    const commitProof = await generateCommitProof(inputs);
    console.log("more proving");
    const { proof, publicSignals } = commitProof;
    console.log("proof completed !");
    console.log(proof);
    console.log(publicSignals);

    const signatureProof = {
      a: toBigInts(proof.pi_a.slice(0, 2)) as [bigint, bigint],
      b: [
        toBigInts(proof.pi_b[0].reverse()),
        toBigInts(proof.pi_b[1].reverse()),
      ] as [[bigint, bigint], [bigint, bigint]],
      c: toBigInts(proof.pi_c.slice(0, 2)) as [bigint, bigint],
      rInv: rInv,
      R: [R?.toAffine().x!, R?.toAffine().y!] as [bigint, bigint],
      T: [T?.toAffine().x!, T?.toAffine().y!] as [bigint, bigint],
      U: [U?.toAffine().x!, U?.toAffine().y!] as [bigint, bigint],
      sTHash: BigInt(publicSignals[0]),
      nullifier: BigInt(publicSignals[1]),
    };

    console.log('Compare hashes')
    const expectedUserOp = await entryPointContract?.read.getUserOpHash([refinedUserOp])
    console.log(await shieldAccount.read.getEthSignedMessageHash([expectedUserOp]))
    console.log(bytesToHex(messageHash))

    // const userOpWithSignature = {
    //   ...refinedUserOp,
    //   signature: encodeSignature([signatureProof]),
    // }
    // await entryPointContract.write.handleOps([[userOpWithSignature], accountAddress!], {})
    // return

    const { data } = await supabase.from("shield_account_user_ops").insert([{
      shield_account_id: Number(accountId),
      data: JSON.parse(toJsonStrings(refinedUserOp))
    }]).select().limit(1).single()

    await supabase?.from("shield_account_user_op_signatures").insert({
      user_op_id: data?.id!,
      signer: userAddress!,
      proof: JSON.parse(toJsonStrings(signatureProof))
    })

    fetch(`/api/accounts/${accountId}/send`, {
      method: 'POST',
      body: JSON.stringify({ userOpId: data?.id }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => console.log(res.ok))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProving(true);
    try {
      await handleProve();
    } finally {
      setIsProving(false);
    }
  };

  const formState = useFormState<{ to: string; value: bigint }>(
    { to: "", value: 0n },
    {
      to: (value) => {
        if (value === "" || typeof value === "undefined") {
          return { valid: false, value };
        }
        if (isAddress(value)) {
          return { valid: true, value };
        }
        return { valid: false, value, error: "Enter a valid address" };
      },
      value: (value) => {
        let v: bigint | null;
        try {
          v = BigInt(value);
          if (v === 0n) {
            return { valid: false, value: v };
          }
          if (v < 0n) {
            return { valid: false, value: v, error: "Enter a positve integer" };
          }
          return { valid: true, value: v };
        } catch {
          return { valid: false, value: 0n, error: "Enter a valid integer" };
        }
      },
    }
  );

  if (!isClient) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex px-4 gap-4">
        <div className="flex flex-col flex-1 gap-2 p-4 rounded-md border bg-neutral-900 border-neutral-700">
          <div className="flex flex-col">
            <p className="text-slate-400">Account</p>
            <p className="gray-100">{accountAddress}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col">
              <p className="text-slate-400">Required Signers</p>
              <p className="gray-100">{requiredSigners?.toString()}</p>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-slate-400">Confirmed txs</p>
              <p className="gray-100">{accountNonce?.toString()}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 p-4 rounded-md border bg-neutral-900 border-neutral-700">
          <p className="text-slate-400">Balance</p>
          <p>
            {balance?.formatted} {balance?.symbol}
          </p>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <p>Transfer</p>
        <form
          className="flex flex-col w-full gap-4 p-4 rounded-md border bg-neutral-900 border-neutral-700"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to">To</Label>
            <Input
              type="text"
              name="to"
              id="to"
              placeholder="0x"
              value={formState.state.fields.to.value}
              className="w-full"
              onChange={(e) => formState.setValue("to", e.target.value)}
              required
            />
            {formState.state.fields.to.error && (
              <p className="text-red-500 text-sm">
                {formState.state.fields.to.error}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="value">Value</Label>
            <Input
              type="text"
              name="value"
              id="value"
              placeholder="1000000"
              value={formState.state.fields.value.value
                .toString(10)
                .replace(/^0+/, "")}
              className="w-full"
              onChange={(e) => formState.setValue("value", e.target.value)}
              required
            />
            {formState.state.fields.value.error && (
              <p className="text-red-500 text-sm">
                {formState.state.fields.value.error}
              </p>
            )}
          </div>
          <Button
            isLoading={isProving}
            disabled={!formState.state.valid}
            variant="default"
            Icon={SendIcon}
            type="submit"
          >
            Transfer
          </Button>
        </form>
      </div>
    </div>
  );
}
