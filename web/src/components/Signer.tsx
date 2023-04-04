'use client';

import { generateInputs } from '@/utils/generateTestInputs';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSigner } from 'wagmi';
import { generateCommitProof } from '@/services/snark';
import { UserOperation, executeTransactionData } from 'common';

export default function Signer() {
  const { data: signer } = useSigner()

  useEffect(() => {
    const testProof = async () => {
      const inputs = await generateInputs();
      const commitProof = await generateCommitProof(inputs)
      const { proof, publicSignals } = commitProof
      console.log(proof)
      console.log(publicSignals)
    }
    testProof()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userOps: UserOperation = {
      sender: `0x2a9e8fa175F45b235efDdD97d2727741EF4Eee63`,
      nonce: 0n,
      initCode: `0x`,
      callData: executeTransactionData({
        target: `0x1111111111111111111111111111111111111111`,
        value: 1_000_000_000n,
        payload: `0x`,
        delegate: false
      }),
      callGasLimit: 100_000n,
      verificationGasLimit: 2_000_000n,
      preVerificationGas: 21_000n,
      maxFeePerGas: 0n,
      maxPriorityFeePerGas: 0n,
      paymasterAndData: `0x`,
      signature: `0x`
    }
    const input = await generateInputs(userOps);
    const commitProof = await generateCommitProof(input)
    const { proof, publicSignals } = commitProof;
    console.log(proof)
    console.log(publicSignals)
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
