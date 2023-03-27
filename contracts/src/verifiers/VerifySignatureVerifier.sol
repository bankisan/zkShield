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

library VerifySignatureVerifier {
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
            [8573078715457173701937216060305645550120921664942578777094677538575527227224,
             384914052462706756376276208875647291074183170368223582103266125698540266373],
            [21318488925536843066507854655899944215716124866462658468848841594448563732397,
             689665241416764456311928739572768764788032456994266746411194989664521897186]
        );
        vk.IC = new Pairing.G1Point[](12);
        
        vk.IC[0] = Pairing.G1Point( 
            17442761531468968702134335031842616027439166981072631400025880747712615622126,
            1890323967165612659283451316568779772288642794301419721557678361159074020475
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            4648671307035567733985728840569494875059285012601294218685688100326346960045,
            17713167777724598586746180090443547272068560566687598054118514922484772461568
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            768631527643076650332686965722819628899894468588268506161049242112183235984,
            12017368016054165357608826244895332289543183288907442421234340853262922717023
        );                                      
        
        vk.IC[3] = Pairing.G1Point( 
            13349626362947372003654169953769133360360913409452043216046969689697683259200,
            14390090565193171543617853488920355956849302703551504554493445212380508166084
        );                                      
        
        vk.IC[4] = Pairing.G1Point( 
            11720679434360936484399360483830499987255820066650862180954114711101681472574,
            21201997644184079579970091351047585232413889329165061421583071048900872988500
        );                                      
        
        vk.IC[5] = Pairing.G1Point( 
            10621773123886672337186094811289861499312772406727593494423657992276733374109,
            10524617708733021935451828769091872529545764284456359039085953369504129135440
        );                                      
        
        vk.IC[6] = Pairing.G1Point( 
            4687072560527461292063713849731568636051194778580110859414445057727522721316,
            15712898869383566435590277940303040655188706182905612477818477319606853179568
        );                                      
        
        vk.IC[7] = Pairing.G1Point( 
            15653368267132856577579727704010259157581152553687453251989611207294452782935,
            6755859293087738216871625989655781440578207827476237700521068578670077575966
        );                                      
        
        vk.IC[8] = Pairing.G1Point( 
            9493175542566259254504220224195833450458035446276915217037084716778107649170,
            14537579695141292836267216956337866422545998260736996982488514433364539137822
        );                                      
        
        vk.IC[9] = Pairing.G1Point( 
            17232082126335763452529266847851249719677991631596223671725116053073865087401,
            21435618738909336554147883256822996450230808147737860244649949993686912349735
        );                                      
        
        vk.IC[10] = Pairing.G1Point( 
            14777364206854545376225790442819042801194859276311802599099491183586748285110,
            20518809686037755111586276268667167175532385867539085660291907258545934841400
        );                                      
        
        vk.IC[11] = Pairing.G1Point( 
            497568571746075672515744851918225664233156814158431483959194977704395788550,
            15085357540200378929073230759509693868083574324167061498543024558857058226030
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
            uint[11] memory input
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
