# The case for a private multisig

Multisigs provide a uniquely crypto-enabled approach to managing jointly owned accounts. The most well known multisig product is [Safe](https://safe.global/) where the total value locked (TVL) on mainnet accounts is [$53B USD](https://dune.com/queries/2893829/4821383) as of August 2023. Multisig accounts are great for storing assets and managing signing keys in several pivotal functions within the crypto ecosystem, including cross-chain bridging, DAO treasury management, and administrative control of other protocols.

While current multisigs are extremely helpful, a major issue with them is that they expose the underlying addresses of each signer in the multisig. Individual operators' accounts should not be doxxed by default. It should be a deliberate decision and should be the account's choice to make.

There are specific cases where multisig accounts may want to keep their individual signers private. For DAOs and other crypto institutions, exposed signers leads to a higher [chance of hacks](https://twitter.com/dedaub/status/1675516729349292032) as attackers know the exact addresses they need to compromise. For individuals who want to use social recovery mechanisms to recover their multisigs, guardians can collude to take over the account if they know who each other are. For companies, their employees' personal wallets might be signers which can lead to public leaks of personal account activity.

Luckily, we are at a point in time where it's possible to _upgrade_ a multisig's privacy layer without changing a user's underlying wallet tech. In this post, we will introduce zkShield: a private multisig on Ethereum that you can interact with using familiar wallets like Metamask, Rainbow, and others. **In this post, we will cover the current scheme that zkShield is using to add privacy to multisigs, and we'll outline some of the future improvements that we expect to see in the coming months and years.**

We will assume the reader has basic knowledge of smart contract programming and an introductory understanding of cryptography (hashes and signatures particularly). If not, you should still be able to read this post and just skip over the math parts. We will not go in depth with zero-knowledge proofs but will provide supplementary resources for the curious to dig in futher.

## Private Multisig Scheme

zkShield's signing scheme attempts to replicate the traditional multisig process as closely as possible. Crypto users are familiar with this pattern and the goal is to keep it as close as possible to the traditional patterns, but with privacy for signers. The process most multsig users will be familiar with is the following:

1. `N` Signers are added to the multisig by their account address with a value of `M` that corresponds to a threshold of `M <= N` signers
2. One of the signers pays for the onchain deployment of the multsig
3. A signer creates a draft transaction, `t`
4. `M` of `N` signers sign the transaction passing the threshold
5. One of the signers pays for the onchain transaction `t` to execute

Our goal with zkShield was to follow a similar flow to the above. Wherever possible, we aimed to improve the flow — for example, by enabling the multisig account itself to pay for transactions, rather than requiring one of the individual signers to pay. Not everything could be improved, however, and to keep things private we had to make some tradeoffs.

In the next section we'll describe a cryptographic primitive known as *signing*. We will cover how signing works in zkShield, and how it differs from other transparent multisig signing schemes.

#### Signing

Signatures are a fundamental principle of blockchains and cryptography itself. Crypto users should be familiar with the high level concept of a signature. Signing is the primary action we all take whenever we want to enact any operation onchain.

Specifically, those who use EVM chains may be familiar with a specific type of signature called ECDSA. If you're using a non-account abstraction wallet (known as an EOA), you use ECDSA to sign a message or sign a transaction. It's the action that follows when you click the **sign** prompt in your wallet.

With account abstraction smart accounts, we are no longer restricted to just using ECDSA signatures. There are a number of experimental and production ready wallets that are implementing [BLS](https://getwax.org/), [passkeys](https://www.passkeys.com/), and a whole range of other signing schemes.

A potential drawback with building a non-ECDSA wallet is having to develop your own signing interface. That's because the vast majority of browser extension wallets use ECDSA. Even if the signing scheme is easier to implement, it's hard to onboard new users.

At the beginning of zkShield's development, we looked into many of these alternative signing schemes. Specifically, one extremely promising signature scheme is [PLUME](https://aayushg.com/thesis.pdf) which is ZK friendly and has deterministic signatures by default (something we'll talk about later). Unfortunately, at the time of development the only way to use this signing scheme as to build a Metamask snap, or something equivalent, for users to sign.

After considering these various options, we still ended up choosing ECDSA. The benefit of making it easy for users to transition from their existing wallet interface was too much to overcome. But, to enable privacy, we'll need a ZK version of the signature.

#### zkECDSA

*The naming of the ECDSA variables are referenced [from this book](https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages#ecdsa-sign)*  

In this section, we will provide a brief sketch of zkECDSA. We will cover some of the signature algorithms' drawbacks, and we'll discuss how it helps enable privacy. If you want a deeper dive into the state of zkECDSAs, there's a fantastic post from [Blake McAlevey-Scurr](https://mirror.xyz/privacy-scaling-explorations.eth/djxf2g9VzUcss1e-gWIL2DSRD4stWggtTOcgsv1RlxY) to read through.

At a high level, the difference between the regular ECDSA and our use of zkECDSA is that the `s` signature value is **not** publicly disclosed in the zkECDSA. Instead, you can frame the zkECDSA as stating: _I know the private key `pk` and generated a signature value `s` for the given message `m` and public key `Q`_.

In our circuit, we don't need to actually pass in the `pk` as the signature verification algorithm will check the `s` value against the message `m` and public key `Q`. In zk terms, the private input is `s` where the public input is `m` and the output is `Q`.

This alone does not provide any privacy. The public key, `Q` is exposed and anyone can view it. A first attempt at hiding this `Q` value might be to hash with using some kind of hashing function like `poseidon`, a [ZK friendly hash](https://github.com/ingonyama-zk/papers/blob/main/sok_zk_friendly_hashes.pdf).

Unfortunately, this doesn't mean the public key is hidden. It's trivial to hash all the known public keys onchain and find out which one is yours if you've ever used that keypair for a transcation.

Instead, you can salt the public key with some random value that only you know. This `secret` value can be tacked onto the end of the public key and hashed together: `poseidon(Q, secret)`. If the secret is a random value with a high amount of entropy, then the hash's output can never be linked back to that public key!

With a hidden public key, it might seem like the scheme is complete. Unfortunately, there are two main problems that come up in its implementation. First, ECDSA is non-deterministic meaning we can use multiple signatures for the same message and public key. This can cause a "double spend" issue, or in our case, a "double sign" issue in the multisig. Secondly, proving times for zkECDSA can take a long time which makes for a poor signing experience.

To solve this, we need to deal with the non-determinism of the ECDSA and decrease the proving time. 

**Non-determinism of ECDSA**

ECDSA relies on generating a random nonce `k` in its algorithm to create the signature value `s`. If we never expose this value `s`, then the random value `k` can be chosen arbitrarily as `k_1`, `k_2`, to `k_n` which generate valid `s` values of a given message `m`: `s_1`, `s_2`, `s_n`. If our verify proof only checked whether a signer from the multisig submitted a correct signature `s_i`, then the same signer could generate multiple signatures and pass the threshold.

Those familiar with ECDSAs may counter that there is a deterministic [ECDSA RFC](https://datatracker.ietf.org/doc/html/rfc6979#section-3.2) which produces a `k` HMAC derived by the private key `pk` and message `m`. But, given we pass in `s` as a private input in the zkECDSA circuit, we can't guarantee this derivation will always happen.

To address this issue, we need to output some type of **nullifier** which prevents the user from being able to double sign. One nullifier we could use is the public key, `Q`, but once again this would expose the signer's account. However, looking back at the way we solved with `poseidon(Q, secret)` it's exactly what we would want to use in this case!

The first reason it works as a nullifier is that it generates the same output for the same inputs: `Q` and `secret` making it deterministic. Secondly, it also hides the account of the user which preserves their privacy. Whenever you see the `nullifier` reference in the code of zkShield, this is what it is referring to.

**Speeding up proofs**

There are has been steady progress on speeding up zkECDSA proofs over the years. The first circom implementation of zkECDSA begins with [0xPARC](https://0xparc.org/blog/zk-ecdsa-1). For a first implementation, this worked well, but it wasn't optimal, as it had a high amount of constraints (meaning proving time would be uncomfortably long). 

This made the size of the proving key quite large and was also the cause of a long proving time. The high amount of constraints is due to _wrong-field_ math as the proving method's max field size is smaller than the field size of the ECDSA curve. 

A large proving time would be a UX nightmare for multisigs. Luckily, if we fast forward a few months from the publication of 0xPARC's release, the team at Personae Labs released [Efficient ECDSA](https://personaelabs.org/posts/efficient-ecdsa-1/). This implementation used a clever algebra trick to rearrange the ECDSA equation to move a lot of the expensive wrong-field math out of the circuit.

You can read their post for a deeper dive, but essentially we can rearrange the ECDSA equation to:
```
s*T+U=Q
```

where `T` and `U` are points on the curve. Now, the zkECDSA circuit performs only a single elliptical curve multiplication, one addition, and a validity check against the public key, `Q`. While this brought down the amount of constraints significantly, the single `s*T` multiplication still made browser proving infeasible.

To make proving in the browser possible, [we have to build a set of precomputes of `T`](https://ethresear.ch/t/efficient-ecdsa-signature-verification-using-circom/13629/7) to speed up the circuit calculation. These precomputes should be passed in as a private input to the circuit as passing them publically would make onchain verification gas quite expensive. With the precomputes, we were able to achieve zkECDSA proving speed of 30-50s in the browser!

But, the precomputes don't come for free. To use them as a private input to the proof we'll have to create another proof that verifies the `s*T` calculation matches the `s* T_precomputes` in the circuit. This proof is quite computationally expensive, but can be safely offloaded to a a server as it does not expose any information which could reveal the underlying account.

Lastly, we still need to pass the values `T` and `U` to the proof verification onchain. From the efficient ECDSA post, these values are the outputs of the elliptical curve calculations `r^{−1}*R` and `−r^{−1}*m*G`, respectively. If we tried to do these multiplications onchain, not only would that be absurdly gas expensive, there are no production ready libraries elliptical curve libraries that we could use in Solidity.

To get around this, we'll use a trick from an [old post](https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384/4) on the ethresearch forums. In that post, Vitalik and Anton Bukov discuss abusing the `ecrecover()` precompile to do an elliptical curve multiplication check. This check is inexpensive in gas and simplifies the code where all we need to do is pass in `r^-1`, `-r^-1`, `R`, and `G` to verify they match a passed in `T` and `U`. Logic for this can be found in the zkShield [`verifyProof()` function](https://github.com/bankisan/zkShield-private/blob/main/contracts/src/ShieldAccount.sol#L92-L116).

#### Membership proof

Now that we've covered the zkECDSA part of the proof, we can move onto proving the membership of the signer. Recall that the purpose of the multisig is to have N number of signers belong to a single account. The method of encoding memberships in the account is an integral part of preserving their privacy.

One easy way to store members on an account is to use a simple mapping of them. We've already mentioned the pitfalls of storing public account information, so we could store their nullifiers instead. At first glance this may seem like a decent solution, but it will unfortunately expose the exact `N` number of account signers. In an ideal case, we would also want to hide this from the public.

Instead, we can use a merkle tree that contains all members of the account. Given the tree is encoded as a single hashed `byte32` root value, we don't expose total member counts and we reduce the storage cost of storing memberships in the account as well.

To use this merkle tree as part of the proof, we have to include it in the ZK circuit. This is a relatively trivial piece of the circuit and where we pass in a path and root of the account, and verify the merkle root matches a signer's nullifier as a leaf node.

#### Sending the transaction

We've already covered the transaction flow for a traditional multisig, but what happens in the zkShield case when it gets time to send that transaction onchain? First, we need to make sure the number of signatures for a given transaction passes the threshold set on the account. Finally, we need to submit the transaction onchain with a list of signatures for a given transaction. If all those pass, then the account should be able to execute the transaction on chain!

Well, we skipped over a very important piece of keeping the signers private. Who, or what, actually sends the transaction onchain? If one of the signers signs the bundle of signatures and originates the transaction, then their account will be exposed. To solve this, enter [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337), account abstraction.

We won't cover the full extent of the ERC-4337 account abstraction spec, but an overview of it describes a smart contract account (known as a smart account). In the spec an account's transaction is called a `UserOperation` which defines its own `singature` field. 

The `signature` field from the user op is used to validate the user op. The signature can be anything but in zkShield's case the signature we pass into the account to validate is an array of the signers' proofs. Each proof is passed into the `verifyProof()` method that then checks whether the proof is valid for the user op and whether the nullifier is unique for this transaction.

If successful, the transaction will go through and the account, rather than any individual signer, will pay for the transaction. Another added benefit of using an ERC-4337 account is that no individual signer is responsible for sending this transaction. This differs from other multisigs where a single signer must send the multisig transaction themselves which may hold them liable for any actions the transaction performs.


## Future improvements

ZK tech continues to improve at an astonishing pace. In this section, we want to mention a few of the improvements that we believe will provide the most benefits in the short term.

#### Recursion

One drawback to the original design of the scheme is the naive implementation of verifying each proof using an array in the signature. Given each proof verification costs 200,000 gas, this implementation's gas costs will scale linearly with each signer. For high thresholds, this becomes infeasible as the gas cost for issuing a single transaction will be in the millions.

Rather than iterating through an array for proofs, it would be much better to build a proof of proofs, recursively. That way, there is a constant proof verification cost which is independent of the number of signers.

#### Faster proving methods

While discussing the zkECDSA, we briefly mentioned a history of zkECDSA and stopped at efficient-ecdsa which zkShield employs. Since then, there has been a lot more work done to improve zkECDSAs. There are examples of zkECDSAs being implemented [using `noir`](https://github.com/colinnielsen/noir-verify-ecdsa_secp256k1), RISC0, and even Personae Labs' [spartan-ecdsa](https://github.com/personaelabs/spartan-ecdsa).

We're hopeful that with more innovation in this space, we can remove the need for two proof verifications and continue to speed up the in-browser proof generation.

#### One-time nullifiers

To check for double signing, our scheme ensures that the nullifier of the signer was only used once in the array of signatures. In this process, the nullifier does not reveal the underlying account. But, if a single signer is involved with many transactions, their nullifier can be tracked across them.

Instead, we can generate another one time nullifier where the set membership nullifier is hashed with the message. This could be something like `poseidon(poseidon(Q, secret), message)`. If we output this onetime nullifier, we will still prevent double spending without revealing the set membership nullifier.

### Acknowledgements

These are just a few of the improvements we are excited about in the short term. As the ZK landscape continues to change, we'll be monitoring for additional ways to modify the scheme and make privacy safe to use. Private multisigs are coming, and we're excited to help bring them to mainstream adoption.

*The authors of zkShield are extremely grateful to the EF's [Privacy and Scaling Explorations](https://pse.dev/) team who provided grant funding to pursue this project as well providing expertise in the early design of the project. Secondly, we would like to thank [OrangeDAO](https://www.orangedao.xyz/) for their funding, product help and mentoring support in the fellowship program. Finally, we would like to thank [Bruno](https://twitter.com/Blulinski) from [Aztec](https://aztec.network/) for reviewing and providing helpful suggestions for this post.*
