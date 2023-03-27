// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {EntryPoint, IEntryPoint} from "account-abstraction/core/EntryPoint.sol";

import {ShieldAccount, UserOperation, SignatureProof, Transaction, ShieldErrors} from "../src/ShieldAccount.sol";

import {Fixture, LoadFixture} from "./utils/Fixtures.sol";

contract ShieldAccountTest is Test {
    using LoadFixture for Vm;

    ShieldAccount shieldAccount;
    EntryPoint entryPoint;

    function setUp() public {
        entryPoint = new EntryPoint();
        vm.deal(address(entryPoint), 1 ether);
    }

    function deployDefaultShield() public {
        deployShieldWithFixture(vm.loadFixture("default"));
    }

    function deployShieldWithFixture(Fixture memory fixture) public {
        shieldAccount = new ShieldAccount(
            IEntryPoint(address(entryPoint)),
            bytes32(fixture.root),
            3
        );
        vm.deal(address(shieldAccount), 1 ether);
    }

    function testVerifySingleProof() public {
        deployDefaultShield();
        SignatureProof memory proof = SignatureProof({
            a: [
                6818803061818513651495557548511548851656133805726336953493374826739950928330,
                9282282391116430584685044340780624739686836190579890996315218561183493122161
            ],
            b: [
                [
                    12107480264013293124718241037730933000893093048671539451943166360108917992282,
                    16971281361738057980234684406588859806301295550019534735788027348081103402243
                ],
                [
                    16669159980314983865064150528237581580647812441240473035154132317794288152020,
                    18588761900575160328261260928134118101542086033331516738165050479041037856643
                ]
            ],
            c: [
                19793810610780222280776751325495464765337953391431096952320974714268926884943,
                16841653631170811561567173040542673274295733579290106951608211094144705607192
            ],
            rInv: 44919587290890681652349532934718199871603088675020817907644526114598768153402,
            R: [
                20132073554653267163990333140506705663310548757771185198131827906582155039316,
                84926802392075438702398410561964075916851471743103165899010056512476049789155
            ],
            T: [
                80895642366785752895809918531540412725097073356165828070247975307289589757613,
                102027040121525385105724675584999272124569152086584343930987235271383876436812
            ],
            U: [
                22818766594702845013638480194371655352846664393883941898867187022432211054262,
                30676237569768170643669372481073658786328161481105255863788238294119238274406
            ],
            sTHash: 13404317335423216603580113804782776508652296447014573181631567330743731286321,
            nullifier: 8094934433466558583763938418245975014807954430509194901151988383394207674276
        });

        UserOperation memory userOp = UserOperation({
            sender: address(shieldAccount),
            nonce: 0,
            initCode: "",
            callData: "",
            callGasLimit: 0,
            verificationGasLimit: 100000,
            preVerificationGas: 21000,
            maxFeePerGas: 0,
            maxPriorityFeePerGas: 0,
            paymasterAndData: "",
            signature: ""
        });
        bytes32 hash = entryPoint.getUserOpHash(userOp);
        assertTrue(shieldAccount.verifyProof(proof, hash));
    }

    function testVerifyHandleOps() public {
        deployDefaultShield();
        Fixture memory fixture = vm.loadFixture("default");

        UserOperation memory userOp = UserOperation({
            sender: address(shieldAccount),
            nonce: 0,
            initCode: "",
            callData: "",
            callGasLimit: 0,
            verificationGasLimit: 2_000_000,
            preVerificationGas: 21000,
            maxFeePerGas: 0,
            maxPriorityFeePerGas: 0,
            paymasterAndData: "",
            signature: fixture.signature
        });

        bytes32 hash = entryPoint.getUserOpHash(fixture.userOp);
        assertEq(hash, fixture.msg, "Not the correct hash");

        // Extract the SignatureProof structs using the extractSignatureProofs function
        bytes memory call = abi.encodeCall(shieldAccount.root, ());

        vm.expectRevert();
        entryPoint.simulateHandleOp(userOp, address(shieldAccount), call);

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = fixture.userOp;
        entryPoint.handleOps(ops, payable(address(1)));
    }

    function testRevertsWithDuplicateNonce() public {
        deployDefaultShield();
        Fixture memory fixture = vm.loadFixture("default");

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = fixture.userOp;
        entryPoint.handleOps(ops, payable(address(1)));

        // Reuses the same nonce.
        vm.expectRevert();
        entryPoint.handleOps(ops, payable(address(1)));
    }

    function testUpdatesRoot() public {
        deployDefaultShield();
        Fixture memory fixture = vm.loadFixture("root");

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = fixture.userOp;
        entryPoint.handleOps(ops, payable(address(1)));

        assertEq(
            shieldAccount.root(),
            bytes32(
                0x1111111111111111111111111111111111111111111111111111111111111111
            ),
            "root failed to change"
        );
    }

    function testUpdatesSigners() public {
        deployDefaultShield();
        Fixture memory fixture = vm.loadFixture("signers");

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = fixture.userOp;
        entryPoint.handleOps(ops, payable(address(1)));

        assertEq(
            uint256(shieldAccount.requiredSigners()),
            1,
            "requiredSigners failed to change"
        );
    }

    function testTransfer() public {
        deployDefaultShield();
        Fixture memory fixture = vm.loadFixture("transfer");

        uint256 prevBalance = address(shieldAccount).balance;

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = fixture.userOp;
        entryPoint.handleOps(ops, payable(address(1)));

        assertEq(
            prevBalance - address(shieldAccount).balance,
            1_000_000_000,
            "transfer failed to send"
        );
    }

    function testRevertWhenCallingShieldMethods() public {
        deployDefaultShield();
        // Fixture memory fixture = vm.loadFixture("transfer");

        vm.expectRevert(
            abi.encodeWithSelector(ShieldErrors.Unauthorized.selector)
        );
        shieldAccount.updateRoot(bytes32(uint256(3)));

        vm.expectRevert(
            abi.encodeWithSelector(ShieldErrors.Unauthorized.selector)
        );
        shieldAccount.updateRequiredSigners(4);

        Transaction memory tx_ = Transaction({
            target: payable(address(4)),
            payload: hex"",
            value: 0,
            delegate: true
        });
        vm.expectRevert(
            abi.encodeWithSelector(ShieldErrors.Unauthorized.selector)
        );
        shieldAccount.execute(tx_);
    }

    function testExtractProofs() public {
        deployDefaultShield();
        // Create 3 sample SignatureProof structs
        SignatureProof memory proof1 = SignatureProof({
            a: [
                6818803061818513651495557548511548851656133805726336953493374826739950928330,
                9282282391116430584685044340780624739686836190579890996315218561183493122161
            ],
            b: [
                [
                    12107480264013293124718241037730933000893093048671539451943166360108917992282,
                    16971281361738057980234684406588859806301295550019534735788027348081103402243
                ],
                [
                    16669159980314983865064150528237581580647812441240473035154132317794288152020,
                    18588761900575160328261260928134118101542086033331516738165050479041037856643
                ]
            ],
            c: [
                19793810610780222280776751325495464765337953391431096952320974714268926884943,
                16841653631170811561567173040542673274295733579290106951608211094144705607192
            ],
            rInv: 44919587290890681652349532934718199871603088675020817907644526114598768153402,
            R: [
                20132073554653267163990333140506705663310548757771185198131827906582155039316,
                84926802392075438702398410561964075916851471743103165899010056512476049789155
            ],
            T: [
                80895642366785752895809918531540412725097073356165828070247975307289589757613,
                102027040121525385105724675584999272124569152086584343930987235271383876436812
            ],
            U: [
                22818766594702845013638480194371655352846664393883941898867187022432211054262,
                30676237569768170643669372481073658786328161481105255863788238294119238274406
            ],
            sTHash: 13404317335423216603580113804782776508652296447014573181631567330743731286321,
            nullifier: 8094934433466558583763938418245975014807954430509194901151988383394207674276
        });

        SignatureProof memory proof2 = SignatureProof({
            a: [
                1102961174575595945515542551612400301023159759900108399807573156861342721798,
                12132411121490886022246519989007312753486421593183496432717622357135748741560
            ],
            b: [
                [
                    10765431506843680871204047739490675648371698620734148327977058906097914591114,
                    7310775351819658110652025125909599501160572022521828361180092054258362064486
                ],
                [
                    18931838511287455796676298531152334367210541176764452009114044140163764133828,
                    19299524807588028304959414196271859439332053492929394543092080926087451242348
                ]
            ],
            c: [
                17739516889925049987602887372927455737879769229499472823828345684052123073886,
                5541282283719592471142444780669612680068952916012940011371117288901905665490
            ],
            rInv: 65162460828153942625065768266689113192291117228598215547269757185817484408993,
            R: [
                11124277019826236911879414036172904435645268575900393236245090952097671306305,
                93773274581996260905431425220137096924896464629635500580932168468426777228979
            ],
            T: [
                91177540915078544322681206920036518715398557035479278932049771728498544046702,
                27603421297964908888443182361584390860218509267202016304218607122139138836837
            ],
            U: [
                111083406579906146229326242061728470672867439271973643574567517540384846359166,
                42237518870167232360506809084819568058910287456886702063591209220924989602683
            ],
            sTHash: 5707522426695950571376616199983071647272082896412150159220371014483542772853,
            nullifier: 7645998282623756722056664024592450303017876239892507551817859532634938499436
        });

        SignatureProof memory proof3 = SignatureProof({
            a: [
                18472348813765578307067438448125643776379647916944089300280648801244389192597,
                2848282697806801010674824480363598508242632574521993351186966015195745710707
            ],
            b: [
                [
                    10026125309204795868098256250519292390930896265788117909521393258214646621879,
                    14096540465062852616262472118652677623195105717345658413170460381815934605207
                ],
                [
                    5605571722366862640124683119600713371596351270591274383740908673009206828582,
                    1482462759948861607588970092085652132667962209451352787613670061414895151868
                ]
            ],
            c: [
                12749730961657380872253396921959185099038794545929644367197212092002475458903,
                4132669311441952474650095121814061046877146254731101299974843343279304127940
            ],
            rInv: 29422656993009491652007194441257515813858313630118681076246249789801671643690,
            R: [
                112050276128534079683187033720505637897423424125374986467401175318252008615252,
                59093429865229280893894278004554207001101598837407382690508154594409593439820
            ],
            T: [
                92560408459507192372940626359711111989841137496904606665558422007541507432922,
                61440071343481967933846338218530687661663378187958467027913826017232756677707
            ],
            U: [
                50255713415030111987465261835455447790447122468112150920901657547829635727492,
                109616292705415675419391039782332450700673402087810641532838051433884954139124
            ],
            sTHash: 19207218798895625839991617741775468335208899088407243141150763866378495917517,
            nullifier: 14499132994412541007914154789463382981474052091496849788977066010024883701425
        });

        // Extract the SignatureProof structs using the extractSignatureProofs function
        bytes
            memory data = hex"000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030f134e46927df62809fbf73b1607e63995eac4a02494fa2c5e740b6cbc4bc1ca148595ed601e8bb63d028421d41be512a8bedcf34dece69a1129ede81857e8711ac4974aa563514459e3e1f41c042183b0ecde4931f4ede25b6080541d162b5a258567a41ebbfda0f64b61dd223c56259bd9fa9ad913418d321367d74ea4f50324da690341fd2f464edd277e311a980b7f38e6695580c7211729c84d910a2dd42918ddcbc0b5c998bc6a7b791aac12d039a4bdf0dd3d6f2d6586e749065def832bc2e658a1671a00138cc5b4009d4c09a42a473fd9a5123d5cbf031474e43c4f253c09c45d6769690ab4e59b98f18a9f232eabab602e59e8b22852016137b618634f95dea8392c7e8d0f88a081cd7e6f85e62c4f44707fe9bb1c01d53429133a2c82598e8cd4526b3aec09f7101640d36cf508d14f59a26c60dcb2be917b1254bbc2dde1e8b529099e31553c960600b343b0db6182c98fddf9cc66cd5f1b50e3b2d94f9e4e9216ec27ca92564ad98260804b6371a70790126fdabd42a414b6ade191421f8d4c1ec191fe1b09a0a37bfcab8d1a880c9963ecf8e7b2125491034c3272f6d60aae76576ff37c60aa09a06ac1c5d8b5a8d731f51f1a8b695ee42eb643d2229abcc16eaf72feec4aa2b045f5aa3455ed3c01c3d7ef25cfe0ad730d661da29323102c72b095fcb560533a9b77036a824d0de8a9c481dac79205def13111e5920de67725fab1002073352f7c06fd17798db2ac57c4ae2c992ee8c0afa4027040ffba201857c90422ffd6603a4ed33269a4c2f17d8095b400e4e48527061ad2b38b8b86bd321d972876c281156dca3a01cd9fa15a0f9bff337a08cfb9b817cd04af999237d15db5704c2b6b2d9e46be2d73523ae455afe7faf32851b78a1029c091033c0792e7f2510aaa1a2b155cab409adf58640685b684b73fab9e6629db0a767fb6e102763978fcc775cb179ba62a86f891e817652fbc56bfa51fc42aab24d9376c8923f0e73b406d8720a8844b012864dbfd8908a7a56116e7ef6c273835f395555f21b2c826c5b7fae5b9e5636b6d3766bf9486ee94dec7203d5e0c40412f4b701e2969c75f23a77933c76ae42a36cc8cc5cb82117681b8facdd29010a554fa27a8f139762c9d9e2fc4553b216e76f4710263adeb7649fb1338a118981e1f705be44f256526ec55aa95e2b6fa27a9337f7da49145aa25687a5c41cf51cae47f14b3da5a52429ec0a18fb8ec62b910cde210892aa7575f347cf6b3c994a8cbaaea086bd24a5174549243a3c914100d4bd62a533b3b29e84167726e3d06fb9895931d6fac62813a194958428f04c8f97f5154ce9b3a650f37cd4965f596fae54147525be0291a267f542310360177ee0d93dd1642416a76bfebaa7e5d6196a7d47b17901e549ed5db6ead221a85763524ce6b6604063d8648d17b7b0c9e57dce7227fdd551fffbebd5bfe2a8bae329831ed32a3cb1098d3d7678c7510e77b4e949df0f94da393a33f054fe4dfd36cc17f6c613bcce9d0ebfde1616c28d6fa9a606aad2b5e3d1ae6aefbc8021a4f8e415a073d7e2fb17602c7863395064c122504199735fbe1ec8bf68ff2aea08f901625d47a6586fd8b44d3157273162a95f8a507f2ceaf7a6c401de2fc5fca86bd1fb6c9a92b5ecc5b2b5aa826b71f2a5bf1f6d9418d3cef43b31d9f736bcac5c134c297bd0ce923a213925cd7970c64a4231b73320a82bcc7d69c94d861066ddc1ff7c221a8e8222f18f3321e2603470b4fdfa91400e32de3bfcc8f7346b900d47ffbe985a179411f5614d96afc1c30178d06a0febfd74cbf13ca2e1a7c0c83581e9050b96fe90c2adc9694415709230208499e9b816455ec95a60a88ca4db969da3098be1eb512c87aeafab5c4410ca23ae15ffa95332969cdbf173ce1d039e0404c5c5c3fe292bfe8f7bf522af7ba357605965bf49afa7c8481dd6575a28e0458b6866b5ef7c2807e1121ad5482a5b22f369708518cf36113a6149b4b15eb8544f41901615f7d0e186fc4064ccca355abae72ec37e23df44e1460abdd946840d89309f99fa36a7c120bae21da87d5d919425928e000d87dd828d92842952f0636d421dffaeba6dc1c12541c4b6f1bb9cd0fe86fea6b2d81e2e9a3132f8826cb7540697e33e0a6427b70384084f2589f7f2f4f6905272ab93bb9c2492f9224b5ab4305d96d76c2913710f419f42a76e68d108b68c06d89ff94aa328236310f5711e73aefc5ef981134efd4fdcd200e37ecd339b4a5abfd4b2ad29265a1e178ad0fca0d3acd837366f8def2c6b1";
        SignatureProof[] memory proofs = shieldAccount.extractSignatureProofs(
            data
        );

        // Assert that the correct number of proofs was extracted
        assertEq(proofs.length, 3, "Invalid number of proofs extracted");

        // Compare each extracted proof with the original data
        compareProofs(proof1, proofs[0]);
        compareProofs(proof2, proofs[1]);
        compareProofs(proof3, proofs[2]);
    }

    function compareProofs(
        SignatureProof memory expected,
        SignatureProof memory actual
    ) internal {
        assertEq(actual.a[0], expected.a[0]);
        assertEq(actual.a[1], expected.a[1]);
        assertEq(actual.b[0][0], expected.b[0][0]);
        assertEq(actual.b[0][1], expected.b[0][1]);
        assertEq(actual.b[1][0], expected.b[1][0]);
        assertEq(actual.b[1][1], expected.b[1][1]);
        assertEq(actual.c[0], expected.c[0]);
        assertEq(actual.c[1], expected.c[1]);
        assertEq(actual.rInv, expected.rInv);
        assertEq(actual.R[0], expected.R[0]);
        assertEq(actual.R[1], expected.R[1]);
        assertEq(actual.T[0], expected.T[0]);
        assertEq(actual.T[1], expected.T[1]);
        assertEq(actual.sTHash, expected.sTHash);
        assertEq(actual.U[0], expected.U[0]);
        assertEq(actual.U[1], expected.U[1]);
    }

    // Help debugging `bytes` type.
    // https://ethereum.stackexchange.com/a/126928
    function iToHex(bytes memory buffer) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(buffer.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < buffer.length; i++) {
            converted[i * 2] = _base[uint8(buffer[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(buffer[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }
}
