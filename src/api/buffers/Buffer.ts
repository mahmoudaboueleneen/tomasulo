import DecodedInstruction from "../misc/DecodedInstruction";

abstract class Buffer implements Executable {
    tag: Tag;
    busy: 0 | 1;
    address: number | null;
    decodedInstructionObject: DecodedInstruction | null;

    constructor(tag: string) {
        this.tag = tag;
        this.busy = 0;
        this.address = null;
        this.decodedInstructionObject = null;
    }

    loadInstructionIntoBuffer(address: number) {
        this.busy = 1;
        this.address = address;
    }

    canExecute(): boolean {
        return !this.isFinished() && this.busy === 1;
    }

    isFinished() {
        return this.decodedInstructionObject !== null && this.decodedInstructionObject.isFinished();
    }

    decrementCyclesLeft() {
        if (this.decodedInstructionObject !== null) {
            this.decodedInstructionObject.decrementCyclesLeft();
        }
    }

    clear() {
        this.busy = 0;
        this.address = null;
    }
}

export default Buffer;
