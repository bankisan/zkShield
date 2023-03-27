//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import {Pairing} from "./Pairing.sol";

library ValidateSMultTVerifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }
    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            20491192805390485299153009773594534940189261866228447918068658471970481763042,
            9383485363053290200918347156157836566562967994039712273449902621266178545958
        );

        vk.beta2 = Pairing.G2Point(
            [4252822878758300859123897981450591353533073413197771768651442665752259397132,
             6375614351688725206403948262868962793625744043794305715222011528459656738731],
            [21847035105528745403288232691147584728191162732299865338377159692350059136679,
             10505242626370262277552901082094356697409835680220590971873171140371331206856]
        );
        vk.gamma2 = Pairing.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Pairing.G2Point(
            [5429824986809027087605263519771307697136655138340851962389490335557311765063,
             10947429869272091540145693616388788366750989810603036727518545908681540325854],
            [6579308873699214133941465384741833200510758820614796553609635982180941100443,
             15355639014863897217886592053737450502549372992404673990896193487906882155971]
        );
        vk.IC = new Pairing.G1Point[](10);
        
        vk.IC[0] = Pairing.G1Point( 
            3039277484925189402420069912515278320842677659714938680656979815823388634426,
            10725228751327592097432612995439538698054840589437960648404850435059874639136
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            5550441500430782806437688755603649145902304052027711444653559817438770681987,
            16943468556170274910058989777272305757823936251507427542543035830892598928414
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            2388326655169941890826930355328365547127847743716147286326257984869344236527,
            9224612411911198779617704226640623486860685662852324241500431426041545283103
        );                                      
        
        vk.IC[3] = Pairing.G1Point( 
            15954433166126158553760856350677661325994524914631094398505293600872432741017,
            21417978341535917494291549213983180998565470552904419923255163783341464101576
        );                                      
        
        vk.IC[4] = Pairing.G1Point( 
            9369068576397030608989988948612749289246819689885458283925449697730980056208,
            1560992465630885296295332506337431712616442578471410657711072400941704759592
        );                                      
        
        vk.IC[5] = Pairing.G1Point( 
            13717665171854329298884767641807572226997842551471798955789231718900065502189,
            11604686008077760263890156876822507271220136028940389458637593436683514662825
        );                                      
        
        vk.IC[6] = Pairing.G1Point( 
            9458920782624219249515472017783002178113322475149596956828219781322659843147,
            1475308779972015001141513380901862923681366339551261168268505513198576214916
        );                                      
        
        vk.IC[7] = Pairing.G1Point( 
            4385736345277195015216428566225532095708613118670868612715888292825897491090,
            7406659973725708170279020831898895415837809810286353076879892939330668712615
        );                                      
        
        vk.IC[8] = Pairing.G1Point( 
            20199518574842110723364625526128334136245828236950158500268837270654965883347,
            20624137623120923615261827494876355969896133658498748797097764119842381747007
        );                                      
        
        vk.IC[9] = Pairing.G1Point( 
            1056790110358737848105832794464713667197216240484096902579852541064561746997,
            12793817626058881663059196169300918977056410813352227106688505630143738703627
        );                                      
        
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length,"verifier-bad-input");
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd4(
            Pairing.negate(proof.A), proof.B,
            vk.alfa1, vk.beta2,
            vk_x, vk.gamma2,
            proof.C, vk.delta2
        )) return 1;
        return 0;
    }
    /// @return r  bool true if proof is valid
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[9] memory input
        ) public view returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
