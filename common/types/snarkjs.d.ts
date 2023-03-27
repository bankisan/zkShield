interface Proof {
  pi_a: [string, string, string]
  pi_b: [[string, string], [string, string], [string, string]]
  pi_c: [string, string, string]
  protocol: string
  curve: string
}

declare module 'snarkjs' {
  const groth16 = {
    fullProve(
      input: Record<string, any>,
      wasmPath: string,
      zkeyPath: string
    ): Promise<{ publicSignals: string[]; proof: Proof }> {},

    verify(
      verificationKey: {},
      publicSignals: string[],
      proof: Proof
    ): Promise<boolean> {},
  }
}
