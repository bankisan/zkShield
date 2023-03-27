pragma circom 2.1.0;

include "../lib/circomlib/circuits/poseidon.circom";
include "../lib/circomlib/circuits/comparators.circom";
include "../lib/efficient-zk-ecdsa/ecdsa_verify.circom";
include "../lib/tree.circom";

template VerifySignature(n, k, levels) {
    /* 
     * PRIVATE INPUTS
    */

    // Signature inputs.
    signal input s[k];
    signal input TPreComputes[32][256][2][4]; // T = r^-1 * R

    // Merkle tree inputs.
    signal input secret;
    signal input pathIndices[levels];
    signal input siblings[levels];

    /* 
     * PUBLIC INPUTS
    */
    signal input U[2][k];

    /* 
     * OUTPUTS
    */

    // sMultTHash ensures the s*T parameter is
    // valid for the given signature.
    signal output sMultTHash;

    // nullifier prevents double signing.
    signal output nullifier;

    // root of the merkle tree for the membership
    // set.
    signal output root;

    component ecdsaVerify = ECDSAVerify(n, k);
    for (var i = 0; i < k; i++) {
      ecdsaVerify.s[i] <== s[i];
      ecdsaVerify.U[0][i] <== U[0][i];
      ecdsaVerify.U[1][i] <== U[1][i];
    }

    ecdsaVerify.TPreComputes <== TPreComputes;

    var sMultTHashInputs[2 * k];
    for (var i = 0; i < k; i++) {
      sMultTHashInputs[i] = ecdsaVerify.sT[0][i];
      sMultTHashInputs[i + k] = ecdsaVerify.sT[1][i];
    }
    component sMultTHasher = Poseidon(2 * k);
    sMultTHasher.inputs <== sMultTHashInputs;

    sMultTHash <== sMultTHasher.out;

    // Public key hashed with secret.
    var hashInputs[2 * k + 1];

    for (var i = 0; i < k; i++) {
        hashInputs[i] = ecdsaVerify.pubKey[0][i];
        hashInputs[k + i] = ecdsaVerify.pubKey[1][i];
    }
    hashInputs[2 * k] = secret;

    component hasher = Poseidon(2 * k + 1); 
    hasher.inputs <== hashInputs;

    /* // Output the nullifier. */
    nullifier <== hasher.out;
    /**/
    component tree = MerkleTreeInclusionProof(levels);
    tree.leaf <== hasher.out;
    tree.pathIndices <== pathIndices;
    tree.siblings <== siblings;

    root <== tree.root;
}

// VerifySignature works with a max multiparty of of 2^4 == 16 
component main { public [U] } = VerifySignature(64, 4, 4);
