import InstructionOperation from "./InstructionOperation";
import Tag from "./Tag";

type ExecutionRangeCycles = {
    from: number;
    to: number | null;
};

type SummaryTableRecord = {
    iteration: number | null;
    instructionTag: Tag;
    instructionOperation: InstructionOperation | null;
    instructionDestinationRegister?: string | null;
    instructionFirstOperandRegister?: string | null;
    instructionSecondOperand?: string | number | null;
    loadOrStoreInstructionAddress?: number | null;
    issuingCycle: number | null;
    executionRangeCycles: ExecutionRangeCycles | null;
    writeResultCycle: number | null;
};

export default SummaryTableRecord;
