import { expect } from 'chai'
import { secp256k1 } from '@noble/curves/secp256k1'

import * as pkg from 'common'
const { publicKeyToAddress, addressToProjectivePoint } = pkg

describe('Recover address', () => {
    it('should correctly recover address on curve', async () => {
        // A private key of 1 on the curve
        const priv = new Uint8Array(32);
        priv[priv.length - 1] = 1;
        const pub = secp256k1.getPublicKey(priv)
        const address = publicKeyToAddress(pub)
        expect(address, "Address is not correct").to.eq("0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf".toLowerCase())
    })
    it('should correctly calculate point off of address', async () => {  
        const addr = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf"
        const point = addressToProjectivePoint(addr)
        expect(point.px, "X point is not correct").to.eq(81913117857679760423293797659190140896432295886793148662425845977300580253457n)
        expect(point.py, "Y point is not correct").to.eq(4281765189951208132234390813879383828668648022871537071622831729105003729879n)
        expect(point.pz, "Z point is not correct").to.eq(1n)
    })
})
