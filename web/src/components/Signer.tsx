'use client';

import { generateTestInputs } from '@/utils/generateTestInputs';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { generateCommitProof } from '@/services/snark';

export default function Signer() {
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
