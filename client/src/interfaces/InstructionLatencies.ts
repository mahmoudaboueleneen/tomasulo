interface InstructionLatencies {
    FPAddLatency: number;
    FPSubtractLatency: number;
    FPMultiplyLatency: number;
    FPDivideLatency: number;
    IntSubtractLatency: number;
    LoadLatency: number;
    StoreLatency: number;
    IntAddLatency?: 1;
    BranchNotEqualZeroLatency?: 1;
}

export default InstructionLatencies;
