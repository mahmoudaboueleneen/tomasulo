import {
    LoadInstructionList,
    StoreInstructionList,
    AddInstructions,
    SubInstructions,
    MulInstructions,
    DivInstructions,
    BranchInstructions
} from "./SupportedInstructions";

export const AddSubStationInstructions = new Set([...AddInstructions, ...SubInstructions, ...BranchInstructions]);

export const MulDivStationInstructions = new Set([...MulInstructions, ...DivInstructions]);

export const LoadBufferInstructions = new Set(LoadInstructionList);
export const StoreBufferInstructions = new Set(StoreInstructionList);
