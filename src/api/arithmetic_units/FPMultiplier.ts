import { MulInstructions } from "../../constants/SupportedInstructions";
import InstructionOperation from "../../types/InstructionOperation";
import AluElement from "./AluElement";

class FPMultiplier extends AluElement {
    constructor() {
        super();
    }
    public compute(op: InstructionOperation, operand1: number, operand2: number) {
        if (MulInstructions.has(op)) {
            return operand1 * operand2;
        }
        return operand1 / operand2;
    }
}

export default FPMultiplier;
