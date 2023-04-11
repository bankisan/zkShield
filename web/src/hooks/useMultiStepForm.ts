'use client'

import { useState } from 'react'

// From: https://github.com/Marcosfitzsimons/multi-step-form/blob/15eb077bebb80ce60827ffcd7b29065c95010aa2/hooks/useMultipleStepForm.ts#L1-L2

/**
 * @name useMultiStepForm
 * @param {number} steps
 * @returns {object} currentStepIndex, steps, isFirstStep, isLastStep, showSuccessMsg, goTo, nextStep, previousStep
 * @description This function is used to move to next step or previous step
 */
export const useMultiStepForm = (steps: number) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const nextStep = () => {
        if (currentStepIndex < steps - 1) {
            setCurrentStepIndex((i) => i + 1)
        }
        if (currentStepIndex === 3) {
            setShowSuccessMsg(true)
        }
    }

    const previousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((i) => i - 1)
        }
    }

    const goTo = (index: number) => {
        if (index < 0) {
            setCurrentStepIndex(0)
        } else if (index >= steps) {
            setCurrentStepIndex(steps - 1)
        } else {
            setCurrentStepIndex(index)
        }
    }

    const isFirstStep = currentStepIndex === 0
    const isLastStep = currentStepIndex === steps - 1

    return {
        currentStepIndex,
        steps,
        isFirstStep,
        isLastStep,
        showSuccessMsg,
        goTo,
        nextStep,
        previousStep
    }
}
