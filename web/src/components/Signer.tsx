'use client';

import { generateInputs } from '@/utils/generateInputs';
import React, { useState, FormEvent, useEffect } from 'react';
import * as utils from "@noble/curves/abstract/utils"
import { useAccount, useSignMessage } from 'wagmi';
import { generateCommitProof } from '@/services/snark';
import { UserOperation, executeTransactionData, personalUserOpHash } from 'common';
import { secp256k1 } from '@noble/curves/secp256k1'

export default function Signer() {
  const { address } = useAccount();
  const [ msgHash, setMsgHash ] = useState<Uint8Array>()
  const { signMessageAsync } = useSignMessage({ message: msgHash })

  const userOp: UserOperation = {
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
  // useEffect(() => {
  //   const testProof = async () => {
  //     const inputs = await generateInputs();
  //     const commitProof = await generateCommitProof(inputs)
  //     const { proof, publicSignals } = commitProof
  //     console.log(proof)
  //     console.log(publicSignals)
  //   }
  //   testProof()
  // }, [])

  const handleSign = () => {
    const hashed = personalUserOpHash(
      userOp,
      `0xFefC6BAF87cF3684058D62Da40Ff3A795946Ab06`,
      31337n
    )
    const messageHash = utils.hexToBytes(hashed.slice(2))
    setMsgHash(messageHash)
  };

  const handleProve = async () => { 
    const signature = await signMessageAsync()
    /// first byte is v - 27 or 28, which is not part of the signature, hence slice(4)
    const signatureBytes = utils.hexToBytes(signature.slice(4))
    console.log(signatureBytes)
    const sig = secp256k1.Signature.fromCompact(signatureBytes)
    const input = await generateInputs(userOp, address, msgHash, sig);
    const commitProof = await generateCommitProof(input)
    const { proof, publicSignals } = commitProof;
    console.log(proof)
    console.log(publicSignals)
  }

  return (
    <div className="flex flex-col container">
      <h1>{msgHash}</h1>
      <button onClick={handleSign}>Sign</button>
      <button onClick={handleProve}>Prove</button>
    </div>
  );
}
