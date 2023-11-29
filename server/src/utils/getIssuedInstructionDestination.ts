import IssuedInstructionDestination from "../types/enums/IssuedInstructionDestination";
import {
    AddSubStationInstructions,
    MulDivStationInstructions,
    LoadBufferInstructions,
    StoreBufferInstructions
} from "../constants/SupportedInstructionsPerStationOrBuffer";
import InstructionOperation from "../types/InstructionOperation";

function getIssuedInstructionDestination(instructionOperation: InstructionOperation): IssuedInstructionDestination {
    if (AddSubStationInstructions.has(instructionOperation)) {
        return IssuedInstructionDestination.ADD_SUB;
    }
    if (MulDivStationInstructions.has(instructionOperation)) {
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
