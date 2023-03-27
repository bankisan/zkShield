pragma circom 2.0.6;
include "./secp256k1_scalar_mult_cached_windowed.circom";

template ECDSAVerify(n, k) {
    signal input s[k];
    signal input TPreComputes[32][256][2][4]; // T = r^-1 * R
    signal input U[2][k]; // -(m * r^-1 * G)

    signal output pubKey[2][k];

    // Note: We differ from the efficient-ecdsa spec
    // to use as a validation for the precomputes in
    // the calling circuit.
    signal output sT[2][k];

    // s * T
    // or, s * r^-1 * R
    component sMultT = Secp256K1ScalarMultCachedWindowed(n, k);
    var stride = 8;
    var num_strides = div_ceil(n * k, stride);

    for (var i = 0; i < num_strides; i++) {
        for (var j = 0; j < 2 ** stride; j++) {
            for (var l = 0; l < k; l++) {
                sMultT.pointPreComputes[i][j][0][l] <== TPreComputes[i][j][0][l];
                sMultT.pointPreComputes[i][j][1][l] <== TPreComputes[i][j][1][l];
            }
        }
    }

    for (var i = 0; i < k; i++) {
        sMultT.scalar[i] <== s[i];
    }

    // s * T + U
    // or, s * r^-1 * R + -(m * r^-1 * G)
    component pointAdder = Secp256k1AddUnequal(n, k);
    for (var i = 0; i < k; i++) {
        pointAdder.a[0][i] <== sMultT.out[0][i];
        pointAdder.a[1][i] <== sMultT.out[1][i];

        sT[0][i] <== sMultT.out[0][i];
        sT[1][i] <== sMultT.out[1][i];

        pointAdder.b[0][i] <== U[0][i];
        pointAdder.b[1][i] <== U[1][i];
    }

    for (var i = 0; i < k; i++) {
        pubKey[0][i] <== pointAdder.out[0][i];
        pubKey[1][i] <== pointAdder.out[1][i];
    }
}
