/// Code from: https://github.com/Marcosfitzsimons/multi-step-form/blob/15eb077bebb80ce60827ffcd7b29065c95010aa2/app/page.tsx#
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { AnimatePresence } from "framer-motion";
import ProverForm from "@/components/ProverForm";
import SignatureForm from "@/components/NullifierForm";
import SignInForm from "@/components/SignInForm";
import UserOpForm from "@/components/UserOpForm";
import SuccessMessage from "@/components/SuccessMessage";
import SideBar from "@/components/SideBar";
import { secp256k1 } from '@noble/curves/secp256k1'
import * as utils from "@noble/curves/abstract/utils"
import { generateInputs } from '@/utils/generateInputs';
import { Proof, generateCommitProof } from '@/services/snark';
import { useAccount, useSignMessage } from 'wagmi';
import { UserOperation, executeTransactionData, personalUserOpHash } from 'common';

export type CallData = {
  target: `0x${string}`;
  value: bigint;
  payload: `0x${string}`;
  delegate: boolean;
};

export type FormItems = Omit<UserOperation, "callData"> & {
  callData: CallData;
  nullifier?: string;
  proof?: Proof;
  publicSignals?: string[];
}

export const initialValues: FormItems = {
  sender: `0x2a9e8fa175F45b235efDdD97d2727741EF4Eee63`,
  nonce: 0n,
  callData: {
    target: `0x1111111111111111111111111111111111111111`,
    value: 1_000_000_000n,
    payload: `0x`,
    delegate: false
  },
  initCode: `0x`,
  callGasLimit: 100_000n,
  verificationGasLimit: 2_000_000n,
  preVerificationGas: 21_000n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  paymasterAndData: `0x`,
  signature: `0x`
};

export const message = "Please sign the following in your wallet.";

