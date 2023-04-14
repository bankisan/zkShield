import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree';
import { ProjPointType } from '@noble/curves/abstract/weierstrass';
import { SignatureProof, Transaction } from './types';
export declare const nullifierMessage = "Signing this message keeps your account hidden\n\nDo not sign this message outside the domain of zkshield.io";
export declare const REGISTERS = 4n;
export declare const STRIDE = 8n;
export declare const NUM_STRIDES: bigint;
export declare const encodeSignature: (proofs: SignatureProof[]) => `0x${string}`;
export declare const toHex: (value: bigint) => string;
export declare const toBigInts: (input: string[]) => bigint[];
export declare const splitToRegisters: (value: bigint) => bigint[];
export declare const calculatePrecomputes: (point: ProjPointType<bigint>) => bigint[][][][];
export declare const hasher: (inputs: bigint[]) => Promise<bigint>;
export declare const createTree: (depth: number, zeroValue: bigint, arity?: number) => Promise<IncrementalMerkleTree>;
export declare const executeTransactionData: (tx: Transaction) => `0x${string}`;
export declare const publicKeyToAddress: (publicKey: Uint8Array) => string;
//# sourceMappingURL=signature-proof.d.ts.map