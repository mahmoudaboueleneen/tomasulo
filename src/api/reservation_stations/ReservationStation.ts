import V from "../../types/V";
import Q from "../../types/Q";
import DecodedInstruction from "../DecodedInstruction";

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

    loadInstructionIntoStation(op: InstructionOperation) {
        this.busy = 1;
        this.op = op;
    }

    setQj(qj: string) {
        this.qj = qj;
    }

    setQk(qk: string) {
        this.qk = qk;
    }

    setVj(vj: number) {
        this.vj = vj;
    }

    setVk(vk: number) {
        this.vk = vk;
    }

    canExecute() {
        return !this.isFinished() && this.busy === 1 && this.qj === 0 && this.qk === 0;
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
        this.op = null;
        this.vj = null;
        this.vk = null;
        this.qj = null;
        this.qk = null;
    }
}

export default ReservationStation;
