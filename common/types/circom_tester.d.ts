declare module 'circom_tester' {
  interface Circuit {
    calculateWitness<T>(witness: T): any
    assertOut(witness: any, options?: {}): void
  }
  function wasm(filename: string): Promise<Circuit>
}
