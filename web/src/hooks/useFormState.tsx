import { useState } from 'react'

function deepClone<T>(object: T): T {
  if (typeof object !== 'object' || object === null) {
    return object
  }

  if (Array.isArray(object)) {
    return object.map((item) => deepClone(item)) as unknown as T
  }

  const clonedObject: any = {}
  for (const key in object) {
    clonedObject[key] = deepClone(object[key])
  }

  return clonedObject as T
}

type Validator<T> = {
  [key in keyof T]: (value: T[key] | HTMLInputElement['value']) => {
    value: T[key];
    valid: boolean;
    error?: string
  }
}

type FormState<T> = {
  valid: boolean
  error: string
  fields: {
    [key in keyof T]: { valid: boolean; error: string; value: T[key] }
  }
  isChanged: boolean
}

export function useFormState<
  T,
  I = T,
  V extends Validator<T> = Validator<T>
>(initialValues: I, inputValidators: V) {
  const buildInitialFieldValues = (values: I) =>
    Object.keys(values as object).reduce((acc, nextKey) => {
      const nextValue = values[nextKey as keyof I] as T[keyof T] | undefined
      const result = {
        ...acc,
        [nextKey]: {
          ...(nextKey in inputValidators
            // @ts-ignore
            ? inputValidators[nextKey as keyof V](nextValue)
            : { valid: true }),
          value: deepClone(nextValue),
        },
      }
      return result
    }, {} as { [key in keyof T]: { valid: boolean; error: string; value: T[key] } })

  const [initialFieldValues] = useState(() =>
    buildInitialFieldValues(initialValues)
  )

  const [formState, setFormState] = useState<FormState<T>>(() => {
    const initialFieldState = buildInitialFieldValues(initialValues)
    const firstInvalidField = Object.keys(initialFieldState).find(
      (f) => !initialFieldState[f as keyof T].valid
    )
    const formValidity = !firstInvalidField
    return {
      valid: formValidity,
      error: '',
      isChanged: false,
      fields: initialFieldState,
    }
  })

  const getValues = (fields?: typeof formState.fields | undefined) => {
    return Object.keys(formState.fields).reduce(
      (acc, nextKey) => ({
        ...acc,
        [nextKey as keyof T]: (fields ?? formState.fields)[nextKey as keyof T]
          .value,
      }),
      {} as T
    )
  }

  const setValue = <K extends keyof T, VT extends (HTMLInputElement['value'] | T[K])>(
    key: K,
    val: VT
  ) => {
    setFormState((prevState: FormState<T>) => {
      const updatedState: FormState<T> = deepClone(prevState)
      updatedState.fields[key].value = val as T[typeof key]

      const validatorFunc = inputValidators[key]

      //@ts-ignore
      const validator = validatorFunc ? validatorFunc(val) : { valid: true }
      updatedState.fields[key].valid = validator.valid
      //@ts-ignore
      updatedState.fields[key].error = validator.error

      const firstInvalidField = Object.keys(updatedState.fields).find(
        (f) => !updatedState.fields[f as keyof T].valid
      )
      const values = getValues(updatedState.fields)

      updatedState.valid = !firstInvalidField
      updatedState.isChanged = initialFieldValues !== values
      return updatedState
    })
  }

  const reset = (newValues?: I) => {
    const newInitialFieldValues = buildInitialFieldValues(
      newValues ?? initialValues
    )
    Object.keys(newInitialFieldValues).forEach((fieldName) => {
      setValue(
        fieldName as keyof T,
        newInitialFieldValues[fieldName as keyof T].value
      )
    })
    setFormState((prevState: FormState<T>) => {
      const state: FormState<T> = deepClone(prevState)
      state.isChanged = false
      return state
    })
  }

  return { state: formState, setValue, getValues, reset }
}
