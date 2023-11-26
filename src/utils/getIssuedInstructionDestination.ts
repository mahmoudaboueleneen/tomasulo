import IssuedInstructionDestination from "../enums/IssuedInstructionDestination";
import {
    AddSubInstructions,
    MulDivInstructions,
    LoadBufferInstructions,
    StoreBufferInstructions
} from "../constants/SupportedInstructionsPerStationOrBuffer";

function getIssuedInstructionDestination(instructionOperation: InstructionOperation): IssuedInstructionDestination {
    if (AddSubInstructions.has(instructionOperation)) {
        return IssuedInstructionDestination.ADD_SUB;
    }
    if (MulDivInstructions.has(instructionOperation)) {
        return IssuedInstructionDestination.MUL_DIV;
    }
    if (LoadBufferInstructions.has(instructionOperation)) {
        return IssuedInstructionDestination.LOAD_BUFFER;
    }
    if (StoreBufferInstructions.has(instructionOperation)) {
        return IssuedInstructionDestination.STORE_BUFFER;
    }
    throw new Error(`Invalid instruction ${instructionOperation}`);
}

export default getIssuedInstructionDestination;
