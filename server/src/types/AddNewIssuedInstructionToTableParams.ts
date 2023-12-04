import InstructionOperation from "./InstructionOperation";
import Tag from "./Tag";

type AddNewIssuedInstructionToTableParams = {
    iteration: number | null;
    tag: Tag;
    operation: InstructionOperation;
    issuingClockCycle: number;
    firstOperandRegister?: string;
    destinationRegister?: string;
    secondOperand?: string | number;
    address?: number;
};

export default AddNewIssuedInstructionToTableParams;
