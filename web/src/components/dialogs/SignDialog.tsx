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
import { useParams } from "next/navigation";
import { ShieldAccountUserOp } from "@/types";
import {
  UserOperation,
  getUserOpHash,
  shieldAccountABI,
  toBigInts,
  toJsonStrings,
} from "common";
import { readContract } from "@wagmi/core";
import { useChainId, useWalletClient } from "wagmi";
import { Hex, hashMessage, hexToBytes, hexToNumber } from "viem";
import { generateInputs } from "@/utils/generateInputs";
import { secp256k1 } from "@noble/curves/secp256k1";
import { generateCommitProof } from "@/services/snark";
import { useNullifierContext } from "@/hooks/useNullifier";
import { sign } from "crypto";

const createSignatureProof = async (
  messageHash: Uint8Array,
  signedUserOp: Hex,
  secret: bigint,
  pathIndices: string[],
  siblings: string[][]
) => {
  const v = hexToNumber(`0x${signedUserOp.slice(130)}`);
  const sig = secp256k1.Signature.fromCompact(
    signedUserOp.substring(2, 130)
  ).addRecoveryBit(v - 27);

  console.log("Pre Generate Inputs");

  const { inputs, contractVerifyInputs } = await generateInputs(
    secret,
    messageHash,
    sig,
    pathIndices,
    siblings
  );

  const { rInv, R, T, U } = contractVerifyInputs;
  const commitProof = await generateCommitProof(inputs);
  const { proof, publicSignals } = commitProof;

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

  return JSON.parse(toJsonStrings(signatureProof));
};

export const SignDialog = ({ userOp }: { userOp: ShieldAccountUserOp }) => {
  const supabase = useClientSupabase<Database>();
  const { toast } = useToast();
  const { accountId } = useParams();

  // Crypto Hooks
  const { data: walletClient } = useWalletClient();
  const { signNullifierMessage } = useNullifierContext();
  const chainId = useChainId();

  // Dialog / Form State
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSigning, setIsSigning] = useState(false);

  const submit = useCallback(async () => {
    setIsSigning(true)
    setErrorMessage(null);
    try {
      if (!supabase) {
        throw "Error intializing Supabase client.";
      }

      // Retrieve address (self)
      const { data: self, error: addressError } = await supabase
        .from("addresses")
        .select()
        .single();
      if (!self || addressError) {
        throw (
          "Error retrieving user address. " +
          (addressError ? addressError.message : "")
        );
      }

      // Retrieve zkShield account address
      const { data: account, error: accountError } = await supabase
        .from("shield_accounts")
        .select()
        .eq("id", userOp.shield_account_id)
        .single();
      if (!account || accountError) {
        throw (
          "Error retrieving zkShield account. " +
          (accountError ? accountError.message : "")
        );
      }

      // Retrieve path
      const { data: association, error: pathError } = await supabase
        .from("shield_account_addresses")
        .select("path")
        .eq("shield_account_id", userOp.shield_account_id)
        .eq("address", self.address)
        .single();
      if (!association || pathError) {
        throw (
          "Error retrieving signer path. " +
          (pathError ? pathError.message : "")
        );
      }
      if (association?.path === null) {
        throw "Signer path is null.";
      }
      const pathIndices = (association.path as { pathIndices: string[] })[
        "pathIndices"
      ];
      const siblings = (association.path as { siblings: string[][] })[
        "siblings"
      ];

      // Retrieve entryPoint address
      const entryPointAddress = await readContract({
        abi: shieldAccountABI,
        address: account.address as Hex,
        functionName: "entryPoint",
      });

      // Retrieve userOp hash
      const userOpHash = getUserOpHash(
        userOp.data as unknown as UserOperation,
        entryPointAddress,
        BigInt(chainId)
      ) as Hex;

      // Sign user operation hash
      const signedUserOp = await walletClient?.signMessage({
        // @ts-ignore
        message: { raw: hexToBytes(userOpHash) },
      });
      if (!signedUserOp) {
        throw "Error signing user operation.";
      }

      const messageHash = hexToBytes(
        // @ts-ignore
        hashMessage({ raw: hexToBytes(userOpHash) })
      );

      const { secret } = await signNullifierMessage();

      // @ts-ignore
      const proof = await createSignatureProof(
        messageHash,
        signedUserOp,
        secret,
        pathIndices,
        siblings
      );

      // Submit signed user operation
      const { data: userOpSignature, error: userOpSignatureError } =
        await supabase
          .from("shield_account_user_op_signatures")
          .insert({
            user_op_id: userOp.id,
            signer: self.address,
            proof: proof,
          })
          .select()
          .single();

      if (!userOpSignature || userOpSignatureError) {
        throw (
          "Error creating user op signature. " +
          (userOpSignatureError ? userOpSignatureError.message : "")
        );
      }

      toast({
        title: "User operation successfully signed!",
      });
      setOpen(false);
    } catch (e) {
      setErrorMessage(e as string);
    }
  }, [
    supabase,
    walletClient,
    setErrorMessage,
    setOpen,
    toast,
    userOp,
    chainId,
    signNullifierMessage,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-md px-6 mr-2">
          Sign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sign User Operation</DialogTitle>
          <DialogDescription>
            Sign the following user operation:
          </DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm">
            {errorMessage + ". Please try again."}
          </div>
        )}
        <DialogFooter>
          <Button disabled={isSigning} onClick={() => submit().finally(() => setIsSigning(false))}>
            {isSigning ? 'Signing...' : 'Sign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
