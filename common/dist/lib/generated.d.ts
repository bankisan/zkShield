export declare const baseAccountABI: readonly [{
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "entryPoint";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "contract IEntryPoint";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "nonce";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "missingAccountFunds";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "validateUserOp";
    readonly outputs: readonly [{
        readonly name: "validationData";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}];
export declare const erc1967FactoryABI: readonly [{
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "DeploymentFailed";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "SaltDoesNotStartWithCaller";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "UpgradeFailed";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }];
    readonly name: "AdminChanged";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }];
    readonly name: "Deployed";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }];
    readonly name: "Upgraded";
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "adminOf";
    readonly outputs: readonly [{
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "changeAdmin";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "deploy";
    readonly outputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "data";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "deployAndCall";
    readonly outputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "salt";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
    readonly name: "deployDeterministic";
    readonly outputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "admin";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "salt";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "data";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "deployDeterministicAndCall";
    readonly outputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "initCodeHash";
    readonly outputs: readonly [{
        readonly name: "result";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "salt";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
    readonly name: "predictDeterministicAddress";
    readonly outputs: readonly [{
        readonly name: "predicted";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "upgrade";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "proxy";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "implementation";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "data";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "upgradeAndCall";
    readonly outputs: readonly [];
}];
export declare const devDeployABI: readonly [{
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "IS_SCRIPT";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bool";
        readonly type: "bool";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "run";
    readonly outputs: readonly [];
}];
export declare const entryPointABI: readonly [{
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "preOpGas";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "paid";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "validAfter";
        readonly internalType: "uint48";
        readonly type: "uint48";
    }, {
        readonly name: "validUntil";
        readonly internalType: "uint48";
        readonly type: "uint48";
    }, {
        readonly name: "targetSuccess";
        readonly internalType: "bool";
        readonly type: "bool";
    }, {
        readonly name: "targetResult";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "ExecutionResult";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "opIndex";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "reason";
        readonly internalType: "string";
        readonly type: "string";
    }];
    readonly name: "FailedOp";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "SenderAddressResult";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "aggregator";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "SignatureValidationFailed";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "returnInfo";
        readonly internalType: "struct IEntryPoint.ReturnInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "preOpGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "prefund";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "sigFailed";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "validAfter";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "validUntil";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "paymasterContext";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "senderInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "factoryInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "paymasterInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }];
    readonly name: "ValidationResult";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "returnInfo";
        readonly internalType: "struct IEntryPoint.ReturnInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "preOpGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "prefund";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "sigFailed";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "validAfter";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "validUntil";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "paymasterContext";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "senderInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "factoryInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "paymasterInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "aggregatorInfo";
        readonly internalType: "struct IEntryPoint.AggregatorStakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "aggregator";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "stakeInfo";
            readonly internalType: "struct IStakeManager.StakeInfo";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "stake";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "unstakeDelaySec";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }];
        }];
    }];
    readonly name: "ValidationResultWithAggregation";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "factory";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "paymaster";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }];
    readonly name: "AccountDeployed";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalDeposit";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Deposited";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "aggregator";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }];
    readonly name: "SignatureAggregatorChanged";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalStaked";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeLocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawTime";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeUnlocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeWithdrawn";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "paymaster";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "nonce";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "success";
        readonly internalType: "bool";
        readonly type: "bool";
        readonly indexed: false;
    }, {
        readonly name: "actualGasCost";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "actualGasUsed";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "UserOperationEvent";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "nonce";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "revertReason";
        readonly internalType: "bytes";
        readonly type: "bytes";
        readonly indexed: false;
    }];
    readonly name: "UserOperationRevertReason";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Withdrawn";
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "SIG_VALIDATION_FAILED";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "initCode";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "paymasterAndData";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "_validateSenderAndPaymaster";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint32";
        readonly type: "uint32";
    }];
    readonly name: "addStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "depositTo";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "deposits";
    readonly outputs: readonly [{
        readonly name: "deposit";
        readonly internalType: "uint112";
        readonly type: "uint112";
    }, {
        readonly name: "staked";
        readonly internalType: "bool";
        readonly type: "bool";
    }, {
        readonly name: "stake";
        readonly internalType: "uint112";
        readonly type: "uint112";
    }, {
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint32";
        readonly type: "uint32";
    }, {
        readonly name: "withdrawTime";
        readonly internalType: "uint48";
        readonly type: "uint48";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "getDepositInfo";
    readonly outputs: readonly [{
        readonly name: "info";
        readonly internalType: "struct IStakeManager.DepositInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "deposit";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "staked";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "stake";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint32";
            readonly type: "uint32";
        }, {
            readonly name: "withdrawTime";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }];
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "initCode";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "getSenderAddress";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "getUserOpHash";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "opsPerAggregator";
        readonly internalType: "struct IEntryPoint.UserOpsPerAggregator[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "userOps";
            readonly internalType: "struct UserOperation[]";
            readonly type: "tuple[]";
            readonly components: readonly [{
                readonly name: "sender";
                readonly internalType: "address";
                readonly type: "address";
            }, {
                readonly name: "nonce";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "initCode";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }, {
                readonly name: "callData";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }, {
                readonly name: "callGasLimit";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "verificationGasLimit";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "preVerificationGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "maxFeePerGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "maxPriorityFeePerGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "paymasterAndData";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }, {
                readonly name: "signature";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }];
        }, {
            readonly name: "aggregator";
            readonly internalType: "contract IAggregator";
            readonly type: "address";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "beneficiary";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "handleAggregatedOps";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "ops";
        readonly internalType: "struct UserOperation[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "beneficiary";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "handleOps";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "callData";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "opInfo";
        readonly internalType: "struct EntryPoint.UserOpInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "mUserOp";
            readonly internalType: "struct EntryPoint.MemoryUserOp";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "sender";
                readonly internalType: "address";
                readonly type: "address";
            }, {
                readonly name: "nonce";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "callGasLimit";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "verificationGasLimit";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "preVerificationGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "paymaster";
                readonly internalType: "address";
                readonly type: "address";
            }, {
                readonly name: "maxFeePerGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "maxPriorityFeePerGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }];
        }, {
            readonly name: "userOpHash";
            readonly internalType: "bytes32";
            readonly type: "bytes32";
        }, {
            readonly name: "prefund";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "contextOffset";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preOpGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "context";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "innerHandleOp";
    readonly outputs: readonly [{
        readonly name: "actualGasCost";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "op";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "target";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "targetCallData";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "simulateHandleOp";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "simulateValidation";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "unlockStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "withdrawStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }, {
        readonly name: "withdrawAmount";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "withdrawTo";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
export declare const iAccountABI: readonly [{
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "missingAccountFunds";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "validateUserOp";
    readonly outputs: readonly [{
        readonly name: "validationData";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}];
export declare const iEntryPointABI: readonly [{
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "preOpGas";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "paid";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "validAfter";
        readonly internalType: "uint48";
        readonly type: "uint48";
    }, {
        readonly name: "validUntil";
        readonly internalType: "uint48";
        readonly type: "uint48";
    }, {
        readonly name: "targetSuccess";
        readonly internalType: "bool";
        readonly type: "bool";
    }, {
        readonly name: "targetResult";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "ExecutionResult";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "opIndex";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "reason";
        readonly internalType: "string";
        readonly type: "string";
    }];
    readonly name: "FailedOp";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "SenderAddressResult";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "aggregator";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "SignatureValidationFailed";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "returnInfo";
        readonly internalType: "struct IEntryPoint.ReturnInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "preOpGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "prefund";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "sigFailed";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "validAfter";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "validUntil";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "paymasterContext";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "senderInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "factoryInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "paymasterInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }];
    readonly name: "ValidationResult";
}, {
    readonly type: "error";
    readonly inputs: readonly [{
        readonly name: "returnInfo";
        readonly internalType: "struct IEntryPoint.ReturnInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "preOpGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "prefund";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "sigFailed";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "validAfter";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "validUntil";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }, {
            readonly name: "paymasterContext";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "senderInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "factoryInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "paymasterInfo";
        readonly internalType: "struct IStakeManager.StakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "stake";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "aggregatorInfo";
        readonly internalType: "struct IEntryPoint.AggregatorStakeInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "aggregator";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "stakeInfo";
            readonly internalType: "struct IStakeManager.StakeInfo";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "stake";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "unstakeDelaySec";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }];
        }];
    }];
    readonly name: "ValidationResultWithAggregation";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "factory";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "paymaster";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }];
    readonly name: "AccountDeployed";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalDeposit";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Deposited";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "aggregator";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }];
    readonly name: "SignatureAggregatorChanged";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalStaked";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeLocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawTime";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeUnlocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeWithdrawn";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "paymaster";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "nonce";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "success";
        readonly internalType: "bool";
        readonly type: "bool";
        readonly indexed: false;
    }, {
        readonly name: "actualGasCost";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "actualGasUsed";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "UserOperationEvent";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "nonce";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "revertReason";
        readonly internalType: "bytes";
        readonly type: "bytes";
        readonly indexed: false;
    }];
    readonly name: "UserOperationRevertReason";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Withdrawn";
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "_unstakeDelaySec";
        readonly internalType: "uint32";
        readonly type: "uint32";
    }];
    readonly name: "addStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "depositTo";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "getDepositInfo";
    readonly outputs: readonly [{
        readonly name: "info";
        readonly internalType: "struct IStakeManager.DepositInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "deposit";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "staked";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "stake";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint32";
            readonly type: "uint32";
        }, {
            readonly name: "withdrawTime";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }];
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "initCode";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "getSenderAddress";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "getUserOpHash";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "opsPerAggregator";
        readonly internalType: "struct IEntryPoint.UserOpsPerAggregator[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "userOps";
            readonly internalType: "struct UserOperation[]";
            readonly type: "tuple[]";
            readonly components: readonly [{
                readonly name: "sender";
                readonly internalType: "address";
                readonly type: "address";
            }, {
                readonly name: "nonce";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "initCode";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }, {
                readonly name: "callData";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }, {
                readonly name: "callGasLimit";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "verificationGasLimit";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "preVerificationGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "maxFeePerGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "maxPriorityFeePerGas";
                readonly internalType: "uint256";
                readonly type: "uint256";
            }, {
                readonly name: "paymasterAndData";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }, {
                readonly name: "signature";
                readonly internalType: "bytes";
                readonly type: "bytes";
            }];
        }, {
            readonly name: "aggregator";
            readonly internalType: "contract IAggregator";
            readonly type: "address";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "beneficiary";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "handleAggregatedOps";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "ops";
        readonly internalType: "struct UserOperation[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "beneficiary";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "handleOps";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "op";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "target";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "targetCallData";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "simulateHandleOp";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "simulateValidation";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "unlockStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "withdrawStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }, {
        readonly name: "withdrawAmount";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "withdrawTo";
    readonly outputs: readonly [];
}];
export declare const iAggregatorABI: readonly [{
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOps";
        readonly internalType: "struct UserOperation[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "aggregateSignatures";
    readonly outputs: readonly [{
        readonly name: "aggregatedSignature";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOps";
        readonly internalType: "struct UserOperation[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "signature";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "validateSignatures";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "validateUserOpSignature";
    readonly outputs: readonly [{
        readonly name: "sigForUserOp";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
}];
export declare const iMulticall3ABI: readonly [{
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "calls";
        readonly internalType: "struct IMulticall3.Call[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "aggregate";
    readonly outputs: readonly [{
        readonly name: "blockNumber";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "returnData";
        readonly internalType: "bytes[]";
        readonly type: "bytes[]";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "calls";
        readonly internalType: "struct IMulticall3.Call3[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "allowFailure";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "aggregate3";
    readonly outputs: readonly [{
        readonly name: "returnData";
        readonly internalType: "struct IMulticall3.Result[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "success";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "calls";
        readonly internalType: "struct IMulticall3.Call3Value[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "allowFailure";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "value";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "aggregate3Value";
    readonly outputs: readonly [{
        readonly name: "returnData";
        readonly internalType: "struct IMulticall3.Result[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "success";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "calls";
        readonly internalType: "struct IMulticall3.Call[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "blockAndAggregate";
    readonly outputs: readonly [{
        readonly name: "blockNumber";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "blockHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "returnData";
        readonly internalType: "struct IMulticall3.Result[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "success";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getBasefee";
    readonly outputs: readonly [{
        readonly name: "basefee";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "blockNumber";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "getBlockHash";
    readonly outputs: readonly [{
        readonly name: "blockHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getBlockNumber";
    readonly outputs: readonly [{
        readonly name: "blockNumber";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getChainId";
    readonly outputs: readonly [{
        readonly name: "chainid";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getCurrentBlockCoinbase";
    readonly outputs: readonly [{
        readonly name: "coinbase";
        readonly internalType: "address";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getCurrentBlockDifficulty";
    readonly outputs: readonly [{
        readonly name: "difficulty";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getCurrentBlockGasLimit";
    readonly outputs: readonly [{
        readonly name: "gaslimit";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getCurrentBlockTimestamp";
    readonly outputs: readonly [{
        readonly name: "timestamp";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "addr";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "getEthBalance";
    readonly outputs: readonly [{
        readonly name: "balance";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "getLastBlockHash";
    readonly outputs: readonly [{
        readonly name: "blockHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "requireSuccess";
        readonly internalType: "bool";
        readonly type: "bool";
    }, {
        readonly name: "calls";
        readonly internalType: "struct IMulticall3.Call[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "tryAggregate";
    readonly outputs: readonly [{
        readonly name: "returnData";
        readonly internalType: "struct IMulticall3.Result[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "success";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "requireSuccess";
        readonly internalType: "bool";
        readonly type: "bool";
    }, {
        readonly name: "calls";
        readonly internalType: "struct IMulticall3.Call[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
    readonly name: "tryBlockAndAggregate";
    readonly outputs: readonly [{
        readonly name: "blockNumber";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "blockHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "returnData";
        readonly internalType: "struct IMulticall3.Result[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "success";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }];
}];
export declare const iPaymasterABI: readonly [{
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "mode";
        readonly internalType: "enum IPaymaster.PostOpMode";
        readonly type: "uint8";
    }, {
        readonly name: "context";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "actualGasCost";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "postOp";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "maxCost";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "validatePaymasterUserOp";
    readonly outputs: readonly [{
        readonly name: "context";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "validationData";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}];
export declare const multiTokenReceiverABI: readonly [{
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256[]";
        readonly type: "uint256[]";
    }, {
        readonly name: "";
        readonly internalType: "uint256[]";
        readonly type: "uint256[]";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "onERC1155BatchReceived";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes4";
        readonly type: "bytes4";
    }];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "onERC1155Received";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes4";
        readonly type: "bytes4";
    }];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "onERC721Received";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes4";
        readonly type: "bytes4";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "tokensReceived";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
export declare const iStakeManagerABI: readonly [{
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalDeposit";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Deposited";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalStaked";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeLocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawTime";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeUnlocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeWithdrawn";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Withdrawn";
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "_unstakeDelaySec";
        readonly internalType: "uint32";
        readonly type: "uint32";
    }];
    readonly name: "addStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "depositTo";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "getDepositInfo";
    readonly outputs: readonly [{
        readonly name: "info";
        readonly internalType: "struct IStakeManager.DepositInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "deposit";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "staked";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "stake";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint32";
            readonly type: "uint32";
        }, {
            readonly name: "withdrawTime";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }];
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "unlockStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "withdrawStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }, {
        readonly name: "withdrawAmount";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "withdrawTo";
    readonly outputs: readonly [];
}];
export declare const senderCreatorABI: readonly [{
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "initCode";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "createSender";
    readonly outputs: readonly [{
        readonly name: "sender";
        readonly internalType: "address";
        readonly type: "address";
    }];
}];
export declare const shieldAccountABI: readonly [{
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "AlreadyInitialized";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "DuplicateSigner";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "InvalidNonce";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "InvalidSignature";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "RequiredSignersNotSatisfied";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "TransactionFailed";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "entryPoint";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "contract IEntryPoint";
        readonly type: "address";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "tx_";
        readonly internalType: "struct Transaction";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "target";
            readonly internalType: "address payable";
            readonly type: "address";
        }, {
            readonly name: "value";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "payload";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "delegate";
            readonly internalType: "bool";
            readonly type: "bool";
        }];
    }];
    readonly name: "execute";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "data";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "extractSignatureProofs";
    readonly outputs: readonly [{
        readonly name: "proofs";
        readonly internalType: "struct SignatureProof[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "a";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "b";
            readonly internalType: "uint256[2][2]";
            readonly type: "uint256[2][2]";
        }, {
            readonly name: "c";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "rInv";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "R";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "T";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "U";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "sTHash";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "nullifier";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "hash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
    readonly name: "getEthSignedMessageHash";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "__entryPoint";
        readonly internalType: "contract IEntryPoint";
        readonly type: "address";
    }, {
        readonly name: "_root";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "_requiredSigners";
        readonly internalType: "uint96";
        readonly type: "uint96";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "nonce";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256[]";
        readonly type: "uint256[]";
    }, {
        readonly name: "";
        readonly internalType: "uint256[]";
        readonly type: "uint256[]";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "onERC1155BatchReceived";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes4";
        readonly type: "bytes4";
    }];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "onERC1155Received";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes4";
        readonly type: "bytes4";
    }];
}, {
    readonly stateMutability: "pure";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "onERC721Received";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes4";
        readonly type: "bytes4";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "requiredSigners";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint96";
        readonly type: "uint96";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "root";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }, {
        readonly name: "";
        readonly internalType: "bytes";
        readonly type: "bytes";
    }];
    readonly name: "tokensReceived";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "_requiredSigners";
        readonly internalType: "uint96";
        readonly type: "uint96";
    }];
    readonly name: "updateRequiredSigners";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "_root";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
    readonly name: "updateRoot";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "userOp";
        readonly internalType: "struct UserOperation";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "sender";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "nonce";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "initCode";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "callGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "verificationGasLimit";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "preVerificationGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "maxPriorityFeePerGas";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "paymasterAndData";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }, {
            readonly name: "signature";
            readonly internalType: "bytes";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }, {
        readonly name: "missingAccountFunds";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "validateUserOp";
    readonly outputs: readonly [{
        readonly name: "validationData";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "proof";
        readonly internalType: "struct SignatureProof";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "a";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "b";
            readonly internalType: "uint256[2][2]";
            readonly type: "uint256[2][2]";
        }, {
            readonly name: "c";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "rInv";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "R";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "T";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "U";
            readonly internalType: "uint256[2]";
            readonly type: "uint256[2]";
        }, {
            readonly name: "sTHash";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }, {
            readonly name: "nullifier";
            readonly internalType: "uint256";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "userOpHash";
        readonly internalType: "bytes32";
        readonly type: "bytes32";
    }];
    readonly name: "verifyProof";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "bool";
        readonly type: "bool";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
export declare const shieldErrorsABI: readonly [{
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "AlreadyInitialized";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "DuplicateSigner";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "InvalidNonce";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "InvalidSignature";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "RequiredSignersNotSatisfied";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "TransactionFailed";
}, {
    readonly type: "error";
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
}];
export declare const stakeManagerABI: readonly [{
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalDeposit";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Deposited";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "totalStaked";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeLocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawTime";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeUnlocked";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "StakeWithdrawn";
}, {
    readonly type: "event";
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "withdrawAddress";
        readonly internalType: "address";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "amount";
        readonly internalType: "uint256";
        readonly type: "uint256";
        readonly indexed: false;
    }];
    readonly name: "Withdrawn";
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint32";
        readonly type: "uint32";
    }];
    readonly name: "addStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
}, {
    readonly stateMutability: "payable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "depositTo";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "deposits";
    readonly outputs: readonly [{
        readonly name: "deposit";
        readonly internalType: "uint112";
        readonly type: "uint112";
    }, {
        readonly name: "staked";
        readonly internalType: "bool";
        readonly type: "bool";
    }, {
        readonly name: "stake";
        readonly internalType: "uint112";
        readonly type: "uint112";
    }, {
        readonly name: "unstakeDelaySec";
        readonly internalType: "uint32";
        readonly type: "uint32";
    }, {
        readonly name: "withdrawTime";
        readonly internalType: "uint48";
        readonly type: "uint48";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly internalType: "address";
        readonly type: "address";
    }];
    readonly name: "getDepositInfo";
    readonly outputs: readonly [{
        readonly name: "info";
        readonly internalType: "struct IStakeManager.DepositInfo";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "deposit";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "staked";
            readonly internalType: "bool";
            readonly type: "bool";
        }, {
            readonly name: "stake";
            readonly internalType: "uint112";
            readonly type: "uint112";
        }, {
            readonly name: "unstakeDelaySec";
            readonly internalType: "uint32";
            readonly type: "uint32";
        }, {
            readonly name: "withdrawTime";
            readonly internalType: "uint48";
            readonly type: "uint48";
        }];
    }];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "unlockStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }];
    readonly name: "withdrawStake";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "withdrawAddress";
        readonly internalType: "address payable";
        readonly type: "address";
    }, {
        readonly name: "withdrawAmount";
        readonly internalType: "uint256";
        readonly type: "uint256";
    }];
    readonly name: "withdrawTo";
    readonly outputs: readonly [];
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
export declare const stdInvariantABI: readonly [{
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "excludeArtifacts";
    readonly outputs: readonly [{
        readonly name: "excludedArtifacts_";
        readonly internalType: "string[]";
        readonly type: "string[]";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "excludeContracts";
    readonly outputs: readonly [{
        readonly name: "excludedContracts_";
        readonly internalType: "address[]";
        readonly type: "address[]";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "excludeSenders";
    readonly outputs: readonly [{
        readonly name: "excludedSenders_";
        readonly internalType: "address[]";
        readonly type: "address[]";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "targetArtifactSelectors";
    readonly outputs: readonly [{
        readonly name: "targetedArtifactSelectors_";
        readonly internalType: "struct StdInvariant.FuzzSelector[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "addr";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "selectors";
            readonly internalType: "bytes4[]";
            readonly type: "bytes4[]";
        }];
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "targetArtifacts";
    readonly outputs: readonly [{
        readonly name: "targetedArtifacts_";
        readonly internalType: "string[]";
        readonly type: "string[]";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "targetContracts";
    readonly outputs: readonly [{
        readonly name: "targetedContracts_";
        readonly internalType: "address[]";
        readonly type: "address[]";
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "targetSelectors";
    readonly outputs: readonly [{
        readonly name: "targetedSelectors_";
        readonly internalType: "struct StdInvariant.FuzzSelector[]";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "addr";
            readonly internalType: "address";
            readonly type: "address";
        }, {
            readonly name: "selectors";
            readonly internalType: "bytes4[]";
            readonly type: "bytes4[]";
        }];
    }];
}, {
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [];
    readonly name: "targetSenders";
    readonly outputs: readonly [{
        readonly name: "targetedSenders_";
        readonly internalType: "address[]";
        readonly type: "address[]";
    }];
}];
export declare const validateSMultTVerifierABI: readonly [{
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "a";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "b";
        readonly internalType: "uint256[2][2]";
        readonly type: "uint256[2][2]";
    }, {
        readonly name: "c";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "input";
        readonly internalType: "uint256[9]";
        readonly type: "uint256[9]";
    }];
    readonly name: "verifyProof";
    readonly outputs: readonly [{
        readonly name: "r";
        readonly internalType: "bool";
        readonly type: "bool";
    }];
}];
export declare const verifySignatureVerifierABI: readonly [{
    readonly stateMutability: "view";
    readonly type: "function";
    readonly inputs: readonly [{
        readonly name: "a";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "b";
        readonly internalType: "uint256[2][2]";
        readonly type: "uint256[2][2]";
    }, {
        readonly name: "c";
        readonly internalType: "uint256[2]";
        readonly type: "uint256[2]";
    }, {
        readonly name: "input";
        readonly internalType: "uint256[11]";
        readonly type: "uint256[11]";
    }];
    readonly name: "verifyProof";
    readonly outputs: readonly [{
        readonly name: "r";
        readonly internalType: "bool";
        readonly type: "bool";
    }];
}];
//# sourceMappingURL=generated.d.ts.map