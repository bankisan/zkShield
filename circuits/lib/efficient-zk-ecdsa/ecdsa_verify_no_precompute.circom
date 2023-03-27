pragma circom 2.0.6;
include "./circom-ecdsa-circuits/secp256k1.circom";

template ECDSAVerifyNoPrecompute(n, k) {
    signal input s[k];
    signal input T[2][k]; // T = r^-1 * R
    signal input U[2][k]; // -(m * r^-1 * G)
    signal output pubKey[2][k];

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

    // s * T + U
    // or, s * r^-1 * R + -(m * r^-1 * G)
    component pointAdder = Secp256k1AddUnequal(n, k);
    for (var i = 0; i < k; i++) {
        pointAdder.a[0][i] <== sMultT.out[0][i];
        pointAdder.a[1][i] <== sMultT.out[1][i];
        pointAdder.b[0][i] <== U[0][i];
        pointAdder.b[1][i] <== U[1][i];
    }

    for (var i = 0; i < k; i++) {
        pubKey[0][i] <== pointAdder.out[0][i];
        pubKey[1][i] <== pointAdder.out[1][i];
    }
}
