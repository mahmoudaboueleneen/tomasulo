import { AddInstructions, SubInstructions } from "../../constants/SupportedInstructions";
import InstructionOperation from "../../types/InstructionOperation";
import AluElement from "./AluElement";

class FPAdder extends AluElement {
    constructor() {
        super();
    }

    public compute(op: InstructionOperation, operand1: number, operand2: number) {
        if (SubInstructions.has(op)) {
            return operand1 - operand2;
        } else if (AddInstructions.has(op)) {
            return operand1 + operand2;
        } else {
            return operand1 !== 0 ? 1 : 0;
        }
    }
}

export default FPAdder;
