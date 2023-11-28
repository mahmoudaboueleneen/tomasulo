import InstructionOperation from "../../types/InstructionOperation";

abstract class AluElement {
    private busy: 0 | 1;

    constructor() {
        this.busy = 0;
    }

    isBusy() {
        return this.busy === 1;
    }

    setBusy(busy: 0 | 1) {
        this.busy = busy;
    }

    public abstract compute(op: InstructionOperation, operand1: number, operand2: number): number;
}

export default AluElement;
