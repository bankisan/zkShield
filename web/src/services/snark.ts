import { VERIFY_SIGNATURE_WASM_PATH, VERIFY_SIGNATURE_ZKEY_PATH } from '@/config'

/// Input for the snarkjs proof generation (in utils)
export interface Input {
    s: bigint[];
    TPreComputes: bigint[][][][];
    U: bigint[][];
    secret: bigint;
    pathIndices: any[];
    siblings: string[][];
}

/// Proof output from the snarkjs proof generation
export interface Proof {
  pi_a: [string, string, string]
  pi_b: [[string, string], [string, string]]
  pi_c: [string, string]
  r_inv: string
  r: [string, string]
  t: [string, string]
  u: [string, string]
  sTHash: string,
  nullifier: string
}

/// SnarkJS interface
export interface SnarkJS {
  groth16: {
    fullProve(
      input: Record<string, string | string[] | string[][]| string[][][][]>,
      wasmPath: string,
      zkeyPath: string,
    ): Promise<{ publicSignals: string[]; proof: Proof }>

    verify(
      verificationKey: {},
      publicSignals: string[],
      proof: Proof,
    ): Promise<boolean>
  }
}

/// Fetches the wasm and zkey files + imports snarkjs
const { groth16 }: SnarkJS = require('snarkjs')

/// Converts bigint to string for snarkjs
type ConvertedInput = Record<string, string | string[] | string[][] | string[][][][]>;
const convertInput = (input: Input): ConvertedInput => {
  return {
    s: input.s.map(String),
    TPreComputes: input.TPreComputes.map(a => a.map(b => b.map(c => c.map(String)))),
    U: input.U.map(a => a.map(String)),
    secret: input.secret.toString(),
    pathIndices: input.pathIndices.map(String),
    siblings: input.siblings.map(String),
  };
};

/// Generates a snarkjs proof
export const generateCommitProof = async (
  input: Input
) => {
  await Promise.all([
    fetch(VERIFY_SIGNATURE_WASM_PATH),
    fetch(VERIFY_SIGNATURE_ZKEY_PATH)
  ])
  const { s, TPreComputes, U, secret, pathIndices, siblings } = convertInput(input);

  return groth16.fullProve(
    { s, TPreComputes, U, secret, pathIndices, siblings },
    VERIFY_SIGNATURE_WASM_PATH,
    VERIFY_SIGNATURE_ZKEY_PATH,
  )
}
