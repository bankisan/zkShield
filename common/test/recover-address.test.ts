import { expect } from 'chai'
import { secp256k1 } from '@noble/curves/secp256k1'
import { publicKeyToAddress } from "../lib"

describe('Recover address', () => {
    it('should correctly recover address on curve', async () => {
        // A private key of 1 on the curve
        const priv = new Uint8Array(32);
        priv[priv.length - 1] = 1;
        const pub = secp256k1.getPublicKey(priv)
        const address = publicKeyToAddress(pub)
        expect(address, "Address is not correct").to.eq("0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf".toLowerCase())
    })
})
