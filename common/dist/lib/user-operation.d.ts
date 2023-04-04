import { UserOperation } from './types';
export declare const DefaultsForUserOp: UserOperation;
export declare const packUserOp: (op: UserOperation) => `0x${string}`;
export declare const getUserOpHash: (op: UserOperation, entryPoint: `0x${string}`, chainId: bigint) => string;
export declare const personalUserOpHash: (op: UserOperation, entryPoint: `0x${string}`, chainId: bigint) => string;
//# sourceMappingURL=user-operation.d.ts.map