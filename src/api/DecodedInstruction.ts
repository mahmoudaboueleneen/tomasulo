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

    isFinished() {
        return this.cyclesLeft === 0;
    }

    decrementCyclesLeft() {
        if (this.cyclesLeft > 0) {
            this.cyclesLeft--;
        }
    }
}

export default DecodedInstruction;
