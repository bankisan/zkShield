# zkShield

```
  |`-._/\_.-`|
  |    ||    |
  |____||____|      zkShield
  |__________|       Private multisig with hidden owners
  \    ||    /
   \   ||   /
     '.||.'
```

**zkShield** is a private multisig that uses zero-knowledge proofs and account abstraction (ERC-4337) to hide the account owners. Owners create a `ShieldAccount` multisig using existing wallets (i.e. Metamask, Rainbow, etc.) but, on-chain, their addresses and access will be hidden from the public. Once deployed, owners will be able to privately define member access, rotate owner keys, and execute m-of-n threshold transactions.

**Current status:** 🛠 In development 🛠

### How does it work?

zkShield uses a combination of zero-knowledge proofs and account abstraction (ERC-4337) to hide the account owners. Specifically, the multisig account verifies a proof that a valid threshold of account members has signed an ECDSA signature of a `UserOperation`. With ERC-4337, the `UserOperation` including the proof signature are sent to a bundler without exposing any account member.

Here's a breakdown of the different techniques and technologies used to achieve this:

**Circom Circuits**

- https://github.com/iden3/circom

**Efficient zkECDSA**

- https://personaelabs.org/posts/efficient-ecdsa-1/

**Account Abstraction (ERC-4337)**

- https://eips.ethereum.org/EIPS/eip-4337

### Roadmap

- [ ] Expanded documentation on setup and testing
- [ ] Account abstraction improvements
  - [x] Factory contract that deploys the account
  - [ ] Improved gas estimations
  - [ ] ERC-1271 signature
  - [x] Account can receive ERC-721, ERC-1155, and ERC-777 tokens
- [ ] Frontend UI to create and manage a ShieldAccount
- [ ] Deploy to testnets
- [ ] Deploy to mainnets

### FAQs

##### Can I use this right now?

We're still in development and don't currently recommend deploying on mainnet. There is one key piece to the verification missing that is still required to achieve a robust signature scheme. DM on [Twitter](https://twitter.com/0xbankisan) if you can figure out what's being intentionally left out and why it's required 😉.

##### What are the gas costs?

Currently, gas costs for verification currently scale linearly with the amount of signers in the multisig. Eventually, we hope to implement recursive zkSNARKs to keep the same gas price regardless of the amount of signers.

##### How can I help?

We're looking for frontend / fullstack help to implement the frontend interface. Reach out on [Twitter](https://twitter.com/0xbankisan) and let's chat!

### Support

This project is supported by a [grant](https://blog.ethereum.org/2023/02/14/layer-2-grants-roundup) from the Ethereum Foundation's PSE group.

_Shield ascii adapted from [asciiart](https://www.asciiart.eu/weapons/shields)_