export default function Home() {
  const { address } = useAccount();
  const [messageHash, setMessageHash] = useState<Uint8Array>(new TextEncoder().encode(message));
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    previousStep,
    nextStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    goTo,
    showSuccessMsg,
  } = useMultiStepForm(4);
  const { signMessageAsync } = useSignMessage({ message: messageHash });

  // Initial run to test proof generation and warm up the prover wasm.
  useEffect(() => {
    const testProof = async () => {
      const inputs = await generateInputs();
      const commitProof = await generateCommitProof(inputs)
      const { proof, publicSignals } = commitProof
      console.log({ proof, publicSignals })
    }
    testProof()
  }, [])

  const handleHash = async () => {
    const { callData, proof: _, publicSignals: __, ...userOp } = formData;
    const refinedUserOp = { callData: executeTransactionData(callData), ...userOp };

    const hashed = personalUserOpHash(
      refinedUserOp,
      `0xFefC6BAF87cF3684058D62Da40Ff3A795946Ab06`,
      31337n
    )
    const messageHash = utils.hexToBytes(hashed.slice(2))
    setMessageHash(messageHash)
  }

  const handleProve = async () => { 
    const { callData, proof: _, publicSignals: __, ...userOp } = formData;
    const refinedUserOp = { callData: executeTransactionData(callData), ...userOp };
    // const signature = await signMessageAsync()
    /// first byte is v - 27 or 28, which is not part of the signature, hence slice(4)
    const signatureBytes = utils.hexToBytes(formData.signature.slice(4))
    const sig = secp256k1.Signature.fromCompact(signatureBytes)
    const input = await generateInputs(refinedUserOp, address, messageHash, sig);
    const commitProof = await generateCommitProof(input)
    console.log('proving...')
    const { proof, publicSignals } = commitProof;
    console.log('proof completed !')
    console.log(proof)
    console.log(publicSignals)
    setFormData({ proof, publicSignals, ...formData})
  }

  async function updateForm(fieldToUpdate: Partial<FormItems>) {
    const { callGasLimit, signature, maxPriorityFeePerGas } = fieldToUpdate;

    if (callGasLimit && callGasLimit > 50_000n) {
      setErrors((prevState) => ({
        ...prevState,
        callGasLimit: "CallGasLimit should be at least 50,000 gwei.",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        callGasLimit: "",
      }));
    }

    if (signature && !/^0x[0-9a-fA-F]/.test(signature)) {
      setErrors((prevState) => ({
        ...prevState,
        signature: "Please enter a valid signature",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        signature: "",
      }));
    }

    if (maxPriorityFeePerGas && maxPriorityFeePerGas < 10_000n) {
      setErrors((prevState) => ({
        ...prevState,
        maxPriorityFeePerGas: "MaxPriorityFeePerGas should be less than 10,000 gwei.",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        maxPriorityFeePerGas: "",
      }));
    }

    setFormData({ ...formData, ...fieldToUpdate });
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Don't go to next step if there are errors
    if (Object.values(errors).some((error) => error)) {
      console.error(errors)
      return;
    }
    // Don't go to next step if user is not connected to wallet
    if (isFirstStep && !address) {
      return;
    }
    // Don't go to next step if user has not set nullifier
    if (currentStepIndex === 1 && !formData.nullifier) { 
      // Sign message
      const message = await signMessageAsync();
      if (message) {
        updateForm({ nullifier: message });
      }
      return;
    }
    // Don't go to next step if user has not signed message
    if (currentStepIndex === 2) { 
      await handleHash()
    }
    // Don't go to next step if user has not generated proof
    if (isLastStep && !formData.proof && !formData.publicSignals) {
      if (formData.signature === initialValues.signature) {
        // Sign message
        const message = await signMessageAsync();
        if (message) {
          updateForm({ signature: message });
        }
      } else {
        await handleProve();
      }
      return;
    }
    nextStep();
  };

  return (
    <div
      className={`flex justify-between ${
        currentStepIndex === 1 ? "h-[600px] md:h-[500px]" : "h-[500px]"
      } w-11/12 max-w-4xl relative m-1 rounded-lg border border-neutral-700 bg-[#262626] p-4`}
    >
      {!showSuccessMsg ? (
        <SideBar currentStepIndex={currentStepIndex} goTo={goTo} />
      ) : (
        ""
      )}
      <main
        className={`${showSuccessMsg ? "w-full" : "w-full md:mt-5 md:w-[65%]"}`}
      >
        {showSuccessMsg ? (
          <AnimatePresence mode="wait">
            <SuccessMessage />
          </AnimatePresence>
        ) : (
          <form
            onSubmit={handleOnSubmit}
            className="w-full flex flex-col justify-between h-full"
          >
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && (
                <SignInForm
                  key="step1"
                />
              )}
              {currentStepIndex === 1 && (
                <SignatureForm key="step2" 
                  {...formData}
                />
              )}
              {currentStepIndex === 2 && (
                <UserOpForm key="step3"
                  {...formData}
                  updateForm={updateForm}
                  errors={errors}
                />
              )}
              {currentStepIndex === 3 && (
                <ProverForm key="step4" 
                  {...formData}
                />
              )}
            </AnimatePresence>
            <div className="w-full items-center flex justify-between">
              <div className="">
                <Button
                  onClick={previousStep}
                  type="button"
                  variant="ghost"
                  className={`${
                    isFirstStep
                      ? "invisible"
                      : "visible p-0 text-neutral-200 hover:text-white"
                  }`}
                >
                  Go Back
                </Button>
              </div>
              <div className="flex items-center">
                <div className="relative after:pointer-events-none after:absolute after:inset-px after:rounded-[11px] after:shadow-highlight after:shadow-white/10 focus-within:after:shadow-[#77f6aa] after:transition">
                  <Button
                    type="submit"
                    className="relative text-neutral-200 bg-neutral-900 border border-black/20 shadow-input shadow-black/10 rounded-xl hover:text-white"
                  >
                    {isLastStep && formData.proof && formData.publicSignals ? "Confirm" : "Next Step"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
