/// Code from: https://github.com/Marcosfitzsimons/multi-step-form/blob/15eb077bebb80ce60827ffcd7b29065c95010aa2/app/page.tsx#
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMultiStepForm } from '@/hooks/useMultiStepForm'
import { AnimatePresence } from 'framer-motion'
import ProverForm from '@/components/ProverForm'
import SignatureForm from '@/components/NullifierForm'
import SignInForm from '@/components/SignInForm'
import UserOpForm from '@/components/UserOpForm'
import SuccessMessage from '@/components/SuccessMessage'
import SideBar from '@/components/SideBar'
import { secp256k1 } from '@noble/curves/secp256k1'
import * as utils from '@noble/curves/abstract/utils'
import { generateInputs } from '@/utils/generateInputs'
import { Proof, generateCommitProof } from '@/services/snark'
import {
  useAccount,
  useSignMessage,
  useContractRead,
  useContractWrite,
  useContract,
  useProvider,
  useSignTypedData,
  useSigner,
} from 'wagmi'
import { Hex, bytesToHex, etherUnits, hexToBigInt, hexToBytes } from 'viem'
import {
  UserOperation,
  encodeSignature,
  entryPointABI,
  executeTransactionData,
  hashUserOp,
  nullifierMessage,
  personalUserOpHash,
  shieldAccountABI,
  toBigInts,
} from 'common'
import { foundry } from 'wagmi/dist/chains'
import { BigNumber, ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils.js'

import signers from "../fixtures/signers.json"
import accounts from "../fixtures/accounts.json"
console.log(signers, accounts)

export type CallData = {
  target: `0x${string}`
  value: bigint
  payload: `0x${string}`
  delegate: boolean
}

export type FormItems = Omit<UserOperation, 'callData'> & {
  callData: Hex
  nullifier?: string
  proof?: Proof
  publicSignals?: string[]
}

const toBigNumbers = (input: (string | bigint)[]): BigNumber[] => {
  return input.map((el) => BigNumber.from(el))
}

export const initialValues: FormItems = {
  sender: `0x89ac276207912188c62d44143e429e868cC33e5E`,
  nonce: 3n,
  callData: `0x`,
  initCode: `0x`,
  callGasLimit: 100_000n,
  verificationGasLimit: 2_000_000n,
  preVerificationGas: 21_000n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  paymasterAndData: `0x`,
  signature: `0x`,
}

const convertToWagmiUserOp = (op: UserOperation) => {
  return Object.entries(op).reduce((current, [k, v]) => {
    if (typeof v !== 'bigint') {
      return { [k]: v, ...current }
    }
    return { [k]: BigNumber.from(v), ...current }
  }, {}) as {
    sender: `0x${string}`
    nonce: BigNumber
    initCode: `0x${string}`
    callData: `0x${string}`
    callGasLimit: BigNumber
    verificationGasLimit: BigNumber
    preVerificationGas: BigNumber
    maxFeePerGas: BigNumber
    maxPriorityFeePerGas: BigNumber
    paymasterAndData: `0x${string}`
    signature: `0x${string}`
  }
}

export default function Home() {
  const { address } = useAccount()
  const [messageHash, setMessageHash] = useState<Uint8Array>(
    new TextEncoder().encode(nullifierMessage)
  )
  const [formData, setFormData] = useState(initialValues)
  const [isProving, setIsProving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const {
    previousStep,
    nextStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    goTo,
    showSuccessMsg,
  } = useMultiStepForm(4)
  const { data } = useContractRead({
    abi: shieldAccountABI,
    address: '0x89ac276207912188c62d44143e429e868cC33e5E',
    functionName: 'root',
  })

  const provider = useProvider()
  const contract = useContract({
    abi: shieldAccountABI,
    address: '0x89ac276207912188c62d44143e429e868cC33e5E',
    signerOrProvider: provider,
  })
  const [sender, setSender] = useState(
    () =>
      new ethers.Wallet(
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        provider
      )
  )

  useEffect(() => {
    setSender(
      new ethers.Wallet(
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        provider
      )
    )
  }, [provider])

  const entryPointContract = useContract({
    abi: entryPointABI,
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    signerOrProvider: sender,
  })

  const { signMessageAsync } = useSignMessage()

  const handleHash = async () => {
    const { callData, proof: _, publicSignals: __, ...userOp } = formData
    // TODO: calculate callData from params
    // const refinedUserOp = { callData: executeTransactionData(callData), ...userOp };
    const refinedUserOp = {
      callData: executeTransactionData({
        target: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        payload: '0x',
        value: 1_000_000n,
        delegate: false,
      }),
      ...userOp,
    }

    // const hashedOp = hashUserOp(refinedUserOp) as Hex
    // const result = await signTypedDataAsync({value: {
    //   userOpHash: hashedOp,
    //   entryPoint: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`,
    //   chainId: BigNumber.from(31337),
    // }})

    const hashed = personalUserOpHash(
      refinedUserOp,
      `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`,
      31337n
    ) as Hex
    const messageHash = hexToBytes(hashed)
    setMessageHash(messageHash)
  }

  const handleProve = async () => {
    const { callData, proof: _, publicSignals: __, ...userOp } = formData

    // TODO: calculate callData from params
    // const refinedUserOp = { callData: executeTransactionData(callData), ...userOp };
    // const refinedUserOp = { callData, ...userOp }
    const refinedUserOp = {
      callData: executeTransactionData({
        target: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        payload: '0x',
        value: 1_000_000n,
        delegate: false,
      }),
      ...userOp,
    }

    // const signature = await signMessageAsync()
    /// first byte is v - 27 or 28, which is not part of the signature, hence slice(4)
    const signatureBytes = utils.hexToBytes(formData.signature.slice(4))
    const sig = secp256k1.Signature.fromCompact(signatureBytes)
    const { inputs, contractVerifyInputs } = await generateInputs(
      refinedUserOp,
      formData.nullifier as `0x${string}`,
      nullifierMessage,
      messageHash,
      sig
    )
    console.log('This is the hash:', bytesToHex(messageHash))

    const { rInv, R, T, U } = contractVerifyInputs
    const commitProof = await generateCommitProof(inputs)
    console.log('proving...')
    const { proof, publicSignals } = commitProof
    console.log('proof completed !')
    console.log(proof)
    console.log(publicSignals)

    const signatureProof = {
      a: toBigInts(proof.pi_a.slice(0, 2)) as [bigint, bigint],
      b: [
        toBigInts(proof.pi_b[0].reverse()),
        toBigInts(proof.pi_b[1].reverse()),
      ] as [[bigint, bigint], [bigint, bigint]],
      c: toBigInts(proof.pi_c.slice(0, 2)) as [bigint, bigint],
      rInv: rInv,
      R: [R?.toAffine().x!, R?.toAffine().y!] as [bigint, bigint],
      T: [T?.toAffine().x!, T?.toAffine().y!] as [bigint, bigint],
      U: [U?.toAffine().x!, U?.toAffine().y!] as [bigint, bigint],
      sTHash: BigInt(publicSignals[0]),
      nullifier: BigInt(publicSignals[1]),
    }
    //
    // const verifyInputs = {
    //   a: toBigNumbers(proof.pi_a.slice(0, 2)) as [BigNumber, BigNumber],
    //   b: [
    //     toBigNumbers(proof.pi_b[0].reverse()),
    //     toBigNumbers(proof.pi_b[1].reverse()),
    //   ] as [[BigNumber, BigNumber], [BigNumber, BigNumber]],
    //   c: toBigNumbers(proof.pi_c.slice(0, 2)) as [BigNumber, BigNumber],
    //   rInv: BigNumber.from(rInv),
    //   R: toBigNumbers([R?.toAffine().x!, R?.toAffine().y!]) as [
    //     BigNumber,
    //     BigNumber
    //   ],
    //   T: toBigNumbers([T?.toAffine().x!, T?.toAffine().y!]) as [
    //     BigNumber,
    //     BigNumber
    //   ],
    //   U: toBigNumbers([U?.toAffine().x!, U?.toAffine().y!]) as [
    //     BigNumber,
    //     BigNumber
    //   ],
    //   sTHash: BigNumber.from(publicSignals[0]),
    //   nullifier: BigNumber.from(publicSignals[1]),
    // }
    //
    // console.log('verify:', verifyInputs)
    // console.log('This is the next hash:', bytesToHex(messageHash))
    // const answer = await contract?.verifyProof(
    //   verifyInputs,
    //   bytesToHex(messageHash)
    // )
    // console.log('What is the answer?', answer)
    //
    const toConvert = { ...refinedUserOp }
    toConvert.signature = encodeSignature([signatureProof])
    const wgmi = convertToWagmiUserOp(toConvert)

    console.log("Compare hashes")
    console.log(await contract?.getEthSignedMessageHash(await entryPointContract?.getUserOpHash(wgmi)!))
    console.log(bytesToHex(messageHash))

    // Runs the transaction
    await entryPointContract?.handleOps(
      [wgmi],
      '0x89ac276207912188c62d44143e429e868cC33e5E',
    )
    setFormData({ proof, publicSignals, ...formData })
  }

  async function updateForm(fieldToUpdate: Partial<FormItems>) {
    const { callData, callGasLimit, maxFeePerGas, maxPriorityFeePerGas } =
      fieldToUpdate

    if (!/^0x[0-9a-fA-F]*$/.test(callData ?? formData.callData)) {
      setErrors((prevState) => ({
        ...prevState,
        callData: 'Please enter a valid hex',
      }))
    } else {
      setErrors((prevState) => ({
        ...prevState,
        callData: '',
      }))
    }

    if ((callGasLimit ?? formData.callGasLimit) < 50_000n) {
      setErrors((prevState) => ({
        ...prevState,
        callGasLimit: 'callGasLimit should be at least 50,000 gwei.',
      }))
    } else {
      setErrors((prevState) => ({
        ...prevState,
        callGasLimit: '',
      }))
    }

    if ((maxFeePerGas ?? formData.maxFeePerGas) > 10_000n) {
      setErrors((prevState) => ({
        ...prevState,
        maxFeePerGas: 'maxFeePerGas should be less than 10,000 gwei.',
      }))
    } else {
      setErrors((prevState) => ({
        ...prevState,
        maxFeePerGas: '',
      }))
    }

    if ((maxPriorityFeePerGas ?? formData.maxPriorityFeePerGas) > 10_000n) {
      setErrors((prevState) => ({
        ...prevState,
        maxPriorityFeePerGas:
          'maxPriorityFeePerGas should be less than 10,000 gwei.',
      }))
    } else {
      setErrors((prevState) => ({
        ...prevState,
        maxPriorityFeePerGas: '',
      }))
    }

    setFormData({ ...formData, ...fieldToUpdate })
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Don't go to next step if there are errors
    if (Object.values(errors).some((error) => error)) {
      console.error(errors)
      return
    }
    // Don't go to next step if user is not connected to wallet
    if (isFirstStep && !address) {
      return
    }
    // Don't go to next step if user has not set nullifier
    if (currentStepIndex === 1 && !formData.nullifier) {
      // Sign message
      const message = await signMessageAsync({ message: nullifierMessage })
      if (message) {
        updateForm({ nullifier: message })
      }
      return
    }
    // Don't go to next step if user has not signed message
    if (currentStepIndex === 2) {
      await handleHash()
    }
    // Don't go to next step if user has not generated proof
    if (isLastStep && !formData.proof && !formData.publicSignals) {
      if (formData.signature === initialValues.signature) {
        // Sign message
        const message = await signMessageAsync({ message: messageHash })
        if (message) {
          updateForm({ signature: message })
        }
      } else {
        setIsProving(true)
        await handleProve()
        setIsProving(false)
      }
      return
    }
    nextStep()
  }

  return (
    <div
      className={`flex justify-between ${
        currentStepIndex === 1 ? 'h-[600px] md:h-[500px]' : 'h-[500px]'
      } w-11/12 max-w-4xl relative m-1 rounded-lg border border-neutral-700 bg-[#262626] p-4`}
    >
      {!showSuccessMsg ? (
        <SideBar currentStepIndex={currentStepIndex} goTo={goTo} />
      ) : (
        ''
      )}
      <main
        className={`${showSuccessMsg ? 'w-full' : 'w-full md:mt-5 md:w-[65%]'}`}
      >
        {showSuccessMsg ? (
          <AnimatePresence mode='wait'>
            <SuccessMessage />
          </AnimatePresence>
        ) : (
          <form
            onSubmit={handleOnSubmit}
            className='w-full flex flex-col justify-between h-full'
          >
            <AnimatePresence mode='wait'>
              {currentStepIndex === 0 && <SignInForm key='step1' />}
              {currentStepIndex === 1 && (
                <SignatureForm key='step2' {...formData} />
              )}
              {currentStepIndex === 2 && (
                <UserOpForm
                  key='step3'
                  {...formData}
                  updateForm={updateForm}
                  errors={errors}
                />
              )}
              {currentStepIndex === 3 && (
                <ProverForm key='step4' isProving={isProving} {...formData} />
              )}
            </AnimatePresence>
            <div className='w-full items-center flex justify-between'>
              <div className=''>
                <Button
                  onClick={previousStep}
                  type='button'
                  variant='ghost'
                  className={`${
                    isFirstStep
                      ? 'invisible'
                      : 'visible p-0 text-neutral-200 hover:text-white'
                  }`}
                >
                  Go Back
                </Button>
              </div>
              <div className='flex items-center'>
                <div className='relative after:pointer-events-none after:absolute after:inset-px after:rounded-[11px] after:shadow-highlight after:shadow-white/10 focus-within:after:shadow-[#77f6aa] after:transition'>
                  <Button
                    type='submit'
                    className='relative text-neutral-200 bg-neutral-900 border border-black/20 shadow-input shadow-black/10 rounded-xl hover:text-white'
                  >
                    {isLastStep && formData.proof && formData.publicSignals
                      ? 'Confirm'
                      : 'Next Step'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
