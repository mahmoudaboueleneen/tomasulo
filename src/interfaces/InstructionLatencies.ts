interface InstructionLatencies {
  FPAddLatency: number;
  FPSubtractLatency: number;
  FPMultiplyLatency: number;
  FPDivideLatency: number;
  IntSubtractLatency: number;
  IntAddLatency?: 1;
  BranchNotEqualZeroLatency?: 1;
}

export default InstructionLatencies;
