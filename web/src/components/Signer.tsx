'use client';

import { generateTestInputs } from '@/utils/generateTestInputs';
// import { generateCommitProof } from '@/services/snark'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSigner } from 'wagmi';
import { buildPoseidon } from 'circomlibjs';
import { generateCommitProof } from '@/services/snark';

// generateTestInputs();

export default function Signer() {
  const { data: signer } = useSigner()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitted:');
    const inputes = await generateTestInputs();
    const commitProof = await generateCommitProof(inputes)
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
