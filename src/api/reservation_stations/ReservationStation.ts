import V from "../../types/V";
import Q from "../../types/Q";
import DecodedInstruction from "../misc/DecodedInstruction";

abstract class ReservationStation implements Executable {
    tag: Tag;
    busy: 0 | 1;
    op: InstructionOperation | null;
    vj: V;
    vk: V;
    qj: Q;
    qk: Q;
    decodedInstructionObject: DecodedInstruction | null;

    constructor(tag: string) {
        this.tag = tag;
        this.busy = 0;
        this.op = null;
        this.vj = null;
        this.vk = null;
        this.qj = null;
        this.qk = null;
        this.decodedInstructionObject = null;
    }

    public loadInstructionIntoStation(op: InstructionOperation) {
        this.busy = 1;
        this.op = op;
    }

    public decrementCyclesLeft() {
        if (this.decodedInstructionObject !== null) {
            this.decodedInstructionObject.decrementCyclesLeft();
        }
    }

    public canExecute() {
        return !this.isFinished() && this.busy === 1 && this.qj === 0 && this.qk === 0;
    }

    public isFinished() {
        return this.decodedInstructionObject !== null && this.decodedInstructionObject.isFinished();
    }

    public clear() {
        this.busy = 0;
        this.op = null;
        this.vj = null;
        this.vk = null;
        this.qj = null;
        this.qk = null;
    }

    public update(tag: Tag, value: number) {
        if (this.qj === tag) {
            this.qj = 0;
            this.vj = value;
        }
        if (this.qk === tag) {
            this.qk = 0;
            this.vk = value;
        }
    }
}

export default ReservationStation;
