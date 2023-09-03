// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library ECUtils {
    // secp256k1 scalar order of G.
    uint256 constant n =
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

    // Base point (generator) G
    uint256 constant Gx =
        0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint256 constant Gy =
        0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;

    function calculateUScalar(uint256 rInv, uint256 msgHash)
        internal
        pure
        returns (uint256)
    {
        uint256 rInvNeg = n - rInv;
        return mulmod(rInvNeg, uint256(msgHash), n);
    }

    // s*G === Q
    // https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384/4
    function validateECMult(
        uint256 scalar,
        uint256 gx,
        uint256 gy,
        uint256 qx,
        uint256 qy
    ) internal pure returns (bool) {
        address signer = ecrecover(
            0,
            gy % 2 != 0 ? 28 : 27,
            bytes32(gx),
            bytes32(mulmod(scalar, gx, n))
        );

        address qAddress = address(
            uint160(uint256(keccak256(abi.encodePacked(qx, qy))))
        );
        return qAddress == signer;
    }

    function toRegister(uint256 a)
        internal
        pure
        returns (uint256[4] memory register)
    {
        register[3] = (a >> 192) & 0xFFFFFFFFFFFFFFFF;
        register[2] = (a >> 128) & 0xFFFFFFFFFFFFFFFF;
        register[1] = (a >> 64) & 0xFFFFFFFFFFFFFFFF;
        register[0] = a & 0xFFFFFFFFFFFFFFFF;
    }
}
