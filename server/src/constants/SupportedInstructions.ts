const AddImmediateInstructionList = ["ADDI"];
const SubImmediateInstructionList = ["SUBI"];

const FPAddInstructionList = ["ADD.D", "ADD.S", "ADD.PS"];
const FPSubInstructionList = ["SUB.D", "SUB.S", "SUB.PS"];
const FPMulInstructionList = ["MUL.D", "MUL.S", "MUL.PS"];
const FPDivInstructionList = ["DIV.D", "DIV.S", "DIV.PS"];

const BranchInstructionList = ["BNEZ"];

export const LoadInstructionList = ["LD", "LW", "LWU", "LB", "LBU", "LH", "LHU", "L.D", "L.S"];
export const StoreInstructionList = ["SD", "SW", "SWU", "SB", "SBU", "SH", "SHU", "S.D", "S.S"];

export const AddImmediateInstructions = new Set(AddImmediateInstructionList);
export const SubImmediateInstructions = new Set(SubImmediateInstructionList);

export const FPAddInstructions = new Set(FPAddInstructionList);
export const FPSubInstructions = new Set(FPSubInstructionList);
export const FPMulInstructions = new Set(FPMulInstructionList);
export const FPDivInstructions = new Set(FPDivInstructionList);

export const AddInstructions = new Set(FPAddInstructionList.concat(AddImmediateInstructionList));
export const SubInstructions = new Set(FPSubInstructionList.concat(SubImmediateInstructionList));
export const MulInstructions = new Set(FPMulInstructionList);
export const DivInstructions = new Set(FPDivInstructionList);

export const ImmediateInstructions = new Set(AddImmediateInstructionList.concat(SubImmediateInstructionList));
export const RInstructions = new Set(
    FPAddInstructionList.concat(FPSubInstructionList).concat(FPMulInstructionList).concat(FPDivInstructionList)
);
export const LoadInstructions = new Set(LoadInstructionList);
export const StoreInstructions = new Set(StoreInstructionList);
export const BranchInstructions = new Set(BranchInstructionList);
