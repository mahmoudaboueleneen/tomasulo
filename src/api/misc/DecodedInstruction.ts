import InstructionOperation from "../../types/InstructionOperation";

class DecodedInstruction {
    operation: InstructionOperation;
    destination: string;
    source1: string;
    source2: string;
    immediate: number | null;
    cyclesLeft: number;

    constructor(
        operation: InstructionOperation,
        destination: string,
        source1: string,
        source2: string,
        immediate: number | null = null,
        cyclesLeft: number
    ) {
        this.operation = operation;
        this.destination = destination;
        this.source1 = source1;
        this.source2 = source2;
        this.immediate = immediate;
        this.cyclesLeft = cyclesLeft;
    }

    decrementCyclesLeft() {
        if (this.cyclesLeft > 0) {
            this.cyclesLeft--;
        }
    }

    isFinished() {
        return this.cyclesLeft === 0;
    }
}

export default DecodedInstruction;
