pragma circom 2.1.0;

include "../lib/efficient-zk-ecdsa/circom-ecdsa-circuits/secp256k1.circom";
include "../lib/circomlib/circuits/poseidon.circom";

template ValidateSMultT(n, k) {
    signal input s[k];
    signal input T[2][k]; // T = r^-1 * R

    signal output sMultTHash;

    // s * T
    // or, s * r^-1 * R
    component sMultT = Secp256k1ScalarMult(n, k);
    var stride = 8;
    var num_strides = div_ceil(n * k, stride);
    for (var idx = 0; idx < k; idx++) {
        sMultT.scalar[idx] <== s[idx];
        sMultT.point[0][idx] <== T[0][idx];
        sMultT.point[1][idx] <== T[1][idx];
    }

    var hashInputs[2 * k];
    for (var i = 0; i < k; i++) {
      hashInputs[i] = sMultT.out[0][i];
      hashInputs[k + i] = sMultT.out[1][i];
    }

    component hasher = Poseidon(2 * k);
    hasher.inputs <== hashInputs;

    sMultTHash <== hasher.out;
}

component main { public [T] } = ValidateSMultT(64, 4);
