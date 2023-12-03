import Executable from "../../interfaces/Executable";
import Tag from "../../types/Tag";

abstract class Buffer implements Executable {
    tag: Tag;
    busy: 0 | 1;
    address: number | null;
    cyclesLeft: number;

    constructor(tag: string, busy?: 0 | 1, address?: number, cyclesLeft?: number) {
        this.tag = tag;
        this.busy = busy !== undefined ? busy : 0;
        this.address = address !== undefined ? address : null;
        this.cyclesLeft = cyclesLeft !== undefined ? cyclesLeft : 0;
    }

    abstract clone(): Buffer;

    loadInstructionIntoBuffer(address: number) {
        this.busy = 1;
        this.address = address;
    }

    decrementCyclesLeft() {
        if (this.cyclesLeft > 0) {
            this.cyclesLeft--;
        }
    }

    canExecute(): boolean {
        return !this.isFinished() && this.busy === 1;
    }

    isFinished() {
        return this.cyclesLeft === 0;
    }

    clear() {
        this.busy = 0;
        this.address = null;
    }

    public setCyclesLeft(cycles: number) {
        this.cyclesLeft = cycles;
    }
}

export default Buffer;
